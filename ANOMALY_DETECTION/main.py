import logging
from flask import Flask, jsonify, request, render_template
from app.anomaly_bp import anomaly_bp
from app.buy_anomaly_bp import buy_anomaly_bp
from app.utils.db_function import process_data
from app.utils.db_function_buy import process_data_buy
from app.utils.process import process_env
import pandas as pd
import requests
import os

# Create the logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Define the path for the log file
log_file_path = os.path.join("C:\\Python\\ANOMALY_DETECTION\\logger", "anomaly_logger.log")

# Create a file handler and set its level to INFO
file_handler = logging.FileHandler(log_file_path)
file_handler.setLevel(logging.INFO)

# Create a logging format
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
file_handler.setFormatter(formatter)

# Add the file handler to the logger
logger.addHandler(file_handler)

# Create the Flask app
app = Flask(__name__)

# Register the blueprint
app.register_blueprint(anomaly_bp, name='anomaly_bp')
app.register_blueprint(buy_anomaly_bp, name='buy_anomaly_bp')

@app.route('/home')
def login_page():
    return render_template('front_page.html')

@app.route('/load', methods=['POST'])
def training():
    try:
        json_input = request.form.to_dict()
        print(json_input)
        result = process_env(json_input)
        if result == "success":
            csv_path = r"C:\Python\ANOMALY_DETECTION\app\test_data\test.csv"
            df = pd.read_csv(csv_path)
            excel_data = df.copy()
            excel_data.drop(columns=['COMPANYID'], inplace=True)
            excel_da = excel_data.head(50).copy()
            excel_da['Select'] = '<button class="btn btn-primary select-row">Select</button>'
            excel_html = excel_da.to_html(index=False, escape=False)
            # Assuming process_data returns a dictionary with relevant information
            return render_template('next_page.html', excel_table=excel_html)
        elif result == "buy":
            csv_path = r"C:\Python\ANOMALY_DETECTION\app\test_data\buy.csv"
            df = pd.read_csv(csv_path)
            excel_data = df.copy()
            excel_da = excel_data.head(50).copy()
            excel_da['Select'] = '<button class="btn btn-primary select-row">Select</button>'
            excel_html = excel_da.to_html(index=False, escape=False)
            # Assuming process_data returns a dictionary with relevant information
            return render_template('buy_anom.html', excel_table=excel_html)
        else:
            return("failed")
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/test', methods=['GET', 'POST'])
def index():
            
    if request.method == 'POST':
        data = request.form.to_dict()
        print(data)
        anomaly = data['anomaly']
        if anomaly == "bill":
            csv_path = r"C:\Python\ANOMALY_DETECTION\app\test_data\test.csv"
            postman_url = 'http://127.0.0.1:9602/api/bill/predict'
            numeric_fields = ["tenantid", "officeId", 'billAdressID', 'grossWt', 'netWt', 'chargeWt', 'billType', 'isSez', 'taxExemption', 
                          'totalIgst', 'totalCgst', 'totalSgst', 'netTotal', 'taxTotal', 'grossTotal']
            df = pd.read_csv(csv_path)
            excel_data = df.copy()
            excel_data.drop(columns=['COMPANYID'], inplace=True)
            excel_da = excel_data.head(50).copy()
            excel_da['Select'] = '<button class="btn btn-primary select-row">Select</button>'
            excel_html = excel_da.to_html(index=False, escape=False)
            html = 'next_page.html'
        elif anomaly == "buy":
            csv_path = r"C:\Python\ANOMALY_DETECTION\app\test_data\buy.csv"
            postman_url = 'http://127.0.0.1:9602/api/buy/predict'
            numeric_fields = ["tenantid", "officeId", 'BILL_TYPEID', 'PAYABLEFROM', 
                          'serviceTax', 'PAYABLETO', 'tdsTax', 'netTotal', 'discount', 'grossTotal']
            df = pd.read_csv(csv_path)
            excel_data = df.copy()
            excel_da = excel_data.head(50).copy()
            excel_da['Select'] = '<button class="btn btn-primary select-row">Select</button>'
            excel_html = excel_da.to_html(index=False, escape=False)
            html = 'buy_anom.html'
            
        if 'anomaly' in data:
            del data['anomaly']
            
        for key, value in data.items():
            try:
                if key == ["tenantid", "officeId"]:
                    data["tenantid"] = int(float(value))
                    data["officeId"] = int(float(value))
            except ValueError:
                # If conversion fails, leave the value unchanged
                pass
        
        for field in numeric_fields:
            if field in data:
                if field == "tenantid" or field == "officeId":
                    data[field] = int(float(data[field]))
                else:
                    data[field] = float(data[field])

        response = requests.post(postman_url, json=data)

        if response.status_code == 200:
            response_data = response.json()
            return render_template(html, excel_table=excel_html, response_data=response_data, display_modal=True)
        else:
            return 'Failed to send data', response.status_code
    
    return render_template(html, excel_table=excel_html)

@app.route('/api/bill/train', methods=['POST'])
def train():
    try:
        json_input = request.json
        result = process_data(json_input)
        logger.info('Training completed successfully')
        return jsonify(result)
    except Exception as e:
        logger.error(f'Error during training: {str(e)}')
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/buy/train', methods=['POST'])
def trainbuy():
    try:
        json_input = request.json
        result = process_data_buy(json_input)
        logger.info('Training completed successfully')
        return jsonify(result)
    except Exception as e:
        logger.error(f'Error during training: {str(e)}')
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=9602)
