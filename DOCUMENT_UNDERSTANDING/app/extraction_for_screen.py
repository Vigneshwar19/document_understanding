import os
from PIL import Image
import google.generativeai as genai
from .utils.needs import get_next_api_key
    
def generate_extracted_content_screen(image_paths, user_text, modelName):
    try:
        print(image_paths)
        api_key = get_next_api_key()
        print(f"Using API key: {api_key}")
        os.environ['GOOGLE_API_KEY'] = api_key
            
        genai.configure(api_key=os.environ['GOOGLE_API_KEY'])
        
        all_responses = []
        generation_config = {
            "response_mime_type": "application/json",
        }
        model = genai.GenerativeModel(
            model_name=modelName,
            generation_config=generation_config,
        )
        print(modelName)
        chat = model.start_chat(history=[])

        for image_path in image_paths:
            print(image_path)
            img = Image.open(image_path)
            response = chat.send_message([user_text, img], stream=False)
            response.resolve()
            all_responses.append(response.text)
        
        return all_responses
    
    except FileNotFoundError:
        return "> The specified file was not found."
    except Exception as e:
        error_message = f"Error generating content: {e}, Kindly refresh and try again"
        print(f"Error generating content: {e}, Kindly refresh and try again")
        return error_message