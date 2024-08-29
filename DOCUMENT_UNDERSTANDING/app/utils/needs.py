import requests
from datetime import datetime

api_key_index = 0

def get_next_api_key():
    global api_key_index
    api_keys = [
        "AIzaSyD7f5kuR4NfdkrTbO70XsdoKBbq0yEp5wM", # Sriram
        "AIzaSyDkYi1DfL6lPAWoi3eTIFTBY5vx-XqbcuY ", # Selva sir
        "AIzaSyDyGuDXEGpf5cGXXICQZ5Y_P35g3Q0fI8E", # My Key
    ]
    api_key = api_keys[api_key_index]
    
    api_key_index = (api_key_index + 1) % len(api_keys)
    
    return api_key

def get_model(model, retry=False):
    primary_model = 'gemini-1.5-pro'
    fallback_model = 'gemini-1.5-flash'

    if retry:
        return fallback_model
    else:
        if model == 2:
            return primary_model
        else:
            return fallback_model

def download_file(url):
    try:
        print(url)
        response = requests.get(url, verify=False)
        response.raise_for_status()
        return response.content
    except requests.RequestException as e:
        raise RuntimeError(f"Failed to download file from {url}: {str(e)}")

def order_json_data(data, key_order):
    ordered_data = {}
    for key in key_order:
        if key in data:
            ordered_data[key] = data[key]
    return ordered_data

def convert_date_format(date_str):
    date_formats = ['%d/%m/%Y', '%d.%m.%Y', '%d-%m-%Y', '%d/%m/%y', '%d.%m.%y', '%d-%m-%y']
    
    for fmt in date_formats:
        try:
            if date_str != None:
                return datetime.strptime(date_str, fmt).strftime("%d/%m/%Y")
        except ValueError:
            continue
    
    return date_str

def convert_date_format_dpi(date_str):
    date_formats = ['%d/%m/%Y', '%d.%m.%Y', '%d-%m-%Y', '%d/%m/%y', '%d.%m.%y', '%d-%m-%y']
    
    for fmt in date_formats:
        try:
            if date_str is not None:
                return datetime.strptime(date_str, fmt).strftime("%Y-%m-%d")
        except ValueError:
            continue
    
    return date_str