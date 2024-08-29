from PIL import Image
import fitz
import os

def convert_pdf_to_image_with_overlay(pdf_path, output_folder, pages, img_path):
    try:
        if not os.path.exists(output_folder):
            os.makedirs(output_folder)
        
        pdf_document = fitz.open(pdf_path)
        
        overlay_image = Image.open(img_path).convert("RGBA")
        
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
            
            pdf_image = Image.frombytes("RGB", [pix.width, pix.height], pix.samples).convert("RGBA")

            overlay_resized = overlay_image.resize((pdf_image.width, int(pdf_image.height * 0.15)), Image.LANCZOS)

            combined_height = pdf_image.height + overlay_resized.height
            combined_image = Image.new("RGBA", (pdf_image.width, combined_height))

            combined_image.paste(pdf_image, (0, 0))

            combined_image.paste(overlay_resized, (0, pdf_image.height), overlay_resized)
            
            image_filename = os.path.basename(pdf_path).replace('.pdf', f'_page_{page_number + 1}.png')
            image_path = os.path.join(output_folder, image_filename)
            combined_image.save(image_path, "PNG")
            image_paths.append(image_path)
        
        return image_paths
    except Exception as e:
        print(f"Error converting PDF to images with stacked images: {e}")
        return None