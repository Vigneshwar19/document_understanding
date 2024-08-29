import os
import tempfile
import logging
from flask import Flask, request, jsonify, g, render_template
import requests
import time
from PIL import Image, ImageEnhance
from flask_cors import CORS
from datetime import datetime
import io
from app.captcha_extraction import captcha_extracted_content
from app.extraction import generate_extracted_content
from app.extraction_for_screen import generate_extracted_content_screen
from app.extraction_for_screen_docs import generate_extracted_content_screen_docs
from app.extracted_data_to_json import process_multiple_awb, process_multiple_invoices, process_multiple_dpi, process_multiple_docs
from app.utils.needs import download_file
from app.utils.pdf_to_image import convert_pdf_to_image

app = Flask(__name__)
CORS(app)

log_file_path = r'C:\Python\DOCUMENT_UNDERSTANDING\logger\document_understanding_log.log'

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s', handlers=[
    logging.FileHandler(log_file_path),
    logging.StreamHandler()
])



logger = logging.getLogger(__name__)

logging.getLogger('werkzeug').setLevel(logging.WARNING)
logging.getLogger('flask.app').setLevel(logging.WARNING)

UPLOAD_FOLDER = r'C:\Python\DOCUMENT_UNDERSTANDING\static\pdf_uploaded_by_screen'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
IMAGE_FOLDER = r'C:\Python\DOCUMENT_UNDERSTANDING\static\images_converted_by_screen'
app.config['IMAGE_FOLDER'] = IMAGE_FOLDER

@app.before_request
def before_request():
    g.start_time = time.time()

@app.after_request
def after_request(response):
    if hasattr(g, 'start_time'):
        response_time = time.time() - g.start_time
        logger.info(f"Request to {request.path} took {response_time:.3f} seconds")
    return response

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/pdfprocess', methods=['POST'])
def pdfprocess():
    try:
        if 'pdfFile' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        
        file = request.files['pdfFile']
        
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        
        if file and file.filename.lower().endswith('.pdf'):
            pdf_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
            file.save(pdf_path)
            pages='0'
            image_paths = convert_pdf_to_image(pdf_path, app.config['IMAGE_FOLDER'], pages)
            if not image_paths:
                return jsonify({'error': 'Failed to convert PDF to images'}), 500
            
            image_filenames = [os.path.basename(path) for path in image_paths]
            print(image_filenames)
            
            return jsonify({'success': 'File uploaded successfully', 'images': image_filenames}), 200
        
        return jsonify({'error': 'Invalid file format'}), 400
    except Exception as e:
        logger.error(f"Error processing PDF: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

@app.route('/selectedpages', methods=['POST'])
def selectedpages():
    try:
        data = request.get_json()
        image_paths = data.get('images', [])
        datatype = data.get('dropdownValue', '')
        modelName = data.get('modelName', '')
        print(f"Dropdown Value: {datatype}")
        print(f"Model: {modelName}")
        print(image_paths)
        paths = []
        for i in image_paths:
            paths.append(f'C:\\Python\\DOCUMENT_UNDERSTANDING\\static\\images_converted_by_screen\\{i}')
        if datatype == 'INVOICE':
            user_text_file = r'C:\Python\DOCUMENT_UNDERSTANDING\static\promts\invoice.txt'
            with open(user_text_file, 'r') as file:
                user_text = file.read()
            content = generate_extracted_content_screen(paths, user_text, modelName)
            logger.info("Generated INVOICE content: %s", content)
            response_json = process_multiple_invoices(content)
            logger.info("Generated INVOICE json: %s", response_json)
        elif datatype == 'DOCS':
            user_text_file = r'C:\Python\DOCUMENT_UNDERSTANDING\static\promts\docs.txt'
            with open(user_text_file, 'r') as file:
                user_text = file.read()
            img_path = r"C:\Python\DOCUMENT_UNDERSTANDING\static\img\promts_page-0001.png"
            content = generate_extracted_content_screen_docs(paths, user_text, img_path, modelName)
            logger.info("Generated DOCS content: %s", content)
            response_json = process_multiple_docs(content)
            logger.info("Generated DOCS json: %s", response_json)
        elif datatype == 'DPI':
            user_text_file = r'C:\Python\DOCUMENT_UNDERSTANDING\static\promts\dpi.txt'
            with open(user_text_file, 'r') as file:
                user_text = file.read()
            content = generate_extracted_content_screen(paths, user_text, modelName)
            logger.info("Generated DPI content: %s", content)
            response_json = process_multiple_dpi(content)
            logger.info("Generated DPI json: %s", response_json)
        elif datatype == 'AWB':
            user_text_file = r'C:\Python\DOCUMENT_UNDERSTANDING\static\promts\awb.txt'
            with open(user_text_file, 'r') as file:
                user_text = file.read()
            content = generate_extracted_content_screen(paths, user_text, modelName)
            logger.info("Generated AWB content: %s", content)
            response_json = process_multiple_awb(content)
            logger.info("Generated AWB json: %s", response_json)
        
        if not image_paths:
            return jsonify({'error': 'No images selected'}), 400

        return jsonify(response_json), 200
    except Exception as e:
        logger.error(f"Error in selectedpages: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

@app.route('/captcha', methods=['POST'])
def captcha():
    if 'image' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    image = request.files['image']
    
    if image.filename == '':
        return jsonify({"error": "No selected file"}), 400

    image_stream = io.BytesIO(image.read())
    img = Image.open(image_stream)
    
    enhancer = ImageEnhance.Sharpness(img)
    img = enhancer.enhance(2.0)

    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(1.5)

    current_time = datetime.now().strftime('%y-%m-%d_%H-%M-%S')
    filename = f'captcha_image_{current_time}.png'
    save_path = os.path.join(r'C:\Python\DOCUMENT_UNDERSTANDING\static\captcha', filename)
    img.save(save_path)

    img_stream = io.BytesIO()
    img.save(img_stream, format='PNG')
    img_stream.seek(0)

    user_text_file = r'C:\Python\DOCUMENT_UNDERSTANDING\static\promts\captcha.txt'
    with open(user_text_file, 'r') as file:
        user_text = file.read()

    captcha_response = captcha_extracted_content(save_path, user_text)
    logger.info("Extracted Captcha: %s", captcha_response)
    print(captcha_response)

    return captcha_response, 200

@app.route('/upload', methods=['POST'])
def process_pdf():
    try:
        if not request.is_json:
            logger.error("Invalid input format, JSON expected")
            return jsonify({"error": "Invalid input format, JSON expected"}), 400

        data = request.get_json()
        urls = data.get('urls')
        datatype = data.get('datatype')
        pages = data.get('pages')
        model_no = data.get('modelNo', '').strip()

        if model_no == '0':
            model = 1
        elif model_no:
            try:
                model = int(model_no)
            except ValueError:
                model = 1
        else:
            model = 1
            
        logger.info("Urls Received: %s", urls)
        logger.info("Data Type Received: %s", datatype)
        logger.info("Page Number Received: %s", pages)

        if not urls:
            logger.error("No URLs provided")
            return jsonify({'error': 'No URLs provided'}), 400

        for url in urls:
            retry_count = 5
            success = False
            response_json = {}

            while retry_count > 0 and not success:
                try:
                    if 'ezeeshipping' in url and not url.startswith("http"):
                        url = "https://" + url
                        
                    if url.startswith("http://") or url.startswith("https://"):
                        file_bytes = download_file(url)
                        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_pdf:
                            temp_pdf.write(file_bytes)
                            pdf_path = temp_pdf.name
                            logger.info(f"Downloaded PDF from {url}")

                    elif os.path.exists(url):
                        pdf_path = url
                    else:
                        logger.error(f"Invalid URL or file path: {url}")
                        return jsonify({"error": f"Invalid URL or file path: {url}"}), 400

                    if datatype.lower() == "awb":
                        output_folder = r'C:\Python\DOCUMENT_UNDERSTANDING\static\uploaded_awb'
                        user_text_file = r'C:\Python\DOCUMENT_UNDERSTANDING\static\promts\awb.txt'
                        with open(user_text_file, 'r') as file:
                            user_text = file.read()
                        content = generate_extracted_content(pdf_path, user_text, output_folder, pages, datatype, model)
                        logger.info("Generated AWB content: %s", content)
                        response_json = process_multiple_awb(content)
                        logger.info("Generated AWB json: %s", response_json)
                    elif datatype.lower() == "invoice":
                        output_folder = r'C:\Python\DOCUMENT_UNDERSTANDING\static\uploaded_invoices'
                        user_text_file = r'C:\Python\DOCUMENT_UNDERSTANDING\static\promts\invoice.txt'
                        with open(user_text_file, 'r') as file:
                            user_text = file.read()
                        content = generate_extracted_content(pdf_path, user_text, output_folder, pages, datatype, model)
                        logger.info("Generated INVOICE content: %s", content)
                        if isinstance(content, list):
                            response_json = process_multiple_invoices(content)
                            logger.info("Generated INVOICE json: %s", response_json)
                        else:
                            response_json = content
                    elif datatype.lower() == "dpi":
                        output_folder = r'C:\Python\DOCUMENT_UNDERSTANDING\static\uploaded_dpi'
                        user_text_file = r'C:\Python\DOCUMENT_UNDERSTANDING\static\promts\dpi.txt'
                        with open(user_text_file, 'r') as file:
                            user_text = file.read()
                        content = generate_extracted_content(pdf_path, user_text, output_folder, pages, datatype, model)
                        logger.info("Generated DPI content: %s", content)
                        if isinstance(content, list):
                            response_json = process_multiple_dpi(content)
                            logger.info("Generated DPI json: %s", response_json)
                        else:
                            response_json = content
                    elif datatype.lower() == "docs":
                        output_folder = r'C:\Python\DOCUMENT_UNDERSTANDING\static\uploaded_docs'
                        user_text_file = r'C:\Python\DOCUMENT_UNDERSTANDING\static\promts\docs.txt'
                        with open(user_text_file, 'r') as file:
                            user_text = file.read()
                        content = generate_extracted_content(pdf_path, user_text, output_folder, pages, datatype, model)
                        logger.info("Generated DOCS content: %s", content)
                        if isinstance(content, list):
                            response_json = process_multiple_docs(content)
                            logger.info("Generated DOCS json: %s", response_json)
                        else:
                            response_json = content
                    else:
                        logger.error(f"Invalid datatype: {datatype}")
                        return jsonify({'error': f"Invalid datatype: {datatype}"}), 400

                    success = True
                except requests.exceptions.RequestException as re:
                    retry_count -= 1
                    logger.error(f"RequestException while downloading the file: {re}, Retries left: {retry_count}")
                    time.sleep(1)
                except Exception as e:
                    logger.error(f"Exception while processing the file: {e}")
                    return jsonify({'error': 'Internal Server Error'}), 500

            if not success:
                return jsonify({'error': 'Failed to download the file after multiple attempts'}), 500

        return jsonify(response_json), 200

    except Exception as e:
        logger.error(f"Error in process_pdf: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=False, port=9601)
