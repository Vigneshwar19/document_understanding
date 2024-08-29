import requests
import re
from datetime import datetime
import json
from collections import Counter

def call_api_multiple_inputs_quo(data, extracted_parts, section, name, time_ref, formatted_list, month_cou, new_pairs):
    result = ""
    print('here')
    print(extracted_parts)
    print(name)
    count = 0
    response = []

    # Parse the JSON string within the 'response' key
    if 'response' in data:
        try:
            corrected_json = correct_json_string(data['response'])
            leadres = json.loads(corrected_json)
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")
            return f"Error decoding JSON: {e}"

        # Ensure leadres is a list
        if not isinstance(leadres, list):
            return "Error: Expected parsed data to be a list."

        # Filter leadres to contain only the items that have all the values present in extracted_parts
        filtered_leadres = filter_leads_by_criteria(leadres, new_pairs)
        print(f"Filtered leadres based on criteria {new_pairs}: ", filtered_leadres)

        # Process each item in the leadres list
        if name is not None: 
            for item in filtered_leadres:      
                if isinstance(item, dict):
                    if "SEARCH COMPANY" in item.keys():
                        bill_to_value = item["SEARCH COMPANY"]
                        if isinstance(bill_to_value, str) and name is not None:
                            name_processed = preprocess_string(name)
                            value_processed = preprocess_string(bill_to_value)
                            if name_processed.capitalize() in value_processed.capitalize():
                                count += 1
                                response.append(bill_to_value)
                else:
                    print(f"Error: Expected a dictionary but got {type(item)} with value {item}")
                    continue
                
            print("res2: ", response)
            words = ", ".join(response)
            # How many [hot] quotation from [google, india] for six months with name t
            # Further processing of the response
            unique_names = set()

            for word in response:
                processed_word = preprocess_string(word).capitalize()
                if processed_word:
                    unique_names.add(processed_word)
                    
            unique_names_list = list(unique_names)
            first_unique_name = next(iter(unique_names), None)
        else:
            for item in filtered_leadres:
                if isinstance(item, dict) and "SEARCH COMPANY" in item:
                    bill_to_value = item["SEARCH COMPANY"]
                    if isinstance(bill_to_value, str):
                        response.append(bill_to_value)
                else:
                    print(f"Error: Expected a dictionary but got {type(item)} with value {item}")
                    continue
            print("res2: ", response)
            words = ", ".join(response)
            # How many [hot] quotation from [google, india] for six months with name t
            # Further processing of the response
            unique_names = set()

            for word in response:
                processed_word = preprocess_string(word).capitalize()
                if processed_word:
                    unique_names.add(processed_word)
                    
            unique_names_list = list(unique_names)
            first_unique_name = next(iter(unique_names), None)

        final_response = ""
        final_response2 = ""
        
        if time_ref is not None:
            if time_ref.isdigit():
                time_ref += " days"
            if formatted_list != "<table style='border-collapse: collapse;'></table>":
                final_response2 += (f"<b>Your {time_ref} {section} count for your search <br>{formatted_list}<br> is listed below:</b>\n\n")
            else:
                final_response2 += (f"<b>Your {time_ref} {section} count for your search is listed below:</b>\n\n")
        else:
            if month_cou is not None:
                if formatted_list != "<table style='border-collapse: collapse;'></table>":
                    final_response2 += (f"<b>Your {month_cou} days {section} count for your search <br>{formatted_list}<br> is listed below:</b>\n\n")
                else:
                    final_response2 += (f"<b>Your {month_cou} days {section} count under your search is listed below:</b>\n\n")
            else:
                if formatted_list != "<table style='border-collapse: collapse;'></table>":
                    final_response2 += (f"<b>Your one month {section} count for your search <br>{formatted_list}<br> is listed below:</b>\n\n")
                else:
                    final_response2 += (f"<b>Your one month {section} count under your search is listed below:</b>\n\n")
        
        resu = ""
        items = ""
        resu += '<div id="tblsrl">\n'
        resu += '<table class="striped-table" border="1" cellspacing="0" cellpadding="3">\n'
        resu += "    <thead>\n"
        resu += "        <tr>\n"

        # Extract keys from the first item in formatted_list for the table headers
        headers = [pair[0] for pair in new_pairs]

        # Ensure "COMPANY" and "CREATED DATE" are included
        headers.insert(0, "QUOTATION DATE")
        if "SEARCH COMPANY" not in headers:
            headers.insert(0, "SEARCH COMPANY")
        if "SEARCH COMPANY" in headers:
            headers.remove("SEARCH COMPANY")
            headers.insert(0, "SEARCH COMPANY")
        # Ensure "ENQUIRY NUMBER" is the first header
        if "QUOTATION NUMBER" not in headers:
            headers.insert(0, "QUOTATION NUMBER")
        if "QUOTATION NUMBER" in headers:
            headers.remove("QUOTATION NUMBER")
            headers.insert(0, "QUOTATION NUMBER")

        # Remove "COMPANY NAME", "FROM DATE", and "TO DATE" if present
        unwanted_headers = ["COMPANY NAME", "FROM DATE", "TO DATE"]
        for header in unwanted_headers:
            if header in headers:
                headers.remove(header)
                
        for header in headers:
            if header == "SEARCH COMPANY":
                header = "SEARCH COMPANY"
            resu += f"            <th><b>{header.upper()}</b></th>\n"
        resu += "        </tr>\n"
        resu += "    </thead>\n"
        items += "    <tbody>\n"
        
        enq_count = 0

        if unique_names_list:
            for com_name in unique_names_list:
                for item in filtered_leadres:
                    if item.get('SEARCH COMPANY', '').upper() == com_name.upper():
                        items += "        <tr class=\"even\">\n"
                        for header in headers:
                            value = item.get(header, '')
                            items += f"            <td><span>{value}</span></td>\n"
                        items += "        </tr>\n"
                        enq_count += 1

        else:
            if time_ref is not None: 
                if time_ref.isdigit():
                    time_ref += " days"
                if formatted_list != "<table style='border-collapse: collapse;'></table>":
                    final_response += f"No {section}s under your search <br>{formatted_list}<br> in {time_ref}. Check the spelling\n\n"
                else:
                    final_response += f"No {section}s for {time_ref} under your search.\n\n"
            else:
                if month_cou is not None:
                    if formatted_list != "<table style='border-collapse: collapse;'></table>":
                        final_response += f"No {section}s under your search <br>{formatted_list}<br> in {month_cou} days. Check the spelling\n\n"
                    else:
                        final_response += f"No {section}s for {month_cou} days under your search.\n\n"
                else:
                    if formatted_list != "<table style='border-collapse: collapse;'></table>":
                        final_response += f"No {section}s under your search <br>{formatted_list}<br> in one month. Check the spelling\n\n"
                    else:
                        final_response += f"No {section}s for one month under your search.\n\n"
                        
        if final_response != f"No {section}s under your search <br>{formatted_list}<br> in {time_ref}. Check the spelling\n\n" and final_response != f"No {section}s for {time_ref} under your search.\n\n" and final_response != f"No {section}s under your search <br>{formatted_list}<br> in one month. Check the spelling\n\n" and final_response != f"No {section}s for one month under your search.\n\n" and final_response != f"No {section}s under your search <br>{formatted_list}<br> in {month_cou} days. Check the spelling\n\n" and final_response != f"No {section}s for {month_cou} days under your search.\n\n":
            
            items += "    </tbody>\n"
            items += "    <tfoot>\n"
            items += f"        <tr>\n"
            items += f"            <td colspan=\"{len(headers)-1}\"><b>TOTAL QUOTATIONS</b></td>\n"
            items += f"            <td><b>{enq_count}</b></td>\n"
            items += "        </tr>\n"
            items += "    </tfoot>\n"
            resu += items
            resu += "</table>\n"
            resu += '</div>\n'

            final_response += final_response2
            final_response += resu

        return final_response
    else:
        return "Error: 'response' key not found in data."
    
def call_api_multiple_inputs_lead(data, extracted_parts, section, name, time_ref, formatted_list, month_cou, new_pairs):
    result = ""
    print('here')
    print(extracted_parts)
    print(name)
    count = 0
    response = []

    # Parse the JSON string within the 'response' key
    if 'response' in data:
        try:
            corrected_json = correct_json_string(data['response'])
            leadres = json.loads(corrected_json)
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")
            return f"Error decoding JSON: {e}"

        # Ensure leadres is a list
        if not isinstance(leadres, list):
            return "Error: Expected parsed data to be a list."

        # Filter leadres to contain only the items that have all the values present in extracted_parts
        filtered_leadres = []
        for item in leadres:
            if all(part.upper() in item.values() for part in extracted_parts):
                filtered_leadres.append(item)
        #print("yes: ", filtered_leadres)

        # Process each item in the leadres list
        if name is not None: 
            for item in filtered_leadres:      
                if isinstance(item, dict):
                    if "NAME" in item.keys():
                        bill_to_value = item["NAME"]
                        if isinstance(bill_to_value, str) and name is not None:
                            name_processed = preprocess_string(name)
                            value_processed = preprocess_string(bill_to_value)
                            if name_processed.capitalize() in value_processed.capitalize():
                                count += 1
                                response.append(bill_to_value)
                else:
                    print(f"Error: Expected a dictionary but got {type(item)} with value {item}")
                    continue
                
            print("res2: ", response)
            words = ", ".join(response)
            # How many [hot] quotation from [google, india] for six months with name t
            # Further processing of the response
            unique_names = set()

            for word in response:
                processed_word = preprocess_string(word).capitalize()
                if processed_word:
                    unique_names.add(processed_word)
                    
            unique_names_list = list(unique_names)
            first_unique_name = next(iter(unique_names), None)
        else:
            for item in filtered_leadres:
                if isinstance(item, dict) and "NAME" in item:
                    bill_to_value = item["NAME"]
                    if isinstance(bill_to_value, str):
                        response.append(bill_to_value)
                else:
                    print(f"Error: Expected a dictionary but got {type(item)} with value {item}")
                    continue
            print("res2: ", response)
            words = ", ".join(response)
            # How many [hot] quotation from [google, india] for six months with name t
            # Further processing of the response
            unique_names = set()

            for word in response:
                processed_word = preprocess_string(word).capitalize()
                if processed_word:
                    unique_names.add(processed_word)
                    
            unique_names_list = list(unique_names)
            first_unique_name = next(iter(unique_names), None)

        final_response = ""
        final_response2 = ""
        
        if time_ref is not None:
            if time_ref.isdigit():
                time_ref += " days"
            if formatted_list != "<table style='border-collapse: collapse;'></table>":
                final_response2 += (f"<b>Your {time_ref} {section} count for your search <br>{formatted_list}<br> is listed below:</b>\n\n")
            else:
                final_response2 += (f"<b>Your {time_ref} {section} count for your search is listed below:</b>\n\n")
        else:
            if month_cou is not None:
                if formatted_list != "<table style='border-collapse: collapse;'></table>":
                    final_response2 += (f"<b>Your {month_cou} days {section} count for your search <br>{formatted_list}<br> is listed below:</b>\n\n")
                else:
                    final_response2 += (f"<b>Your {month_cou} days {section} count under your search is listed below:</b>\n\n")
            else:
                if formatted_list != "<table style='border-collapse: collapse;'></table>":
                    final_response2 += (f"<b>Your one month {section} count for your search <br>{formatted_list}<br> is listed below:</b>\n\n")
                else:
                    final_response2 += (f"<b>Your one month {section} count under your search is listed below:</b>\n\n")
        
        resu = ""
        items = ""
        resu += '<div id="tblsrl">\n'
        resu += '<table class="striped-table" border="1" cellspacing="0" cellpadding="3">\n'
        resu += "    <thead>\n"
        resu += "        <tr>\n"

        # Extract keys from the first item in formatted_list for the table headers
        headers = [pair[0] for pair in new_pairs]
        headers.insert(0, "NAME")
        headers.insert(2, "CREATED DATE")
        if "COMPANY NAME" in headers:
            headers.remove("COMPANY NAME")
        if "FROM DATE" in headers:
            headers.remove("FROM DATE")
        if "TO DATE" in headers:
            headers.remove("TO DATE")
        for header in headers:
            if header == "NAME":
                header = "COMPANY NAME"
            resu += f"            <th><b>{header.upper()}</b></th>\n"
        resu += "        </tr>\n"
        resu += "    </thead>\n"
        items += "    <tbody>\n"

        if unique_names_list:
            for com_name in unique_names_list:
                for item in filtered_leadres:
                    if item.get('NAME', '').upper() == com_name.upper():
                        items += "        <tr class=\"even\">\n"
                        for header in headers:
                            value = item.get(header, '')
                            items += f"            <td>{value}</td>\n"
                        items += "        </tr>\n"

        else:
            if time_ref is not None: 
                if time_ref.isdigit():
                    time_ref += " days"
                if formatted_list != "<table style='border-collapse: collapse;'></table>":
                    final_response += f"No {section}s under your search <br>{formatted_list}<br> in {time_ref}. Check the spelling\n\n"
                else:
                    final_response += f"No {section}s for {time_ref} under your search.\n\n"
            else:
                if month_cou is not None:
                    if formatted_list != "<table style='border-collapse: collapse;'></table>":
                        final_response += f"No {section}s under your search <br>{formatted_list}<br> in {month_cou} days. Check the spelling\n\n"
                    else:
                        final_response += f"No {section}s for {month_cou} days under your search.\n\n"
                else:
                    if formatted_list != "<table style='border-collapse: collapse;'></table>":
                        final_response += f"No {section}s under your search <br>{formatted_list}<br> in one month. Check the spelling\n\n"
                    else:
                        final_response += f"No {section}s for one month under your search.\n\n"
                        
        if final_response != f"No {section}s under your search <br>{formatted_list}<br> in {time_ref}. Check the spelling\n\n" and final_response != f"No {section}s for {time_ref} under your search.\n\n" and final_response != f"No {section}s under your search <br>{formatted_list}<br> in one month. Check the spelling\n\n" and final_response != f"No {section}s for one month under your search.\n\n" and final_response != f"No {section}s under your search <br>{formatted_list}<br> in {month_cou} days. Check the spelling\n\n" and final_response != f"No {section}s for {month_cou} days under your search.\n\n":
            
            items += "    </tbody>\n"
            items += "    <tfoot>\n"
            items += f"        <tr>\n"
            items += f"            <td colspan=\"{len(headers)-1}\"><b>TOTAL LEADS</b></td>\n"
            items += f"            <td><b>{len(unique_names_list)}</b></td>\n"
            items += "        </tr>\n"
            items += "    </tfoot>\n"
            resu += items
            resu += "</table>\n"
            resu += '</div>\n'

            final_response += final_response2
            final_response += resu

        return final_response
    else:
        return "Error: 'response' key not found in data."

def filter_leads_by_criteria(leads, criteria):
    """
    Filter leads based on multiple criteria.

    :param leads: List of lead dictionaries.
    :param criteria: List of tuples where each tuple contains (field, value).
    :return: List of filtered leads.
    """
    # Remove pairs containing 'from date' or 'to date'
    criteria = [(field, value) for field, value in criteria if 'from date' not in field.lower() and 'to date' not in field.lower()]

    filtered = []
    for item in leads:
        match = True
        for field, value in criteria:
            field_value = item.get(field, '')
            if field_value is None:
                field_value = ''
            field_value_lower = field_value.lower()
            if value.lower() not in field_value_lower:
                match = False
                break
        if match:
            filtered.append(item)
    return filtered

def call_api_multiple_inputs_enq(data, extracted_parts, section, name, time_ref, formatted_list, month_cou, new_pairs):
    result = ""
    print('here')
    print(extracted_parts)
    print(name)
    count = 0
    response = []

    # Parse the JSON string within the 'response' key
    if 'response' in data:
        try:
            corrected_json = correct_json_string(data['response'])
            leadres = json.loads(corrected_json)
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")
            return f"Error decoding JSON: {e}"

        # Ensure leadres is a list
        if not isinstance(leadres, list):
            return "Error: Expected parsed data to be a list."

        # Filter leadres to contain only the items that have all the values present in extracted_parts
        filtered_leadres = filter_leads_by_criteria(leadres, new_pairs)
        print(f"Filtered leadres based on criteria {new_pairs}: ", filtered_leadres)

        # Process each item in the leadres list
        if name is not None: 
            for item in filtered_leadres:      
                if isinstance(item, dict):
                    if "COMPANY" in item.keys():
                        bill_to_value = item["COMPANY"]
                        if isinstance(bill_to_value, str) and name is not None:
                            name_processed = preprocess_string(name)
                            value_processed = preprocess_string(bill_to_value)
                            if name_processed.capitalize() in value_processed.capitalize():
                                count += 1
                                response.append(bill_to_value)
                else:
                    print(f"Error: Expected a dictionary but got {type(item)} with value {item}")
                    continue
                
            print("res2: ", response)
            words = ", ".join(response)
            # How many [hot] quotation from [google, india] for six months with name t
            # Further processing of the response
            unique_names = set()

            for word in response:
                processed_word = preprocess_string(word).capitalize()
                if processed_word:
                    unique_names.add(processed_word)
                    
            unique_names_list = list(unique_names)
            first_unique_name = next(iter(unique_names), None)
        else:
            for item in filtered_leadres:
                if isinstance(item, dict) and "COMPANY" in item:
                    bill_to_value = item["COMPANY"]
                    if isinstance(bill_to_value, str):
                        response.append(bill_to_value)
                else:
                    print(f"Error: Expected a dictionary but got {type(item)} with value {item}")
                    continue
            print("res2: ", response)
            words = ", ".join(response)
            # How many [hot] quotation from [google, india] for six months with name t
            # Further processing of the response
            unique_names = set()

            for word in response:
                processed_word = preprocess_string(word).capitalize()
                if processed_word:
                    unique_names.add(processed_word)
                    
            unique_names_list = list(unique_names)
            first_unique_name = next(iter(unique_names), None)

        final_response = ""
        final_response2 = ""
        
        if time_ref is not None:
            if time_ref.isdigit():
                time_ref += " days"
            if formatted_list != "<table style='border-collapse: collapse;'></table>":
                final_response2 += (f"<b>Your {time_ref} {section} count for your search <br>{formatted_list}<br> is listed below:</b>\n\n")
            else:
                final_response2 += (f"<b>Your {time_ref} {section} count for your search is listed below:</b>\n\n")
        else:
            if month_cou is not None:
                if formatted_list != "<table style='border-collapse: collapse;'></table>":
                    final_response2 += (f"<b>Your {month_cou} days {section} count for your search <br>{formatted_list}<br> is listed below:</b>\n\n")
                else:
                    final_response2 += (f"<b>Your {month_cou} days {section} count under your search is listed below:</b>\n\n")
            else:
                if formatted_list != "<table style='border-collapse: collapse;'></table>":
                    final_response2 += (f"<b>Your one month {section} count for your search <br>{formatted_list}<br> is listed below:</b>\n\n")
                else:
                    final_response2 += (f"<b>Your one month {section} count under your search is listed below:</b>\n\n")
        
        resu = ""
        items = ""
        resu += '<div id="tblsrl">\n'
        resu += '<table class="striped-table" border="1" cellspacing="0" cellpadding="3">\n'
        resu += "    <thead>\n"
        resu += "        <tr>\n"

        # Extract keys from the first item in formatted_list for the table headers
        headers = [pair[0] for pair in new_pairs]

        # Ensure "COMPANY" and "CREATED DATE" are included
        headers.insert(0, "CREATED DATE")
        if "COMPANY" not in headers:
            headers.insert(0, "COMPANY")
        if "COMPANY" in headers:
            headers.remove("COMPANY")
            headers.insert(0, "COMPANY")
        # Ensure "ENQUIRY NUMBER" is the first header
        if "ENQUIRY NUMBER" not in headers:
            headers.insert(0, "ENQUIRY NUMBER")
        if "ENQUIRY NUMBER" in headers:
            headers.remove("ENQUIRY NUMBER")
            headers.insert(0, "ENQUIRY NUMBER")

        # Remove "COMPANY NAME", "FROM DATE", and "TO DATE" if present
        unwanted_headers = ["COMPANY NAME", "FROM DATE", "TO DATE"]
        for header in unwanted_headers:
            if header in headers:
                headers.remove(header)
                
        for header in headers:
            if header == "COMPANY":
                header = "COMPANY"
            resu += f"            <th><b>{header.upper()}</b></th>\n"
        resu += "        </tr>\n"
        resu += "    </thead>\n"
        items += "    <tbody>\n"
        
        enq_count = 0

        if unique_names_list:
            for com_name in unique_names_list:
                for item in filtered_leadres:
                    if item.get('COMPANY', '').upper() == com_name.upper():
                        items += "        <tr class=\"even\">\n"
                        for header in headers:
                            value = item.get(header, '')
                            items += f"            <td><span>{value}</span></td>\n"
                        items += "        </tr>\n"
                        enq_count += 1

        else:
            if time_ref is not None: 
                if time_ref.isdigit():
                    time_ref += " days"
                if formatted_list != "<table style='border-collapse: collapse;'></table>":
                    final_response += f"No {section}s under your search <br>{formatted_list}<br> in {time_ref}. Check the spelling\n\n"
                else:
                    final_response += f"No {section}s for {time_ref} under your search.\n\n"
            else:
                if month_cou is not None:
                    if formatted_list != "<table style='border-collapse: collapse;'></table>":
                        final_response += f"No {section}s under your search <br>{formatted_list}<br> in {month_cou} days. Check the spelling\n\n"
                    else:
                        final_response += f"No {section}s for {month_cou} days under your search.\n\n"
                else:
                    if formatted_list != "<table style='border-collapse: collapse;'></table>":
                        final_response += f"No {section}s under your search <br>{formatted_list}<br> in one month. Check the spelling\n\n"
                    else:
                        final_response += f"No {section}s for one month under your search.\n\n"
                        
        if final_response != f"No {section}s under your search <br>{formatted_list}<br> in {time_ref}. Check the spelling\n\n" and final_response != f"No {section}s for {time_ref} under your search.\n\n" and final_response != f"No {section}s under your search <br>{formatted_list}<br> in one month. Check the spelling\n\n" and final_response != f"No {section}s for one month under your search.\n\n" and final_response != f"No {section}s under your search <br>{formatted_list}<br> in {month_cou} days. Check the spelling\n\n" and final_response != f"No {section}s for {month_cou} days under your search.\n\n":
            
            items += "    </tbody>\n"
            items += "    <tfoot>\n"
            items += f"        <tr>\n"
            items += f"            <td colspan=\"{len(headers)-1}\"><b>TOTAL ENQUIRIES</b></td>\n"
            items += f"            <td><b>{enq_count}</b></td>\n"
            items += "        </tr>\n"
            items += "    </tfoot>\n"
            resu += items
            resu += "</table>\n"
            resu += '</div>\n'

            final_response += final_response2
            final_response += resu

        return final_response
    else:
        return "Error: 'response' key not found in data."

def call_api_lead_month(user_column, json_input, month_name, environment, search_in, end_point, fields_to_print, field_name_mapping):
    print(json_input)
    print(user_column)
    response = ""       
            
    if json_input:
        api_url = f"{environment}/{end_point}"
        try:
            api_resp = requests.post(api_url, json=json_input, verify=False)
                    
            if api_resp.ok: 
                        api_data = api_resp.json()

                        extracted_data_all_lists = []

                        for data_item in api_data:
                            extracted_data = {}
                            for field in fields_to_print:
                                mapped_field = field_name_mapping.get(field, field).upper()
                                if field == 'createddate':
                                    timestamp = int(data_item.get(field, 'Not available')) / 1000
                                    extracted_data[mapped_field] = datetime.utcfromtimestamp(timestamp).strftime('%Y-%m-%d')
                                else:
                                    extracted_data[mapped_field] = data_item.get(field, 'Not available')

                            extracted_data_all_lists.append(extracted_data)

                        extracted_data_all_lists_json = json.dumps(extracted_data_all_lists, indent=4)

                        extracted_data_all_lists_dict = json.loads(extracted_data_all_lists_json)
                        
                        count = 0

                        for item in extracted_data_all_lists_dict:
                            if user_column in item:
                                count += 1
                                response += str(item[user_column])+ " , "
                                print(response)
                        month_res = (f'> {search_in} in <b>{month_name}</b> is <b>{count}</b>\n\n')
                        return month_res                             
            else:
                response = ('Error: Failed to get a response from the API. Status code:', api_resp.status_code)

        except requests.exceptions.SSLError as ssl_error:
            response = f"SSL Error: {ssl_error}"
        except requests.exceptions.RequestException as e:
            response = ('Error: Failed to call the API -', str(e))
    else:
        response = ('Error: Prospect is missing or invalid.')

def call_api_selling_month(user_column, json_input, month_name, environment, search_in, end_point, field_name_mapping):
    print(json_input)
    print(user_column)
    response = ""       
            
    if json_input:
        api_url = f"{environment}/{end_point}"
        try:
            api_resp = requests.post(api_url, json=json_input, verify=False)
                    
            if api_resp.ok:
                api_data = api_resp.json()
                        
                order_list = ['BILL NUMBER', 'BILL DATE', 'BOOKING REF', 'BOOKING NUMBER', 'BOOKING DATE', 'SHIPMENT TYPE', 'BILL TO', 'BILL CURRENCY', 'NET TOTAL(TAX)',
                                        'NET TOTAL(NON-TAX)', 'TAX', 'CGST', 'SGST', 'IGST', 'GROSS TOTAL', 'FOREIGN CURRENCY 1', 'AMOUNT 1', 'FOREIGN CURRENCY 2', 'AMOUNT 2', 'BILL STATUS', 'ACK NO', 'ACK DT']

                fields_to_print = ['billNo', 'billDate', 'billtoname', 'currency', 'taxableamount', 'nettotalnotax', 'taxtotal', 'cgst_amt_str', 'sgst_amt_str', 'igst_amt_str', 'grosstotal',
                                        'extcurr1', 'extcurr1amount', 'extcurr2', 'extcurr2amount', 'status']
                        
                fields_to_print_2 = ['refbookingtype', 'bookingno', 'bookingdate', 'shipmenttype','sender', 'receiver']

                extracted_data_all_lists = []

                for data_item in api_data:
                    extracted_data = {}
                            
                    if 'bookingDetailsVO' in data_item:
                        for field in fields_to_print_2:
                            mapped_field = field_name_mapping.get(field, field).upper()
                            if field in data_item['bookingDetailsVO']:
                                extracted_data[mapped_field] = data_item['bookingDetailsVO'][field]
                                        
                    for field in fields_to_print:
                        mapped_field = field_name_mapping.get(field, field).upper()
                        extracted_data[mapped_field] = data_item.get(field, 'Not available')
                            
                    extracted_data_all_lists.append(extracted_data)
                            
                reordered_data_all_lists = [{key: extracted_data[key] for key in order_list} for extracted_data in extracted_data_all_lists]
                        
                extracted_data_all_lists_json = json.dumps(reordered_data_all_lists, indent=4)
                extracted_data_all_lists_dict = json.loads(extracted_data_all_lists_json)

                count = 0

                for item in extracted_data_all_lists_dict:
                            for key, value in item.items():
                                if isinstance(key, str) and user_column is not None:
                                    if user_column.capitalize() == key.capitalize():
                                        count += 1
                month_res = (f'> {search_in} bills in {month_name} is <b>{count}</b>\n\n')
                return month_res
                                        
            else:
                    response = ('Error: Failed to get a response from the API. Status code:', api_resp.status_code)

        except requests.exceptions.SSLError as ssl_error:
            response = f"SSL Error: {ssl_error}"
        except requests.exceptions.RequestException as e:
            response = ('Error: Failed to call the API -', str(e))
    else:
        response = ('Error: Prospect is missing or invalid.')
        
def call_api_selling_lead(user_column, json_input, section, fill, environment, end_point, field_name_mapping, fields_to_print):
    print(json_input)
    print(user_column)
    response = ""      
            
    if json_input:
        api_url = f"{environment}/{end_point}"
        try:
            api_resp = requests.post(api_url, json=json_input, verify=False)
                    
            if api_resp.ok: 
                        api_data = api_resp.json()

                        extracted_data_all_lists = []

                        for data_item in api_data:
                            extracted_data = {}
                            for field in fields_to_print:
                                mapped_field = field_name_mapping.get(field, field).upper()
                                if field == 'createddate':
                                    timestamp = int(data_item.get(field, 'Not available')) / 1000
                                    extracted_data[mapped_field] = datetime.utcfromtimestamp(timestamp).strftime('%Y-%m-%d')
                                else:
                                    extracted_data[mapped_field] = data_item.get(field, 'Not available')

                            extracted_data_all_lists.append(extracted_data)

                        extracted_data_all_lists_json = json.dumps(extracted_data_all_lists, indent=4)

                        extracted_data_all_lists_dict = json.loads(extracted_data_all_lists_json)
                        
                        count = 0

                        for item in extracted_data_all_lists_dict:
                            if user_column in item:
                                count += 1
                                response += str(item[user_column])+ " , "
    
                        return (f"> Number of <b>{section}</b> in <b>{fill}</b> is <b>{count}</b>\n\n")                              
            else:
                response = ('Error: Failed to get a response from the API. Status code:', api_resp.status_code)

        except requests.exceptions.SSLError as ssl_error:
            response = f"SSL Error: {ssl_error}"
        except requests.exceptions.RequestException as e:
            response = ('Error: Failed to call the API -', str(e))
    else:
        response = ('Error: Prospect is missing or invalid.')

def call_api_selling_sell(user_column, json_input, section, fill, environment, end_point, field_name_mapping):
    print(json_input)
    print(user_column)
    print('yessssss')
    response = ""      
            
    if json_input:
        api_url = f"{environment}/{end_point}"
        try:
            api_resp = requests.post(api_url, json=json_input, verify=False)
                    
            if api_resp.ok:
                api_data = api_resp.json()
                        
                order_list = ['BILL NUMBER', 'BILL DATE', 'BOOKING REF', 'BOOKING NUMBER', 'BOOKING DATE', 'SHIPMENT TYPE', 'BILL TO', 'BILL CURRENCY', 'NET TOTAL(TAX)',
                                        'NET TOTAL(NON-TAX)', 'TAX', 'CGST', 'SGST', 'IGST', 'GROSS TOTAL', 'FOREIGN CURRENCY 1', 'AMOUNT 1', 'FOREIGN CURRENCY 2', 'AMOUNT 2', 'BILL STATUS', 'ACK NO', 'ACK DT']

                fields_to_print = ['billNo', 'billDate', 'billtoname', 'currency', 'taxableamount', 'nettotalnotax', 'taxtotal', 'cgst_amt_str', 'sgst_amt_str', 'igst_amt_str', 'grosstotal',
                                        'extcurr1', 'extcurr1amount', 'extcurr2', 'extcurr2amount', 'status']
                        
                fields_to_print_2 = ['refbookingtype', 'bookingno', 'bookingdate', 'shipmenttype','sender', 'receiver']

                extracted_data_all_lists = []

                for data_item in api_data:
                    extracted_data = {}
                            
                    if 'bookingDetailsVO' in data_item:
                        for field in fields_to_print_2:
                            mapped_field = field_name_mapping.get(field, field).upper()
                            if field in data_item['bookingDetailsVO']:
                                extracted_data[mapped_field] = data_item['bookingDetailsVO'][field]
                                        
                    for field in fields_to_print:
                        mapped_field = field_name_mapping.get(field, field).upper()
                        extracted_data[mapped_field] = data_item.get(field, 'Not available')
                            
                    extracted_data_all_lists.append(extracted_data)
                            
                reordered_data_all_lists = [{key: extracted_data[key] for key in order_list} for extracted_data in extracted_data_all_lists]
                        
                extracted_data_all_lists_json = json.dumps(reordered_data_all_lists, indent=4)
                extracted_data_all_lists_dict = json.loads(extracted_data_all_lists_json)
                        
                count = 0

                for item in extracted_data_all_lists_dict:
                    if user_column in item:
                        count += 1
                        response += str(item[user_column])+ " , "
    
                return (f"> Number of <b>{section}</b> in <b>{fill}</b> is <b>{count}</b>\n\n")                               
            else:
                response = ('Error: Failed to get a response from the API. Status code:', api_resp.status_code)

        except requests.exceptions.SSLError as ssl_error:
            response = f"SSL Error: {ssl_error}"
        except requests.exceptions.RequestException as e:
            response = ('Error: Failed to call the API -', str(e))
    else:
        response = ('Error: Prospect is missing or invalid.')

def call_api_enq_count(data, section, user_column, fill):
    count = 0

    # Parse the JSON string within the 'response' key
    if 'response' in data:
        try:
            corrected_json = correct_json_string(data['response'])
            enqres = json.loads(corrected_json)
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")
            return f"Error decoding JSON: {e}"

        # Ensure leadres is a list
        if not isinstance(enqres, list):
            return "Error: Expected parsed data to be a list."

        # Process each item in the leadres list
        for item in enqres:
            if user_column in item:
                count += 1

        # Return the response in markdown format
        return f"> Number of **{section}** in **{fill}** is **{count}**\n\n"
    else:
        return "Error: 'response' key not found in data."

def call_api_common_count(data, section, user_column, fill):
    count = 0

    # Parse the JSON string within the 'response' key
    if 'response' in data:
        try:
            corrected_json = correct_json_string(data['response'])
            enqres = json.loads(corrected_json)
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")
            return f"Error decoding JSON: {e}"

        # Ensure enqres is a list
        if not isinstance(enqres, list):
            return "Error: Expected parsed data to be a list."

        # Process each item in the enqres list
        for item in enqres:
            # Ensure item is a dictionary
            if isinstance(item, dict):
                # Check if user_column matches any value in the dictionary
                if any(user_column.lower() == value.lower() for value in item.values() if isinstance(value, str)):
                    count += 1

        # Return the response in markdown format
        return f"> Number of **{user_column}** {section} in {fill} is **{count}**\n\n"
    else:
        return "Error: 'response' key not found in data."

def correct_json_string(json_str):
    corrected_str = re.sub(r':\s*(?=[,\}])', ': null', json_str)
    corrected_str = re.sub(r'(?<=\s):\s*null', ': null', corrected_str)
    return corrected_str

def call_api_lead_name(data, name, section, search_in, time_period, user_column):
    count = 0
    response = ""

    # Parse the JSON string within the 'response' key
    if 'response' in data:
        try:
            corrected_json = correct_json_string(data['response'])
            leadres = json.loads(corrected_json)
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")
            return f"Error decoding JSON: {e}"

        # Ensure leadres is a list
        if not isinstance(leadres, list):
            return "Error: Expected parsed data to be a list."

        # Process each item in the leadres list
        for item in leadres:      
            if isinstance(item, dict):
                for key, value in item.items():
                    if key.upper() == user_column:
                        bill_to_value = item[user_column]
                        if isinstance(bill_to_value, str) and name is not None:
                            name_processed = preprocess_string(name)
                            value_processed = preprocess_string(bill_to_value)
                            if name_processed.capitalize() in value_processed.capitalize():
                                count += 1
                                response += str(value) + " , "
            else:
                print(f"Error: Expected a dictionary but got {type(item)} with value {item}")
                continue

        words = response.split(", ")

        unique_names = set()

        for word in words:
            processed_word = preprocess_string(word).capitalize()
            if processed_word:
                unique_names.add(processed_word)
                
        unique_names_list = list(unique_names)
        first_unique_name = next(iter(unique_names), None)
    
        final_response = ""
        final_response2 = ""
        final_response2 += (f"<b>Your {time_period} {section} count for your search '{name}' is listed below:</b>\n\n")
        resu = ""
        resu += '<div >\n'
        resu += '<table class="striped-table" border="1" cellspacing="0" cellpadding="3">\n'
        
        resu += "    <thead>\n"
        resu += f"        <tr>\n"
        resu += "            <th colspan=\"1\"><b>COMPANY</b></th>\n"
        resu += "            <th colspan=\"1\"><b>COUNT</b></th>\n"
        resu += f"        </tr>\n"
        resu += "    </thead>\n"
        items = ""
        if unique_names_list:
            for com_name in unique_names_list:

                filtered_items = [item for item in leadres if user_column in item and item[user_column] is not None and item[user_column].strip().capitalize() == com_name.strip().capitalize()]
                filtered_items_count = len(filtered_items)

                #resu = (f"> * **{com_name.upper()} - {filtered_items_count}**\n\n")

                # Add rows for each payment mode with alternating row colors
                items += f"        <tr class=\"even\">\n"
                items += f"            <td>{com_name.upper()}</td>\n"
                items += f"            <td>{filtered_items_count}</td>\n"
                items += "        </tr>\n"
        
        else:
            final_response += f"No {section} from **{name}** in {time_period}. Check the spelling\n\n"
        
        if final_response != f"No {section} from **{name}** in {time_period}. Check the spelling\n\n":
        
            resu += items
            
            resu += "    </tbody>\n"
            resu += "</table>\n"
            resu += '</div>\n'
            
            final_response += final_response2
            final_response += resu

        return final_response
    else:
        return "Error: 'response' key not found in data."

def call_api_pay_name(data, name, section, search_in, time_period, user_column):
    count = 0
    response = ""

    # Parse the JSON string within the 'response' key
    if 'response' in data:
        try:
            corrected_json = correct_json_string(data['response'])
            leadres = json.loads(corrected_json)
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")
            return f"Error decoding JSON: {e}"

        # Ensure leadres is a list
        if not isinstance(leadres, list):
            return "Error: Expected parsed data to be a list."

        # Process each item in the leadres list
        for item in leadres:      
            if isinstance(item, dict):
                for key, value in item.items():
                    if key.upper() == user_column:
                        bill_to_value = item[user_column]
                        if isinstance(bill_to_value, str) and name is not None:
                            name_processed = preprocess_string(name)
                            value_processed = preprocess_string(bill_to_value)
                            if name_processed.capitalize() in value_processed.capitalize():
                                count += 1
                                response += str(value) + " , "
            else:
                print(f"Error: Expected a dictionary but got {type(item)} with value {item}")
                continue

        words = response.split(", ")

        unique_names = set()

        for word in words:
            processed_word = preprocess_string(word).capitalize()
            if processed_word:
                unique_names.add(processed_word)
                
        unique_names_list = list(unique_names)
        first_unique_name = next(iter(unique_names), None)
        final_response = ""
        final_response2 = ""
                
        if search_in == "payments":
            items = ""
            resu = ""
            final_response2 += f"**{time_period} invoice count and payment details for your search '{name}' are listed below:**\n\n"
            resu += '<div >\n'
            resu += '<table class="striped-table" border="1" cellspacing="0" cellpadding="3">\n'

            resu += "    <thead>\n"
            resu += f"        <tr>\n"
            resu += "            <th rowspan=\"3\"><b>PAYMENT TO</b></th>\n"
            resu += "            <th rowspan=\"3\"><b>COUNT</b></th>\n"
            resu += "            <th colspan=\"6\" style='text-align: center;'><b>PAYMENT MODE</b></th>\n"
            resu += "            <th rowspan=\"3\"><b>TOTAL AMT</b></th>\n"
            resu += f"        </tr>\n"
            resu += f"        <tr>\n"
            resu += "            <th colspan=\"2\" style='text-align: center;'><b>CASH</b></th>\n"
            resu += "            <th colspan=\"2\" style='text-align: center;'><b>ONLINE</b></th>\n"
            resu += "            <th colspan=\"2\" style='text-align: center;'><b>CHEQUE</b></th>\n"
            resu += f"        </tr>\n"
            resu += f"        <tr>\n"
            resu += "            <th style='text-align: center;'><b>COUNT</b></th>\n"
            resu += "            <th style='text-align: center;'><b>AMT</b></th>\n"
            resu += "            <th style='text-align: center;'><b>COUNT</b></th>\n"
            resu += "            <th style='text-align: center;'><b>AMT</b></th>\n"
            resu += "            <th style='text-align: center;'><b>COUNT</b></th>\n"
            resu += "            <th style='text-align: center;'><b>AMT</b></th>\n"
            resu += f"        </tr>\n"
            resu += "    </thead>\n"
            resu += "    <tbody>\n"

            if unique_names_list:
                for com_name in unique_names_list:
                    filtered_items = [item for item in leadres if user_column in item and item[user_column] is not None and item[user_column].strip().capitalize() == com_name.strip().capitalize()]
                    filtered_items_count = len(filtered_items)

                    payment_modes = [item.get('PAYMENT MODE', '') for item in filtered_items]
                    payment_mode_count = Counter(payment_modes)

                    total_amount = sum(item.get('TOTAL AMOUNT', 0) for item in filtered_items)
                    cash_count = payment_mode_count.get('CASH', 0)
                    online_count = payment_mode_count.get('ONLINE', 0)
                    cheque_count = payment_mode_count.get('CHEQUE', 0)
                    cash_total_amount = sum(item.get('TOTAL AMOUNT', 0) for item in filtered_items if item.get('PAYMENT MODE') == 'CASH')
                    online_total_amount = sum(item.get('TOTAL AMOUNT', 0) for item in filtered_items if item.get('PAYMENT MODE') == 'ONLINE')
                    cheque_total_amount = sum(item.get('TOTAL AMOUNT', 0) for item in filtered_items if item.get('PAYMENT MODE') == 'CHEQUE')

                    # Add rows for each payment mode with alternating row colors
                    items += f"        <tr class=\"even\">\n"
                    items += f"            <td>{com_name.upper()}</td>\n"
                    items += f"            <td>{filtered_items_count}</td>\n"
                    items += f"            <td>{cash_count}</td>\n"
                    items += f"            <td>{cash_total_amount:.2f}</td>\n"
                    items += f"            <td>{online_count}</td>\n"
                    items += f"            <td>{online_total_amount:.2f}</td>\n"
                    items += f"            <td>{cheque_count}</td>\n"
                    items += f"            <td>{cheque_total_amount:.2f}</td>\n"
                    items += f"            <td>{total_amount:.2f}</td>\n"
                    items += "        </tr>\n"
            else:
                final_response += f"No {section} from **{name}** in {time_period}. Check the spelling\n\n"
            
            if final_response != f"No {section} from **{name}** in {time_period}. Check the spelling\n\n":
                print('yes')

                # Close the table body and table
                resu += items
                resu += "    </tbody>\n"
                resu += "</table>\n"
                resu += '</div>\n'

                final_response += final_response2
                final_response += resu

        elif search_in == "receipts":
            items = ""
            resu = ""
            final_response2 += f"**{time_period} invoice count and receipt details for your search '{name}' are listed below:**\n\n"
            resu += '<div >\n'
            resu += '<table class="striped-table" border="1" cellspacing="0" cellpadding="3">\n'

            resu += "    <thead>\n"
            resu += f"        <tr>\n"
            resu += "            <th rowspan=\"3\"><b>RECEIPT FROM</b></th>\n"
            resu += "            <th rowspan=\"3\"><b>COUNT</b></th>\n"
            resu += "            <th colspan=\"6\" style='text-align: center;'><b>RECEIPT MODE</b></th>\n"
            resu += "            <th rowspan=\"3\"><b>TOTAL AMT</b></th>\n"
            resu += f"        </tr>\n"
            resu += f"        <tr>\n"
            resu += "            <th colspan=\"2\" style='text-align: center;'><b>CASH</b></th>\n"
            resu += "            <th colspan=\"2\" style='text-align: center;'><b>ONLINE</b></th>\n"
            resu += "            <th colspan=\"2\" style='text-align: center;'><b>CHEQUE</b></th>\n"
            resu += f"        </tr>\n"
            resu += f"        <tr>\n"
            resu += "            <th style='text-align: center;'><b>COUNT</b></th>\n"
            resu += "            <th style='text-align: center;'><b>AMT</b></th>\n"
            resu += "            <th style='text-align: center;'><b>COUNT</b></th>\n"
            resu += "            <th style='text-align: center;'><b>AMT</b></th>\n"
            resu += "            <th style='text-align: center;'><b>COUNT</b></th>\n"
            resu += "            <th style='text-align: center;'><b>AMT</b></th>\n"
            resu += f"        </tr>\n"
            resu += "    </thead>\n"
            resu += "    <tbody>\n"

            if unique_names_list:
                for com_name in unique_names_list:
                    filtered_items = [item for item in leadres if user_column in item and item[user_column] is not None and item[user_column].strip().capitalize() == com_name.strip().capitalize()]
                    filtered_items_count = len(filtered_items)

                    payment_modes = [item.get('RECEIPT MODE', '') for item in filtered_items]
                    payment_mode_count = Counter(payment_modes)

                    total_amount = sum(item.get('TOTAL AMOUNT', 0) for item in filtered_items)
                    cash_count = payment_mode_count.get('CASH', 0)
                    online_count = payment_mode_count.get('ONLINE', 0)
                    cheque_count = payment_mode_count.get('CHEQUE', 0)
                    cash_total_amount = sum(item.get('TOTAL AMOUNT', 0) for item in filtered_items if item.get('RECEIPT MODE') == 'CASH')
                    online_total_amount = sum(item.get('TOTAL AMOUNT', 0) for item in filtered_items if item.get('RECEIPT MODE') == 'ONLINE')
                    cheque_total_amount = sum(item.get('TOTAL AMOUNT', 0) for item in filtered_items if item.get('RECEIPT MODE') == 'CHEQUE')

                    # Add rows for each receipt mode with alternating row colors
                    items += f"        <tr class=\"even\">\n"
                    items += f"            <td>{com_name.upper()}</td>\n"
                    items += f"            <td>{filtered_items_count}</td>\n"
                    items += f"            <td>{cash_count}</td>\n"
                    items += f"            <td>{cash_total_amount:.2f}</td>\n"
                    items += f"            <td>{online_count}</td>\n"
                    items += f"            <td>{online_total_amount:.2f}</td>\n"
                    items += f"            <td>{cheque_count}</td>\n"
                    items += f"            <td>{cheque_total_amount:.2f}</td>\n"
                    items += f"            <td>{total_amount:.2f}</td>\n"
                    items += "        </tr>\n"
            else:
                final_response += f"No {section} from **{name}** in {time_period}. Check the spelling\n\n"

            # Close the table body and table
            if final_response != f"No {section} from **{name}** in {time_period}. Check the spelling\n\n":

                # Close the table body and table
                resu += items
                resu += "    </tbody>\n"
                resu += "</table>\n"
                resu += '</div>\n'

                final_response += final_response2
                final_response += resu
        elif search_in == "air way bills":
            items = ""
            resu = ""
            final_response2 += f"**{time_period} {section} count and details for your search '{name}' are listed below:**\n\n"
            resu += '<div >\n'
            resu += '<table class="striped-table" border="1" cellspacing="0" cellpadding="3">\n'

            resu += "    <thead>\n"
            resu += f"        <tr>\n"
            resu += "            <th rowspan=\"2\"><b>SHIPPER</b></th>\n"
            resu += "            <th colspan=\"2\" style='text-align: center;'><b>AIR WAY BILL TYPE</b></th>\n"
            resu += "            <th rowspan=\"2\"><b>TOTAL COUNT</b></th>\n"
            resu += f"        </tr>\n"
            resu += f"        <tr>\n"
            resu += "            <th colspan=\"1\" style='text-align: center;'><b>HOUSE</b></th>\n"
            resu += "            <th colspan=\"1\" style='text-align: center;'><b>MASTER</b></th>\n"
            resu += f"        </tr>\n"
            resu += "    </thead>\n"
            resu += "    <tbody>\n"

            if unique_names_list:
                for com_name in unique_names_list:
                    filtered_items = [item for item in leadres if user_column in item and item[user_column] is not None and item[user_column].strip().capitalize() == com_name.strip().capitalize()]
                    filtered_items_count = len(filtered_items)

                    payment_modes = [item.get('AWB TYPE', '') for item in filtered_items]
                    payment_mode_count = Counter(payment_modes)

                    cash_count = payment_mode_count.get('MASTER', 0)
                    online_count = payment_mode_count.get('HOUSE', 0)

                    # Add rows for each receipt mode with alternating row colors
                    items += f"        <tr class=\"even\">\n"
                    items += f"            <td>{com_name.upper()}</td>\n"
                    items += f"            <td>{cash_count}</td>\n"
                    items += f"            <td>{online_count}</td>\n"
                    items += f"            <td>{filtered_items_count}</td>\n"
                    items += "        </tr>\n"
            else:
                final_response += f"No {section} from **{name}** in {time_period}. Check the spelling\n\n"

            # Close the table body and table
            if final_response != f"No {section} from **{name}** in {time_period}. Check the spelling\n\n":

                # Close the table body and table
                resu += items
                resu += "    </tbody>\n"
                resu += "</table>\n"
                resu += '</div>\n'

                final_response += final_response2
                final_response += resu
        elif search_in == "bill of lading":
            items = ""
            resu = ""
            final_response2 += f"**{time_period} {'bill of lading' if section == 'billoflad' else section} count and details for your search '{name}' are listed below:**\n\n"
            resu += '<div >\n'
            resu += '<table class="striped-table" border="1" cellspacing="0" cellpadding="3">\n'

            resu += "    <thead>\n"
            resu += f"        <tr>\n"
            resu += "            <th rowspan=\"2\"><b>SHIPPER</b></th>\n"
            resu += "            <th colspan=\"2\" style='text-align: center;'><b>BL TYPE</b></th>\n"
            resu += "            <th rowspan=\"2\"><b>TOTAL COUNT</b></th>\n"
            resu += f"        </tr>\n"
            resu += f"        <tr>\n"
            resu += "            <th colspan=\"1\" style='text-align: center;'><b>HOUSE</b></th>\n"
            resu += "            <th colspan=\"1\" style='text-align: center;'><b>MASTER</b></th>\n"
            resu += f"        </tr>\n"
            resu += "    </thead>\n"
            resu += "    <tbody>\n"

            if unique_names_list:
                for com_name in unique_names_list:
                    filtered_items = [item for item in leadres if user_column in item and item[user_column] is not None and item[user_column].strip().capitalize() == com_name.strip().capitalize()]
                    filtered_items_count = len(filtered_items)

                    payment_modes = [item.get('BL TYPE', '') for item in filtered_items]
                    payment_mode_count = Counter(payment_modes)

                    cash_count = payment_mode_count.get('MASTER', 0)
                    online_count = payment_mode_count.get('HOUSE', 0)

                    # Add rows for each receipt mode with alternating row colors
                    items += f"        <tr class=\"even\">\n"
                    items += f"            <td>{com_name.upper()}</td>\n"
                    items += f"            <td>{cash_count}</td>\n"
                    items += f"            <td>{online_count}</td>\n"
                    items += f"            <td>{filtered_items_count}</td>\n"
                    items += "        </tr>\n"
            else:
                final_response += f"No {section} from **{name}** in {time_period}. Check the spelling\n\n"

            # Close the table body and table
            if final_response != f"No {section} from **{name}** in {time_period}. Check the spelling\n\n":

                # Close the table body and table
                resu += items
                resu += "    </tbody>\n"
                resu += "</table>\n"
                resu += '</div>\n'

                final_response += final_response2
                final_response += resu

        return final_response
    else:
        return "Error: 'response' key not found in data."
 
def call_api_buy_name(data, name, section, search_in, time_period, user_column):
    count = 0
    response = ""

    # Parse the JSON string within the 'response' key
    if 'response' in data:
        try:
            corrected_json = correct_json_string(data['response'])
            data = json.loads(corrected_json)
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")
            return f"Error decoding JSON: {e}"

        # Ensure leadres is a list
        if not isinstance(data, list):
            return "Error: Expected parsed data to be a list."

        # Process each item in the leadres list
        for item in data:      
            if isinstance(item, dict):
                for key, value in item.items():
                    if key.upper() == user_column:
                        bill_to_value = item[user_column]
                        if isinstance(bill_to_value, str) and name is not None:
                            name_processed = preprocess_string(name)
                            value_processed = preprocess_string(bill_to_value)
                            if name_processed.capitalize() in value_processed.capitalize():
                                count += 1
                                response += str(value) + " , "
            else:
                print(f"Error: Expected a dictionary but got {type(item)} with value {item}")
                continue

        words = response.split(", ")

        unique_names = set()

        for word in words:
            processed_word = preprocess_string(word).capitalize()
            if processed_word:
                unique_names.add(processed_word)
                
        unique_names_list = list(unique_names)
        first_unique_name = next(iter(unique_names), None)
    
        final_response = ""
        items = ""
        resu = ""
        resu += f"<b>Your {time_period} invoice count for your search '{name}' is listed below:</b>"
        resu += '<div id="tblsrl">\n'
        resu += '<table class="striped-table" border="1" cellspacing="0" cellpadding="3">\n'

        # Add the table header
        resu += "    <thead>\n"
        resu += f"        <tr>\n"
        resu += "            <th colspan=\"1\"><b>COMPANY</b></th>\n"
        resu += "            <th colspan=\"1\"><b>COUNT</b></th>\n"
        resu += "            <th colspan=\"1\"><b>TOTAL AMOUNT</b></th>\n"
        resu += f"        </tr>\n"
        resu += "    </thead>\n"
        
        if unique_names_list:
            for com_name in unique_names_list:

                filtered_items = [item for item in data if user_column is not None and item[user_column] is not None and com_name is not None and item[user_column].strip().capitalize() == com_name.strip().capitalize()]
                filtered_items_count = len(filtered_items)
                
                amount = sum(item.get('AMOUNT', 0) for item in filtered_items)

                '''resu = (f"> * **{com_name.upper()} is {filtered_items_count}:**\n\n"
                        f">     * TOTAL AMOUNT - {amount:.2f}\n\n")'''
                    

                # Add rows for each payment mode with alternating row colors
                items += f"        <tr class=\"even\">\n"
                items += f"            <td>{com_name.upper()}</td>\n"
                items += f"            <td>{filtered_items_count}</td>\n"
                items += f"            <td>{amount:.2f}</td>\n"
                items += "        </tr>\n"
                
        else:
            final_response += f"No {section} from **{name}** in {time_period}. Check the spelling\n\n"
            
        if final_response != f"No {section} from **{name}** in {time_period}. Check the spelling\n\n":
        
            resu += items
            
            # Close the table body and table
            resu += "    </tbody>\n"
            resu += "</table>\n"
            resu += '</div>\n'
            
            final_response += resu

        return final_response
    else:
        return "Error: 'response' key not found in data."
            
def call_api_selling_name(json_input, name, environment, section, end_point, field_name_mapping, time_period):
    print(json_input)
    response = ""     
            
    if json_input:
        api_url = f"{environment}/{end_point}"
        try:
            api_resp = requests.post(api_url, json=json_input, verify=False)
                    
            if api_resp.ok:
                api_data = api_resp.json()
                        
                order_list = ['BILL NUMBER', 'BILL DATE', 'BOOKING REF', 'BOOKING NUMBER', 'BOOKING DATE', 'SHIPMENT TYPE', 'BILL TO', 'BILL CURRENCY', 'NET TOTAL(TAX)',
                                        'NET TOTAL(NON-TAX)', 'TAX', 'CGST', 'SGST', 'IGST', 'GROSS TOTAL', 'FOREIGN CURRENCY 1', 'AMOUNT 1', 'FOREIGN CURRENCY 2', 'AMOUNT 2', 'BILL STATUS', 'ACK NO', 'ACK DT']

                fields_to_print = ['billNo', 'billDate', 'billtoname', 'currency', 'nettotal', 'nettotalnotax', 'taxtotal', 'cgst_amt_str', 'sgst_amt_str', 'igst_amt_str', 'grosstotal',
                                        'extcurr1', 'extcurr1amount', 'extcurr2', 'extcurr2amount', 'status']
                        
                fields_to_print_2 = ['refbookingtype', 'bookingno', 'bookingdate', 'shipmenttype','sender', 'receiver']

                extracted_data_all_lists = []

                for data_item in api_data:
                    extracted_data = {}
                            
                    if 'bookingDetailsVO' in data_item:
                        for field in fields_to_print_2:
                            mapped_field = field_name_mapping.get(field, field).upper()
                            if field in data_item['bookingDetailsVO']:
                                extracted_data[mapped_field] = data_item['bookingDetailsVO'][field]
                                        
                    for field in fields_to_print:
                        mapped_field = field_name_mapping.get(field, field).upper()
                        extracted_data[mapped_field] = data_item.get(field, 'Not available')
                            
                    extracted_data_all_lists.append(extracted_data)
                            
                reordered_data_all_lists = [{key: extracted_data[key] for key in order_list} for extracted_data in extracted_data_all_lists]
                        
                extracted_data_all_lists_json = json.dumps(reordered_data_all_lists, indent=4)
                #print(extracted_data_all_lists_json)
                extracted_data_all_lists_dict = json.loads(extracted_data_all_lists_json)
                        
                count = 0

                for item in extracted_data_all_lists_dict:
                    for key, value in item.items():
                        if key.upper() == 'BILL TO':
                            bill_to_value = item['BILL TO']
                            if isinstance(bill_to_value, str) and name is not None:
                                name_processed = preprocess_string(name)
                                value_processed = preprocess_string(bill_to_value)
                                print(name_processed, value_processed)
                                if name_processed.capitalize() in value_processed.capitalize():
                                    count += 1
                                    response += str(value) + " , "
                words = response.split(", ")

                unique_names = set()

                for word in words:
                    processed_word = preprocess_string(word).capitalize()

                    if processed_word not in unique_names:

                        unique_names.add(processed_word)
                
                unique_names_list = list(filter(None, unique_names))

                first_unique_name = next(iter(unique_names), None)
                print("First unique name:", first_unique_name)
            
                final_response = ""
                items = ""
                resu = ""
                resu += '<div >\n'
                resu += '<table class="striped-table" border="1" cellspacing="0" cellpadding="3">\n'

                # Add the table header
                resu += f"        <tr>\n"
                resu += "            <th colspan=\"1\"><b>BILL TO</b></th>\n"
                resu += "            <th colspan=\"1\"><b>COUNT</b></th>\n"
                resu += "            <th colspan=\"1\"><b>TOTAL NET</b></th>\n"
                resu += "            <th colspan=\"1\"><b>TOTAL TAX</b></th>\n"
                resu += "            <th colspan=\"1\"><b>TOTAL GROSS</b></th>\n"
                resu += f"        </tr>\n"
                
                final_response += (f"**{time_period} invoice count and the total revenue for your search '{name}' is listed below:**\n\n")
                if unique_names_list:
                    for com_name in unique_names_list:
                        
                        print('name: ', com_name)

                        filtered_items = [item for item in extracted_data_all_lists_dict if 'BILL TO' in item and item['BILL TO'].strip().capitalize() == com_name.strip().capitalize()]
                        filtered_items_count = len(filtered_items)

                        gross_total = sum(item.get('GROSS TOTAL', 0) for item in filtered_items)
                        tax_total = sum(item.get('TAX', 0) for item in filtered_items)
                        net_total = sum(item.get('NET TOTAL(TAX)', 0) for item in filtered_items)

                        '''resu = (f"> * **{com_name.upper()} is {filtered_items_count}:**\n\n"
                                f">     * TOTAL NET - {net_total:.2f}\n\n"
                                f">     * TOTAL TAX - {tax_total:.2f}\n\n"
                                f">     * TOTAL GROSS - {gross_total:.2f}\n\n")'''
                        
                        # Add rows for each payment mode with alternating row colors
                        items += f"       <tr class=\"even\">\n"
                        items += f"            <td>{com_name.upper()}</td>\n"
                        items += f"            <td>{filtered_items_count}</td>\n"
                        items += f"            <td>{net_total:.2F}</td>\n"
                        items += f"            <td>{tax_total:.2F}</td>\n"
                        items += f"            <td>{gross_total:.2f}</td>\n"
                        items += "        </tr>\n"

                else:
                    final_response += f"No {section} from **{name}** in {time_period}. Check the spelling\n\n"
                
                if final_response != f"No {section} from **{name}** in {time_period}. Check the spelling\n\n":
                
                    # Close the table body and table
                    resu += items
                    
                    resu += "    </tbody>\n"
                    resu += "</table>\n"
                    resu += '</div>\n'

                    final_response += resu

                return final_response                       
            else:
                response = ('Error: Failed to get a response from the API. Status code:', api_resp.status_code)

        except requests.exceptions.SSLError as ssl_error:
            response = f"SSL Error: {ssl_error}"
        except requests.exceptions.RequestException as e:
            response = ('Error: Failed to call the API -', str(e))
    else:
        response = ('Error: Prospect is missing or invalid.')
        
def preprocess_string(s):
    ignore_chars = ['_']

    for char in ignore_chars:
        s = s.replace(char, ' ')
    
    s = s.lower().capitalize()
    return s
        
def call_api_selling_total(json_input, environment, end_point, field_name_mapping, time_period):
    print(json_input)
    response = ""     
            
    if json_input:
        api_url = f"{environment}/{end_point}"
        try:
            api_resp = requests.post(api_url, json=json_input, verify=False)
                    
            if api_resp.ok:
                api_data = api_resp.json()
                        
                order_list = ['BILL NUMBER', 'BILL DATE', 'BOOKING REF', 'BOOKING NUMBER', 'BOOKING DATE', 'SHIPMENT TYPE', 'BILL TO', 'BILL CURRENCY', 'NET TOTAL(TAX)',
                                        'NET TOTAL(NON-TAX)', 'TAX', 'CGST', 'SGST', 'IGST', 'GROSS TOTAL', 'FOREIGN CURRENCY 1', 'AMOUNT 1', 'FOREIGN CURRENCY 2', 'AMOUNT 2', 'BILL STATUS', 'ACK NO', 'ACK DT']

                fields_to_print = ['billNo', 'billDate', 'billtoname', 'currency', 'nettotal', 'nettotalnotax', 'taxtotal', 'cgst_amt_str', 'sgst_amt_str', 'igst_amt_str', 'grosstotal',
                                        'extcurr1', 'extcurr1amount', 'extcurr2', 'extcurr2amount', 'status']
                        
                fields_to_print_2 = ['refbookingtype', 'bookingno', 'bookingdate', 'shipmenttype','sender', 'receiver']

                extracted_data_all_lists = []

                for data_item in api_data:
                    extracted_data = {}
                            
                    if 'bookingDetailsVO' in data_item:
                        for field in fields_to_print_2:
                            mapped_field = field_name_mapping.get(field, field).upper()
                            if field in data_item['bookingDetailsVO']:
                                extracted_data[mapped_field] = data_item['bookingDetailsVO'][field]
                                        
                    for field in fields_to_print:
                        mapped_field = field_name_mapping.get(field, field).upper()
                        extracted_data[mapped_field] = data_item.get(field, 'Not available')
                            
                    extracted_data_all_lists.append(extracted_data)
                            
                reordered_data_all_lists = [{key: extracted_data[key] for key in order_list} for extracted_data in extracted_data_all_lists]
                        
                extracted_data_all_lists_json = json.dumps(reordered_data_all_lists, indent=4)
                print(extracted_data_all_lists_json)
                extracted_data_all_lists_dict = json.loads(extracted_data_all_lists_json)

                gross_totals = [item.get('GROSS TOTAL', 0) for item in extracted_data_all_lists_dict]
                tax_totals = [item.get('TAX', 0) for item in extracted_data_all_lists_dict]
                net_totals = [item.get('NET TOTAL(TAX)', 0) for item in extracted_data_all_lists_dict]
                
                total_gross_total = sum(gross_totals)
                total_tax_total = sum(tax_totals)
                total_net_total = sum(net_totals)
                print(total_gross_total)
                resu = f" **YOUR {time_period.upper()} REVENUE**\n\n"\
                        f" * **TOTAL NET -** {total_net_total:.2f}\n\n"\
                        f" * **TOTAL TAX -** {total_tax_total:.2f}\n\n"\
                        f" * **TOTAL GROSS -** {total_gross_total:.2f}"
                        
                '''resu = f"Your {time_period} revenue</b>"
                        
                resu += '<div >\n'
                resu += '<table class="striped-table" border="1" cellspacing="0" cellpadding="3">\n'

                        # Add the table header
                resu += "    <thead>\n"
                resu += f"        <tr>\n"
                resu += "            <th colspan=\"1\"><b>TOTAL</b></th>\n"
                resu += "            <th colspan=\"1\"><b>AMOUNT</b></th>\n"
                resu += f"        </tr>\n"
                resu += "    </thead>\n"

                        # Add rows for each payment mode with alternating row colors
                resu += f"        <tr class=\"even\">\n"
                resu += f"            <td>NET</td>\n"
                resu += f"            <td>{total_net_total:.2f}</td>\n"
                resu += "        </tr>\n"

                resu += f"        <tr class=\"odd\">\n"
                resu += f"            <td>TAX</td>\n"
                resu += f"            <td>{total_tax_total:.2f}</td>\n"
                resu += "        </tr>\n"

                resu += f"        <tr class=\"even\">\n"
                resu += f"            <td>GROSS</td>\n"
                resu += f"            <td>{total_gross_total:.2f}</td>\n"
                resu += "        </tr>\n"

                # Close the table body and table
                resu += "    </tbody>\n"
                resu += "</table>\n"
                resu += '</div>\n'''

                return resu
                                   
            else:
                response = ('Error: Failed to get a response from the API. Status code:', api_resp.status_code)

        except requests.exceptions.SSLError as ssl_error:
            response = f"SSL Error: {ssl_error}"
        except requests.exceptions.RequestException as e:
            response = ('Error: Failed to call the API -', str(e))
    else:
        response = ('Error: Prospect is missing or invalid.')