from flask import Blueprint, request, jsonify
import requests
from datetime import datetime
from dateutil.relativedelta import relativedelta
from itertools import zip_longest

graph_bp = Blueprint("graph_bp", __name__, template_folder="templates")

@graph_bp.route('/graph', methods=['POST'])
def graph():
    try:
        user_input = request.json.get('user_input')
        print(user_input)
        
        if user_input is None:
            return jsonify({'response': 'Error: User input parameter is missing.'}), 400
        
        response = ""
        if isinstance(user_input, dict) and any(key in user_input for key in ['tenantid', 'officeid', 'environment', 'period']):
            tenant_id = user_input['tenantid']
            office_id = user_input['officeid']
            end_point = 'generateConsolidationMISReport'
            base_url = user_input['environment']
            period = int(user_input.get('period', 0))
            
            now = datetime.now()
            
            last_month = now - relativedelta(months=1)
            if last_month.day > 30:
                end_date = last_month.replace(day=30)
            else:
                end_date = last_month.replace(day=30)
            
            end_date_2 = datetime.now()
            start_date = (end_date_2 - relativedelta(months=period)).replace(day=1)
            from_date = start_date.strftime('%Y-%m-%d')
            to_date = end_date.strftime('%Y-%m-%d')
            
            json_input = {
                "groupBy": "MONTH",
                "officeId": office_id,
                "tenantid": tenant_id,
                "toDate": to_date,
                "fromDate": from_date
            }
            
            print(json_input)
            
            if json_input is not None:
                api_url = f"{base_url}/{end_point}"
                try:
                    api_resp = requests.post(api_url, json=json_input, verify=False)
                    
                    if api_resp.ok: 
                        api_data = api_resp.json()
                        #print(api_data)
                    
                        def safe_int(value):
                            try:
                                return int(value)
                            except (TypeError, ValueError):
                                return 0

                        debit_net_total = [safe_int(item.get('debitnotetotal')) for item in api_data]
                        invoice_net_total = [safe_int(item.get('invoiceNettotal')) for item in api_data]
                        voucher_total = [safe_int(item.get('vouchertotal')) for item in api_data]
                        credit_net_total = [safe_int(item.get('creditnotetotal')) for item in api_data]
                        expense_total = [safe_int(item.get('expensetotal')) for item in api_data]
                        net_profits = [safe_int(item.get('netprofit')) for item in api_data]
                        #month_name = [(item.get('monthnameonly')) for item in api_data]
                        month_year = [(item.get('groupBy')) for item in api_data]
                        
                        revenue = [d + i for d, i in zip_longest(debit_net_total, invoice_net_total, fillvalue=0)]
                        expense = [v + c + e for v, c, e in zip_longest(voucher_total, credit_net_total, expense_total, fillvalue=0)]
                        
                        short_dates = []

                        for date in month_year:
                            month, year = date.split(',')
                            short_month = month[:3]
                            short_year = year[2:]
                            short_dates.append(f"{short_month},{short_year}")
                        print(short_dates)
                        
                        return jsonify({
                            'net_profits': net_profits,
                            'revenue': revenue,
                            'expense': expense,
                            'month_name': short_dates
                        })
                    
                    else:
                        response = ('Error: Failed to get a response from the API. Status code:', api_resp.status_code)

                except requests.exceptions.SSLError as ssl_error:
                    response = f"SSL Error: {ssl_error}"
                except requests.exceptions.RequestException as e:
                    response = ('Error: Failed to call the API -', str(e))
            else:
                response = ('Error: Quotation Number is missing or invalid.')
    
    except Exception as e:
        return jsonify({'response': 'An error occurred'}), 500
    
    return jsonify({'response': response}), 200