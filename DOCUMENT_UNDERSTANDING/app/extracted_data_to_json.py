from app.utils.needs import convert_date_format, convert_date_format_dpi
from app.utils.converting import convert_to_json_awb, convert_to_json_invoice, convert_to_json_dpi, convert_to_json_docs
import re

def process_multiple_dpi(all_responses):
    all_invoices = [convert_to_json_dpi(response) for response in all_responses]

    if not all_invoices:
        return {}

    final_invoice = all_invoices[0]

    if 'proformaDate' in final_invoice:
        final_invoice['proformaDate'] = convert_date_format_dpi(final_invoice['proformaDate'])
    if 'dpiReception' in final_invoice:
        final_invoice['dpiReception'] = convert_date_format_dpi(final_invoice['dpiReception'])
    if 'dpiRegistration' in final_invoice:
        final_invoice['dpiRegistration'] = convert_date_format_dpi(final_invoice['dpiRegistration'])
    if 'valueFob' in final_invoice and final_invoice['valueFob'] is not None:
        # Convert to string and remove spaces
        final_invoice['valueFob'] = str(final_invoice['valueFob']).replace(' ', '')

    if 'invoiceAmt' in final_invoice and final_invoice['invoiceAmt'] is not None:
        # Convert to string and remove spaces
        final_invoice['invoiceAmt'] = str(final_invoice['invoiceAmt']).replace(' ', '')

    non_null_values = {}

    for invoice in all_invoices[1:]:
        if 'proformaDate' in invoice:
            invoice['proformaDate'] = convert_date_format_dpi(invoice['proformaDate'])
        if 'dpiReception' in invoice:
            invoice['dpiReception'] = convert_date_format_dpi(invoice['dpiReception'])
        if 'dpiRegistration' in invoice:
            invoice['dpiRegistration'] = convert_date_format_dpi(invoice['dpiRegistration'])
        if 'valueFob' in final_invoice and final_invoice['valueFob'] is not None:
            # Convert to string and remove spaces
            final_invoice['valueFob'] = str(final_invoice['valueFob']).replace(' ', '')

        if 'invoiceAmt' in final_invoice and final_invoice['invoiceAmt'] is not None:
            # Convert to string and remove spaces
            final_invoice['invoiceAmt'] = str(final_invoice['invoiceAmt']).replace(' ', '')

        for key, value in invoice.items():
            if key not in ['dpiItemVOs']:
                if value is not None:
                    non_null_values[key] = value

    for key, value in non_null_values.items():
        if final_invoice.get(key) is None:
            final_invoice[key] = value

    combined_items = final_invoice.get('dpiItemVOs', [])
    for invoice in all_invoices[1:]:
        combined_items.extend(invoice.get('dpiItemVOs', []))

    shipping_Method = final_invoice.get('shippingMethod', None)
    print('shipping_Method: ', shipping_Method)
    
    valid_shipment_method = ['FCL', 'LCL']

    if shipping_Method and shipping_Method != 'null':
        found_term = next((term for term in valid_shipment_method if term in shipping_Method.split()), None)
        if found_term:
            final_invoice['shippingMethod'] = found_term
        else:
            final_invoice['shippingMethod'] = None
    
    fret = final_invoice.get('fret')
    if fret == "null" or fret == None:
        print('fret: ', fret)
        final_invoice['fret'] = 0
        
    insuarance = final_invoice.get('insuarance')
    if insuarance == "null" or insuarance == None:
        print('insuarance: ', insuarance)
        final_invoice['insuarance'] = 0
    
    otherCharges = final_invoice.get('otherCharges')
    if otherCharges == "null" or otherCharges == None:
        print('otherCharges: ', otherCharges)
        final_invoice['otherCharges'] = 0
            
    for i, item in enumerate(combined_items, start=1):
        item['itemNo'] = i
        
        if 'shCode' in item:
            if item['shCode'] != 'null' and item['shCode'] is not None:
                if '.' in item['shCode']:
                    shCode = item['shCode'].replace('.', '')
                    item['shCode'] = shCode
    
    final_invoice['dpiItemVOs'] = combined_items

    return final_invoice

def process_multiple_awb(all_responses):
    all_invoices = [convert_to_json_awb(response) for response in all_responses]

    if not all_invoices:
        return {}

    final_invoice = all_invoices[0]

    non_null_values = {}

    for invoice in all_invoices[1:]:
        for key, value in invoice.items():
            if key not in ['ITEMS']:
                if value is not None:
                    non_null_values[key] = value

    for key, value in non_null_values.items():
        if final_invoice.get(key) is None:
            final_invoice[key] = value

    combined_items = final_invoice.get('ITEMS', [])
    for invoice in all_invoices[1:]:
        combined_items.extend(invoice.get('ITEMS', []))
            
    for i, item in enumerate(combined_items, start=1):
        item['itemNo'] = i
    
    final_invoice['ITEMS'] = combined_items

    return final_invoice

def process_multiple_invoices(all_responses):
    all_invoices = [convert_to_json_invoice(response) for response in all_responses]

    if not all_invoices:
        return {}

    final_invoice = all_invoices[0]

    if 'invoicedate' in final_invoice:
        final_invoice['invoicedate'] = convert_date_format(final_invoice['invoicedate'])
    if 'poDate' in final_invoice:
        final_invoice['poDate'] = convert_date_format(final_invoice['poDate'])

    non_null_values = {}

    for invoice in all_invoices[1:]:
        if 'invoicedate' in invoice:
            invoice['invoicedate'] = convert_date_format(invoice['invoicedate'])
        if 'poDate' in invoice:
            invoice['poDate'] = convert_date_format(invoice['poDate'])

        for key, value in invoice.items():
            if key not in ['invoiceItemParserVOs']:
                if value is not None:
                    non_null_values[key] = value

    for key, value in non_null_values.items():
        if final_invoice.get(key) is None:
            final_invoice[key] = value

    combined_items = final_invoice.get('invoiceItemParserVOs', [])
    for invoice in all_invoices[1:]:
        combined_items.extend(invoice.get('invoiceItemParserVOs', []))
    
    hscode_outside = final_invoice.get('hscode', None)
    print('hscode: ', hscode_outside)
    
    if hscode_outside and hscode_outside != 'null':
        hscode_outside = hscode_outside.replace(' ', '')
        final_invoice['hscode'] = hscode_outside
        if not re.fullmatch(r'\d{8}', hscode_outside):
            final_invoice['hscode'] = None
            
    shipment_outside = final_invoice.get('shipmentterm', None)
    print('shipmentterm: ', shipment_outside)
    
    valid_shipment_terms = ['FOB', 'CI', 'CIF', 'CF']

    if shipment_outside and shipment_outside != 'null':
        found_term = next((term for term in valid_shipment_terms if term in shipment_outside.split()), None)
        if found_term:
            final_invoice['shipmentterm'] = found_term
        else:
            final_invoice['shipmentterm'] = None

    for i, item in enumerate(combined_items, start=1):
        item['slno'] = i
        
        if 'hscode' in item:
            if item['hscode'] == 'null' or item['hscode'] is None:
                if hscode_outside:
                    item['hscode'] = hscode_outside
            else:
                hscode = item['hscode'].replace(' ', '')
                if not re.fullmatch(r'\d{8}', hscode):
                    item['hscode'] = None
                else:
                    item['hscode'] = hscode
    
    final_invoice['invoiceItemParserVOs'] = combined_items

    return final_invoice

def process_multiple_awb_2(all_responses):
    all_invoices = [convert_to_json_awb(response) for response in all_responses]

    if not all_invoices:
        return {}

    final_invoice = all_invoices[0]

    for invoice in all_invoices[1:]:
        for key, value in invoice.items():
            if value is not None:
                if key not in final_invoice:
                    final_invoice[key] = value
                    
                elif final_invoice[key] is None:
                    final_invoice[key] = value

    return final_invoice

def process_multiple_docs(all_responses):
    all_invoices = [convert_to_json_docs(response) for response in all_responses]

    if not all_invoices:
        return {}

    final_invoice = all_invoices[0]

    if 'gaindeDeclarationDate' in final_invoice:
        final_invoice['gaindeDeclarationDate'] = convert_date_format_dpi(final_invoice['gaindeDeclarationDate'])
    
    if 'avmanifesteNo' in final_invoice:
        if final_invoice['avmanifesteNo'] != 'null' and final_invoice['avmanifesteNo'] is not None:
            if ' ' in final_invoice['avmanifesteNo']:
                avmanifesteNo = final_invoice['avmanifesteNo'].replace(' ', '')
                final_invoice['avmanifesteNo'] = avmanifesteNo
                
    if 'gaindeDeclarationNo' in final_invoice:
        if final_invoice['gaindeDeclarationNo'] != 'null' and final_invoice['gaindeDeclarationNo'] is not None:
            if ' ' in final_invoice['gaindeDeclarationNo']:
                gaindeDeclarationNo = final_invoice['gaindeDeclarationNo'].replace(' ', '')
                final_invoice['gaindeDeclarationNo'] = gaindeDeclarationNo

    non_null_values = {}

    for invoice in all_invoices[1:]:
        if 'gaindeDeclarationDate' in invoice:
            invoice['gaindeDeclarationDate'] = convert_date_format_dpi(invoice['gaindeDeclarationDate'])
            
        for key, value in invoice.items():
            if value is not None:
                non_null_values[key] = value

    for key, value in non_null_values.items():
        if final_invoice.get(key) is None:
            final_invoice[key] = value

    return final_invoice