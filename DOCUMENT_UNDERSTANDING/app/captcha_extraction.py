from PIL import Image
import google.generativeai as genai
from .utils.needs import get_next_api_key
    
def captcha_extracted_content(image, user_text):
    try:
        api_key = get_next_api_key()
        print(f"Using API key: {api_key}")
            
        genai.configure(api_key=api_key)

        generation_config = {
            "response_mime_type": "application/json",
        }
        
        modelName = 'gemini-1.5-flash'
        print(modelName)

        model = genai.GenerativeModel(
            model_name=modelName,
            generation_config=generation_config,
        )

        chat = model.start_chat(history=[])

        img = Image.open(image)
        response = chat.send_message([user_text, img], stream=False)
        response.resolve()
        print('response', response.text)
        all_responses = response.text
            
        return all_responses
    
    except FileNotFoundError as f:
        return f
    except Exception as e:
        error_message = f"Error generating content: {e}"
        print(f"Error generating content: {e}")
        return error_message
    