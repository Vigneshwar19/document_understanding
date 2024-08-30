from flask import Blueprint, request, jsonify
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from collections import Counter
import logging
import os

buy_anomaly_bp = Blueprint("buy_anomaly_bp", __name__)

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

log_file_path = os.path.join("C:\\Python\\ANOMALY_DETECTION\\logger", "buy_anomaly_logger.log")

file_handler = logging.FileHandler(log_file_path)
file_handler.setLevel(logging.INFO)

# Create a logging format
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
file_handler.setFormatter(formatter)

# Add the file handler to the logger
logger.addHandler(file_handler)

@buy_anomaly_bp.route('/api/buy/predict', methods=['POST'])
def predict():
    results = []
    input = request.json
    logger.info(f"Received request: {input}")
    print(input)

    input_order = [
        "tenantid", "officeId", "payToName", "payFromName", "buybillType", "discount", "tdsTax",
        "netTotal", "serviceTax", "grossTotal", "billItems", "environment"
    ]
    
    input_json = {}
    try:
        for key in input_order:
            input_json[key] = input[key]
    except KeyError as e:
            return {'error': str(e) + ' column not present in input JSON'}, 500
    try:
        if input_json['environment'] == "screen":        
            csv_path = r"C:\Python\ANOMALY_DETECTION\app\test_data\buy.csv"
            print(csv_path)
        elif input_json['environment'] == "EZEEAPP":        
            csv_path = r"C:\Python\ANOMALY_DETECTION\app\uploads\buy.csv"
            print(csv_path)
        
        df = pd.read_csv(csv_path)
        
        categorical_col = ["tenantid", "officeId"]
        #print(df['tenantid'])
        
        for col in categorical_col:
            if input_json[col] not in df[col].values:
                if col == 'tenantid':
                    col_display = 'PAY FROM'
                    col = 'payFromName'
                elif col == 'officeId':
                    col_display = 'PAY TO'
                    col = 'payToName'
                result = {
                            'value': '',
                            'predicted_value': '',
                            'field': col,
                            'message': f"Kindly check the <span style='color: red; font-weight: bold;'>{col_display}</span> because it looks like an ubnormal entry<br><br><span style='color: black; font-weight: bold;'>{col_display}</span> - <span style='color: red; font-weight: bold;'>{input_json[col]}</span>",
                            'noted_as': False
                        }
                print(col)
                results.append(result)

        categorical_columns = ['payToName', 'payFromName']
        label_encoders = {col_name: LabelEncoder() for col_name in categorical_columns}
            
        for col in categorical_columns:
            label_encoders[col].fit(df[col])
            df[col] = label_encoders[col].transform(df[col])
        
        encoded_input = {}
        
        for col in categorical_columns:
            try:
                encoded_input[col] = label_encoders[col].transform([input_json[col]])[0]
            except ValueError:
                if col == 'payToName':
                    col_display = 'PAY TO'
                elif col == 'payFromName':
                    col_display = 'PAY FROM'
                    print(col)
                else:
                    col_display = col
                result = {
                            'value': '',
                            'predicted_value': '',
                            'field': col,
                            'message': f"Kindly check the <span style='color: red; font-weight: bold;'>{col_display}</span> because it looks like an ubnormal entry<br><br><span style='color: black; font-weight: bold;'>{col_display}</span> - <span style='color: red; font-weight: bold;'>{input_json[col]}</span>",
                            'noted_as': False
                        }
                print(col)
                encoded_input[col] = len(label_encoders[col].classes_)
                results.append(result)
        if "billItems" in input_json:
            rate_values = input_json["billItems"].split(";")
            encoded_input["billItems"] = ";".join([str(i) for i in rate_values])

        numerical_columns = ['discount', 'tdsTax', 'netTotal', 'serviceTax', 'grossTotal']

        for col in numerical_columns:
                bill_from_name = encoded_input['payFromName']
                bill_to_name = encoded_input['payToName']
                tenantid = input_json['tenantid']
                officeId = input_json['officeId']

                filtered_df = df[(df['payFromName'] == bill_from_name) & (df['payToName'] == bill_to_name) & (df['tenantid'] == tenantid) & (df['officeId'] == officeId)]

                if filtered_df.empty:
                    result = {
                        'value': '',
                        'predicted_value': '',
                        'field': 'bill',
                        'message': f"Kindly check these:<br><br><span style='color: black; font-weight: bold;'>PAY FROM - </span><span style='color: red; font-weight: bold;'>{input_json['payFromName']}</span><br><span style='color: black; font-weight: bold;'>PAY TO - </span><span style='color: red; font-weight: bold;'>{input_json['payToName']}</span><br><br>Because they're not in combination before",
                        'noted_as': False
                    }
                    results.append(result)
                    break
                else:
                    if col != 'billType':
                        min_val = filtered_df[col].min()
                        max_val = filtered_df[col].max()

                        if not ((min_val <= input_json[col]) & (input_json[col] <= max_val)).any():
                            if col == 'discount':
                                col_display = 'DISCOUNT'
                            elif col == 'tdsTax':
                                col_display = 'TDS TAX'
                            elif col == 'serviceTax':
                                col_display = 'SERVICE TAX'
                            elif col == 'netTotal':
                                col_display = 'NET TOTAL'
                            elif col == 'grossTotal':
                                col_display = 'GROSS TOTAL'
                            else:
                                col_display = col
                            result = {
                                'value': '',
                                'predicted_value': '',
                                'field': col,
                                'message': f"Kindly check the <span style='color: red; font-weight: bold;'>{col_display}</span> because it look like an ubnormal entry<br><br><span style='color: black; font-weight: bold;'>{col_display}</span> - <span style='color: red; font-weight: bold;'>{input_json[col]}</span>",
                                'noted_as': False
                            }
                            results.append(result)
                            
        def strip_spaces(s):
            return {item.replace(" ", "") for item in s}

        if (df['buybillType'] == input_json['buybillType']).any():
            if 'billItems' in input_json:
                rate_in = encoded_input['billItems'].split(';')

                if not filtered_df.empty:
                    filtered_d = df[(df['payFromName'] == bill_from_name) & (df['payToName'] == bill_to_name) & (df['buybillType'] == input_json['buybillType'])]
                    existing_rate = [item.strip() for item in filtered_d['billItems'].iloc[-1].split(';') if item.strip()]
                    unique_billItems = [item.strip() for item in ';'.join(filtered_d['billItems']).split(';') if item.strip()]

                    # Filter out empty strings from rate_in and existing_rate
                    rate_in_filtered = [item.strip() for item in rate_in if item.strip()]
                    existing_rate_filtered = [item.strip() for item in existing_rate if item.strip()]

                    # Checking for intersection without considering spaces
                    if set(strip_spaces(rate_in_filtered)).intersection(set(strip_spaces(unique_billItems))):
                        if set(strip_spaces(rate_in_filtered)).intersection(set(strip_spaces(existing_rate_filtered))):
                            existing_rate_count = Counter(strip_spaces(existing_rate_filtered))
                            rate_in_count = Counter(strip_spaces(rate_in_filtered))

                            missing_values = []
                            for item, count in existing_rate_count.items():
                                if item not in rate_in_count or existing_rate_count[item] > rate_in_count[item]:
                                    missing_values.extend([item] * (existing_rate_count[item] - rate_in_count[item]))

                            additional_values = []
                            for item, count in rate_in_count.items():
                                if item not in existing_rate_count or rate_in_count[item] > existing_rate_count[item]:
                                    additional_values.extend([item] * (rate_in_count[item] - existing_rate_count[item]))
                            

                            if additional_values and missing_values:
                                result = {
                                    'value': '',
                                    'predicted_value': '',
                                    'field': 'billItems',
                                    'message': f"You have added these in your bill items now<br><span style='color: red; font-weight: bold;'> - {'<br> - '.join([item for item in rate_in_filtered if strip_spaces([item]).intersection(set(additional_values))])}</span><br><br>You have missed these in your bill items now<br><span style='color: red; font-weight: bold;'> - {'<br> - '.join([item for item in existing_rate_filtered if strip_spaces([item]).intersection(set(missing_values))])}</span><br><br>Because your last BILL ITEMS are<br><span style='color: red; font-weight: bold;'> - {'<br> - '.join(existing_rate)}</span>",
                                    'noted_as': False
                                }
                                results.append(result)
                            elif missing_values:
                                result = {
                                    'value': '',
                                    'predicted_value': '',
                                    'field': 'billItems',
                                    'message': f"You have missed these in your bill items now<br><span style='color: red; font-weight: bold;'> - {'<br> - '.join([item for item in existing_rate_filtered if strip_spaces([item]).intersection(set(missing_values))])}</span><br><br>Because your last BILL ITEMS are<br><span style='color: red; font-weight: bold;'> - {'<br> - '.join(existing_rate)}</span>",
                                    'noted_as': False
                                }
                                results.append(result)
                            elif additional_values:
                                result = {
                                    'value': '',
                                    'predicted_value': '',
                                    'field': 'billItems',
                                    'message': f"You have added these in your bill items now<br><span style='color: red; font-weight: bold;'> - {'<br> - '.join([item for item in rate_in_filtered if strip_spaces([item]).intersection(set(additional_values))])}</span><br><br>Because your last BILL ITEMS are<br><span style='color: red; font-weight: bold;'> - {'<br> - '.join(existing_rate)}</span>",
                                    'noted_as': False
                                }
                                results.append(result)
                        else:
                            result = {
                                'value': '',
                                'predicted_value': '',
                                'field': 'billItems',
                                'message': f"These Are not in your last BILL ITEMS<br><span style='color: red; font-weight: bold;'> - {'<br> - '.join(rate_in_filtered)}</span><br><br>Your last BILL ITEMS are<br><span style='color: red; font-weight: bold;'> - {'<br> - '.join(existing_rate)}</span>",
                                'noted_as': False
                            }
                            results.append(result)
                    else:
                        result = {
                            'value': '',
                            'predicted_value': '',
                            'field': 'billItems',
                            'message': f"In Your BILL ITEMS<br><span style='color: red; font-weight: bold;'> - {'<br> - '.join(rate_in_filtered)}</span><br><br>look like an ubnormal entry because your last BILL ITEMS<br><span style='color: red; font-weight: bold;'> - {'<br> - '.join(existing_rate)}</span>",
                            'noted_as': False
                        }
                        results.append(result)
        else:
            result = {
                'value': '',
                'predicted_value': '',
                'field': 'buybillType',
                'message': f"Kindly check the <span style='color: red; font-weight: bold;'>BUY BILL TYPE</span> because it look like an ubnormal entry<br><br><span style='color: black; font-weight: bold;'>BUY BILL TYPE</span> - <span style='color: red; font-weight: bold;'>{input_json['buybillType']}</span>",
                'noted_as': False
            }
            results.append(result)
                    
        '''if not filtered_df.empty:
            bill_address_id = input_json['billtoaddress']
            origin = input_json['origin']
            destination = input_json['destination']
            
            filtered_f = df[(df['billtoaddress'] == bill_address_id) & (df['origin'] == origin) & (df['destination'] == destination)]
            
            igst_previously_entered = (filtered_f['totalIgst'] > 0).any()
            cgst_sgst_previously_entered = ((filtered_f['totalCgst'] > 0).any() or (filtered_f['totalSgst'] > 0).any())
            
            current_igst = (input_json['totalIgst'] > 0)
            current_cgst_sgst = ((input_json['totalCgst'] > 0) or (input_json['totalSgst'] > 0))
            
            if igst_previously_entered and current_cgst_sgst:
                result = {
                    'value': '',
                    'predicted_value': '',
                    'field': "error",
                    'message': f"Before, you entered <span style='color: red; font-weight: bold;'>IGST</span> for this type of invoice",
                    'noted_as': False
                }
                results.append(result)
            elif cgst_sgst_previously_entered and current_igst:
                result = {
                    'value': '',
                    'predicted_value': '',
                    'field': "error",
                    'message': f"Before, you entered <span style='color: red; font-weight: bold;'>CGST</span> and <span style='color: red; font-weight: bold;'>SGST</span> for this type of invoice",
                    'noted_as': False
                }
                results.append(result)'''
        
        combination_exists = df[(df['payToName'] == encoded_input['payToName']) &
                                (df['payFromName'] == encoded_input['payFromName']) &
                                (df['buybillType'] == input_json['buybillType'])].shape[0] > 0

        if not combination_exists:
            result = {
                            'value': '',
                            'predicted_value': '',
                            'field': "Combination",
                            'message': f"Combination is <span style='color: red; font-weight: bold;'>new!</span> check it once",
                            'noted_as': False
                        }
            results.append(result)
        elif combination_exists:
            result = {
                            'value': '',
                            'predicted_value': '',
                            'field': "Combination",
                            'message': f"Combination checked",
                            'noted_as': True
                        }
            results.append(result)
                
    except Exception as e:
        logger.exception("An error occurred during prediction:", e)
        return {'errrr': str(e)}, 500
    
    #print(results)
    final_result = ''
    
    all_checked = all('checked' in item['message'].lower() for item in results)
    if all_checked:
        final_result += ("all checked")
    else:
        final_result += ("<b>AS PER OUR <span style='color: #009900;'>AI</span> MODEL, THE BELOW INVOICE DETAILS DOESN'T MATCH WITH PREVIOUS SIMILAR INVOICES.</b>") + '<br><br>'
        for item in results:
            if 'checked' not in item['message'].lower():
                final_result += (f"<b>{item['message']}</b>").upper() + '<br>'
                break
    #print(final_result)
    logger.info(f"response: {final_result}")
    
    return jsonify(final_result)