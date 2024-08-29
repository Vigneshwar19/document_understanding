import json
from app.utils.needs import order_json_data

def convert_to_json_awb(input_string):
    start_index = input_string.find('{')
    end_index = input_string.rfind('}') + 1
    
    json_content = input_string[start_index:end_index].strip()

    json_object = json.loads(json_content)
    
    key_order = ["SHIPPER_NAME", "SHIPPER_ADDRESS", "CONSIGNEE_NAME", "CONSIGNEE_ADDRESS", "HAWB_NUMBER", "MAWB_NUMBER", "ISSUED_BY",
                "ISSUING_CARRIER_AGENT_NAME", "ISSUING_CARRIER_AGENT_CITY", "AGENT'S_IATA_CODE", "ACCOUNTING_INFORMATION", "AIRPORT_OF_DEPARTURE",
                "FIRST_TO", "BY_FIRST_CARRIER", "SECOND_TO", "FIRST_BY", "THIRD_TO", "SECOND_BY", "DECLARED_VALUE_FOR_CARRIAGE", "DECLARED_VALUE_FOR_CUSTOMS", "AIRPORT_OF_DESTINATION", "REQUESTED_FLIGHT_NUMBER",
                "REQUESTED_FLIGHT_DATE", "AMOUNT_OF_INSURANCE", "HANDLING_INFORMATION", "ITEMS", "SIGNATURE_OF_SHIPPER_OR_HIS_AGENT", "EXECUTED_ON_DATE",
                "AT_PLACE", "SIGNATURE_OF_ISSUING_CARRIER_OR_ITS_AGENT"]
    
    ordered_json_data = order_json_data(json_object, key_order)
    return ordered_json_data

def convert_to_json_docs(input_string):
    start_index = input_string.find('{')
    end_index = input_string.rfind('}') + 1
    
    json_content = input_string[start_index:end_index].strip()

    json_object = json.loads(json_content)
    
    key_mapping = {
        "DECLARATION_NUMBER": "gaindeDeclarationNo",
        "DECLARATION_DATE": "gaindeDeclarationDate",
        "PPM_NUMBER": "ppm",
        "MANIFESTE_OR_AUTRE_NUMBER": "avmanifesteNo",
        "NUMBER_OF_ARTICLES": "avnoOfArticles",
    }

    renamed_json_object = {key_mapping.get(k, k): v for k, v in json_object.items()}
    
    key_order = [
        "gaindeDeclarationNo", "gaindeDeclarationDate", "ppm", "avmanifesteNo",
        "avnoOfArticles"
        ]

    ordered_json_data = {k: renamed_json_object[k] for k in key_order if k in renamed_json_object}

    return ordered_json_data

def convert_to_json_invoice(input_string):
    start_index = input_string.find('{')
    end_index = input_string.rfind('}') + 1
    
    json_content = input_string[start_index:end_index].strip()

    json_object = json.loads(json_content)

    key_mapping = {
        "SHIPPER_NAME": "shipper",
        "SHIPPER_ADDRESS": "shipperaddress",
        "CONSIGNEE_NAME": "consignee",
        "CONSIGNEE_ADDRESS": "consigneeaddress",
        "INVOICE_NUMBER": "invoiceno",
        "INVOICE_DATE": "invoicedate",
        "ORIGIN": "origin",
        "DESTINATION": "destination",
        "SHIPMENT_TERM": "shipmentterm",
        "DISCHARGE": "discharge",
        "PO_NUMBER": "poNumber",
        "PO_DATE": "poDate",
        "HS_CODE": "hscode",
        "CURRENCY_TYPE": "currency",
        "INVOICE_ITEM_CHILDS": "invoiceItemParserVOs",
    }

    renamed_json_object = {key_mapping.get(k, k): v for k, v in json_object.items()}
    
    if 'invoiceItemParserVOs' in renamed_json_object:
        for item in renamed_json_object['invoiceItemParserVOs']:
            generaldesc = item.get('generaldesc') or ''
            desc = item.get('desc') or ''
            quantity = item.get('quantity')
            rate = item.get('rate')
            totalamount = item.get('totalamount')

            if generaldesc == "null":
                generaldesc = ''
            if desc == "null":
                desc = ''
            if quantity == "null" or quantity == None:
                print('quantity: ', quantity)
                quantity = 0
            if rate == "null" or rate == None:
                print('rate: ', rate)
                item['rate'] = 0
            if totalamount is not None and totalamount != "null":
                if isinstance(totalamount, (int, float)):
                    totalamount_str = str(totalamount)
                else:
                    totalamount_str = totalamount
                
                if isinstance(totalamount_str, str) and ',' in totalamount_str:
                    print('yes')
                    item['totalamount'] = totalamount_str.replace(',', '.')
                else:
                    item['totalamount'] = totalamount_str

            if generaldesc in desc:
                combined_desc = desc
            else:
                combined_desc = f"{generaldesc if generaldesc else ''}, {desc if desc else ''}".strip(', ')

            item['desc'] = combined_desc if desc else (generaldesc if generaldesc else '')
            
            del item['generaldesc']

    key_order = [
        "shipper", "shipperaddress", "consignee", "consigneeaddress",
        "invoiceno", "invoicedate", "origin", "destination", "shipmentterm", 
        "discharge", "poNumber", "poDate", "hscode", "currency", "invoiceItemParserVOs"
    ]

    ordered_json_data = {k: renamed_json_object[k] for k in key_order if k in renamed_json_object}

    return ordered_json_data

def convert_to_json_dpi(input_string):
    start_index = input_string.find('{')
    end_index = input_string.rfind('}') + 1
    
    json_content = input_string[start_index:end_index].strip()

    json_object = json.loads(json_content)

    key_mapping = {
        "CURRENCY_TYPE": "currency",
        "EXPORTER_NAME": "exporterName",
        "EXPORTER_ADDRESS": "exporterAddress",
        "IMPORTER_NAME": "importerName",
        "IMPORTER_ADDRESS": "importerAddress",
        "INVOICE_NUMBER": "proformaNo",
        "INVOICE_DATE": "proformaDate",
        "INTERNATIONAL_COMMERCIAL_TERMS": "incoterm",
        "PAYMENT_MODE": "modeOfPayment",
        "PAYMENT_TERMS": "PaymentTerms",
        "DPI_NUMBER": "dpiNo",
        "DPI_RECEPTION_DATE": "dpiReception",
        "DPI_REGISTRATION_DATE": "dpiRegistration",
        "PPM": "ppm",
        "NINEA": "ninea",
        "OBSERVATIONS": "observation",
        "BANQUE_NAME": "bankName",
        "BANQUE_CONTACT_NUMBER": "bankPhoneno",
        "BANQUE_FAX": "bankFax",
        "BANQUE_CONTACT": "bankContact",
        "MODE_OF_TRANSPORT": "modeOfTransport",
        "COUNTRY_OF_ORIGIN": "provenance",
        "ISSUER_AV/ARA": "transmitterAvAra",
        "PLACE_OF_DEPARTURE": "placeofEmbarkation",
        "MODE_OF_SHIPMENT": "shippingMethod",
        "TRANSSHIPMENT_LOCATION": "transhipmentLocation",
        "VALUE_FOB": "valueFob", 
        "TOTAL": "invoiceAmt", 
        "FREIGHT": "fret", 
        "INSURANCE": "insuarance", 
        "OTHER_CHARGES": "otherCharges", 
        "ITEMS": "dpiItemVOs"
    }

    renamed_json_object = {key_mapping.get(k, k): v for k, v in json_object.items()}
    
    if 'dpiItemVOs' in renamed_json_object:
        for item in renamed_json_object['dpiItemVOs']:
            generaldesc = item.get('generaldesc') or ''
            desc = item.get('desc') or ''
            valueFact = item.get('valueFact') or ''
            print(valueFact)

            if generaldesc == "null":
                generaldesc = ''
            if desc == "null":
                desc = ''
            if valueFact is not None and valueFact != "null":
                if isinstance(valueFact, (int, float)):
                    valueFact_str = str(valueFact)
                else:
                    valueFact_str = valueFact
                
                if isinstance(valueFact_str, str) and ',' in valueFact_str:
                    print('yes')
                    item['valueFact'] = valueFact_str.replace(',', '.')
                else:
                    item['valueFact'] = valueFact_str

            if generaldesc in desc:
                combined_desc = desc
            else:
                combined_desc = f"{generaldesc if generaldesc else ''}, {desc if desc else ''}".strip(', ')

            item['desc'] = combined_desc if desc else (generaldesc if generaldesc else '')
            
            del item['generaldesc']

    key_order = [
        "currency", "exporterName", "exporterAddress", "importerName", "importerAddress", "proformaNo", "proformaDate", "incoterm",
        "modeOfPayment", "PaymentTerms", "dpiNo", "dpiReception", "dpiRegistration", "ppm", "ninea", "observation", "bankName", "bankPhoneno", "bankFax",
        "bankContact", "modeOfTransport", "provenance", "transmitterAvAra", "placeofEmbarkation", "shippingMethod", "transhipmentLocation",
        "valueFob", "invoiceAmt", "fret", "insuarance", "otherCharges", "dpiItemVOs"
    ]

    ordered_json_data = {k: renamed_json_object[k] for k in key_order if k in renamed_json_object}

    return ordered_json_data