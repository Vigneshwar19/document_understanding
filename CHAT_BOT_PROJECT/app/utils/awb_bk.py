import json
import requests

def fetch_data(params):
    try:
        api_url = "http://164.52.205.129:9601/upload" #http://127.0.0.1:9601/upload
        params = json.loads(params)
        response = requests.post(api_url, json=params)

        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error: Received status code {response.status_code}")
            return {}
    except requests.RequestException as e:
        print(f"Request failed: {e}")
        return {}

def dict_to_html_table_awb(data):
    keys_order = ["SHIPPER_NAME", "SHIPPER_ADDRESS", "CONSIGNEE_NAME", "CONSIGNEE_ADDRESS", "HAWB_NUMBER", "MAWB_NUMBER", "ISSUED_BY",
                "ISSUING_CARRIER_AGENT_NAME", "ISSUING_CARRIER_AGENT_CITY", "AGENT'S_IATA_CODE", "ACCOUNTING_INFORMATION", "AIRPORT_OF_DEPARTURE",
                "FIRST_TO", "BY_FIRST_CARRIER", "SECOND_TO", "FIRST_BY", "THIRD_TO", "SECOND_BY", "DECLARED_VALUE_FOR_CARRIAGE", "DECLARED_VALUE_FOR_CUSTOMS", "AIRPORT_OF_DESTINATION", "REQUESTED_FLIGHT_NUMBER",
                "REQUESTED_FLIGHT_DATE", "AMOUNT_OF_INSURANCE", "HANDLING_INFORMATION", "ITEMS", "SIGNATURE_OF_SHIPPER_OR_HIS_AGENT", "EXECUTED_ON_DATE",
                "AT_PLACE", "SIGNATURE_OF_ISSUING_CARRIER_OR_ITS_AGENT"]
    
    display_names = {
        "SHIPPER_NAME": "SHIPPER NAME",
        "SHIPPER_ADDRESS": "SHIPPER ADDRESS",
        "CONSIGNEE_NAME": "CONSIGNEE NAME",
        "CONSIGNEE_ADDRESS": "CONSIGNEE ADDRESS",
        "HAWB_NUMBER": "HAWB NUMBER",
        "MAWB_NUMBER": "MAWB NUMBER",
        "ISSUED_BY": "ISSUED BY",
        "ISSUING_CARRIER_AGENT_NAME": "ISSUING CARRIER'S AGENT NAME",
        "ISSUING_CARRIER_AGENT_CITY": "ISSUING CARRIER'S AGENT CITY",
        "AGENT'S_IATA_CODE": "AGENT'S IATA CODE",
        "ACCOUNTING_INFORMATION": "ACCOUNTING INFORMATION",
        "AIRPORT_OF_DEPARTURE": "AIRPORT OF DEPARTURE",
        "FIRST_TO": "FIRST TO",
        "BY_FIRST_CARRIER": "BY FIRST CARRIER",
        "SECOND_TO": "SECOND TO",
        "FIRST_BY": "FIRST BY",
        "THIRD_TO": "THIRD TO",
        "SECOND_BY": "SECOND BY",
        "DECLARED_VALUE_FOR_CARRIAGE": "DECLARED VALUE FOR CARRIAGE",
        "DECLARED_VALUE_FOR_CUSTOMS": "DECLARED VALUE FOR CUSTOMS",
        "AIRPORT_OF_DESTINATION": "AIRPORT OF DESTINATION",
        "REQUESTED_FLIGHT_NUMBER": "REQUESTED FLIGHT NUMBER",
        "REQUESTED_FLIGHT_DATE": "REQUESTED FLIGHT DATE",
        "AMOUNT_OF_INSURANCE": "AMOUNT OF INSURANCE",
        "HANDLING_INFORMATION": "HANDLING INFORMATION",
        "ITEMS": "ITEMS",
        "SIGNATURE_OF_SHIPPER_OR_HIS_AGENT": "SIGNATURE OF SHIPPER OR HIS AGENT",
        "EXECUTED_ON_DATE": "EXECUTED ON DATE",
        "AT_PLACE": "AT PLACE",
        "SIGNATURE_OF_ISSUING_CARRIER_OR_ITS_AGENT": "SIGNATURE OF ISSUING CARRIER OR ITS AGENT",
    }
    
    html = '<div id="tblsrl">\n'
    html += '<table class="striped-table" border="1" cellspacing="0" cellpadding="3">\n'
    html += '<thead>\n'
    html += '<tr>\n'
    html += f"<th><b>Fields</b></th>\n"
    html += f"<th><b>Values</b></th>\n"
    html += '</tr>\n'
    html += '</thead>\n'
    html += "<tbody>\n"
    
    for key in keys_order:
        if key in data:
            display_key = display_names.get(key, key)
            if key == "ITEMS" and isinstance(data[key], list):
                html += f'<tr class="even">\n<td scope="row" colspan="2"><b>{display_key}</b></td>\n</tr>\n'
                html += f'<tr class="even">\n<td scope="row" colspan="2">\n'
                html += f'<div class="accordion" id="accordionItem">\n'
                for index, child_item in enumerate(data[key]):
                    html += f'<div class="accordion-item">\n'
                    html += f'<h2 class="accordion-header" id="headingItem{index}">\n'
                    html += f'<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseItem{index}" aria-expanded="false" aria-controls="collapseItem{index}">\n'
                    html += f'ITEM {index + 1}\n'
                    html += f'</button>\n'
                    html += f'</h2>\n'
                    html += f'<div id="collapseItem{index}" class="accordion-collapse collapse" aria-labelledby="headingItem{index}" data-bs-parent="#accordionItem">\n'
                    html += f'<div class="accordion-body">\n'
                    html += f'<table class="striped-table" border="1" cellspacing="0" cellpadding="3">\n'
                    for child_key, child_value in child_item.items():
                        child_value = '' if child_value is None else child_value
                        html += f'<tr class="even">\n<td><b>{child_key}</b></td>\n<td>{child_value}</td>\n</tr>\n'
                    html += f'</table>\n'
                    html += f'</div>\n'
                    html += f'</div>\n'
                    html += f'</div>\n'
                html += f'</div>\n'
                html += '</td>\n</tr>\n'
            else:
                data_value = '' if data[key] is None else data[key]
                html += f'<tr class="even">\n<td scope="row"><b>{display_key}</b></td>\n<td>{data_value}</td>\n</tr>\n'
    
    html += '</tbody>\n'
    html += '</table>\n'
    html += '</div>\n'
    
    return html

def dict_to_html_table_invoice(data):
    keys_order = [
        'shipper', 'shipperaddress', 'consignee', 'consigneeaddress', 'invoiceno', 'invoicedate',
        'hscode', 'poNumber', 'poDate', 'origin', 'destination', 'discharge', 'currency',
        'shipmentterm', 'invoiceItemParserVOs'
    ]
    
    display_names = {
        "shipper": "SHIPPER NAME",
        "shipperaddress": "SHIPPER ADDRESS",
        "consignee": "CONSIGNEE NAME",
        "consigneeaddress": "CONSIGNEE ADDRESS",
        "invoiceno": "INVOICE NUMBER",
        "invoicedate": "INVOICE DATE",
        "hscode": "HS CODE",
        "poNumber": "PO NUMBER",
        "poDate": "PO DATE",
        "origin": "ORIGIN",
        "destination": "DESTINATION",
        "discharge": "DISCHARGE",
        "currency": "CURRENCY TYPE",
        "TERMS_OF_PAYMENT": "TERMS OF PAYMENT",
        "invoiceItemParserVOs": "INVOICE ITEMS",
        "shipmentterm": "SHIPMENT TERM",
    }
    
    html = '<div id="tblsrl">\n'
    html += '<table class="striped-table" border="1" cellspacing="0" cellpadding="3">\n'
    html += '<thead>\n'
    html += '<tr>\n'
    html += f"<th><b>Fields</b></th>\n"
    html += f"<th><b>Values</b></th>\n"
    html += '</tr>\n'
    html += '</thead>\n'
    html += "<tbody>\n"
    
    for key in keys_order:
        if key in data:
            display_key = display_names.get(key, key)
            if key == "invoiceItemParserVOs" and isinstance(data[key], list):
                html += f'<tr class="even">\n<td scope="row" colspan="2"><b>{display_key}</b></td>\n</tr>\n'
                html += f'<tr class="even">\n<td scope="row" colspan="2">\n'
                html += f'<div class="accordion" id="accordionItem">\n'
                for index, child_item in enumerate(data[key]):
                    html += f'<div class="accordion-item">\n'
                    html += f'<h2 class="accordion-header" id="headingItem{index}">\n'
                    html += f'<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseItem{index}" aria-expanded="false" aria-controls="collapseItem{index}">\n'
                    html += f'ITEM {index + 1}\n'
                    html += f'</button>\n'
                    html += f'</h2>\n'
                    html += f'<div id="collapseItem{index}" class="accordion-collapse collapse" aria-labelledby="headingItem{index}" data-bs-parent="#accordionItem">\n'
                    html += f'<div class="accordion-body">\n'
                    html += f'<table class="striped-table" border="1" cellspacing="0" cellpadding="3">\n'
                    for child_key, child_value in child_item.items():
                        child_value = '' if child_value is None else child_value
                        html += f'<tr class="even">\n<td><b>{child_key}</b></td>\n<td>{child_value}</td>\n</tr>\n'
                    html += f'</table>\n'
                    html += f'</div>\n'
                    html += f'</div>\n'
                    html += f'</div>\n'
                html += f'</div>\n'
                html += '</td>\n</tr>\n'
            else:
                data_value = '' if data[key] is None else data[key]
                html += f'<tr class="even">\n<td scope="row"><b>{display_key}</b></td>\n<td>{data_value}</td>\n</tr>\n'
    
    html += '</tbody>\n'
    html += '</table>\n'
    html += '</div>\n'
    
    return html

def generate_params(file_path, doc_type):
    if doc_type and file_path:
        params = {
            'urls': [file_path],
            'datatype': doc_type,
            'shipmenttype': 'EXP_SEA_FCL',
            'pages': '0'
        }
        return json.dumps(params)
    return json.dumps({})

def generate_awb_bk(file_path, doc_type):
    print(doc_type)
    try:
        print('awb_bk_entered')
        print(file_path)
        
        if doc_type == 'INVOICE':
            params = generate_params(file_path, doc_type)
            print(params)
            response_data = fetch_data(params)

            print(response_data)
            modified_response = dict_to_html_table_invoice(response_data)
            
        elif doc_type == 'AWB':
            params = generate_params(file_path, doc_type)
            response_data = fetch_data(params)
            
            print(response_data)
            modified_response = dict_to_html_table_awb(response_data)

        modified_response = modified_response.replace('None', '')
        return modified_response
    except Exception as e:
        error_message = f"**Error generating content:** Kindly referesh and try again"
        print(f"Error generating content: {e}, Kindly referesh and try again")
        return error_message
