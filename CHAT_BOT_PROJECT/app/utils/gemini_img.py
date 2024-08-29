import os
from PIL import Image
import fitz
import google.generativeai as genai
import markdown2
from IPython.display import Markdown

def convert_pdf_to_image(pdf_path):
    try:
        pdf_document = fitz.open(pdf_path)
        
        first_page = pdf_document.load_page(0)
        pix = first_page.get_pixmap(matrix=fitz.Matrix(3, 3))
        
        image_path = pdf_path.replace('.pdf', '.png')
        pix.save(image_path)
        
        return image_path
    except Exception as e:
        print(f"Error converting PDF to image: {e}")
        return None

def to_markdown(text):
    # "code-friendly", "fenced-code-blocks", "footnotes", "tables", "strike", "smarty-pants", "toc", "metadata", "abbr", "linkify", "highlightjs", "wikilinks"
    html = markdown2.markdown(text, extras = ["code-friendly", "fenced-code-blocks", "footnotes", "tables", "strike", "smarty-pants", "toc", "metadata", "abbr", "linkify", "highlightjs", "wikilinks"])
    return html

def generate_image_content(image_path, user_text):
    try:
        os.environ['GOOGLE_API_KEY'] = "AIzaSyDyGuDXEGpf5cGXXICQZ5Y_P35g3Q0fI8E"
        genai.configure(api_key=os.environ['GOOGLE_API_KEY'])
        
        if image_path.lower().endswith('.pdf'):
            image_path = convert_pdf_to_image(image_path)
            if not image_path:
                raise ValueError("Failed to convert PDF to image.")
        
        img = Image.open(image_path)
        
        model = genai.GenerativeModel('gemini-1.5-flash')
        chat = model.start_chat(history=[])
        
        print(user_text, image_path)
        response = chat.send_message([user_text, img], stream=False)
        response.resolve()

        markdown_response = response.text
        print(markdown_response)

        modified_response = to_markdown(markdown_response)
        print(modified_response)
        return modified_response
    
    except FileNotFoundError:
        return "> The specified file was not found."
    except Exception as e:
        error_message = f"**Error generating content:** Kindly referesh and try again"
        print(f"Error generating content: {e}, Kindly referesh and try again")
        return error_message

