from flask import Blueprint, request, jsonify, send_from_directory
import pandas as pd
import os
from playwright.sync_api import sync_playwright
from datetime import datetime
import json

current_time = datetime.now().strftime('%y-%m-%d_%H-%M-%S')

cth_enq_bp = Blueprint("cth_enq_bp", __name__, template_folder="templates")

EXCEL_DIRECTORY = r'C:\Python\ICEGATE_AUTOMATION\excel'
JSON_UPDATE_FILE = os.path.join(EXCEL_DIRECTORY, 'cth_enq_update.json')

@cth_enq_bp.route('/excel/<filename>', methods=['GET'])
def download_excel(filename):
    return send_from_directory(EXCEL_DIRECTORY, filename)

@cth_enq_bp.route('/api/icegate/cthenqupdate', methods=['POST'])
def cthupdate():
    print('yes')
    if not os.path.exists(JSON_UPDATE_FILE):
        return jsonify({"status": "error", "message": "JSON update file not found"}), 404

    try:
        with open(JSON_UPDATE_FILE, 'r') as json_file:
            lines = json_file.readlines()
        
        last_data = None
        for line in lines:
            print(line)
            line = line.strip()
            if line:
                try:
                    obj = json.loads(line)
                    if isinstance(obj, dict):
                        last_data = obj
                except json.JSONDecodeError as e:
                    print(f"JSON decode error: {str(e)}")
        
        if last_data is None:
            print('yessssssssssssssssss')
            return jsonify({"status": "success", "data": []}), 200
        
        return jsonify({"status": "success", "data": [last_data]}), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@cth_enq_bp.route('/api/icegate/cthenq', methods=['POST'])
def searchcth():
    output_dir = r'C:\Python\ICEGATE_AUTOMATION\excel'
    os.makedirs(output_dir, exist_ok=True)

    if 'file' not in request.files:
        return jsonify({"status": "error", "message": "No file uploaded"}), 400

    file = request.files['file']
    file_path = os.path.join(output_dir, f"uploaded_cth_enq_{current_time}.xlsx")
    file.save(file_path)
    
    try:
        df = pd.read_excel(file_path, engine='openpyxl', dtype={'HSCODE': str})

        column_name = 'HSCODE'
        if column_name in df.columns:
            values = df[column_name].tolist()

            results = []
            with sync_playwright() as p:
                browser = p.chromium.launch(headless=True)
                context = browser.new_context(accept_downloads=True)

                try:
                    for i, value in enumerate(values):
                        page = browser.new_page()
                        try:
                            page.goto("https://www.old.icegate.gov.in/Webappl/Codes")
                            
                            page.click('a >> text="Custom tariff head"')
                            page.fill('input[name="cth"]', str(value))
                            page.click('#submitbutton')
                            page.wait_for_timeout(1000)
                            
                            table_selector = 'table[bgcolor="snow"]'
                            page.wait_for_selector(table_selector, timeout=15000)

                            table_element = page.query_selector(table_selector)
                            if table_element:
                                rows = table_element.query_selector_all('tbody tr')
                                for row in rows:
                                    cells = row.query_selector_all('td')
                                    if cells and cells[0].inner_text() == str(value):
                                        data = {
                                            "CTH": cells[0].inner_text(),
                                            "BCD Rate": cells[1].inner_text(),
                                            "Specific Duty Flag": cells[2].inner_text(),
                                            "Spec Duty": cells[3].inner_text(),
                                            "Spec Duty Unit": cells[4].inner_text()
                                        }
                                        results.append(data)
                                        break 
                            
                            with open(JSON_UPDATE_FILE, 'a') as json_file:
                                if i > 0:
                                    json_file.write(',\n')
                                json.dump(data, json_file)

                        except Exception as e:
                            error_data = {"status": "error", "message": str(e)}
                            results.append(error_data)
                            with open(JSON_UPDATE_FILE, 'a') as json_file:
                                if i > 0:
                                    json_file.write(',\n')
                                json.dump(error_data, json_file)

                        finally:
                            page.close()

                    output_path = os.path.join(output_dir, f'extracted_cth_enq_data_{current_time}.xlsx')
                    df_results = pd.DataFrame(results)
                    df_results.to_excel(output_path, index=False, engine='openpyxl')

                    relative_path = os.path.relpath(output_path, EXCEL_DIRECTORY)
                    return jsonify({'status': 'success', 'excelFilePath': relative_path})

                finally:
                    browser.close()

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
