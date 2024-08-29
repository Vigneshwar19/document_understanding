import os
import google.generativeai as genai
import re
import markdown2
from app import db
from app.models import GeneralFirstInput

os.environ['GOOGLE_API_KEY'] = "AIzaSyDyGuDXEGpf5cGXXICQZ5Y_P35g3Q0fI8E"
genai.configure(api_key=os.environ['GOOGLE_API_KEY'])

try:
    model = genai.GenerativeModel('gemini-1.5-flash')
    chat = model.start_chat(history=[])
except Exception as e:
    raise RuntimeError(f"Failed to initialize the generative model: {e}")

def to_markdown(text):
    # "code-friendly", "fenced-code-blocks", "footnotes", "tables", "strike", "smarty-pants", "toc", "metadata"
    html = markdown2.markdown(text, extras=["code-friendly", "fenced-code-blocks", "footnotes", "tables", "toc"])
    return html

input_tracker = None

def generate_response(user_input):
    global chat, input_tracker
    value = user_input['general']
    try:
        if value.lower() == "refresh":
            if input_tracker:
                input_tracker = None
                print('none')
            chat = model.start_chat(history=[])
            print("Chat history has been refreshed.")
        else:
            response = chat.send_message(value, stream=True)
            response.resolve()
            if input_tracker == None:
                input_tracker = value
                new_general_input = GeneralFirstInput(
                    user_input=user_input.get('general'),
                    date=user_input.get('current_date'),
                    tenantid=int(user_input.get('tenantid')),
                    officeid=int(user_input.get('officeid')),
                    username=user_input.get('userid')
                )
                db.session.add(new_general_input)
                db.session.commit()
            modified_response = response.text.replace("Google", "Ezee Shipping")
            modified_response = modified_response.replace("Gemini", "EzeeBot")
            
            url_pattern = r'https?://\S+'
            
            urls = re.findall(url_pattern, modified_response)
            
            for url in urls:
                modified_response = modified_response.replace(url, f'<a href="{url}" style="color: #007bff;">{url}</a>')
            
            modified_response = to_markdown(modified_response)
            
            print(modified_response)
            
            return modified_response
        
    except FileNotFoundError:
        return "The specified file was not found."
    except ValueError as ve:
        return f"Value error occurred: {ve}"
    except Exception as e:
        error_message = f"> **Error generating content:** Kindly refresh and try again."
        print(f"Error generating content: {e}, Kindly refresh and try again by typing 'refresh'.")
        
        return error_message

'''Error generating content: 429 Resource has been exhausted (e.g. check quota)'''