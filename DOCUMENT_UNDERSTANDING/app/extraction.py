import os
from PIL import Image
import google.generativeai as genai
from .utils.pdf_to_image import convert_pdf_to_image
from .utils.pdf_to_image_docs import convert_pdf_to_image_with_overlay
from .utils.needs import get_next_api_key, get_model

def generate_extracted_content(pdf_path, user_text, output_folder, pages, datatype, model):
    def request_with_retry(model_name, image_paths):
        print(model_name)
        try:
            generation_config = {
                "response_mime_type": "application/json",
            }

            model = genai.GenerativeModel(
                model_name=model_name,
                generation_config=generation_config,
            )
            
            chat = model.start_chat(history=[])

            all_responses = []

            for image_path in image_paths:
                print(image_path)
                img = Image.open(image_path)
                
                try:
                    response = chat.send_message([user_text, img], stream=False)
                    response.resolve()
                    print('response', response.text)
                    all_responses.append(response.text)

                except Exception as e:
                    error_message = str(e)
                    print(error_message)
                    
                    if '500' in error_message:
                        print(f"Received 500 error with model {model_name}. Trying a different model.")
                        return None
                    else:
                        raise e

            return all_responses
        
        except Exception as e:
            error_message = f"Error generating content: {e}"
            print(error_message)
            return error_message
    
    try:
        api_key = get_next_api_key()
        print(f"Using API key: {api_key}")
        genai.configure(api_key=api_key)

        if datatype.lower() == 'docs':
            if pdf_path.lower().endswith(('.pdf', '.PDF')):
                print(datatype)
                img_path = r'C:\Python\DOCUMENT_UNDERSTANDING\static\img\promts_page-0001.png'
                image_paths = convert_pdf_to_image_with_overlay(pdf_path, output_folder, pages, img_path)
                if not image_paths:
                    raise ValueError("Failed to convert PDF to images.")
        else:
            if pdf_path.lower().endswith(('.pdf', '.PDF')):
                image_paths = convert_pdf_to_image(pdf_path, output_folder, pages)
                if not image_paths:
                    raise ValueError("Failed to convert PDF to images.")
        
        model_name = get_model(model)
        responses = request_with_retry(model_name, image_paths)

        if responses is None:
            new_model_name = get_model(model, retry=True)
            responses = request_with_retry(new_model_name, image_paths)

        return responses
    
    except FileNotFoundError:
        return f"File not found: {pdf_path}"
    except Exception as e:
        error_message = f"Error generating content: {e}"
        print(f"Error generating content: {e}")
        return error_message