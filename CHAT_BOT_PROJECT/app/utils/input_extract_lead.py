import os
import google.generativeai as genai
import re
from IPython.display import Markdown
import textwrap
from datetime import datetime, timedelta

# Set the Google API key environment variable
os.environ['GOOGLE_API_KEY'] = "AIzaSyDyGuDXEGpf5cGXXICQZ5Y_P35g3Q0fI8E"
genai.configure(api_key=os.environ['GOOGLE_API_KEY'])

# Initialize the generative model
try:
    model = genai.GenerativeModel('gemini-1.5-pro-latest')
    chat = model.start_chat(history=[])
except Exception as e:
    raise RuntimeError(f"Failed to initialize the generative model: {e}")

def to_markdown(text):
    text = text.replace('•', '  *')
    return Markdown(textwrap.indent(text, '> ', predicate=lambda _: True))

def extarct_from_response(user_input):
    global chat
    try:
        if user_input.lower() == "refresh":
            # Reinitialize the chat session to clear the history and start a new chat
            chat = model.start_chat(history=[])
            print("lead chat history has been refreshed.")
        else:
            current_date = datetime.now().date()
            # Generate content using the generative model
            response = chat.send_message("text: " + user_input + ", extract keywords from the text and add them all into one list [] and give like this example '['prospect':'hot', 'sales_contact':'management', 'lead_source':'google', 'country':'india', 'city':'chennai', 'company_name':'Arun Exports', 'time_period':'last year', 'from_date':'date in this format '2024-06-01'', 'to_date':'date in this format '2024-06-13''', 'month_count':'days count acording to time_period note: don't give like this '30 or 31 days' i want only one answer that also only digits and count the days not months'] there can be one keyword or many keywords also extract and give only the list no need of any aditional explanations in the response only list i want with proper key and value, note: remove leads from text and if any spelling mistakes in the value of time_period or prospect correct and give, Important Note: month_count and from_date, to_date is important if there is time_period and if any name use only company_name as key not name Very Important Note: always give the result in the list format as i shown as example and for your help today date is" + str(current_date), stream=True)
            response.resolve()
            
            # Replace specific words to customize the response
            modified_response = response.text
            modified_response = to_markdown(modified_response)
            data_string = modified_response.data
            print(modified_response.data)
            
            processed_pairs = re.findall(r"'(.*?)': '(.*?)'|'(.*?)': (\d+)", data_string)

            # Process the results to merge the captures into a single list of tuples
            pairs = [(k1 or k2, v1 or v2) for k1, v1, k2, v2 in processed_pairs]

            print('pairs: ', pairs)

            # Create a dictionary from the extracted pairs
            data_dict = {key: value for key, value in pairs}
            print('data_dict: ', data_dict)
            
            # Define the keys to extract
            keys_to_extract = ["prospect", "sales_contact", "country", "city", "lead_source"]

            # Extracting the first part of the data
            first_part = [data_dict[key] for key in keys_to_extract if key in data_dict]

            # Extracting the second part of the data (without a list)
            second_part = data_dict.get("company_name", None)

            # Extracting the third part of the data (without a list)
            third_part = data_dict.get("time_period", None)
            
            # Extracting the fourth part of the data (without a list)
            fourth_part = data_dict.get("month_count", None)
            
            fifth_part = data_dict.get("from_date", None)
            
            sixth_part = data_dict.get("to_date", None)

            # Combining the extracted parts into the desired format
            desired_format = [first_part, second_part, third_part, fourth_part, fifth_part, sixth_part]
            print(desired_format)

            return desired_format, pairs
        
    except FileNotFoundError:
        return "The specified file was not found."
    except ValueError as ve:
        return f"Value error occurred: {ve}"
    except Exception as e:
        error_message = f"> **Error generating content:** Kindly refresh and try again."
        print(f"Error generating content: {e}, Kindly refresh and try again by typing 'refresh'.")
        
        return error_message

'''Error generating content: 429 Resource has been exhausted (e.g. check quota)'''