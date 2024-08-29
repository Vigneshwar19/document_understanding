import re
import spacy

def extract_month_from_response(response):
    # Clean the response string to only contain letters and spaces, then convert to lowercase
    cleaned_question = re.sub(r'[^a-zA-Z\s]', '', response).lower()

    # Split the cleaned question into words
    words = cleaned_question.split()

    # Check if the word "for" is in the words list
    if "for" in words:
        from_index = words.index("for")
        # If "for" is found and followed by another word, extract and return it
        if from_index + 1 < len(words):
            extracted_name = words[from_index + 1]
            return extracted_name.capitalize()

    # Return None if no month is found
    return None

def extract_name(input_text):
    # Load the custom NER model
    model_path = r"C:\python\CHAT_BOT_PROJECT\app\model\name_extract\person_ner_model"
    nlp = spacy.load(model_path)
    doc = nlp(input_text)

    name = None
    # Iterate over the recognized entities and look for a person entity
    for ent in doc.ents:
        if ent.label_ == 'PERSON':
            name = ent.text.capitalize()
    
    # Return the extracted name or None if not found
    return name if name is not None else None

def extract_name_from_question(input_text):
    print(input_text)
    # Clean the input text to remove unwanted characters and convert to lowercase
    cleaned_question = re.sub(r'[^a-zA-Z()._\s]', '', input_text).lower()
    print(cleaned_question)
    words = cleaned_question.split()

    # List of key words to look for in the question
    key_words = ["from", "frm", "to", "are"]
    for key_word in key_words:
        if key_word in words:
            from_index = words.index(key_word)
            # If a keyword is found and followed by other words, extract and format the name
            if from_index + 1 < len(words):
                extracted_name = " ".join(words[from_index + 1:])
                print('name_fun:', extracted_name)
                extracted_name = extracted_name.replace('(', '').replace(')', '')
                return ' '.join(word.capitalize() for word in extracted_name.split('_'))

    # Return None if no name is found
    return None 

def extract_from_brackets_and_name(input_text):
    
    # Clean the input text to remove unwanted characters but keep square brackets and commas
    cleaned_question = re.sub(r'[^a-zA-Z0-9()._\s\[\],]', '', input_text).lower()
    
    # Function to extract all text inside square brackets
    def extract_all_brackets(text):
        matches = re.findall(r'\[(.*?)\]', text)
        combined_results = []
        for match in matches:
            combined_results.extend([word.strip() for word in match.split(',')])
        return combined_results

    # Function to extract name after "starting with"
    def extract_name(text):
        match = re.search(r'with name (.+)', text)
        if match:
            name = match.group(1).strip()
            name = name.replace('(', '').replace(')', '')
            return ' '.join(word.capitalize() for word in name.split())
        return None
    
    # Function to extract time period
    def extract_time_period(text):
        time_periods = ["last month", "last year", "last week", "today", "six months", "six month"]
        for period in time_periods:
            if period in text:
                return period
        return None

    extracted_parts = extract_all_brackets(cleaned_question)
    name = extract_name(cleaned_question)
    time_period = extract_time_period(cleaned_question)
    print([extracted_parts, name, time_period])
    return extracted_parts, name, time_period
