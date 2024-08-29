from flask import Blueprint, request, jsonify
import time
import logging
from app.chat_input_bp import chatbot
import requests
import json
from app import db
from datetime import datetime, timedelta
from .utils.our_chat_bot_api import call_api_selling_name
from .utils.gemini_chat import generate_response
from .utils.g_cse import search_engine
from app.models import GeneralInput 
from .utils.input_extract_lead import extarct_from_response
from .utils.input_extract_enq import extarct_from_response_enq
from .utils.input_extract_quo import extarct_from_response_quo

chat_bp = Blueprint("chat_bot_bp", __name__, template_folder="templates")

def send_json_to_uri(uri, json_data):
    try:
        response = requests.post(uri, json=json_data)
        response.raise_for_status()  # Raise an exception for HTTP errors
        return response
    except requests.exceptions.RequestException as e:
        print(f"Error sending JSON to {uri}: {e}")
        return None
    
@chat_bp.route('/chat', methods=['POST'])
def chat():
    try:
        start_time = time.time()
        user_input = request.json.get('user_input')
        logging.info("User input received: %s", user_input)
        print(user_input)
        
        if user_input is None:
            return jsonify({'response': 'Error: User input parameter is missing.'}), 400
        
        response = ""
        
        if isinstance(user_input, dict) and any(key in user_input for key in ['user_text']):
            input_text = user_input['user_text']
            tenant_id = user_input['tenantid']
            office_id = user_input['officeid']
            environment = user_input['environment']

            response = chatbot(input_text, tenant_id, office_id, environment)
            print(response)
        
        elif isinstance(user_input, dict) and 'tag' in user_input:
            print("entered")
            input_text = user_input['input']
            tenant_id = user_input['tenantid']
            office_id = user_input['officeid']
            environment = user_input['environment']

            response = search_engine(input_text)
        
        elif isinstance(user_input, dict) and 'sales' in user_input:
            name = user_input['sales']
            tenant_id = user_input['tenantid']
            office_id = user_input['officeid']
            environment = user_input['environment']
            print('name: ', name)
            user_column = 'LEAD SOURCE'
            current_date = datetime.now().date()
            one_month_ago = current_date - timedelta(days=30)
            from_date_str = one_month_ago.strftime("%Y-%m-%d")
            to_date_str = current_date.strftime("%Y-%m-%d")
            json_input = {
                        "fromdate": from_date_str,
                        "toDate": to_date_str,
                        "officeId": office_id,
                        "tenantid": tenant_id
                    }
            response += call_api_selling_name(user_column, json_input, name, environment)

        elif isinstance(user_input, dict) and any(key in user_input for key in ['customSBbooking_number', 'customSBbooking_ref', 'customSBjob_number', 'customSBsb_number', 'customSBlicense_reg_number', 'customSBsb_from_date', 'customSBsb_to_date', 'customSBinvoice_number', 'customSBhscode']):
            SBbooking_input = {}
            for key in ['customSBbooking_number', 'customSBbooking_ref', 'customSBjob_number', 'customSBsb_number', 'customSBlicense_reg_number', 'customSBsb_from_date', 'customSBsb_to_date', 'customSBinvoice_number', 'customSBhscode']:
                if key in user_input:
                    SBbooking_input[key] = user_input[key]
            current_date = user_input['current_date']
            tenant_id = user_input['tenantid']
            office_id = user_input['officeid']
            user_id_2 = user_input['userid2']
            user_id = user_input['userid']
            end_point = 'searchShippingBill'
            base_url = user_input['environment']
            print(SBbooking_input)
            
            SBbooking_input_modified = {
                'sbfromdate': SBbooking_input.get('customSBsb_from_date', ''),
                'sbtodate': SBbooking_input.get('customSBsb_to_date', ''),
                'bookingno': SBbooking_input.get('customSBbooking_number', ''),
                'invoiceNo': SBbooking_input.get('customSBinvoice_number', ''),
                'jobno': SBbooking_input.get('customSBjob_number', ''),
                'licenceno': SBbooking_input.get('customSBlicense_reg_number', ''),
                'ritcCode': SBbooking_input.get('customSBhscode', ''),
                'sbno': SBbooking_input.get('customSBsb_number', ''),
                'tempbookingno': SBbooking_input.get('customSBbooking_ref', ''),
            }
            
            for key, value in user_input.items():
                if key == 'ffrid' or key == 'chaid':
                    SBbooking_input_modified[key] = value

            json_input = {
                            **SBbooking_input_modified,
                            "tenantid":tenant_id,
                            "officeId":office_id,
                            "loggedInUserId":user_id_2,
                            "createdBy":130,
                            #"createdDate":current_date,
                            "userByLastupdatedbyStr":user_id,
                            #"lastUpdatedDate":current_date,
                            "lastUpdatedBy":130,
                            "isicegateshippingbill": 1
                        }

            print(json_input)
            
            if SBbooking_input:
                api_url = f"{base_url}/{end_point}"
                try:
                    api_resp = requests.post(api_url, json=json_input, verify=False)
                    
                    field_name_mapping = {
                        'bookingno': 'Booking Number',
                        'tempbookingno': 'Booking Ref',
                        'bookingdate': 'Booking Date',
                        'jobno': 'Job Number',
                        'jobdate': 'Job Date',
                        'sbno': 'SB Number',
                        'sbdate': 'SB Date',
                        'shippername': 'Shipper',
                        'consigneName': 'Consignee',
                        'noofpkgs': 'No Of PKGS',
                        'grosswt': 'Gross WT',
                        'netwt': 'Net WT',
                        'wtunit': 'Units',
                        'statuscode': 'Status',
                    }

                    if api_resp.status_code == 200:
                        api_data = api_resp.json()

                        fields_to_print = ['bookingno', 'tempbookingno', 'bookingdate', 'jobno', 'jobdate', 'sbno',
                                        'sbdate', 'shippername', 'consigneName', 'noofpkgs', 'grosswt', 'netwt', 'wtunit', 'statuscode']

                        extracted_data_all_lists = []

                        for data_item in api_data:
                            extracted_data = {}
                            for field in fields_to_print:
                                mapped_field = field_name_mapping.get(field, field).upper()
                                extracted_data[mapped_field] = data_item.get(field, 'Not available')

                            extracted_data_all_lists.append(extracted_data)

                        extracted_data_all_lists_json = json.dumps(extracted_data_all_lists, indent=4)
                        print(extracted_data_all_lists_json)
                        response = extracted_data_all_lists_json

                    else:
                        response = f"Error: Failed to get a response from the API. Status code: {api_resp.status_code}"

                except requests.exceptions.SSLError as ssl_error:
                    response = f"SSL Error: {ssl_error}"
                except requests.exceptions.RequestException as request_error:
                    response = f"Error: Failed to call the API - {request_error}"
            else:
                response = 'Error: Booking number is missing or invalid.'
                
        elif isinstance(user_input, dict) and any(key in user_input for key in ['paypayable_to', 'payamount', 'payfrom_date', 'payto_date', 'paycheque_number', 'paybooking_number', 'paybill_number']):
            booking_input = {}
            for key in ['paypayable_to', 'payamount', 'payfrom_date', 'payto_date', 'paycheque_number', 'paybooking_number', 'paybill_number']:
                if key in user_input:
                    booking_input[key] = user_input[key]
            tenant_id = user_input['tenantid']
            office_id = user_input['officeid']
            end_point = 'findPaymentsPaidByQuerys'
            base_url = user_input['environment']
            print(booking_input)
            
            booking_input_modified = {
                'amount': booking_input.get('payamount', ''),
                'details': booking_input.get('paycheque_number', ''),
                'bookingNo': booking_input.get('paybooking_number', ''),
                'billNo': booking_input.get('paybill_number', ''),
                'chequeFromDate': booking_input.get('payfrom_date', ''),
                'chequeToDate': booking_input.get('payto_date', ''),
                'companydesc': booking_input.get('paypayable_to', ''),
            }

            json_input = {
                            **booking_input_modified,
                            "tenantid":tenant_id,
                            "officeId":office_id,
                            #"loggedInUserId":user_id_2,
                            #"createdBy":130,
                            #"createdDate":current_date,
                            #"userByLastupdatedbyStr":user_id,
                            #"lastUpdatedDate":current_date,
                            #"lastUpdatedBy":130,
                            "paymentmode": -1
                        }

            print(json_input)
            
            if booking_input:
                api_url = f"{base_url}/{end_point}"
                try:
                    api_resp = requests.post(api_url, json=json_input, verify=False)
                    
                    field_name_mapping = {
                        'companyName': 'Payment To',
                        'paymentmode': 'Payment Mode',
                        'paymentDate': 'Payment Date',
                        'paymentno': 'Payment Number',
                        'details': 'Cheque Number',
                        'checkDate': 'Cheque Date',
                        'utrNo': 'UTR Number',
                        'utrDate': 'UTR Date',
                        'remarks': 'Remark',
                        'amount': 'Total Amount',
                        'unadjustedamount': 'Unadjusted Amount',
                        'createddbyuser': 'Created By',
                        'createdDate': 'Created Date',
                        'confirmedbyuser': 'Confirmed By',
                        'confirmedDate': 'Confirmed Date',
                    }

                    if api_resp.status_code == 200:
                        api_data = api_resp.json()

                        fields_to_print = ['companyName', 'paymentmode', 'paymentDate', 'paymentno', 'details', 'checkDate',
                                        'utrNo', 'utrDate', 'remarks', 'amount', 'unadjustedamount', 'createddbyuser', 'createdDate', 'confirmedbyuser', 'confirmedDate']

                        extracted_data_all_lists = []

                        for data_item in api_data:
                            extracted_data = {}
                            for field in fields_to_print:
                                mapped_field = field_name_mapping.get(field, field).upper()
                                value = data_item.get(field, 'Not available')
                                
                                if field == 'paymentmode':
                                    if value == 0:
                                        value = 'CHEQUE'
                                    elif value == 1:
                                        value = 'ONLINE'
                                    elif value == 2:
                                        value = 'CASH'
                                    elif value == 3:
                                        value = 'UPI'
                                        
                                if field == 'createdDate' and isinstance(value, int) and len(str(value)) == 13:
                                    try:
                                        value = datetime.fromtimestamp(value / 1000).strftime('%Y-%m-%d')
                                    except ValueError:
                                        pass
                                elif field == 'confirmedDate' and isinstance(value, int) and len(str(value)) == 13:
                                    try:
                                        value = datetime.fromtimestamp(value / 1000).strftime('%Y-%m-%d')
                                    except ValueError:
                                        pass
                                extracted_data[mapped_field] = value

                            extracted_data_all_lists.append(extracted_data)

                        extracted_data_all_lists_json = json.dumps(extracted_data_all_lists, indent=4)
                        print(extracted_data_all_lists_json)
                        response = extracted_data_all_lists_json

                    else:
                        response = f"Error: Failed to get a response from the API. Status code: {api_resp.status_code}"

                except requests.exceptions.SSLError as ssl_error:
                    response = f"SSL Error: {ssl_error}"
                except requests.exceptions.RequestException as request_error:
                    response = f"Error: Failed to call the API - {request_error}"
            else:
                response = 'Error: Booking number is missing or invalid.'
                
        elif isinstance(user_input, dict) and any(key in user_input for key in ['receiptsreceipt_from', 'receiptsamount', 'receiptsfrom_date', 'receiptsto_date', 'receiptsbooking_number', 'receiptsbill_number']):
            booking_input = {}
            for key in ['receiptsreceipt_from', 'receiptsamount', 'receiptsfrom_date', 'receiptsto_date', 'receiptsbooking_number', 'receiptsbill_number']:
                if key in user_input:
                    booking_input[key] = user_input[key]
            tenant_id = user_input['tenantid']
            office_id = user_input['officeid']
            end_point = 'findPaymentsReceivedByQuery'
            base_url = user_input['environment']
            print(booking_input)
            
            booking_input_modified = {
                'amount': booking_input.get('receiptsamount', ''),
                'bookingNo': booking_input.get('receiptsbooking_number', ''),
                'billNo': booking_input.get('receiptsbill_number', ''),
                'chequeFromDate': booking_input.get('receiptsfrom_date', ''),
                'chequeToDate': booking_input.get('receiptsto_date', ''),
                'companydesc': booking_input.get('receiptsreceipt_from', ''),
            }

            json_input = {
                            **booking_input_modified,
                            "tenantid":tenant_id,
                            "officeId":office_id,
                            #"loggedInUserId":user_id_2,
                            #"createdBy":130,
                            #"createdDate":current_date,
                            #"userByLastupdatedbyStr":user_id,
                            #"lastUpdatedDate":current_date,
                            #"lastUpdatedBy":130,
                            "paymentmode": -1
                        }

            print(json_input)
            
            if booking_input:
                api_url = f"{base_url}/{end_point}"
                try:
                    api_resp = requests.post(api_url, json=json_input, verify=False)
                    
                    field_name_mapping = {
                        'intLedgerName': 'Receipt From',
                        'paymentmode': 'Receipt Mode',
                        'paymentDate': 'Receipt Date',
                        'paymentno': 'Receipt Number',
                        'details': 'Cheque Number',
                        'checkDate': 'Cheque Date',
                        'utrNo': 'UTR Number',
                        'utrDate': 'UTR Date',
                        'remarks': 'Remark',
                        'amount': 'Total Amount',
                        'unadjustedamount': 'Unadjusted Amount',
                        'createddbyuser': 'Created By',
                        'createdDate': 'Created Date',
                        'confirmedbyuser': 'Confirmed By',
                        'confirmedDate': 'Confirmed Date',
                    }

                    if api_resp.ok:
                        api_data = api_resp.json()

                        fields_to_print = ['intLedgerName', 'paymentmode', 'paymentDate', 'paymentno', 'details', 'checkDate',
                                        'utrNo', 'utrDate', 'remarks', 'amount', 'unadjustedamount', 'createddbyuser', 'createdDate', 'confirmedbyuser', 'confirmedDate']

                        extracted_data_all_lists = []

                        for data_item in api_data:
                            extracted_data = {}
                            for field in fields_to_print:
                                mapped_field = field_name_mapping.get(field, field).upper()
                                value = data_item.get(field, 'Not available')
                                
                                if field == 'paymentmode':
                                    if value == 0:
                                        value = 'CHEQUE'
                                    elif value == 1:
                                        value = 'ONLINE'
                                    elif value == 2:
                                        value = 'CASH'
                                    elif value == 3:
                                        value = 'UPI'
                                        
                                if field == 'createdDate' and isinstance(value, int) and len(str(value)) == 13:
                                    try:
                                        value = datetime.fromtimestamp(value / 1000).strftime('%Y-%m-%d')
                                    except ValueError:
                                        pass
                                elif field == 'confirmedDate' and isinstance(value, int) and len(str(value)) == 13:
                                    try:
                                        value = datetime.fromtimestamp(value / 1000).strftime('%Y-%m-%d')
                                    except ValueError:
                                        pass
                                extracted_data[mapped_field] = value

                            extracted_data_all_lists.append(extracted_data)

                        extracted_data_all_lists_json = json.dumps(extracted_data_all_lists, indent=4)
                        print(extracted_data_all_lists_json)
                        response = extracted_data_all_lists_json

                    else:
                        response = f"Error: Failed to get a response from the API. Status code: {api_resp.status_code}"

                except requests.exceptions.SSLError as ssl_error:
                    response = f"SSL Error: {ssl_error}"
                except requests.exceptions.RequestException as request_error:
                    response = f"Error: Failed to call the API - {request_error}"
            else:
                response = 'Error: Booking number is missing or invalid.'
        
        elif isinstance(user_input, dict) and any(key in user_input for key in ['customBEbooking_number', 'customBEbooking_ref', 'customBEinvoice_number', 'customBEhscode', 'customBEjob_number', 'customBElicense_reg_number', 'customBEbe_number', 'customBEiec_code', 'customBEigm_number', 'customBEbe_from_date', 'customBEbe_to_date', 'customBEhawb/hbl_number', 'customBEmawb\mbl_number']):
            booking_input = {}
            for key in ['customBEbooking_number', 'customBEbooking_ref', 'customBEinvoice_number', 'customBEhscode', 'customBEjob_number', 'customBElicense_reg_number', 'customBEbe_number', 'customBEiec_code', 'customBEigm_number', 'customBEbe_from_date', 'customBEbe_to_date', 'customBEhawb/hbl_number', 'customBEmawb\mbl_number']:
                if key in user_input:
                    booking_input[key] = user_input[key]
            current_date = user_input['current_date']
            tenant_id = user_input['tenantid']
            office_id = user_input['officeid']
            user_id_2 = user_input['userid2']
            user_id = user_input['userid']
            end_point = 'searchBillofEntry'
            base_url = user_input['environment']
            print(booking_input)
            
            booking_input_modified = {
                'bookingno': booking_input.get('customBEbooking_number', ''),
                'tempbookingno': booking_input.get('customBEbooking_ref', ''),
                'invoiceNo': booking_input.get('customBEinvoice_number', ''),
                'ritcCode': booking_input.get('customBEhscode', ''),
                'jobno': booking_input.get('customBEjob_number', ''),
                'beno': booking_input.get('customBEbe_number', ''),
                'chacode': booking_input.get('customBEiec_code', ''),
                'igmno': booking_input.get('customBEigm_number', ''),
                'licenceno': booking_input.get('customBElicense_reg_number', ''),
                'hblno': booking_input.get('customBEhawb/hbl_number', ''),
                'mblno': booking_input.get('customBEmawb\mbl_number', ''),
                'bedate': booking_input.get('customBEbe_from_date', ''),
                'betoDate': booking_input.get('customBEbe_to_date', ''),
            }
            
            for key, value in user_input.items():
                if key == 'ffrid' or key == 'chaid':
                    booking_input_modified[key] = value

            json_input = {
                            **booking_input_modified,
                            "tenantid":tenant_id,
                            "officeId":office_id,
                            "loggedInUserId":user_id_2,
                            "createdBy":130,
                            #"createdDate":current_date,
                            "userByLastupdatedbyStr":user_id,
                            #"lastUpdatedDate":current_date,
                            "lastUpdatedBy":130,
                            "isicegateBillofEntry": 1
                        }

            print(json_input)
            
            if booking_input:
                api_url = f"{base_url}/{end_point}"
                try:
                    api_resp = requests.post(api_url, json=json_input, verify=False)
                    
                    field_name_mapping = {
                        'bookingno': 'Booking Number',
                        'jobno': 'Job Number',
                        'jobdate': 'Job Date',
                        'igmno': 'IGM No',
                        'igmdate': 'IGM Date',
                        'beno': 'BE Number',
                        'bedate': 'BE Date',
                        'shippername': 'Shipper',
                        'consigneName': 'Consignee',
                        'locationcode': 'Port Of Filing',
                        'beType': 'BE Type',
                        'portoforigindesc': 'Origin Port',
                    }

                    if api_resp.status_code == 200:
                        api_data = api_resp.json()

                        fields_to_print = ['bookingno', 'jobno', 'jobdate', 'igmno', 'igmdate', 'beno',
                                        'bedate', 'shippername', 'consigneName', 'locationcode', 'beType', 'portoforigindesc']

                        extracted_data_all_lists = []

                        for data_item in api_data:
                            extracted_data = {}
                            for field in fields_to_print:
                                mapped_field = field_name_mapping.get(field, field).upper()
                                extracted_data[mapped_field] = data_item.get(field, 'Not available')

                            extracted_data_all_lists.append(extracted_data)

                        extracted_data_all_lists_json = json.dumps(extracted_data_all_lists, indent=4)
                        print(extracted_data_all_lists_json)

                        response = extracted_data_all_lists_json

                    else:
                        response = f"Error: Failed to get a response from the API. Status code: {api_resp.status_code}"

                except requests.exceptions.SSLError as ssl_error:
                    response = f"SSL Error: {ssl_error}"
                except requests.exceptions.RequestException as request_error:
                    response = f"Error: Failed to call the API - {request_error}"
            else:
                response = 'Error: Booking number is missing or invalid.'
                
        elif isinstance(user_input, dict) and any(key in user_input for key in ['bookingcompany', 'bookingbooking_number', 'bookingfrom_date', 'bookingto_date', 'bookingbooking_ref', 'bookinginvoice_number', 'bookingliner_bk_number', 'bookingcntr_number', 'bookingindent_number', 'bookingshipper_ref', 'bookingconsignee_ref', 'bookingsb_number', 'bookingbe_number', 'bookinghbl/hawb_number', 'bookingmbl/mawb_number', 'bookingplace_of_receipt', 'bookingplace_of_delivery']):
            booking_input = {}
            for key in ['bookingcompany', 'bookingbooking_number', 'bookingfrom_date', 'bookingto_date', 'bookingbooking_ref', 'bookinginvoice_number', 'bookingliner_bk_number', 'bookingcntr_number', 'bookingindent_number', 'bookingshipper_ref', 'bookingconsignee_ref', 'bookingsb_number', 'bookingbe_number', 'bookinghbl/hawb_number', 'bookingmbl/mawb_number', 'bookingplace_of_receipt', 'bookingplace_of_delivery']:
                if key in user_input:
                    booking_input[key] = user_input[key]
            tenant_id = user_input['tenantid']
            office_id = user_input['officeid']
            end_point = 'searchBooking'
            base_url = user_input['environment']
            print(booking_input)
            
            booking_input_modified = {
                'bookingFrom': booking_input.get('bookingfrom_date', ''),
                'bookingTo': booking_input.get('bookingto_date', ''),
                'bookingno': booking_input.get('bookingbooking_number', ''),
                'beNo': booking_input.get('bookingbe_number', ''),
                'cnerefno': booking_input.get('bookingconsignee_ref', ''),
                'containerno': booking_input.get('bookingcntr_number', ''),
                'hbl_hawbno': booking_input.get('bookinghbl/hawb_number', ''),
                'indentNo': booking_input.get('bookingindent_number', ''),
                'invoiceno': booking_input.get('bookinginvoice_number', ''),
                'linerbookingno': booking_input.get('bookingliner_bk_number', ''),
                'mbl_mawbno': booking_input.get('bookingmbl/mawb_number', ''),
                'placeOfAcceptance': booking_input.get('bookingplace_of_receipt', ''),
                'placeOfDelivery': booking_input.get('bookingplace_of_delivery', ''),
                'purchaseorderno': booking_input.get('bookingshipper_ref', ''),
                'sbno': booking_input.get('bookingsb_number', ''),
                'tempbookingno': booking_input.get('bookingbooking_ref', ''),
            }
            
            shipment_type_ffrid = "'IMP_SEA_FCL','IMP_SEA_LCL','IMP_AIR','IMP_OTHERS','IMP_EXBOND','IMP_BREAKBULK','CROSSCOUNTRY_IMP_FCL','CROSSCOUNTRY_IMP_LCL','CROSSCOUNTRY_IMP_AIR','IMP_OTHERS_SEA','IMP_SEA_RO-RO','IMP_SEA_BREAK_BULK','IMP_OTHERS_AIR','IMP_ROAD_FTL','IMP_ROAD_LTL','IMP_EXBOND_AIR'"
            shipment_type_chaid = "'EXP_AIR','EXP_SEA_FCL','EXP_SEA_LCL','EXP_OTHERS','CROSSCOUNTRY_EXP_FCL','CROSSCOUNTRY_EXP_LCL','CROSSCOUNTRY_EXP_AIR','EXP_OTHERS_SEA','EXP_SEA_RO-RO','EXP_SEA_BREAK_BULK','EXP_BREAKBULK','EXP_OTHERS_AIR','EXP_ROAD_FTL','EXP_ROAD_LTL'"
            shipment_type_trpid = "'TRP_BOOKING','TRP_OTHERS'"

            for key, value in user_input.items():
                if key == 'ffrid':
                    booking_input_modified[key] = value
                    #booking_input_modified['shipmentTypeLike'] = shipment_type_ffrid
                elif key == 'chaid':
                    booking_input_modified[key] = value
                    #booking_input_modified['shipmentTypeLike'] = shipment_type_chaid
                elif key == 'trpid':
                    booking_input_modified[key] = value
                    booking_input_modified['shipmentTypeLike'] = shipment_type_trpid
                else:
                    booking_input_modified[key] = value

            json_input = {
                            **booking_input_modified,
                            "tenantid":tenant_id,
                            "officeId":office_id,
                            "isconsolbooking":"true",
                            #"loggedInUserId":user_id_2,
                            "createdBy":130,
                            #"createdDate":current_date,
                            #"userByLastupdatedbyStr":user_id,
                            #"lastUpdatedDate":current_date,
                            "lastUpdatedBy":130
                        }

            print(json_input)
            
            if booking_input:
                api_url = f"{base_url}/{end_point}"
                try:
                    api_resp = requests.post(api_url, json=json_input, verify=False)
                    
                    field_name_mapping = {
                        'prefixbookingno': 'Booking Number',
                        'tempbookingno': 'Booking Ref',
                        'bookingdate': 'Booking Date',
                        'shipmenttype': 'Shipment Type',
                        'shipper': 'Shipper',
                        'consignee': 'Consignee',
                        'statuscode': 'Status',
                        'invoiceno': 'Invoice',
                        'containerNumbers': 'Container Number',
                        'remarks': 'Remarks',
                        'origindesc': 'Origin',
                        'destinationdesc': 'Destination',
                        'companyByCustomsagentName': 'Customs Agent',
                        'bookingPartyName': 'Booking Party',
                    }

                    if api_resp.status_code == 200:
                        api_data = api_resp.json()

                        fields_to_print = ['prefixbookingno', 'tempbookingno', 'bookingdate', 'shipmenttype', 'shipper', 'consignee',
                                        'statuscode', 'invoiceno', 'containerNumbers', 'remarks', 'origindesc', 'destinationdesc', 'companyByCustomsagentName', 'bookingPartyName']

                        extracted_data_all_lists = []

                        for data_item in api_data:
                            extracted_data = {}
                            for field in fields_to_print:
                                mapped_field = field_name_mapping.get(field, field).upper()
                                extracted_data[mapped_field] = data_item.get(field, 'Not available')

                            extracted_data_all_lists.append(extracted_data)

                        extracted_data_all_lists_json = json.dumps(extracted_data_all_lists, indent=4)

                        response = extracted_data_all_lists_json

                    else:
                        response = f"Error: Failed to get a response from the API. Status code: {api_resp.status_code}"

                except requests.exceptions.SSLError as ssl_error:
                    response = f"SSL Error: {ssl_error}"
                except requests.exceptions.RequestException as request_error:
                    response = f"Error: Failed to call the API - {request_error}"
            else:
                response = 'Error: Booking number is missing or invalid.'
                
        elif isinstance(user_input, dict) and any(key in user_input for key in ['bolbk_from_date', 'bolbk_to_date', 'bolbl_number', 'bolbooking_number', 'bolbooking_ref', 'bolbl_ref', 'bolfrom_date', 'bolto_date', 'bolcontainer_number']):
            booking_input = {}
            for key in ['bolbk_from_date', 'bolbk_to_date', 'bolbl_number', 'bolbooking_number', 'bolbooking_ref', 'bolbl_ref', 'bolfrom_date', 'bolto_date', 'bolcontainer_number']:
                if key in user_input:
                    booking_input[key] = user_input[key]
            tenant_id = user_input['tenantid']
            office_id = user_input['officeid']
            end_point = 'searchBillOfLading'
            base_url = user_input['environment']
            print(booking_input)
            
            booking_input_modified = {
                'blno': booking_input.get('bolbl_number', ''),
                'bookingno': booking_input.get('bolbooking_number', ''),
                'tempbookingno': booking_input.get('bolbooking_ref', ''),
                'blreferenceno': booking_input.get('bolbl_ref', ''),
                'containerno': booking_input.get('bolcontainer_number', ''),
                'blFrom': booking_input.get('bolfrom_date', ''),
                'blTo': booking_input.get('bolto_date', ''),
                'bookingFrom': booking_input.get('bolbk_from_date', ''),
                'bookingTo': booking_input.get('bolbk_to_date', ''),
            }
            
            for key, value in user_input.items():
                if key == 'ffrid' or key == 'chaid':
                    booking_input_modified[key] = value

            json_input = {
                            **booking_input_modified,
                            "tenantid":tenant_id,
                            "officeId":office_id,
                            #"loggedInUserId":user_id_2,
                            "createdBy":130,
                            #"createdDate":current_date,
                            #"userByLastupdatedbyStr":user_id,
                            #"lastUpdatedDate":current_date,
                            "lastUpdatedBy":130
                        }

            print(json_input)
            
            if booking_input:
                api_url = f"{base_url}/{end_point}"
                try:
                    api_resp = requests.post(api_url, json=json_input, verify=False)
                    
                    field_name_mapping = {
                        'blno': 'BL Number',
                        'bookingno': 'Booking Number',
                        'shipmenttype': 'Shipment Type',
                        'tempbookingno': 'Booking Ref',
                        'blreferenceno': 'BL Ref',
                        'blFrom': 'Booking Date',
                        'bltype': 'BL Type',
                        'shippername': 'Shipper',
                        'status': 'Status',
                    }

                    if api_resp.status_code == 200:
                        api_data = api_resp.json()

                        fields_to_print = ['blno', 'bookingno', 'shipmenttype', 'tempbookingno', 'blreferenceno', 'blFrom',
                                        'bltype', 'shippername', 'status']

                        extracted_data_all_lists = []

                        for data_item in api_data:
                            extracted_data = {}
                            for field in fields_to_print:
                                mapped_field = field_name_mapping.get(field, field).upper()
                                value = data_item.get(field, 'Not available')
                                
                                if field == 'bltype':
                                    if value == 2:
                                        value = 'HOUSE'
                                    elif value == 3:
                                        value = 'MASTER'
                                if field == 'blFrom' and isinstance(value, int) and len(str(value)) == 13:
                                    try:
                                        value = datetime.fromtimestamp(value / 1000).strftime('%Y-%m-%d')
                                    except ValueError:
                                        pass
                                extracted_data[mapped_field] = value

                            extracted_data_all_lists.append(extracted_data)

                        extracted_data_all_lists_json = json.dumps(extracted_data_all_lists, indent=4)
                        print(extracted_data_all_lists_json)
                        response = extracted_data_all_lists_json

                    else:
                        response = f"Error: Failed to get a response from the API. Status code: {api_resp.status_code}"

                except requests.exceptions.SSLError as ssl_error:
                    response = f"SSL Error: {ssl_error}"
                except requests.exceptions.RequestException as request_error:
                    response = f"Error: Failed to call the API - {request_error}"
            else:
                response = 'Error: Booking number is missing or invalid.'
                
        elif isinstance(user_input, dict) and any(key in user_input for key in ['awbbk_from_date', 'awbbk_to_date', 'awbawb_number', 'awbbooking_number', 'awbbooking_ref', 'awbawb_ref', 'awbfrom_date', 'awbto_date']):
            booking_input = {}
            for key in ['awbbk_from_date', 'awbbk_to_date', 'awbawb_number', 'awbbooking_number', 'awbbooking_ref', 'awbawb_ref', 'awbfrom_date', 'awbto_date']:
                if key in user_input:
                    booking_input[key] = user_input[key]
            tenant_id = user_input['tenantid']
            office_id = user_input['officeid']
            end_point = 'searchAirwaybill'
            base_url = user_input['environment']
            print(booking_input)
            
            booking_input_modified = {
                'awbno': booking_input.get('awbawb_number', ''),
                'bookingnostr': booking_input.get('awbbooking_number', ''),
                'tempbookingno': booking_input.get('awbbooking_ref', ''),
                'awbrefno': booking_input.get('awbawb_ref', ''),
                'awbFrom': booking_input.get('awbfrom_date', ''),
                'awbTo': booking_input.get('awbto_date', ''),
                'bookingFrom': booking_input.get('awbbk_from_date', ''),
                'bookingTo': booking_input.get('awbbk_to_date', ''),
            }
            
            for key, value in user_input.items():
                if key == 'ffrid' or key == 'chaid':
                    booking_input_modified[key] = value

            json_input = {
                            **booking_input_modified,
                            "tenantid":tenant_id,
                            "officeId":office_id,
                            #"loggedInUserId":user_id_2,
                            "createdBy":130,
                            #"createdDate":current_date,
                            #"userByLastupdatedbyStr":user_id,
                            #"lastUpdatedDate":current_date,
                            "lastUpdatedBy":130,
                        }

            print(json_input)
            
            if booking_input:
                api_url = f"{base_url}/{end_point}"
                try:
                    api_resp = requests.post(api_url, json=json_input, verify=False)
                    
                    field_name_mapping = {
                        'awbno': 'AWB Number',
                        'bookingno': 'Booking Number',
                        'tempbookingno': 'Booking Ref',
                        'awbrefno': 'AWB Ref',
                        'awbFrom': 'Booking Date',
                        'awbtype': 'AWB Type',
                        'shippername': 'Shipper',
                        'status': 'Status',
                    }

                    if api_resp.status_code == 200:
                        api_data = api_resp.json()

                        fields_to_print = ['awbno', 'bookingno', 'tempbookingno', 'awbrefno', 'awbFrom', 'awbtype', 'shippername', 'status']
                        
                        extracted_data_all_lists = []

                        for data_item in api_data:
                            extracted_data = {}
                            for field in fields_to_print:
                                mapped_field = field_name_mapping.get(field, field).upper()
                                value = data_item.get(field, 'Not available')
                                
                                if field == 'awbtype':
                                    if value == 1:
                                        value = 'HOUSE'
                                    elif value == 2:
                                        value = 'MASTER'
                                
                                extracted_data[mapped_field] = value

                            extracted_data_all_lists.append(extracted_data)

                        extracted_data_all_lists_json = json.dumps(extracted_data_all_lists, indent=4)
                        print(extracted_data_all_lists_json)
                        response = extracted_data_all_lists_json

                    else:
                        response = f"Error: Failed to get a response from the API. Status code: {api_resp.status_code}"

                except requests.exceptions.SSLError as ssl_error:
                    response = f"SSL Error: {ssl_error}"
                except requests.exceptions.RequestException as request_error:
                    response = f"Error: Failed to call the API - {request_error}"
            else:
                response = 'Error: Booking number is missing or invalid.'
                
        elif isinstance(user_input, dict) and any(key in user_input for key in ['enqenquiry_number', 'enqcontact_name', 'enqcompany', 'enqfrom_date', 'enqto_date']):
            enquiry_input = {}
            for key in ['enqenquiry_number', 'enqcontact_name', 'enqcompany', 'enqfrom_date', 'enqto_date']:
                if key in user_input:
                    enquiry_input[key] = user_input[key]
            tenant_id = user_input['tenantid']
            office_id = user_input['officeid']
            end_point = 'searchenquiry'
            base_url = user_input['environment']
            print('enq', enquiry_input)
            
            enquiry_input_modified = {
                'enquiryno': enquiry_input.get('enqenquiry_number', ''),
                'created_date_from': enquiry_input.get('enqfrom_date', ''),
                'searchCompany': enquiry_input.get('enqcompany', ''),
                'searchName': enquiry_input.get('enqcontact_name', ''),
                'created_date_to': enquiry_input.get('enqto_date', '') 
            }

            json_input = {
                        **enquiry_input_modified,
                        "officeId": office_id,
                        "tenantid": tenant_id,
                        }
            
            print(json_input)
            
            if enquiry_input is not None:
                api_url = f"{base_url}/{end_point}"
                try:
                    api_resp = requests.post(api_url, json=json_input, verify=False)
                    
                    field_name_mapping = {
                        'enquiryno': 'Enquiry Number',
                        'searchCompany': 'Company',
                        'searchorigin': 'Origin',
                        'searchdestination': 'Destination',
                        'searchshipmenttype': 'Shipment Type',
                        'placeOfLoading': 'Port of Loading',
                        'placeOfDelivey': 'Port of Discharge',
                        'created_date': 'Created Date',
                        'quotationSent': 'Quotation Sent',
                        'progress_update': 'Enquiry Prospect',
                        'status': 'Status',
                    }

                    if api_resp.ok: 
                        api_data = api_resp.json()

                        fields_to_print = ['enquiryno', 'searchCompany', 'searchorigin', 'searchdestination', 'searchshipmenttype',
                                        'placeOfLoading', 'placeOfDelivey', 'created_date', 'quotationSent', 'progress_update', 'status']

                        extracted_data_all_lists = []

                        for data_item in api_data:
                            extracted_data = {}
                            for field in fields_to_print:
                                mapped_field = field_name_mapping.get(field, field).upper()
                                if field == 'created_date':
                                    timestamp = int(data_item.get(field, 'Not available')) / 1000
                                    extracted_data[mapped_field] = datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d')
                                elif field == 'progress_update':
                                    progress_value = data_item.get(field, 'Not available')
                                    if progress_value == 'H':
                                        extracted_data[mapped_field] = "HOT"
                                    elif progress_value == 'W':
                                        extracted_data[mapped_field] = "WARM"
                                    elif progress_value == 'C':
                                        extracted_data[mapped_field] = "COLD"
                                    else:
                                        extracted_data[mapped_field] = progress_value
                                else:
                                    extracted_data[mapped_field] = data_item.get(field, 'Not available')

                            extracted_data_all_lists.append(extracted_data)

                        extracted_data_all_lists_json = json.dumps(extracted_data_all_lists, indent=4)
                        #print(extracted_data_all_lists_json)

                        response += extracted_data_all_lists_json
                        
                    else:
                        response = ('Error: Failed to get a response from the API. Status code:', api_resp.status_code)
                        
                except requests.exceptions.SSLError as ssl_error:
                    response = f"SSL Error: {ssl_error}"
                except requests.exceptions.RequestException as e:
                    response = ('Error: Failed to call the API -', str(e))
            else:
                response = (f'Error: {key} is missing or invalid.')
                
        elif isinstance(user_input, dict) and any(key in user_input for key in ['leadcompany_name', 'leadsales_executive', 'leadfrom_date', 'leadto_date']):
            lead_input = {}
            print(user_input)
            print('entered lead')
            for key in ['leadcompany_name', 'leadsales_executive', 'leadfrom_date', 'leadto_date']:
                if key in user_input:
                    lead_input[key] = user_input[key]
            tenant_id = user_input['tenantid']
            office_id = user_input['officeid']
            end_point = 'searchleadcompany'
            base_url = user_input['environment']
            
            lead_input_modified = {
                'name': lead_input.get('leadcompany_name', ''),
                'fromdate': lead_input.get('leadfrom_date', ''),
                'toDate': lead_input.get('leadto_date', '') 
            }

            json_input = {
                        **lead_input_modified,
                        "officeId": office_id,
                        "tenantid": tenant_id,
                        }
            
            print(json_input)
            
            if lead_input:
                api_url = f"{base_url}/{end_point}"
                try:
                    api_resp = requests.post(api_url, json=json_input, verify=False)
                    
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

                    if api_resp.ok: 
                        api_data = api_resp.json()

                        fields_to_print = ['name', 'city', 'country', 'webSite', 'prospect', 'salescontactstring', 'createddate', 'followUpDate', 'leadSource']

                        extracted_data_all_lists = []

                        for data_item in api_data:
                            extracted_data = {}
                            for field in fields_to_print:
                                mapped_field = field_name_mapping.get(field, field).upper()
                                if field == 'createddate':
                                    timestamp = int(data_item.get(field, 'Not available')) / 1000
                                    extracted_data[mapped_field] = datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d')
                                else:
                                    extracted_data[mapped_field] = data_item.get(field, 'Not available')

                            extracted_data_all_lists.append(extracted_data)

                        extracted_data_all_lists_json = json.dumps(extracted_data_all_lists, indent=4)

                        response += extracted_data_all_lists_json
                        
                    else:
                        response = ('Error: Failed to get a response from the API. Status code:', api_resp.status_code)

                except requests.exceptions.SSLError as ssl_error:
                    response = f"SSL Error: {ssl_error}"
                except requests.exceptions.RequestException as e:
                    response = ('Error: Failed to call the API -', str(e))
            else:
                response = ('Error: Prospect is missing or invalid.')
                
        elif isinstance(user_input, dict) and any(key in user_input for key in ['sellcompany', 'sellfrom_date', 'sellto_date', 'selldirect_purchase', 'sellindirect_purchase']):
            sell_input = {}
            for key in ['sellcompany', 'sellfrom_date', 'sellto_date', 'selldirect_purchase', 'sellindirect_purchase']:
                if key in user_input:
                    sell_input[key] = user_input[key]
            tenant_id = user_input['tenantid']
            office_id = user_input['officeid']
            end_point = 'searchBuyingBillByQuery'
            base_url = user_input['environment']
            
            sell_input_modified = {
                'payableToName': sell_input.get('sellcompany', ''),
                'fromDate': sell_input.get('sellfrom_date', ''),
                'toDate': sell_input.get('sellto_date', ''), 
            }
            
            for key, value in user_input.items():
                if key == 'selldirect_purchase':
                    sell_input_modified['purchasetype'] = value
                elif key == 'sellindirect_purchase':
                    sell_input_modified['purchasetype'] = value

            json_input = {
                        **sell_input_modified,
                        "officeId": office_id,
                        "tenantid": tenant_id,
                        }
            
            print(json_input)
            
            if sell_input:
                api_url = f"{base_url}/{end_point}"
                try:
                    api_resp = requests.post(api_url, json=json_input, verify=False)
                    
                    field_name_mapping = {
                        'billno': 'Bill Number',
                        'billDate': 'Bill Date',
                        'bookingno': 'Booking Number',
                        'statuscode': 'Status',
                        'company': 'Company',
                        'billTypeName': 'Bill Type',
                        'indentAvailable': 'Indent',
                        'nettotal': 'Amount',    
                    }

                    if api_resp.ok: 
                        api_data = api_resp.json()

                        fields_to_print = ['billno', 'billDate', 'bookingno', 'statuscode', 'company', 'billTypeName', 'indentAvailable', 'nettotal']

                        extracted_data_all_lists = []

                        for data_item in api_data:
                            extracted_data = {}
                            for field in fields_to_print:
                                mapped_field = field_name_mapping.get(field, field).upper()
                                extracted_data[mapped_field] = data_item.get(field, 'Not available')

                            extracted_data_all_lists.append(extracted_data)

                        extracted_data_all_lists_json = json.dumps(extracted_data_all_lists, indent=4)

                        print(extracted_data_all_lists_json)

                        response += extracted_data_all_lists_json
                        
                    else:
                        response = ('Error: Failed to get a response from the API. Status code:', api_resp.status_code)

                except requests.exceptions.SSLError as ssl_error:
                    response = f"SSL Error: {ssl_error}"
                except requests.exceptions.RequestException as e:
                    response = ('Error: Failed to call the API -', str(e))
            else:
                response = ('Error: Prospect is missing or invalid.')
                
        elif isinstance(user_input, dict) and any(key in user_input for key in ['buybill_number', 'buybooking_number', 'buybooking_ref', 'buyinvoice_number', 'buycompany_name', 'buyfrom_date', 'buyto_date', 'buycontainer_number', 'buysb_number', 'buybe_number', 'buyhbl_number', 'buymbl_number', 'buyhawb_number', 'buymawb_number']):
            buy_input = {}
            for key in ['buybill_number', 'buybooking_number', 'buybooking_ref', 'buyinvoice_number', 'buycompany_name', 'buyfrom_date', 'buyto_date', 'buycontainer_number', 'buysb_number', 'buybe_number', 'buyhbl_number', 'buymbl_number', 'buyhawb_number', 'buymawb_number']:
                if key in user_input:
                    buy_input[key] = user_input[key]
            tenant_id = user_input['tenantid']
            office_id = user_input['officeid']
            end_point = 'searchBookingBill'
            base_url = user_input['environment']
            
            buy_input_modified = {
                'billNo': buy_input.get('buybill_number', ''),
                'benos': buy_input.get('buybe_number', ''),
                'billfromdate': buy_input.get('buyfrom_date', ''),
                'billtodate': buy_input.get('buyto_date', ''),
                'bookingno': buy_input.get('buybooking_number', ''),
                'containernos': buy_input.get('buycontainer_number', ''),
                'hawbno': buy_input.get('buyhawb_number', ''),
                'hblno': buy_input.get('buyhbl_number', ''),
                'invoiceno': buy_input.get('buyinvoice_number', ''),
                'mawbno': buy_input.get('buymawb_number', ''),
                'mblno': buy_input.get('buymbl_number', ''),
                'searchCompanyName': buy_input.get('buycompany_name', ''),
                'shippingbillnos': buy_input.get('buysb_number', ''),
                'tempbookingno': buy_input.get('buybooking_ref', ''),
            }

            json_input = {
                        **buy_input_modified,
                        "officeId": office_id,
                        "tenantid": tenant_id,
                        "orderby": "BILL_NO",
                        }
            
            print(json_input)
            
            if buy_input:
                api_url = f"{base_url}/{end_point}"
                try:
                    api_resp = requests.post(api_url, json=json_input, verify=False)
                    
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

                        response += extracted_data_all_lists_json
                                        
                    else:
                        response = ('Error: Failed to get a response from the API. Status code:', api_resp.status_code)

                except requests.exceptions.SSLError as ssl_error:
                    response = f"SSL Error: {ssl_error}"
                except requests.exceptions.RequestException as e:
                    response = ('Error: Failed to call the API -', str(e))
            else:
                response = ('Error: Prospect is missing or invalid.')
        
        elif isinstance(user_input, dict) and any(key in user_input for key in ['quoquotation_number', 'quoquotation_ref', 'quocontact_name', 'quocompany', 'quofrom_date', 'quoto_date']):
            Quotation_input = {}
            for key in ['quoquotation_number', 'quoquotation_ref', 'quocontact_name', 'quocompany', 'quofrom_date', 'quoto_date']:
                if key in user_input:
                    Quotation_input[key] = user_input[key]
            tenant_id = user_input['tenantid']
            office_id = user_input['officeid']
            end_point = 'searchquotation'
            base_url = user_input['environment']
            
            Quotation_input_modified = {
                'searchQuotationNo': Quotation_input.get('quoquotation_number', ''),
                'searchQuotationRefNo': Quotation_input.get('quoquotation_ref', ''),
                'searchCompany': Quotation_input.get('quocompany', ''),
                'searchQuotationFromDate': Quotation_input.get('quofrom_date', ''),
                'searchQuotationToDate': Quotation_input.get('quoto_date', '') 
            }
            
            json_input = {
                        **Quotation_input_modified,
                        "officeId": office_id,
                        "tenantid": tenant_id,
                        }
            
            print(json_input)
            
            if Quotation_input is not None:
                api_url = f"{base_url}/{end_point}"
                try:
                    api_resp = requests.post(api_url, json=json_input, verify=False)
                    
                    field_name_mapping = {
                        'quotationno': 'Quotation Number',
                        'quotationdate': 'Quotation Date',
                        'searchCompany': 'Search Company',
                        'searchName': 'Contact Name',
                        'searchShipmentType': 'Shipment Type',
                        'natureOfContract': 'Shipment Term',
                        'searchOrigin': 'Origin',
                        'searchDestination': 'Destination',
                        'status': 'Status',
                    }

                    if api_resp.ok: 
                        api_data = api_resp.json()

                        fields_to_print = ['quotationno', 'quotationdate', 'searchCompany', 'searchName', 'searchShipmentType', 'natureOfContract', 'searchOrigin', 'searchDestination', 'status']

                        extracted_data_all_lists = []

                        for data_item in api_data:
                            extracted_data = {}
                            for field in fields_to_print:
                                mapped_field = field_name_mapping.get(field, field).upper()
                                extracted_data[mapped_field] = data_item.get(field, 'Not available')

                            extracted_data_all_lists.append(extracted_data)

                        extracted_data_all_lists_json = json.dumps(extracted_data_all_lists, indent=4)

                        #print(extracted_data_all_lists_json)

                        response += extracted_data_all_lists_json
                        
                    else:
                        response = ('Error: Failed to get a response from the API. Status code:', api_resp.status_code)

                except requests.exceptions.SSLError as ssl_error:
                    response = f"SSL Error: {ssl_error}"
                except requests.exceptions.RequestException as e:
                    response = ('Error: Failed to call the API -', str(e))
            else:
                response = ('Error: Quotation Number is missing or invalid.')
                
        elif isinstance(user_input, dict):
            if any(key.startswith('general') for key in user_input.keys()):
                for key, value in user_input.items():
                    if key.startswith('general'):
                        if value == 'refresh':
                            generate_response(user_input)
                            #extarct_from_response_enq(value)
                            #extarct_from_response(value)
                            #extarct_from_response_quo(value)
                        else:
                            new_general_input = GeneralInput(
                                user_input=user_input.get('general'),
                                date=user_input.get('current_date'),
                                tenantid=int(user_input.get('tenantid')),
                                officeid=int(user_input.get('officeid')),
                                username=user_input.get('userid')
                            )
                            db.session.add(new_general_input)
                            db.session.commit()
                            uri = 'http://127.0.0.1:9604/notify'
                            json_data = {'tableName': 'GENERAL_QS_TBL', 'type': 'INSERT', 'message': 'inserted a new record <br> "' + user_input.get('general') + '"', 'current_date': user_input.get('current_date'), 'tenantid': user_input.get('tenantid'), 'officeid': user_input.get('officeid'), 'username': '<span style="color: #007bff; font-weight: bold;">' + user_input.get('userid') + '&nbsp;</span>'} 
                            response2 = send_json_to_uri(uri, json_data)
                            print(response2)
                            response = generate_response(user_input)
                        # Update the response in the database
                        if response:
                            new_general_input.response = response
                            db.session.commit()
            
        end_time = time.time()
        response_time = end_time - start_time
        logging.info("Response time: %.2f seconds", response_time)
        if not isinstance(response, list or tuple):
            response = response.replace('null', '')
        return jsonify({'response': response})
    
    except Exception as e:
        logging.error("An error occurred in chat(): %s", str(e))
        return jsonify({'response': 'An error occurred'}), 500
