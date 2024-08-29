from PIL import Image
import fitz
import os

def convert_pdf_to_image(pdf_path, output_folder, pages):
    try:
        print(pdf_path, output_folder)
        if not os.path.exists(output_folder):
            os.makedirs(output_folder)
        
        pdf_document = fitz.open(pdf_path)
        
        image_paths = []
        
        if pages == '0' or pages == '':
            pages_to_convert = range(len(pdf_document))
        else:
            pages_to_convert = [int(p) - 1 for p in pages.split(',')]

        for page_number in pages_to_convert:
            if page_number < 0 or page_number >= len(pdf_document):
                err = f"Page number {page_number + 1} is out of range."
                print(err)
                return err

            page = pdf_document.load_page(page_number)
            pix = page.get_pixmap(matrix=fitz.Matrix(3, 3))
            
            img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
            
            image_filename = os.path.basename(pdf_path).replace('.pdf', f'_page_{page_number + 1}.png')
            image_path = os.path.join(output_folder, image_filename)
            img.save(image_path)
            image_paths.append(image_path)
        
        pdf_filename = os.path.basename(pdf_path)
        pdf_output_path = os.path.join(output_folder, pdf_filename)
        pdf_document.save(pdf_output_path)
        
        return image_paths
    except Exception as e:
        print(f"Error converting PDF to images: {e}")
        return None