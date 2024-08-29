from flask import Blueprint, request, jsonify
from joblib import load
import json
import requests
import random
from datetime import datetime, timedelta
from app import db
from app.models import OurBotInput
from .utils.our_chat_bot_api import call_api_selling_lead, call_api_selling_sell, call_api_lead_month, call_api_selling_month, call_api_common_count, call_api_selling_name, call_api_selling_total, call_api_lead_name, call_api_enq_count, call_api_pay_name, call_api_buy_name, call_api_multiple_inputs_lead, call_api_multiple_inputs_enq, call_api_multiple_inputs_quo
from .utils.input_extract_lead import extarct_from_response
from .utils.input_extract_enq import extarct_from_response_enq
from .utils.input_extract_quo import extarct_from_response_quo
from .utils.user_input_extraction_functions import extract_month_from_response, extract_name, extract_name_from_question, extract_from_brackets_and_name

chat_bot_bp = Blueprint("chat_bot_bp", __name__, template_folder="templates")

def send_to_chat_service(json_input):
        print('enter')
        url = 'http://127.0.0.1:9603/chat'  # Replace with the actual URL
        headers = {'Content-Type': 'application/json'}
        
        try:
            # Debug: Print the JSON input to ensure it is correctly formatted
            print("Sending JSON input:", json.dumps(json_input, indent=2))

            response = requests.post(url, json=json_input, headers=headers)
            response.raise_for_status()  # Raise an exception for HTTP errors
            
            # Debug: Print the response content to understand server feedback
            print("Response status code:", response.status_code)

            return response.json()  # Assuming the response is in JSON format
        except requests.exceptions.HTTPError as http_err:
            print(f"HTTP error occurred: {http_err}")
            print("Response content:", http_err.response.content)  # Debug: Print the error response content
        except Exception as err:
            print(f"Other error occurred: {err}")

@chat_bot_bp.route('/chat_input', methods=['POST'])
def chatbot():
    user_input = request.json.get('user_input')
    print(user_input)
    api_response = ""
    api_response2 = ""
    
    if isinstance(user_input, dict) and all(key in user_input for key in ['ffrid', 'chaid', 'section', 'input_text', 'tenantid', 'officeid', 'environment']):
        section = user_input['section'].lower()
        input_text = user_input['input_text']
        tenant_id = user_input['tenantid']
        office_id = user_input['officeid']
        environment = user_input['environment']
        ffrid = user_input['ffrid']
        chaid = user_input['chaid']
        time_period = 'one month'
        
        if section == 'lead':
            end_point = 'searchleadcompany'
            fields_to_print = ['name', 'city', 'country', 'webSite', 'prospect', 'salescontactstring', 'createddate', 'followUpDate', 'leadSource']
            field_name_mapping = {
                                    'name': 'Name',
                                    'city': 'City',
                                    'country': 'Country',
                                    'webSite': 'Website',
                                    'prospect': 'Prospect',
                                    'salescontactstring': 'Sales Contact',
                                    'createddate': 'Created Date',
                                    'followUpDate': 'Next Followup Date',
                                    'leadSource': 'Lead Source'
                                }
        elif section == 'selling':
            end_point = 'searchBookingBill'
            field_name_mapping = {
                        'billNo': 'Bill Number',
                        'billDate': 'Bill Date',
                        'refbookingtype': 'Booking Ref',
                        'bookingno': 'Booking Number',
                        'bookingdate': 'Booking Date',
                        'shipmenttype': 'Shipment Type',
                        'billtoname': 'Bill to',
                        'currency': 'Bill Currency',
                        'nettotal': 'Net Total(Tax)',
                        'nettotalnotax': 'Net Total(Non-Tax)',
                        'taxtotal': 'Tax',
                        'cgst_amt_str': 'CGST',
                        'sgst_amt_str': 'SGST',
                        'igst_amt_str': 'IGST',
                        'grosstotal': 'Gross Total',
                        'extcurr1': 'Foreign Currency 1',
                        'extcurr1amount': 'Amount 1',
                        'extcurr2': 'Foreign Currency 2',
                        'extcurr2amount': 'Amount 2',
                        'status': 'Bill Status',
                        'sender': 'Ack No',
                        'receiver': 'Ack Dt',
                    }
        
        vectorizer_path = f'C:\\Python\\CHAT_BOT_PROJECT\\app\\model\\chat_model\\{section}\\vectorizer.joblib'
        vectorizer = load(vectorizer_path)

        clf_path = f'C:\\Python\\CHAT_BOT_PROJECT\\app\\model\\chat_model\\{section}\\classifier.joblib'
        clf = load(clf_path)

        intents_path = f'C:\\Python\\CHAT_BOT_PROJECT\\app\\intents\\{section}_intents.json'
        print(intents_path)
        with open(intents_path, 'r') as file:
            intents = json.load(file)
        
        input_text_name = input_text
        input_text = vectorizer.transform([input_text])
        
        enquiry_month_responses = [
            "The number of enquirys for january is januaryenquiry.",
            "The number of enquirys for february is februaryenquiry.",
            "The number of enquirys for march is marchenquiry.",
            "The number of enquirys for april is aprilenquiry.",
            "The number of enquirys for may is mayenquiry.",
            "The number of enquirys for june is juneenquiry.",
            "The number of enquirys for july is julyenquiry.",
            "The number of enquirys for august is augustenquiry.",
            "The number of enquirys for september is septemberenquiry.",
            "The number of enquirys for october is octoberenquiry.",
            "The number of enquirys for november is novemberenquiry.",
            "The number of enquirys for december is decemberenquiry."
        ]
        
        quotation_month_responses = [
            "The number of quotations for january is januaryquotation.",
            "The number of quotations for february is februaryquotation.",
            "The number of quotations for march is marchquotation.",
            "The number of quotations for april is aprilquotation.",
            "The number of quotations for may is mayquotation.",
            "The number of quotations for june is junequotation.",
            "The number of quotations for july is julyquotation.",
            "The number of quotations for august is augustquotation.",
            "The number of quotations for september is septemberquotation.",
            "The number of quotations for october is octoberquotation.",
            "The number of quotations for november is novemberquotation.",
            "The number of quotations for december is decemberquotation."
        ]
        
        ffrBooking_month_responses = [
            "The number of ffrBookings for january is januaryffrBooking.",
            "The number of ffrBookings for february is februaryffrBooking.",
            "The number of ffrBookings for march is marchffrBooking.",
            "The number of ffrBookings for april is aprilffrBooking.",
            "The number of ffrBookings for may is mayffrBooking.",
            "The number of ffrBookings for june is juneffrBooking.",
            "The number of ffrBookings for july is julyffrBooking.",
            "The number of ffrBookings for august is augustffrBooking.",
            "The number of ffrBookings for september is septemberffrBooking.",
            "The number of ffrBookings for october is octoberffrBooking.",
            "The number of ffrBookings for november is novemberffrBooking.",
            "The number of ffrBookings for december is decemberffrBooking."
        ]
        
        custombooking_month_responses = [
            "The number of custombookings for january is januarycustombooking.",
            "The number of custombookings for february is februarycustombooking.",
            "The number of custombookings for march is marchcustombooking.",
            "The number of custombookings for april is aprilcustombooking.",
            "The number of custombookings for may is maycustombooking.",
            "The number of custombookings for june is junecustombooking.",
            "The number of custombookings for july is julycustombooking.",
            "The number of custombookings for august is augustcustombooking.",
            "The number of custombookings for september is septembercustombooking.",
            "The number of custombookings for october is octobercustombooking.",
            "The number of custombookings for november is novembercustombooking.",
            "The number of custombookings for december is decembercustombooking."
        ]
        
        billoflad_month_responses = [
            "The number of billoflads for january is januarybilloflad.",
            "The number of billoflads for february is februarybilloflad.",
            "The number of billoflads for march is marchbilloflad.",
            "The number of billoflads for april is aprilbilloflad.",
            "The number of billoflads for may is maybilloflad.",
            "The number of billoflads for june is junebilloflad.",
            "The number of billoflads for july is julybilloflad.",
            "The number of billoflads for august is augustbilloflad.",
            "The number of billoflads for september is septemberbilloflad.",
            "The number of billoflads for october is octoberbilloflad.",
            "The number of billoflads for november is novemberbilloflad.",
            "The number of billoflads for december is decemberbilloflad."
        ]
        
        awb_month_responses = [
            "The number of awbs for january is januaryawb.",
            "The number of awbs for february is februaryawb.",
            "The number of awbs for march is marchawb.",
            "The number of awbs for april is aprilawb.",
            "The number of awbs for may is mayawb.",
            "The number of awbs for june is juneawb.",
            "The number of awbs for july is julyawb.",
            "The number of awbs for august is augustawb.",
            "The number of awbs for september is septemberawb.",
            "The number of awbs for october is octoberawb.",
            "The number of awbs for november is novemberawb.",
            "The number of awbs for december is decemberawb."
        ]
        
        payment_month_responses = [
            "The number of payments for january is januarypayment.",
            "The number of payments for february is februarypayment.",
            "The number of payments for march is marchpayment.",
            "The number of payments for april is aprilpayment.",
            "The number of payments for may is maypayment.",
            "The number of payments for june is junepayment.",
            "The number of payments for july is julypayment.",
            "The number of payments for august is augustpayment.",
            "The number of payments for september is septemberpayment.",
            "The number of payments for october is octoberpayment.",
            "The number of payments for november is novemberpayment.",
            "The number of payments for december is decemberpayment."
        ]
        
        receipt_month_responses = [
            "The number of receipts for january is januaryreceipt.",
            "The number of receipts for february is februaryreceipt.",
            "The number of receipts for march is marchreceipt.",
            "The number of receipts for april is aprilreceipt.",
            "The number of receipts for may is mayreceipt.",
            "The number of receipts for june is junereceipt.",
            "The number of receipts for july is julyreceipt.",
            "The number of receipts for august is augustreceipt.",
            "The number of receipts for september is septemberreceipt.",
            "The number of receipts for october is octoberreceipt.",
            "The number of receipts for november is novemberreceipt.",
            "The number of receipts for december is decemberreceipt."
        ]
        
        buying_month_responses = [
            "The number of buyings for january is januarybuying.",
            "The number of buyings for february is februarybuying.",
            "The number of buyings for march is marchbuying.",
            "The number of buyings for april is aprilbuying.",
            "The number of buyings for may is maybuying.",
            "The number of buyings for june is junebuying.",
            "The number of buyings for july is julybuying.",
            "The number of buyings for august is augustbuying.",
            "The number of buyings for september is septemberbuying.",
            "The number of buyings for october is octoberbuying.",
            "The number of buyings for november is novemberbuying.",
            "The number of buyings for december is decemberbuying."
        ]
        
        selling_month_responses = [
            "The number of sellings for january is januaryselling.",
            "The number of sellings for february is februaryselling.",
            "The number of sellings for march is marchselling.",
            "The number of sellings for april is aprilselling.",
            "The number of sellings for may is mayselling.",
            "The number of sellings for june is juneselling.",
            "The number of sellings for july is julyselling.",
            "The number of sellings for august is augustselling.",
            "The number of sellings for september is septemberselling.",
            "The number of sellings for october is octoberselling.",
            "The number of sellings for november is novemberselling.",
            "The number of sellings for december is decemberselling."
        ]
        
        name_response = [
            "The number of quotations from name is namequotation.",
            "The number of ffrBookings from name is nameffrBooking.",
            "The number of custombookings from name is namecustombooking.",
            "The number of billoflads from name is namebilloflad.",
            "The number of awbs from name is nameawb.",
            "The number of enquirys from name is nameenquiry.",
            "The number of leads from name is namelead.",
            "The number of buyings from name is namebuying.",
            "The number of payments from name is namepayment.",
            "The number of receipts from name is namereceipt.",
        ]

        tag = clf.predict(input_text)[0]
        
        for intent in intents:
            if intent['tag'] == tag:
                response = random.choice(intent['responses'])
                print(response)
                model_res = ['The number of leads added in the last month is lastmonthlead.','The number of leads added in the last year is lastyearlead.','The number of leads added last week is lastweeklead.',
                             'The number of sellings added last week is lastweekselling.','The number of sellings added in the last year is lastyearselling.','The number of sellings added in the last month is lastmonthselling.',
                             'The number of enquirys added in the last month is lastmonthenquiry.', 'The number of enquirys added in the last year is lastyearenquiry.', 'The number of enquirys added last week is lastweekenquiry.',
                             'The number of quotations added in the last month is lastmonthquotation.', 'The number of quotations added in the last year is lastyearquotation.', 'The number of quotations added last week is lastweekquotation.',
                             'The number of ffrBookings added in the last month is lastmonthffrBooking.', 'The number of ffrBookings added in the last year is lastyearffrBooking.', 'The number of ffrBookings added last week is lastweekffrBooking.',
                             'The number of custombookings added in the last month is lastmonthcustombooking.', 'The number of custombookings added in the last year is lastyearcustombooking.', 'The number of custombookings added last week is lastweekcustombooking.',
                             'The number of billoflads added in the last month is lastmonthbilloflad.', 'The number of billoflads added in the last year is lastyearbilloflad.', 'The number of billoflads added last week is lastweekbilloflad.',
                             'The number of awbs added in the last month is lastmonthawb.', 'The number of awbs added in the last year is lastyearawb.', 'The number of awbs added last week is lastweekawb.',
                             'The number of buyings added in the last month is lastmonthbuying.', 'The number of buyings added in the last year is lastyearbuying.', 'The number of buyings added last week is lastweekbuying.',
                             'The number of payments added in the last month is lastmonthpayment.', 'The number of payments added in the last year is lastyearpayment.', 'The number of payments added last week is lastweekpayment.',
                             'The number of receipts added in the last month is lastmonthreceipt.', 'The number of receipts added in the last year is lastyearreceipt.', 'The number of receipts added last week is lastweekreceipt.']
                
                fin_res = ["The number of for last month with name is leadquery.", "The number of for last month with name is enquiryquery.", "The number of for last month with name is quotationquery."]
                
                if response in fin_res:
                    new_general_input = OurBotInput(
                        module=user_input.get('section'),
                        user_input=user_input.get('input_text'),
                        date=user_input.get('current_date'),
                        tenantid=int(user_input.get('tenantid')),
                        officeid=int(user_input.get('officeid')),
                        username=user_input.get('userid'),
                        environment=user_input.get('environment')
                    )

                    db.session.add(new_general_input)
                    db.session.commit()
                    if response == "The number of for last month with name is leadquery.":
                        input_val, pairs = extarct_from_response(input_text_name)
                        # Define the key name mappings
                        key_mappings = {
                            'prospect': 'PROSPECT',
                            'sales_contact': 'SALES CONTACT',
                            'lead_source': 'LEAD SOURCE',
                            'country': 'COUNTRY',
                            'city': 'CITY',
                            'time_period': 'TIME PERIOD',
                            'from_date': 'FROM DATE',
                            'to_date': 'TO DATE',
                            'company_name': 'COMPANY NAME'
                        }

                        # Apply the key name mappings to the list of pairs
                        new_pairs = [(key_mappings.get(key, key), value) for key, value in pairs if key not in ['month_count', 'time_period']]
                        print(new_pairs)
                        
                        # Create the HTML table with styled key-value pairs
                        table_rows = ''.join([f"<tr><td style='text-align: left; padding-right: 10px;  font-weight: bold;'>{key.capitalize()}</td><td style='color: #007bff; '>{value.capitalize()}</td></tr>" for key, value in new_pairs])
                        formatted_list = f"<table style='border-collapse: collapse;'>{table_rows}</table>"
                        extracted_parts, name, time_ref, month_cou, frm_date, to_date = input_val
                        if frm_date is None and to_date is None:
                            if month_cou == None:
                                if time_ref != None:
                                    if time_ref != "today":
                                        if time_ref == "last month" or time_ref == "one month":
                                            month_count_2 = "30"
                                        elif time_ref == "last week":
                                            month_count_2 = "7"
                                        elif time_ref == "six months":
                                            month_count_2 = "183"
                                        elif time_ref == "last year":
                                            month_count_2 = "365"

                                        current_date = datetime.now().date()
                                        one_month_ago = current_date - timedelta(days=int(month_count_2))
                                        from_date_str = one_month_ago.strftime("%Y-%m-%d")
                                        to_date_str = current_date.strftime("%Y-%m-%d")
                                        
                                    else:
                                        current_date = datetime.now().date()
                                        from_date_str = current_date.strftime("%Y-%m-%d")
                                        to_date_str = current_date.strftime("%Y-%m-%d")
                                else:
                                    month_count_2 = "30"
                                    current_date = datetime.now().date()
                                    one_month_ago = current_date - timedelta(days=int(month_count_2))
                                    from_date_str = one_month_ago.strftime("%Y-%m-%d")
                                    to_date_str = current_date.strftime("%Y-%m-%d")
                            else:
                                month_count_2 = month_cou
                                current_date = datetime.now().date()
                                one_month_ago = current_date - timedelta(days=int(month_count_2))
                                from_date_str = one_month_ago.strftime("%Y-%m-%d")
                                to_date_str = current_date.strftime("%Y-%m-%d")
                        elif frm_date is None and to_date is not None:
                            from_date_str = to_date
                            to_date_str = to_date
                        elif to_date is None and frm_date is not None:
                            from_date_str = frm_date
                            to_date_str = frm_date
                        else:
                            from_date_str = frm_date
                            to_date_str = to_date
                            
                        json_input = {
                                "user_input": {
                                "leadfrom_date": from_date_str,
                                "leadto_date": to_date_str,
                                "officeid": office_id,
                                "tenantid": tenant_id,
                                "environment": environment
                                }
                            }
                            
                        data = send_to_chat_service(json_input)
                        api_response += call_api_multiple_inputs_lead(data, extracted_parts, section, name, time_ref, formatted_list, month_cou, new_pairs)
                        api_response2 += response
                        if new_pairs:
                            new_general_input.response = json.dumps(new_pairs)
                            db.session.commit()
                    elif response == "The number of for last month with name is enquiryquery.":
                        input_val, pairs = extarct_from_response_enq(input_text_name)
                        # Define the key name mappings
                        key_mappings = {
                            'prospect': 'ENQUIRY PROSPECT',
                            'enquiry_number': 'ENQUIRY NUMBER',
                            'quotation': 'QUOTATION SENT',
                            'origin': 'ORIGIN',
                            'destination': 'DESTINATION',
                            'time_period': 'TIME PERIOD',
                            'shipment_type': 'SHIPMENT TYPE',
                            'from_date': 'FROM DATE',
                            'to_date': 'TO DATE',
                            'company_name': 'COMPANY',
                            'status': 'STATUS'
                        }

                        # Apply the key name mappings to the list of pairs
                        new_pairs = [(key_mappings.get(key, key), value) for key, value in pairs if key not in ['month_count', 'time_period']]
                        print(new_pairs)
                        
                        # Create the HTML table with styled key-value pairs
                        table_rows = ''.join([f"<tr><td style='text-align: left; padding-right: 10px;  font-weight: bold;'>{key.capitalize()}</td><td style='color: #007bff; '>{value.capitalize()}</td></tr>" for key, value in new_pairs])
                        formatted_list = f"<table style='border-collapse: collapse;'>{table_rows}</table>"
                        extracted_parts, name, time_ref, month_cou, frm_date, to_date = input_val
                        if frm_date is None and to_date is None:
                            if month_cou == None:
                                if time_ref != None:
                                    if time_ref != "today":
                                        if time_ref == "last month" or time_ref == "one month":
                                            month_count_2 = "30"
                                        elif time_ref == "last week":
                                            month_count_2 = "7"
                                        elif time_ref == "six months":
                                            month_count_2 = "183"
                                        elif time_ref == "last year":
                                            month_count_2 = "365"

                                        current_date = datetime.now().date()
                                        one_month_ago = current_date - timedelta(days=int(month_count_2))
                                        from_date_str = one_month_ago.strftime("%Y-%m-%d")
                                        to_date_str = current_date.strftime("%Y-%m-%d")
                                        
                                    else:
                                        current_date = datetime.now().date()
                                        from_date_str = current_date.strftime("%Y-%m-%d")
                                        to_date_str = current_date.strftime("%Y-%m-%d")
                                else:
                                    month_count_2 = "30"
                                    current_date = datetime.now().date()
                                    one_month_ago = current_date - timedelta(days=int(month_count_2))
                                    from_date_str = one_month_ago.strftime("%Y-%m-%d")
                                    to_date_str = current_date.strftime("%Y-%m-%d")
                            else:
                                month_count_2 = month_cou
                                current_date = datetime.now().date()
                                one_month_ago = current_date - timedelta(days=int(month_count_2))
                                from_date_str = one_month_ago.strftime("%Y-%m-%d")
                                to_date_str = current_date.strftime("%Y-%m-%d")
                        elif frm_date is None and to_date is not None:
                            from_date_str = to_date
                            to_date_str = to_date
                        elif to_date is None and frm_date is not None:
                            from_date_str = frm_date
                            to_date_str = frm_date
                        else:
                            from_date_str = frm_date
                            to_date_str = to_date
                            
                        json_input = {
                                "user_input": {
                                "enqfrom_date": from_date_str,
                                "enqto_date": to_date_str,
                                "officeid": office_id,
                                "tenantid": tenant_id,
                                "environment": environment
                                }
                            }
                            
                        data = send_to_chat_service(json_input)
                        api_response += call_api_multiple_inputs_enq(data, extracted_parts, section, name, time_ref, formatted_list, month_cou, new_pairs)
                        api_response2 += response
                        if new_pairs:
                            new_general_input.response = json.dumps(new_pairs)
                            db.session.commit() 
                    elif response == "The number of for last month with name is quotationquery.":
                        input_val, pairs = extarct_from_response_quo(input_text_name)
                        # Define the key name mappings
                        key_mappings = {
                            'prospect': 'ENQUIRY PROSPECT',
                            'quotation_number': 'QUOTATION NUMBER',
                            'contact_name': 'CONTACT NAME',
                            'origin': 'ORIGIN',
                            'destination': 'DESTINATION',
                            'time_period': 'TIME PERIOD',
                            'shipment_type': 'SHIPMENT TYPE',
                            'shipment_term': 'SHIPMENT TERM',
                            'from_date': 'FROM DATE',
                            'to_date': 'TO DATE',
                            'company_name': 'SEARCH COMPANY',
                            'status': 'STATUS'
                        }

                        # Apply the key name mappings to the list of pairs
                        new_pairs = [(key_mappings.get(key, key), value) for key, value in pairs if key not in ['month_count', 'time_period']]
                        print(new_pairs)
                        
                        # Create the HTML table with styled key-value pairs
                        table_rows = ''.join([f"<tr><td style='text-align: left; padding-right: 10px;  font-weight: bold;'>{key.capitalize()}</td><td style='color: #007bff; '>{value.capitalize()}</td></tr>" for key, value in new_pairs])
                        formatted_list = f"<table style='border-collapse: collapse;'>{table_rows}</table>"
                        extracted_parts, name, time_ref, month_cou, frm_date, to_date = input_val
                        if frm_date is None and to_date is None:
                            if month_cou == None:
                                if time_ref != None:
                                    if time_ref != "today":
                                        if time_ref == "last month" or time_ref == "one month":
                                            month_count_2 = "30"
                                        elif time_ref == "last week":
                                            month_count_2 = "7"
                                        elif time_ref == "six months":
                                            month_count_2 = "183"
                                        elif time_ref == "last year":
                                            month_count_2 = "365"

                                        current_date = datetime.now().date()
                                        one_month_ago = current_date - timedelta(days=int(month_count_2))
                                        from_date_str = one_month_ago.strftime("%Y-%m-%d")
                                        to_date_str = current_date.strftime("%Y-%m-%d")
                                        
                                    else:
                                        current_date = datetime.now().date()
                                        from_date_str = current_date.strftime("%Y-%m-%d")
                                        to_date_str = current_date.strftime("%Y-%m-%d")
                                else:
                                    month_count_2 = "30"
                                    current_date = datetime.now().date()
                                    one_month_ago = current_date - timedelta(days=int(month_count_2))
                                    from_date_str = one_month_ago.strftime("%Y-%m-%d")
                                    to_date_str = current_date.strftime("%Y-%m-%d")
                            else:
                                month_count_2 = month_cou
                                current_date = datetime.now().date()
                                one_month_ago = current_date - timedelta(days=int(month_count_2))
                                from_date_str = one_month_ago.strftime("%Y-%m-%d")
                                to_date_str = current_date.strftime("%Y-%m-%d")
                        elif frm_date is None and to_date is not None:
                            from_date_str = to_date
                            to_date_str = to_date
                        elif to_date is None and frm_date is not None:
                            from_date_str = frm_date
                            to_date_str = frm_date
                        else:
                            from_date_str = frm_date
                            to_date_str = to_date
                            
                        json_input = {
                                "user_input": {
                                "quofrom_date": from_date_str,
                                "quoto_date": to_date_str,
                                "officeid": office_id,
                                "tenantid": tenant_id,
                                "environment": environment
                                }
                            }
                            
                        data = send_to_chat_service(json_input)
                        api_response += call_api_multiple_inputs_quo(data, extracted_parts, section, name, time_ref, formatted_list, month_cou, new_pairs)
                        api_response2 += response
                        if new_pairs:
                            new_general_input.response = json.dumps(new_pairs)
                            db.session.commit()
                elif response in model_res :
                    if response == 'The number of leads added in the last month is lastmonthlead.' or response == 'The number of leads added last week is lastweeklead.' or response == 'The number of leads added in the last year is lastyearlead.':
                        if response == 'The number of leads added in the last month is lastmonthlead.':
                            fill = "last month"
                            month_count_2 = "30"
                        elif response == 'The number of leads added last week is lastweeklead.':
                            fill = "last week"
                            month_count_2 = "7"
                        elif response == 'The number of leads added in the last year is lastyearlead.':
                            fill = "last year"
                            month_count_2 = "365"
                            
                        user_column = 'NAME'
                        current_date = datetime.now().date()
                        one_month_ago = current_date - timedelta(days=int(month_count_2))
                        from_date_str = one_month_ago.strftime("%Y-%m-%d")
                        to_date_str = current_date.strftime("%Y-%m-%d")
                        json_input = {
                            "fromdate": from_date_str,
                            "toDate": to_date_str,
                            "officeId": office_id,
                            "tenantid": tenant_id
                        }
                        
                        
                        api_response += call_api_selling_lead(user_column, json_input, section, fill, environment, end_point, field_name_mapping, fields_to_print)
                        api_response2 += response
                    
                    elif response == 'The number of enquirys added in the last month is lastmonthenquiry.' or response == 'The number of enquirys added last week is lastweekenquiry.' or response == 'The number of enquirys added in the last year is lastyearenquiry.':
                        if response == 'The number of enquirys added in the last month is lastmonthenquiry.':
                            fill = "last month"
                            month_count_2 = "30"
                        elif response == 'The number of enquirys added last week is lastweekenquiry.':
                            fill = "last week"
                            month_count_2 = "7"
                        elif response == 'The number of enquirys added in the last year is lastyearenquiry.':
                            fill = "last year"
                            month_count_2 = "365"
                            
                        user_column = 'COMPANY'
                        current_date = datetime.now().date()
                        one_month_ago = current_date - timedelta(days=int(month_count_2))
                        from_date_str = one_month_ago.strftime("%Y-%m-%d")
                        to_date_str = current_date.strftime("%Y-%m-%d")
                        json_input = {
                            "user_input": {
                            "enqfrom_date": from_date_str,
                            "enqto_date": to_date_str,
                            "officeid": office_id,
                            "tenantid": tenant_id,
                            "environment": environment
                            }
                        }
                        enqres = send_to_chat_service(json_input)
                        api_response += call_api_enq_count(enqres, section, user_column, fill)
                        api_response2 += response
                    
                    elif response == 'The number of quotations added in the last month is lastmonthquotation.' or response == 'The number of quotations added last week is lastweekquotation.' or response == 'The number of quotations added in the last year is lastyearquotation.':
                        if response == 'The number of quotations added in the last month is lastmonthquotation.':
                            fill = "last month"
                            month_count_2 = "30"
                        elif response == 'The number of quotations added last week is lastweekquotation.':
                            fill = "last week"
                            month_count_2 = "7"
                        elif response == 'The number of quotations added in the last year is lastyearquotation.':
                            fill = "last year"
                            month_count_2 = "365"
                            
                        user_column = 'SEARCH COMPANY'
                        current_date = datetime.now().date()
                        one_month_ago = current_date - timedelta(days=int(month_count_2))
                        from_date_str = one_month_ago.strftime("%Y-%m-%d")
                        to_date_str = current_date.strftime("%Y-%m-%d")
                        json_input = {
                            "user_input": {
                            "quofrom_date": from_date_str,
                            "quoto_date": to_date_str,
                            "officeid": office_id,
                            "tenantid": tenant_id,
                            "environment": environment
                            }
                        }
                        quores = send_to_chat_service(json_input)
                        api_response += call_api_enq_count(quores, section, user_column, fill)
                        api_response2 += response
                    elif response == 'The number of ffrBookings added in the last month is lastmonthffrBooking.' or response == 'The number of ffrBookings added last week is lastweekffrBooking.' or response == 'The number of ffrBookings added in the last year is lastyearffrBooking.':
                        if response == 'The number of ffrBookings added in the last month is lastmonthffrBooking.':
                            fill = "last month"
                            month_count_2 = "30"
                        elif response == 'The number of ffrBookings added last week is lastweekffrBooking.':
                            fill = "last week"
                            month_count_2 = "7"
                        elif response == 'The number of ffrBookings added in the last year is lastyearffrBooking.':
                            fill = "last year"
                            month_count_2 = "365"
                            
                        user_column = 'BOOKING PARTY'
                        current_date = datetime.now().date()
                        one_month_ago = current_date - timedelta(days=int(month_count_2))
                        from_date_str = one_month_ago.strftime("%Y-%m-%d")
                        to_date_str = current_date.strftime("%Y-%m-%d")
                        json_input = {
                            "user_input": {
                            "bookingfrom_date": from_date_str,
                            "bookingto_date": to_date_str,
                            "officeid": office_id,
                            "tenantid": tenant_id,
                            "environment": environment,
                            "ffrid": ffrid
                            }
                        }
                        quores = send_to_chat_service(json_input)
                        api_response += call_api_enq_count(quores, section, user_column, fill)
                        api_response2 += response
                    elif response == 'The number of custombookings added in the last month is lastmonthcustombooking.' or response == 'The number of custombookings added last week is lastweekcustombooking.' or response == 'The number of custombookings added in the last year is lastyearcustombooking.':
                        if response == 'The number of custombookings added in the last month is lastmonthcustombooking.':
                            fill = "last month"
                            month_count_2 = "30"
                        elif response == 'The number of custombookings added last week is lastweekcustombooking.':
                            fill = "last week"
                            month_count_2 = "7"
                        elif response == 'The number of custombookings added in the last year is lastyearcustombooking.':
                            fill = "last year"
                            month_count_2 = "365"
                            
                        user_column = 'BOOKING PARTY'
                        current_date = datetime.now().date()
                        one_month_ago = current_date - timedelta(days=int(month_count_2))
                        from_date_str = one_month_ago.strftime("%Y-%m-%d")
                        to_date_str = current_date.strftime("%Y-%m-%d")
                        json_input = {
                            "user_input": {
                            "bookingfrom_date": from_date_str,
                            "bookingto_date": to_date_str,
                            "officeid": office_id,
                            "tenantid": tenant_id,
                            "environment": environment,
                            "chaid": chaid
                            }
                        }
                        quores = send_to_chat_service(json_input)
                        api_response += call_api_enq_count(quores, section, user_column, fill)
                        api_response2 += response
                    elif response == 'The number of billoflads added in the last month is lastmonthbilloflad.' or response == 'The number of billoflads added last week is lastweekbilloflad.' or response == 'The number of billoflads added in the last year is lastyearbilloflad.':
                        if response == 'The number of billoflads added in the last month is lastmonthbilloflad.':
                            fill = "last month"
                            month_count_2 = "30"
                        elif response == 'The number of billoflads added last week is lastweekbilloflad.':
                            fill = "last week"
                            month_count_2 = "7"
                        elif response == 'The number of billoflads added in the last year is lastyearbilloflad.':
                            fill = "last year"
                            month_count_2 = "365"
                            
                        user_column = 'SHIPPER'
                        current_date = datetime.now().date()
                        one_month_ago = current_date - timedelta(days=int(month_count_2))
                        from_date_str = one_month_ago.strftime("%Y-%m-%d")
                        to_date_str = current_date.strftime("%Y-%m-%d")
                        json_input = {
                            "user_input": {
                            "bolfrom_date": from_date_str,
                            "bolto_date": to_date_str,
                            "bolbk_from_date": from_date_str,
                            "bolbk_to_date": to_date_str,
                            "officeid": office_id,
                            "tenantid": tenant_id,
                            "environment": environment
                            }
                        }
                        quores = send_to_chat_service(json_input)
                        api_response += call_api_enq_count(quores, section, user_column, fill)
                        api_response2 += response
                    elif response == 'The number of awbs added in the last month is lastmonthawb.' or response == 'The number of awbs added last week is lastweekawb.' or response == 'The number of awbs added in the last year is lastyearawb.':
                        if response == 'The number of awbs added in the last month is lastmonthawb.':
                            fill = "last month"
                            month_count_2 = "30"
                        elif response == 'The number of awbs added last week is lastweekawb.':
                            fill = "last week"
                            month_count_2 = "7"
                        elif response == 'The number of awbs added in the last year is lastyearawb.':
                            fill = "last year"
                            month_count_2 = "365"
                            
                        user_column = 'SHIPPER'
                        current_date = datetime.now().date()
                        one_month_ago = current_date - timedelta(days=int(month_count_2))
                        from_date_str = one_month_ago.strftime("%Y-%m-%d")
                        to_date_str = current_date.strftime("%Y-%m-%d")
                        json_input = {
                            "user_input": {
                            "awbfrom_date": from_date_str,
                            "awbto_date": to_date_str,
                            "awbbk_from_date": from_date_str,
                            "awbbk_to_date": to_date_str,
                            "officeid": office_id,
                            "tenantid": tenant_id,
                            "environment": environment
                            }
                        }
                        quores = send_to_chat_service(json_input)
                        api_response += call_api_enq_count(quores, section, user_column, fill)
                        api_response2 += response
                    elif response == 'The number of payments added in the last month is lastmonthpayment.' or response == 'The number of payments added last week is lastweekpayment.' or response == 'The number of payments added in the last year is lastyearpayment.':
                        if response == 'The number of payments added in the last month is lastmonthpayment.':
                            fill = "last month"
                            month_count_2 = "30"
                        elif response == 'The number of payments added last week is lastweekpayment.':
                            fill = "last week"
                            month_count_2 = "7"
                        elif response == 'The number of payments added in the last year is lastyearpayment.':
                            fill = "last year"
                            month_count_2 = "365"
                            
                        user_column = 'PAYMENT TO'
                        current_date = datetime.now().date()
                        one_month_ago = current_date - timedelta(days=int(month_count_2))
                        from_date_str = one_month_ago.strftime("%Y-%m-%d")
                        to_date_str = current_date.strftime("%Y-%m-%d")
                        json_input = {
                            "user_input": {
                            "payfrom_date": from_date_str,
                            "payto_date": to_date_str,
                            "officeid": office_id,
                            "tenantid": tenant_id,
                            "environment": environment
                            }
                        }
                        quores = send_to_chat_service(json_input)
                        api_response += call_api_enq_count(quores, section, user_column, fill)
                        api_response2 += response
                    elif response == 'The number of receipts added in the last month is lastmonthreceipt.' or response == 'The number of receipts added last week is lastweekreceipt.' or response == 'The number of receipts added in the last year is lastyearreceipt.':
                        if response == 'The number of receipts added in the last month is lastmonthreceipt.':
                            fill = "last month"
                            month_count_2 = "30"
                        elif response == 'The number of receipts added last week is lastweekreceipt.':
                            fill = "last week"
                            month_count_2 = "7"
                        elif response == 'The number of receipts added in the last year is lastyearreceipt.':
                            fill = "last year"
                            month_count_2 = "365"
                            
                        user_column = 'RECEIPT FROM'
                        current_date = datetime.now().date()
                        one_month_ago = current_date - timedelta(days=int(month_count_2))
                        from_date_str = one_month_ago.strftime("%Y-%m-%d")
                        to_date_str = current_date.strftime("%Y-%m-%d")
                        json_input = {
                            "user_input": {
                            "receiptsfrom_date": from_date_str,
                            "receiptsto_date": to_date_str,
                            "officeid": office_id,
                            "tenantid": tenant_id,
                            "environment": environment
                            }
                        }
                        data = send_to_chat_service(json_input)
                        api_response += call_api_enq_count(data, section, user_column, fill)
                        api_response2 += response
                    elif response == 'The number of buyings added in the last month is lastmonthbuying.' or response == 'The number of buyings added last week is lastweekbuying.' or response == 'The number of buyings added in the last year is lastyearbuying.':
                        if response == 'The number of buyings added in the last month is lastmonthbuying.':
                            fill = "last month"
                            month_count_2 = "30"
                        elif response == 'The number of buyings added last week is lastweekbuying.':
                            fill = "last week"
                            month_count_2 = "7"
                        elif response == 'The number of buyings added in the last year is lastyearbuying.':
                            fill = "last year"
                            month_count_2 = "365"
                            
                        user_column = 'BILL TO'
                        current_date = datetime.now().date()
                        one_month_ago = current_date - timedelta(days=int(month_count_2))
                        from_date_str = one_month_ago.strftime("%Y-%m-%d")
                        to_date_str = current_date.strftime("%Y-%m-%d")
                        json_input = {
                            "user_input": {
                            "buyfrom_date": from_date_str,
                            "buyto_date": to_date_str,
                            "officeid": office_id,
                            "tenantid": tenant_id,
                            "environment": environment
                            }
                        }
                        buyres = send_to_chat_service(json_input)
                        api_response += call_api_enq_count(buyres, section, user_column, fill)
                        api_response2 += response
                        
                    elif response == 'The number of sellings added in the last month is lastmonthselling.' or response == 'The number of sellings added last week is lastweekselling.' or response == 'The number of sellings added in the last year is lastyearselling.':
                        if response == 'The number of sellings added in the last month is lastmonthselling.':
                            fill = "last month"
                            month_count_2 = "30"
                        elif response == 'The number of sellings added last week is lastweekselling.':
                            fill = "last week"
                            month_count_2 = "7"
                        elif response == 'The number of sellings added in the last year is lastyearselling.':
                            fill = "last year"
                            month_count_2 = "365"
                            
                        user_column = 'BILL NUMBER'
                        current_date = datetime.now().date()
                        one_month_ago = current_date - timedelta(days=int(month_count_2))
                        from_date_str = one_month_ago.strftime("%Y-%m-%d")
                        to_date_str = current_date.strftime("%Y-%m-%d")
                        json_input = {
                                    "billfromdate": from_date_str,
                                    "billtodate": to_date_str,
                                    "officeId": office_id,
                                    "tenantid": tenant_id,
                                    "orderby": "BILL_NO"
                                }
                        api_response += call_api_selling_sell(user_column, json_input, section, fill, environment, end_point, field_name_mapping)
                        api_response2 += response
                
                elif response in enquiry_month_responses or response in quotation_month_responses or response in buying_month_responses or response in payment_month_responses or response in receipt_month_responses or response in ffrBooking_month_responses or response in custombooking_month_responses or response in billoflad_month_responses or response in awb_month_responses:
                    current_date = datetime.now().date()
                    one_month_ago = current_date - timedelta(days=30)
                    from_date_str = one_month_ago.strftime("%Y-%m-%d")
                    to_date_str = current_date.strftime("%Y-%m-%d")
                    
                    if response in enquiry_month_responses:
                        user_column = 'COMPANY'
                        section = 'enquiry'
                        fromdate = "enqfrom_date"
                        todate = "enqto_date"
                        json_input = {
                            "user_input": {
                            "enqfrom_date": "2024-04-01",
                            "enqto_date": "2024-04-30",
                            "officeid": office_id,
                            "tenantid": tenant_id,
                            "environment": environment
                            }
                        }
                    elif response in quotation_month_responses:
                        user_column = 'SEARCH COMPANY'
                        section = 'quotation'
                        fromdate = "quofrom_date"
                        todate = "quoto_date"
                        json_input = {
                            "user_input": {
                            "quofrom_date": from_date_str,
                            "quoto_date": to_date_str,
                            "officeid": office_id,
                            "tenantid": tenant_id,
                            "environment": environment
                            }
                        }
                    elif response in ffrBooking_month_responses:
                        user_column = 'BOOKING PARTY'
                        section = 'bookings'
                        fromdate = "bookingfrom_date"
                        todate = "bookingto_date"
                        json_input = {
                            "user_input": {
                            "bookingfrom_date": from_date_str,
                            "bookingto_date": to_date_str,
                            "officeid": office_id,
                            "tenantid": tenant_id,
                            "environment": environment,
                            "ffrid": ffrid
                            }
                        }
                    elif response in custombooking_month_responses:
                        user_column = 'BOOKING PARTY'
                        section = 'bookings'
                        fromdate = "bookingfrom_date"
                        todate = "bookingto_date"
                        json_input = {
                            "user_input": {
                            "bookingfrom_date": from_date_str,
                            "bookingto_date": to_date_str,
                            "officeid": office_id,
                            "tenantid": tenant_id,
                            "environment": environment,
                            "chaid": chaid
                            }
                        }
                    elif response in billoflad_month_responses:
                        user_column = 'SHIPPER'
                        section = 'bill of lading'
                        fromdate = "bolfrom_date"
                        todate = "bolto_date"
                        json_input = {
                            "user_input": {
                            "bolfrom_date": from_date_str,
                            "bolto_date": to_date_str,
                            "bolbk_from_date": from_date_str,
                            "bolbk_to_date": to_date_str,
                            "officeid": office_id,
                            "tenantid": tenant_id,
                            "environment": environment
                            }
                        }
                    elif response in awb_month_responses:
                        user_column = 'SHIPPER'
                        section = 'air way bills'
                        fromdate = "awbfrom_date"
                        todate = "awbto_date"
                        json_input = {
                            "user_input": {
                            "awbfrom_date": from_date_str,
                            "awbto_date": to_date_str,
                            "awbbk_from_date": from_date_str,
                            "awbbk_to_date": to_date_str,
                            "officeid": office_id,
                            "tenantid": tenant_id,
                            "environment": environment
                            }
                        }
                    elif response in receipt_month_responses:
                        user_column = 'RECEIPT FROM'
                        section = 'receipts'
                        fromdate = "receiptsfrom_date"
                        todate = "receiptsto_date"
                        json_input = {
                            "user_input": {
                            "receiptsfrom_date": from_date_str,
                            "receiptsto_date": to_date_str,
                            "officeid": office_id,
                            "tenantid": tenant_id,
                            "environment": environment
                            }
                        }
                    elif response in payment_month_responses:
                        user_column = 'PAYMENT TO'
                        section = 'payments'
                        fromdate = "payfrom_date"
                        todate = "payto_date"
                        json_input = {
                            "user_input": {
                            "payfrom_date": from_date_str,
                            "payto_date": to_date_str,
                            "officeid": office_id,
                            "tenantid": tenant_id,
                            "environment": environment
                            }
                        }
                    elif response in buying_month_responses:
                        user_column = 'COMPANY'
                        section = 'buying'
                        fromdate = "sellfrom_date"
                        todate = "sellto_date"
                        json_input = {
                            "user_input": {
                            "sellfrom_date": from_date_str,
                            "sellto_date": to_date_str,
                            "officeid": office_id,
                            "tenantid": tenant_id,
                            "environment": environment
                            }
                        }
                        
                    month_name = extract_month_from_response(response)
                    month_names = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
                    for month in month_names:
                        if month in response.lower():
                            month_index = month_names.index(month) + 1
                            month_str = str(month_index).zfill(2)
                            json_input["user_input"][fromdate] = f"2024-{month_str}-01"
                            json_input["user_input"][todate] = f"2024-{month_str}-30"
                    data = send_to_chat_service(json_input)
                    api_response += call_api_enq_count(data, section, user_column, month_name)
                    api_response2 += response
                    
                elif response in selling_month_responses:
                    month_name = extract_month_from_response(response)
                    user_column = 'BILL NUMBER'
                    search_in = 'selling'
                    current_date = datetime.now().date()
                    one_month_ago = current_date - timedelta(days=30)
                    from_date_str = one_month_ago.strftime("%Y-%m-%d")
                    to_date_str = current_date.strftime("%Y-%m-%d")
                    json_input = {
                        "billfromdate": "2024-04-01",
                        "billtodate": "2024-04-30",
                        "officeId": office_id,
                        "tenantid": tenant_id,
                        "orderby": "BILL_NO"
                    }
                    month_names = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
                    for month in month_names:
                        if month in response.lower():
                            month_index = month_names.index(month) + 1
                            month_str = str(month_index).zfill(2)
                            json_input["billfromdate"] = f"2024-{month_str}-01"
                            json_input["billtodate"] = f"2024-{month_str}-30"
                    api_response += call_api_selling_month(user_column, json_input, month_name, environment, search_in, end_point, field_name_mapping)
                    api_response2 += response
                
                elif response == 'The number of sellings from name is nameselling.':
                    name = extract_name(input_text_name)
                    print('name_model: ', name)
                    current_date = datetime.now().date()
                    search_in = 'selling'
                    one_month_ago = current_date - timedelta(days=30)
                    from_date_str = one_month_ago.strftime("%Y-%m-%d")
                    to_date_str = current_date.strftime("%Y-%m-%d")
                    json_input = {
                                    "billfromdate": from_date_str,
                                    "billtodate": to_date_str,
                                    "officeId": office_id,
                                    "tenantid": tenant_id,
                                    "orderby": "BILL_NO",
                                    "searchCompanyName": name,
                                }
                    api_res = call_api_selling_name(json_input, name, environment, search_in, end_point, field_name_mapping, time_period)
                    print(api_res)
                    
                    if api_res is not None:
                        if f"No {section} from **{name}** in {time_period}. Check the spelling\n\n" in api_res:
                            name = extract_name_from_question(input_text_name)
                            if name == None:
                                api_response += api_res
                                api_response2 += response
                            else:
                                current_date = datetime.now().date()
                                search_in = 'selling'
                                one_month_ago = current_date - timedelta(days=30)
                                from_date_str = one_month_ago.strftime("%Y-%m-%d")
                                to_date_str = current_date.strftime("%Y-%m-%d")
                                json_input = {
                                                "billfromdate": from_date_str,
                                                "billtodate": to_date_str,
                                                "officeId": office_id,
                                                "tenantid": tenant_id,
                                                "orderby": "BILL_NO",
                                                "searchCompanyName": name,
                                            }
                                api_response += call_api_selling_name(json_input, name, environment, search_in, end_point, field_name_mapping, time_period)
                                api_response2 += response
                        else:
                            api_response += api_res
                            api_response2 += response
                elif response in name_response:
                    name = extract_name(input_text_name)
                    current_date = datetime.now().date()
                    one_month_ago = current_date - timedelta(days=30)
                    from_date_str = one_month_ago.strftime("%Y-%m-%d")
                    to_date_str = current_date.strftime("%Y-%m-%d")
                    
                    if response == 'The number of leads from name is namelead.':
                        search_in = 'lead'
                        user_column = 'NAME'
                        json_input = {
                            "user_input": {
                            "leadfrom_date": from_date_str,
                            "leadto_date": to_date_str,
                            "officeid": office_id,
                            "tenantid": tenant_id,
                            "leadcompany_name": name,
                            "environment": environment
                            }
                        }
                    elif response == 'The number of enquirys from name is nameenquiry.':
                        search_in = 'enquiry'
                        user_column = 'COMPANY'
                        json_input = {
                                "user_input": {
                                "enqfrom_date": from_date_str,
                                "enqto_date": to_date_str,
                                "officeid": office_id,
                                "tenantid": tenant_id,
                                "environment": environment,
                                "enqcompany": name
                                }
                            }
                    elif response == 'The number of ffrBookings from name is nameffrBooking.':
                        search_in = 'ffrBooking'
                        user_column = 'BOOKING PARTY'
                        json_input = {
                                "user_input": {
                                "bookingfrom_date": from_date_str,
                                "bookingto_date": to_date_str,
                                "officeid": office_id,
                                "tenantid": tenant_id,
                                "environment": environment,
                                "company": name,
                                "ffrid": ffrid
                                }
                            }
                    elif response == 'The number of custombookings from name is namecustombooking.':
                        search_in = 'ffrBooking'
                        user_column = 'BOOKING PARTY'
                        json_input = {
                                "user_input": {
                                "bookingfrom_date": from_date_str,
                                "bookingto_date": to_date_str,
                                "officeid": office_id,
                                "tenantid": tenant_id,
                                "environment": environment,
                                "company": name,
                                "chaid": chaid
                                }
                            }
                    elif response == 'The number of billoflads from name is namebilloflad.':
                        search_in = 'bill of lading'
                        user_column = 'SHIPPER'
                        json_input = {
                                "user_input": {
                                "bolfrom_date": from_date_str,
                                "bolto_date": to_date_str,
                                "bolbk_from_date": from_date_str,
                                "bolbk_to_date": to_date_str,
                                "officeid": office_id,
                                "tenantid": tenant_id,
                                "environment": environment,
                                "company": name
                                }
                            }
                        data = send_to_chat_service(json_input)
                        if section == 'billoflad':
                            section = 'bill of lading'
                        api_res = call_api_pay_name(data, name, section, search_in, time_period, user_column)
                        
                        if f"No {section} from **{name}** in {time_period}. Check the spelling\n\n" in api_res:
                            name = extract_name_from_question(input_text_name)
                            if name == None:
                                api_response += api_res
                                api_response2 += response
                            else:
                                api_response += call_api_pay_name(data, name, section, search_in, time_period, user_column)
                                api_response2 += response
                        else:
                            api_response += api_res
                            api_response2 += response
                    elif response == 'The number of awbs from name is nameawb.':
                        search_in = 'air way bills'
                        user_column = 'SHIPPER'
                        json_input = {
                                "user_input": {
                                "awbfrom_date": from_date_str,
                                "awbto_date": to_date_str,
                                "awbbk_from_date": from_date_str,
                                "awbbk_to_date": to_date_str,
                                "officeid": office_id,
                                "tenantid": tenant_id,
                                "environment": environment,
                                "company": name
                                }
                            }
                        data = send_to_chat_service(json_input)
                        if section == 'awb':
                            section = 'air way bills'
                        api_res = call_api_pay_name(data, name, section, search_in, time_period, user_column)
                        
                        if f"No {section} from **{name}** in {time_period}. Check the spelling\n\n" in api_res:
                            name = extract_name_from_question(input_text_name)
                            if name == None:
                                api_response += api_res
                                api_response2 += response
                            else:
                                api_response += call_api_pay_name(data, name, section, search_in, time_period, user_column)
                                api_response2 += response
                        else:
                            api_response += api_res
                            api_response2 += response
                    elif response == 'The number of receipts from name is namereceipt.':
                        search_in = 'receipts'
                        user_column = 'RECEIPT FROM'
                        json_input = {
                                "user_input": {
                                "receiptsfrom_date": from_date_str,
                                "receiptsto_date": to_date_str,
                                "officeid": office_id,
                                "tenantid": tenant_id,
                                "environment": environment,
                                "receiptsreceipt_from": name
                                }
                            }
                        data = send_to_chat_service(json_input)
                        api_res = call_api_pay_name(data, name, section, search_in, time_period, user_column)
                        
                        if f"No {section} from **{name}** in {time_period}. Check the spelling\n\n" in api_res:
                            name = extract_name_from_question(input_text_name)
                            if name == None:
                                api_response += api_res
                                api_response2 += response
                            else:
                                api_response += call_api_pay_name(data, name, section, search_in, time_period, user_column)
                                api_response2 += response
                        else:
                            api_response += api_res
                            api_response2 += response
                    elif response == 'The number of quotations from name is namequotation.':
                        search_in = 'quotation'
                        user_column = 'SEARCH COMPANY'
                        json_input = {
                            "user_input": {
                            "quofrom_date": from_date_str,
                            "quoto_date": to_date_str,
                            "officeid": office_id,
                            "tenantid": tenant_id,
                            "environment": environment,
                            "quocompany": name
                            }
                        }
                    elif response == 'The number of payments from name is namepayment.':
                        search_in = 'payments'
                        user_column = 'PAYMENT TO'
                        json_input = {
                            "user_input": {
                            "payfrom_date": from_date_str,
                            "payto_date": to_date_str,
                            "officeid": office_id,
                            "tenantid": tenant_id,
                            "environment": environment,
                            "paypayable_to": name
                            }
                        }
                        
                        data = send_to_chat_service(json_input)
                        api_res = call_api_pay_name(data, name, section, search_in, time_period, user_column)
                        
                        if f"No {section} from **{name}** in {time_period}. Check the spelling\n\n" in api_res:
                            name = extract_name_from_question(input_text_name)
                            if name == None:
                                api_response += api_res
                                api_response2 += response
                            else:
                                api_response += call_api_pay_name(data, name, section, search_in, time_period, user_column)
                                api_response2 += response
                        else:
                            api_response += api_res
                            api_response2 += response
                    elif response == 'The number of buyings from name is namebuying.':
                        search_in = 'buying'
                        user_column = 'COMPANY'
                        json_input = {
                            "user_input": {
                            "sellfrom_date": from_date_str,
                            "sellto_date": to_date_str,
                            "officeid": office_id,
                            "tenantid": tenant_id,
                            "environment": environment,
                            "sellcompany": name
                            }
                        }
                        data = send_to_chat_service(json_input)
                        api_res = call_api_buy_name(data, name, section, search_in, time_period, user_column)
                        
                        if f"No {section} from **{name}** in {time_period}. Check the spelling\n\n" in api_res:
                            name = extract_name_from_question(input_text_name)
                            if name == None:
                                api_response += api_res
                                api_response2 += response
                            else:
                                api_response += call_api_buy_name(data, name, section, search_in, time_period, user_column)
                                api_response2 += response
                        else:
                            api_response += api_res
                            api_response2 += response
                        
                    if response != "The number of payments from name is namepayment." and response != 'The number of buyings from name is namebuying.' and response != 'The number of receipts from name is namereceipt.' and response != 'The number of awbs from name is nameawb.' and response != 'The number of billoflads from name is namebilloflad.':
                        if section == 'ffrbooking' or section == 'custombooking':
                            section = 'bookings'
                    
                        data = send_to_chat_service(json_input)
                        api_res = call_api_lead_name(data, name, section, search_in, time_period, user_column)
                        
                        if f"No {section} from **{name}** in {time_period}. Check the spelling\n\n" in api_res:
                            name = extract_name_from_question(input_text_name)
                            if name == None:
                                api_response += api_res
                                api_response2 += response
                            else:
                                api_response += call_api_lead_name(data, name, section, search_in, time_period, user_column)
                                api_response2 += response
                        else:
                            api_response += api_res
                            api_response2 += response
                
                else:
                    return jsonify({'response': response})
            
    elif isinstance(user_input, dict) and all(key in user_input for key in ['month', 'field', 'user_text', 'time_period', 'tenantid', 'officeid', 'environment']):
        print('month')
        month_count = user_input['month']
        section = user_input['section'].lower()
        print(section)
        n_type = user_input['field']
        input_text_name = user_input['user_text']
        time_period = user_input['time_period']
        tenant_id = user_input['tenantid']
        office_id = user_input['officeid']
        environment = user_input['environment']
        ffrid = user_input['ffrid']
        chaid = user_input['chaid']
        
        if month_count != 1:
            name = extract_name(input_text_name)
            current_date = datetime.now().date()
            one_month_ago = current_date - timedelta(days=int(month_count))
            from_date_str = one_month_ago.strftime("%Y-%m-%d")
            to_date_str = current_date.strftime("%Y-%m-%d")
        else:
            name = extract_name(input_text_name)
            current_date = datetime.now().date()
            from_date_str = current_date.strftime("%Y-%m-%d")
            to_date_str = current_date.strftime("%Y-%m-%d")
            
        json_input = {
            "user_input": {
                "officeid": office_id,
                "tenantid": tenant_id,
                "environment": environment
            }
        }

        if section == "lead":
            input_val, pairs = extarct_from_response(input_text_name)
            # Define the key name mappings
            key_mappings = {
                    'prospect': 'PROSPECT',
                    'sales_contact': 'SALES CONTACT',
                    'lead_source': 'LEAD SOURCE',
                    'country': 'COUNTRY',
                    'city': 'CITY',
                    'time_period': 'TIME PERIOD',
                    'from_date': 'FROM DATE',
                    'to_date': 'TO DATE',
                    'company_name': 'COMPANY NAME'
                }

            # Apply the key name mappings to the list of pairs
            new_pairs = [(key_mappings.get(key, key), from_date_str if key == 'from_date' else (to_date_str if key == 'to_date' else value)) for key, value in pairs if key not in ['month_count', 'time_period']]
                    
            if 'FROM DATE' not in [key for key, _ in new_pairs]:
                new_pairs.append(('FROM DATE', from_date_str))
            if 'TO DATE' not in [key for key, _ in new_pairs]:
                new_pairs.append(('TO DATE', to_date_str))
    
            # Create the HTML table with styled key-value pairs
            table_rows = ''.join([f"<tr><td style='text-align: left; padding-right: 10px; font-weight: bold;'>{key.capitalize()}</td><td style='color: #007bff;'>{value.capitalize()}</td></tr>" for key, value in new_pairs])
            formatted_list = f"<table style='border-collapse: collapse;'>{table_rows}</table>"
            extracted_parts, name, time_ref, month_cou, frm_date, to_date = input_val
                        
            json_input = {
                    "user_input": {
                    "leadfrom_date": from_date_str,
                    "leadto_date": to_date_str,
                    "officeid": office_id,
                    "tenantid": tenant_id,
                    "environment": environment
                    }
                }
            data = send_to_chat_service(json_input)
            api_response += call_api_multiple_inputs_lead(data, extracted_parts, section, name, time_period, formatted_list, month_cou, new_pairs)
            
        elif section == "enquiry":
            input_val, pairs = extarct_from_response_enq(input_text_name)
            # Define the key name mappings
            key_mappings = {
                'prospect': 'ENQUIRY PROSPECT',
                'enquiry_number': 'ENQUIRY NUMBER',
                'quotation': 'QUOTATION SENT',
                'origin': 'ORIGIN',
                'destination': 'DESTINATION',
                'time_period': 'TIME PERIOD',
                'shipment_type': 'SHIPMENT TYPE',
                'from_date': 'FROM DATE',
                'to_date': 'TO DATE',
                'company_name': 'COMPANY',
                'status': 'STATUS'
            }

            # Apply the key name mappings to the list of pairs
            new_pairs = [(key_mappings.get(key, key), from_date_str if key == 'from_date' else (to_date_str if key == 'to_date' else value)) for key, value in pairs if key not in ['month_count', 'time_period']]
            
            if 'FROM DATE' not in [key for key, _ in new_pairs]:
                new_pairs.append(('FROM DATE', from_date_str))
            if 'TO DATE' not in [key for key, _ in new_pairs]:
                new_pairs.append(('TO DATE', to_date_str))
            print(new_pairs)
            
            # Create the HTML table with styled key-value pairs
            table_rows = ''.join([f"<tr><td style='text-align: left; padding-right: 10px;  font-weight: bold;'>{key.capitalize()}</td><td style='color: #007bff; '>{value.capitalize()}</td></tr>" for key, value in new_pairs])
            formatted_list = f"<table style='border-collapse: collapse;'>{table_rows}</table>"
            extracted_parts, name, time_ref, month_cou, frm_date, to_date = input_val 
                
            json_input = {
                    "user_input": {
                    "enqfrom_date": from_date_str,
                    "enqto_date": to_date_str,
                    "officeid": office_id,
                    "tenantid": tenant_id,
                    "environment": environment
                    }
                }
                
            data = send_to_chat_service(json_input)
            api_response += call_api_multiple_inputs_enq(data, extracted_parts, section, name, time_ref, formatted_list, month_cou, new_pairs)
            
        elif section == "quotation":
            input_val, pairs = extarct_from_response_quo(input_text_name)
            # Define the key name mappings
            key_mappings = {
                'prospect': 'ENQUIRY PROSPECT',
                'quotation_number': 'QUOTATION NUMBER',
                'contact_name': 'CONTACT NAME',
                'origin': 'ORIGIN',
                'destination': 'DESTINATION',
                'time_period': 'TIME PERIOD',
                'shipment_type': 'SHIPMENT TYPE',
                'shipment_term': 'SHIPMENT TERM',
                'from_date': 'FROM DATE',
                'to_date': 'TO DATE',
                'company_name': 'SEARCH COMPANY',
                'status': 'STATUS'
            }

            # Apply the key name mappings to the list of pairs
            new_pairs = [(key_mappings.get(key, key), from_date_str if key == 'from_date' else (to_date_str if key == 'to_date' else value)) for key, value in pairs if key not in ['month_count', 'time_period']]
            
            if 'FROM DATE' not in [key for key, _ in new_pairs]:
                new_pairs.append(('FROM DATE', from_date_str))
            if 'TO DATE' not in [key for key, _ in new_pairs]:
                new_pairs.append(('TO DATE', to_date_str))
            print(new_pairs)
            
            # Create the HTML table with styled key-value pairs
            table_rows = ''.join([f"<tr><td style='text-align: left; padding-right: 10px;  font-weight: bold;'>{key.capitalize()}</td><td style='color: #007bff; '>{value.capitalize()}</td></tr>" for key, value in new_pairs])
            formatted_list = f"<table style='border-collapse: collapse;'>{table_rows}</table>"
            extracted_parts, name, time_ref, month_cou, frm_date, to_date = input_val
                
            json_input = {
                    "user_input": {
                    "quofrom_date": from_date_str,
                    "quoto_date": to_date_str,
                    "officeid": office_id,
                    "tenantid": tenant_id,
                    "environment": environment
                    }
                }
                
            data = send_to_chat_service(json_input)
            api_response += call_api_multiple_inputs_quo(data, extracted_parts, section, name, time_ref, formatted_list, month_cou, new_pairs)
            
        elif section == "ffrbooking":
            section = 'bookings'
            end_point = 'searchBooking'
            search_in = 'bookings'
            user_column = 'BOOKING PARTY'
            json_input["user_input"].update({
                "bookingfrom_date": from_date_str,
                "bookingto_date": to_date_str,
                "company": name,
                "ffrid": ffrid
            })
        elif section == "custombooking":
            section = 'bookings'
            end_point = 'searchBooking'
            search_in = 'bookings'
            user_column = 'BOOKING PARTY'
            json_input["user_input"].update({
                "bookingfrom_date": from_date_str,
                "bookingto_date": to_date_str,
                "company": name,
                "chaid": chaid
            })
        elif section == "billoflad":
            section = 'bill of lading'
            end_point = 'searchBillOfLading'
            search_in = 'bill of lading'
            user_column = 'SHIPPER'
            json_input["user_input"].update({
                "bolfrom_date": from_date_str,
                "bolto_date": to_date_str,
                "bolbk_from_date": from_date_str,
                "bolbk_to_date": to_date_str,
                "company": name
            })
            if "month" in user_input:
                data = send_to_chat_service(json_input)
                if n_type == 'non_gross':
                    api_res = call_api_pay_name(data, name, section, search_in, time_period, user_column)
                    if f"No {section} from **{name}** in {time_period}. Check the spelling\n\n" in api_res:
                        name = extract_name_from_question(input_text_name)
                        if name is None:
                            api_response += api_res
                        else:
                            api_response += call_api_pay_name(data, name, section, search_in, time_period, user_column)
                    else:
                        api_response += api_res
        elif section == "awb":
            section = "air way bills"
            end_point = 'searchAirwaybill'
            search_in = 'air way bills'
            user_column = 'SHIPPER'
            json_input["user_input"].update({
                "awbfrom_date": from_date_str,
                "awbto_date": to_date_str,
                "awbbk_from_date": from_date_str,
                "awbbk_to_date": to_date_str,
                "company": name
            })
            print(section)
            if "month" in user_input:
                data = send_to_chat_service(json_input)
                if n_type == 'non_gross':
                    api_res = call_api_pay_name(data, name, section, search_in, time_period, user_column)
                    if f"No {section} from **{name}** in {time_period}. Check the spelling\n\n" in api_res:
                        name = extract_name_from_question(input_text_name)
                        if name is None:
                            api_response += api_res
                        else:
                            api_response += call_api_pay_name(data, name, section, search_in, time_period, user_column)
                    else:
                        api_response += api_res
        elif section == "payments":
            end_point = 'findPaymentsPaidByQuerys'
            search_in = 'payments'
            user_column = 'PAYMENT TO'
            json_input["user_input"].update({
                "payfrom_date": from_date_str,
                "payto_date": to_date_str,
                "paypayable_to": name
            })
            
            if "month" in user_input:
                data = send_to_chat_service(json_input)
                if n_type == 'non_gross':
                    api_res = call_api_pay_name(data, name, section, search_in, time_period, user_column)
                    if f"No {section} from **{name}** in {time_period}. Check the spelling\n\n" in api_res:
                        name = extract_name_from_question(input_text_name)
                        if name is None:
                            api_response += api_res
                        else:
                            api_response += call_api_pay_name(data, name, section, search_in, time_period, user_column)
                    else:
                        api_response += api_res
        elif section == "receipts":
            end_point = 'findPaymentsReceivedByQuery'
            search_in = 'receipts'
            user_column = 'RECEIPT FROM'
            json_input["user_input"].update({
                "receiptsfrom_date": from_date_str,
                "receiptsto_date": to_date_str,
                "receiptsreceipt_from": name
            })
            
            if "month" in user_input:
                data = send_to_chat_service(json_input)
                if n_type == 'non_gross':
                    api_res = call_api_pay_name(data, name, section, search_in, time_period, user_column)
                    if f"No {section} from **{name}** in {time_period}. Check the spelling\n\n" in api_res:
                        name = extract_name_from_question(input_text_name)
                        if name is None:
                            api_response += api_res
                        else:
                            api_response += call_api_pay_name(data, name, section, search_in, time_period, user_column)
                    else:
                        api_response += api_res
        elif section == "buying":
            end_point = 'searchBuyingBillByQuery'
            search_in = 'buying'
            user_column = 'COMPANY'
            json_input["user_input"].update({
                "sellfrom_date": from_date_str,
                "sellto_date": to_date_str,
                "sellcompany": name
            })
            if "month" in user_input:
                data = send_to_chat_service(json_input)
                if n_type == 'non_gross':
                    api_res = call_api_buy_name(data, name, section, search_in, time_period, user_column)
                    if f"No {section} from **{name}** in {time_period}. Check the spelling\n\n" in api_res:
                        name = extract_name_from_question(input_text_name)
                        if name is None:
                            api_response += api_res
                        else:
                            api_response += call_api_buy_name(data, name, section, search_in, time_period, user_column)
                    else:
                        api_response += api_res
            
        elif section == "selling":
            end_point = 'searchBookingBill'
            field_name_mapping = {
                            'billNo': 'Bill Number',
                            'billDate': 'Bill Date',
                            'refbookingtype': 'Booking Ref',
                            'bookingno': 'Booking Number',
                            'bookingdate': 'Booking Date',
                            'shipmenttype': 'Shipment Type',
                            'billtoname': 'Bill to',
                            'currency': 'Bill Currency',
                            'nettotal': 'Net Total(Tax)',
                            'nettotalnotax': 'Net Total(Non-Tax)',
                            'taxtotal': 'Tax',
                            'cgst_amt_str': 'CGST',
                            'sgst_amt_str': 'SGST',
                            'igst_amt_str': 'IGST',
                            'grosstotal': 'Gross Total',
                            'extcurr1': 'Foreign Currency 1',
                            'extcurr1amount': 'Amount 1',
                            'extcurr2': 'Foreign Currency 2',
                            'extcurr2amount': 'Amount 2',
                            'status': 'Bill Status',
                            'sender': 'Ack No',
                            'receiver': 'Ack Dt',
                        }
            
            if 'month' in user_input:
                                name = extract_name(input_text_name)
                                current_date = datetime.now().date()
                                search_in = 'selling'
                                user_column = ['GROSS TOTAL', 'NET TOTAL(TAX)', 'TAX']
                                one_month_ago = current_date - timedelta(days=int(month_count))
                                from_date_str = one_month_ago.strftime("%Y-%m-%d")
                                to_date_str = current_date.strftime("%Y-%m-%d")
                                json_input = {
                                    "billfromdate": from_date_str,
                                    "billtodate": to_date_str,
                                    "officeId": office_id,
                                    "tenantid": tenant_id,
                                    "orderby": "BILL_NO"
                                }
                                if n_type == 'gross':
                                    api_response += str(call_api_selling_total(json_input, environment, end_point, field_name_mapping, time_period))
                                elif n_type == 'non_gross':
                                    api_res = call_api_selling_name(json_input, name, environment, search_in, end_point, field_name_mapping, time_period)
                            
                                    if f"No {section} from **{name}** in {time_period}. Check the spelling\n\n" in api_res:
                                        name = extract_name_from_question(input_text_name)
                                        if name == None:
                                            api_response += api_res
                                        else:
                                            current_date = datetime.now().date()
                                            search_in = 'selling'
                                            one_month_ago = current_date - timedelta(days=int(month_count))
                                            from_date_str = one_month_ago.strftime("%Y-%m-%d")
                                            to_date_str = current_date.strftime("%Y-%m-%d")
                                            json_input = {
                                                            "billfromdate": from_date_str,
                                                            "billtodate": to_date_str,
                                                            "officeId": office_id,
                                                            "tenantid": tenant_id,
                                                            "orderby": "BILL_NO",
                                                        }
                                            api_response += call_api_selling_name(json_input, name, environment, search_in, end_point, field_name_mapping, time_period)
                                    else:
                                        api_response += api_res
        print(section)
        if section != "selling" and section != "payments" and section != "lead" and section != "enquiry" and section != "quotation" and section != "bill of lading" and section != "buying" and section != "receipts" and section != "air way bills" and 'month' in user_input:
                data = send_to_chat_service(json_input)
                if n_type == 'non_gross':
                    api_res = call_api_lead_name(data, name, section, search_in, time_period, user_column)
                    if f"No {section} from **{name}** in {time_period}. Check the spelling\n\n" in api_res:
                        name = extract_name_from_question(input_text_name)
                        if name is None:
                            api_response += api_res
                        else:
                            api_response += call_api_lead_name(data, name, section, search_in, time_period, user_column)
                    else:
                        api_response += api_res
                        
    elif isinstance(user_input, dict) and all(key in user_input for key in ['section', 'value_to_search', 'tenantid', 'officeid', 'environment']):
        section = user_input['section'].lower()
        user_column = user_input['value_to_search']
        fill = user_input['time_period']
        tenant_id = user_input['tenantid']
        office_id = user_input['officeid']
        environment = user_input['environment']
        current_date = datetime.now().date()
        one_month_ago = current_date - timedelta(days=int(30))
        from_date_str = one_month_ago.strftime("%Y-%m-%d")
        to_date_str = current_date.strftime("%Y-%m-%d")
        print(user_column)
            
        json_input = {
            "user_input": {
                "officeid": office_id,
                "tenantid": tenant_id,
                "environment": environment
            }
        }
        
        if section == "receipts":
            print('yes')
            json_input["user_input"].update({
                "receiptsfrom_date": from_date_str,
                "receiptsto_date": to_date_str,
            })
            
            print('yes')
            data = send_to_chat_service(json_input)
            print('yes')
            api_response = call_api_common_count(data, section, user_column, fill)
            print(api_response)
        
    return jsonify({'response': api_response, 'response2': api_response2})