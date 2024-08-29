import os
from flask import Blueprint, request, jsonify
from .utils.awb_process import generate_awb_content
from .utils.awb_bk import generate_awb_bk

awb_bp = Blueprint("awb_bp", __name__, template_folder="templates")

@awb_bp.route('/awb', methods=['POST'])
def img():
    if 'image' not in request.files:
        return jsonify({"error": "No image part"}), 400
    
    file = request.files['image']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    upload_folder = r"C:\Python\CHAT_BOT_PROJECT\app\uploaded_images"
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)
    
    file_path = os.path.join(upload_folder, file.filename)
    file.save(file_path)

    generated_content = generate_awb_content(file_path)

    return jsonify({"generated_content": generated_content}), 200

@awb_bp.route('/bkcreate', methods=['POST'])
def imgbk():
    if 'image' not in request.files:
        return jsonify({"error": "No image part"}), 400
    
    file = request.files['image']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    doc_type = request.form.get('docType')
    print(doc_type)

    if doc_type == 'AWB':
        upload_folder = r"C:\Python\CHAT_BOT_PROJECT\app\AWB_uploaded"
    elif doc_type == 'INVOICE':
        upload_folder = r"C:\Python\CHAT_BOT_PROJECT\app\invoice_uploaded"
        
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)
    
    file_path = os.path.join(upload_folder, file.filename)
    file.save(file_path)
    
    generated_content2 = generate_awb_bk(file_path, doc_type)

    return jsonify({"generated_content": generated_content2}), 200
