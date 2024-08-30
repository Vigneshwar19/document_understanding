from flask import Blueprint, request, jsonify
import pandas as pd
from sklearn.preprocessing import LabelEncoder
from collections import Counter
import joblib
import logging
import os

anomaly_bp = Blueprint("anomaly_bp", __name__)

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

log_file_path = os.path.join("C:\\Python\\ANOMALY_DETECTION\\logger", "anomaly_logger.log")

file_handler = logging.FileHandler(log_file_path)
file_handler.setLevel(logging.INFO)

# Create a logging format
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
file_handler.setFormatter(formatter)

# Add the file handler to the logger
logger.addHandler(file_handler)

@anomaly_bp.route('/api/bill/predict', methods=['POST'])
def predict():
    md_name = ['linear_regression_model_totaligst.pkl','linear_regression_model_totalcgst.pkl','linear_regression_model_totalsgst.pkl','linear_regression_model_nettotal.pkl','linear_regression_model_taxtotal.pkl', 'linear_regression_model_grosstotal.pkl']
    results = []
    input = request.json
    logger.info(f"Received request: {input}")
    print("input: ", input)
    input_order = [
        "tenantid", "officeId", "shipperName", "consigneeName", "billAdressID", "billToName",
        "billFromName", "shipmentType", "grossWt", "netWt", "chargeWt",
        "currency", "billType", "placeOfSupply", "isSez", "taxExemption",
        "totalIgst", "totalCgst", "totalSgst", "netTotal", "taxTotal",
        "grossTotal", "origin", "destination", "billItems", "billTypeDesc", "billtoaddress", "environment"
    ]
    
    input_json = {}
    try:
        for key in input_order:
            input_json[key] = input[key]
    except KeyError as e:
            return {'error': str(e) + ' column not present in input JSON'}, 500
    try:
        if input_json['environment'] == "screen":        
            csv_path = r"C:\Python\ANOMALY_DETECTION\app\test_data\test.csv"
            print(csv_path)
        elif input_json['environment'] == "EZEEAPP":        
            csv_path = r"C:\Python\ANOMALY_DETECTION\app\uploads\output.csv"
            print(csv_path)
        
        df = pd.read_csv(csv_path)
        
        categorical_col = ["tenantid", "officeId"]
        #print(df['tenantid'])
        
        for col in categorical_col:
            if input_json[col] not in df[col].values:
                if col == 'tenantid':
                    col_display = 'BILL FROM'
                    col = 'billFromName'
                elif col == 'officeId':
                    col_display = 'BILL TO'
                    col = 'billToName'
                result = {
                            'value': '',
                            'predicted_value': '',
                            'field': col,
                            'message': f"Kindly check the <span style='color: red; font-weight: bold;'>{col_display}</span> because it looks like an ubnormal entry<br><br><span style='color: black; font-weight: bold;'>{col_display}</span> - <span style='color: red; font-weight: bold;'>{input_json[col]}</span>",
                            'noted_as': False
                        }
                print(col)
                results.append(result)

        categorical_columns = ['billToName', 'billFromName']
        label_encoders = {col_name: LabelEncoder() for col_name in categorical_columns}
            
        for col in categorical_columns:
            label_encoders[col].fit(df[col])
            df[col] = label_encoders[col].transform(df[col])
        
        encoded_input = {}
        
        for col in categorical_columns:
            try:
                encoded_input[col] = label_encoders[col].transform([input_json[col]])[0]
            except ValueError:
                if col == 'billToName':
                    col_display = 'BILL TO'
                elif col == 'billFromName':
                    col_display = 'BILL FROM'
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

        numerical_columns = ['billType', 'totalCgst', 'totalSgst', 'totalIgst', 'netTotal', 'taxTotal', 'grossTotal']

        for col in numerical_columns:
                bill_from_name = encoded_input['billFromName']
                bill_to_name = encoded_input['billToName']
                bill_address_id = input_json['billAdressID']
                tenantid = input_json['tenantid']
                officeId = input_json['officeId']

                filtered_df = df[(df['billFromName'] == bill_from_name) & (df['billToName'] == bill_to_name) & (df['billAdressID'] == bill_address_id) & (df['tenantid'] == tenantid) & (df['officeId'] == officeId)]
                #print(filtered_df[['billFromName', 'billToName', 'tenantid', 'officeId']])

                if filtered_df.empty:
                    result = {
                        'value': '',
                        'predicted_value': '',
                        'field': 'bill',
                        'message': f"Kindly check these:<br><br><span style='color: black; font-weight: bold;'>BILL FROM - </span><span style='color: red; font-weight: bold;'>{input_json['billFromName']}</span><br><span style='color: black; font-weight: bold;'>BILL TO - </span><span style='color: red; font-weight: bold;'>{input_json['billToName']}</span><br><span style='color: black; font-weight: bold;'>BILL ADDRESS ID - </span><span style='color: red; font-weight: bold;'>{input_json['billtoaddress']}</span><br><br>Because they're not in combination before",
                        'noted_as': False
                    }
                    results.append(result)
                    break
                else:
                    if col != 'billType':
                        min_val = filtered_df[col].min()
                        max_val = filtered_df[col].max()

                        if not ((min_val <= input_json[col]) & (input_json[col] <= max_val)).any():
                            if col == 'totalIgst':
                                col_display = 'IGST'
                            elif col == 'totalCgst':
                                col_display = 'CGST'
                            elif col == 'totalSgst':
                                col_display = 'SGST'
                            elif col == 'netTotal':
                                col_display = 'NET TOTAL'
                            elif col == 'taxTotal':
                                col_display = 'TAX TOTAL'
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

        if (df['billTypeDesc'] == input_json['billTypeDesc']).any():
            if 'billItems' in input_json:
                rate_in = encoded_input['billItems'].split(';')

                if not filtered_df.empty:
                    filtered_d = df[(df['billAdressID'] == bill_address_id) & (df['billFromName'] == bill_from_name) & (df['billToName'] == bill_to_name) & (df['shipmentType'] == input_json['shipmentType']) & (df['billTypeDesc'] == input_json['billTypeDesc'])]
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
                'field': 'billTypeDesc',
                'message': f"Kindly check the <span style='color: red; font-weight: bold;'>BILL TYPE</span> because it look like an ubnormal entry<br><br><span style='color: black; font-weight: bold;'>BILL TYPE</span> - <span style='color: red; font-weight: bold;'>{input_json['billTypeDesc']}</span>",
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
        
        combination_exists = df[(df['billToName'] == encoded_input['billToName']) &
                                (df['billFromName'] == encoded_input['billFromName']) &
                                (df['billTypeDesc'] == input_json['billTypeDesc'])].shape[0] > 0

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
        
    for i in range(len(md_name)):
        model_path = f'C:\\Python\\ANOMALY_DETECTION\\app\\Models_db\\{md_name[i]}'
        model = joblib.load(model_path)
        model = joblib.load(model_path)

        input_json_copy = input_json.copy()
                
        if 'linear_regression_model_grosswt.pkl' in md_name[i]:
            target_field = 'grossWt'
        elif 'linear_regression_model_netwt.pkl' in md_name[i]:
            target_field = 'netWt'
        elif 'linear_regression_model_chargewt.pkl' in md_name[i]:
            target_field = 'chargeWt'
        elif 'linear_regression_model_nettotal.pkl' in md_name[i]:
            target_field = 'netTotal'
        elif 'linear_regression_model_grosstotal.pkl' in md_name[i]:
            target_field = 'grossTotal'
        elif 'linear_regression_model_taxtotal.pkl' in md_name[i]:
            target_field = 'taxTotal'
        elif 'linear_regression_model_totalsgst.pkl' in md_name[i]:
            target_field = 'totalSgst'
        elif 'linear_regression_model_totaligst.pkl' in md_name[i]:
            target_field = 'totalIgst'
        elif 'linear_regression_model_totalcgst.pkl' in md_name[i]:
            target_field = 'totalCgst'
                
        remov = ["tenantid", "officeId", 'shipperName', 'consigneeName', 'billAdressID', 'billToName', 'billFromName', 'shipmentType', 'currency', 'billType', 'placeOfSupply', 'isSez', 'taxExemption', 'origin', 'destination', 'billItems', 'billTypeDesc', 'billtoaddress', 'environment',target_field]
                
        target_value = {}
        for field in remov:
            if field in input_json_copy:
                target_value[field] = input_json_copy.pop(field)
                
        input_df_copy = pd.DataFrame([input_json_copy])

        pred_lr = model.predict(input_df_copy)
        
        result = {}
        if pred_lr[0] < 1:
            pred_lr[0] = 0
                        
        result['value'] = input_json[target_field]
        result['predicted_value'] = pred_lr[0]
        result['field'] = target_field

        if pred_lr[0] >= 3 and input_json[target_field] < 1 or pred_lr[0] <= 1 and input_json[target_field] >= 1:
            result['message'] = f"Predicted <span style='color: red; font-weight: bold;'>{target_field}</span> is NOT close to the input <span style='color: red; font-weight: bold;'>{target_field}</span>. Correct the value "
            result['noted_as'] = f"False"
        elif pred_lr[0] >= 1 and input_json[target_field] >= 1:
            percentage_difference = abs(pred_lr[0] - input_json[target_field]) / input_json[target_field] * 100
            if percentage_difference <= 20:
                result['message'] = f"{target_field} is Checked"
                result['noted_as'] = True
            else:
                result['message'] = f"Predicted <span style='color: red; font-weight: bold;'>{target_field}</span> is NOT close to the input <span style='color: red; font-weight: bold;'>{target_field}</span>. Correct the value and continue."
                result['noted_as'] = False
        else:
            result['message'] = f"{target_field} is Checked"
            result['noted_as'] = True
                        
        results.append(result)
    
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