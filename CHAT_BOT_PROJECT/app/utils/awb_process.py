import os
from PIL import Image
import fitz
import google.generativeai as genai
import markdown2

def convert_pdf_to_image(pdf_path):
    try:
        pdf_document = fitz.open(pdf_path)
        
        first_page = pdf_document.load_page(0)
        pix = first_page.get_pixmap(matrix=fitz.Matrix(3, 3))
        
        image_path = pdf_path.replace('.pdf', '.png')
        pix.save(image_path)
        
        return image_path
    except Exception as e:
        err = f"Error converting PDF to image: {e}"
        print(err)
        return err
    
def to_markdown(text):
    # "code-friendly", "fenced-code-blocks", "footnotes", "tables", "strike", "smarty-pants", "toc", "metadata", "abbr", "linkify", "highlightjs", "wikilinks"
    html = markdown2.markdown(text, extras=["code-friendly", "fenced-code-blocks", "footnotes", "tables", "strike", "smarty-pants", "toc", "metadata", "abbr", "linkify", "highlightjs", "wikilinks"])
    return html

def generate_awb_content(file_path):
    try:
        os.environ['GOOGLE_API_KEY'] = "AIzaSyDyGuDXEGpf5cGXXICQZ5Y_P35g3Q0fI8E"
        genai.configure(api_key=os.environ['GOOGLE_API_KEY'])
        print('entered_awb')

        if file_path.lower().endswith('.pdf'):
            image_path = convert_pdf_to_image(file_path)
            if not image_path:
                raise Exception("Failed to convert PDF to image.")
        else:
            image_path = file_path

        img = Image.open(image_path)

        model = genai.GenerativeModel('gemini-1.5-flash')
        chat = model.start_chat(history=[])
        
        user_text = "extract document details and list it at top and then extract the item details and show it in a table view and tell me about the document at last"

        response = chat.send_message([user_text, img], stream=False)

        response = response.text
        
        markdown_text = to_markdown(response)
        modified_response = markdown_text.replace("Google", "Ezee Shipping")
        modified_response = modified_response.replace("Gemini", "EzeeBot")
        print(modified_response)
        return modified_response
    except Exception as e:
        error_message = f"> **Error generating content:** Kindly referesh and try again"
        print(f"Error generating content: {e}, Kindly referesh and try again")
        return error_message
