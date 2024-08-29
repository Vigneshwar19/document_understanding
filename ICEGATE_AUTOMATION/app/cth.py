from flask import Blueprint, request, jsonify, send_from_directory
import os
import pandas as pd
from datetime import datetime
from playwright.sync_api import sync_playwright
import json

current_time = datetime.now().strftime('%y-%m-%d_%H-%M-%S')

cth_bp = Blueprint("cth_bp", __name__, template_folder="templates")

EXCEL_DIRECTORY = r'C:\Python\ICEGATE_AUTOMATION\excel'
JSON_UPDATE_FILE = os.path.join(EXCEL_DIRECTORY, 'cth_update.json')

@cth_bp.route('/excel/<filename>', methods=['GET'])
def download_excel(filename):
    return send_from_directory(EXCEL_DIRECTORY, filename)

@cth_bp.route('/api/icegate/cthupdate', methods=['POST'])
def cthupdate():
    if not os.path.exists(JSON_UPDATE_FILE):
        return jsonify({"status": "error", "message": "JSON update file not found"}), 404

    try:
        with open(JSON_UPDATE_FILE, 'r') as json_file:
            lines = json_file.readlines()
        
        last_data = None
        for line in lines:
            line = line.strip()
            if line:
                try:
                    obj = json.loads(line)
                    if isinstance(obj, dict):
                        last_data = obj
                except json.JSONDecodeError as e:
                    print(f"JSON decode error: {str(e)}")
        
        if last_data is None:
            return jsonify({"status": "success", "data": []}), 200
        
        return jsonify({"status": "success", "data": [last_data]}), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@cth_bp.route('/api/icegate/cth', methods=['POST'])
def searchcth():
    output_dir = r'C:\Python\ICEGATE_AUTOMATION\excel'
    os.makedirs(output_dir, exist_ok=True)

    if 'file' not in request.files:
        return jsonify({"status": "error", "message": "No file uploaded"}), 400

    file = request.files['file']
    file_path = os.path.join(output_dir, f"uploaded_cth_{current_time}.xlsx")
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
                            page.goto("https://www.old.icegate.gov.in/Webappl/Trade-Guide-on-Imports")
                            page.fill('input[name="cth"]', str(value))
                            page.click('#submitbutton')
                            page.wait_for_timeout(1000)

                            row_selector = f'div.wrap-table100 div#tmptest1 div.row.rowh[value="{value}"]'
                            page.wait_for_selector(row_selector, timeout=15000)

                            row_element = page.query_selector(row_selector)
                            if row_element:
                                cells = row_element.query_selector_all('div.cell')
                                if len(cells) == 5:
                                    data = {
                                        "Tariff Item": cells[0].inner_text(),
                                        "Description Of Goods": cells[1].inner_text(),
                                        "Unit": cells[2].inner_text(),
                                        "Rate Of Duty": cells[3].inner_text(),
                                        "Import Policy": cells[4].inner_text()
                                    }
                                    results.append(data)

                                else:
                                    data = {"status": "error", "message": "Unexpected number of cells in the row."}
                                    results.append(data)
                            else:
                                data = {"status": "error", "message": f"Row not found with the value {value}."}
                                results.append(data)

                            with open(JSON_UPDATE_FILE, 'a') as json_file:
                                if i > 0:
                                    json_file.write(',\n')
                                json.dump(data, json_file)

                        except Exception as e:
                            data = {"status": "error", "message": str(e)}
                            results.append(data)
                            with open(JSON_UPDATE_FILE, 'a') as json_file:
                                if i > 0:
                                    json_file.write(',\n')
                                json.dump(data, json_file)

                        finally:
                            page.close()

                    output_path = os.path.join(output_dir, f'extracted_cth_data_{current_time}.xlsx')
                    os.makedirs(os.path.dirname(output_path), exist_ok=True)
                    df_results = pd.DataFrame(results)
                    df_results.to_excel(output_path, index=False, engine='openpyxl')

                    relative_path = os.path.relpath(output_path, EXCEL_DIRECTORY)
                    return jsonify({'status': 'success', 'excelFilePath': relative_path})

                finally:
                    browser.close()

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
