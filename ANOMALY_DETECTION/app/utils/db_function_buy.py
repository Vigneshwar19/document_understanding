import jaydebeapi
from datetime import datetime
import pandas as pd

def process_data_buy(json_input):
    try:
        driver = 'com.ibm.db2.jcc.DB2Driver'
        url = json_input['url']
        username = json_input['username']
        password = json_input['password']
        conn = jaydebeapi.connect(driver, url, [username, password], r'C:\Python\ANOMALY_DETECTION\app\db2\db2_db2driver_for_jdbc_sqlj\db2jcc.jar')
        
        from_date_str = datetime.strptime(str(json_input['fromdate']), '%Y%m%d%H%M%S').strftime('%Y-%m-%d %H:%M:%S')
        to_date_str = datetime.strptime(str(json_input['todate']), '%Y%m%d%H%M%S').strftime('%Y-%m-%d %H:%M:%S')
        cursor = conn.cursor()
        
        cursor.execute('''
        SELECT  TBL_BUYINGBILL.TENANTID,TBL_BUYINGBILL.OFFICEID,TBL_BUYINGBILL.BILLNO,TBL_BUYINGBILL.BILL_DATE,TBL_BUYINGBILL.BILL_TYPEID,TBL_BOOKING_BILLTYPE.DESC AS BUYINGBILLTYPENAME,TBL_BUYINGBILL.PAYABLEFROM,PAYABLEFROMCOMPANY.NAME AS PAYABLEFROMNAME,TBL_BUYINGBILL.PAYABLETO,PAYABLETOCOMPANY.NAME AS PAYABLETONAME,TBL_BUYINGBILL.THIRDPARTYID,THIRDPARTY.NAME AS THIRDPARTYNAME,
        TBL_BUYINGBILL.NETTOTAL,TBL_BUYINGBILL.SERVICETAX,TBL_BUYINGBILL.TDS_TAX, TBL_BUYINGBILL.DISCOUNT,TBL_BUYINGBILL.GROSSTOTAL,
        (SELECT LISTAGG(TBL_CHARGECODES.NAME,';') FROM TBL_BUYINGBILL_CHARGEITEMS
        LEFT OUTER JOIN TBL_CHARGECODES ON TBL_CHARGECODES.ID=TBL_BUYINGBILL_CHARGEITEMS.CHARGETYPEID WHERE TBL_BUYINGBILL_CHARGEITEMS.BUYINGBILLID=TBL_BUYINGBILL.ID
        GROUP BY TBL_BUYINGBILL_CHARGEITEMS.BUYINGBILLID) AS BILLITEMS
        FROM TBL_BUYINGBILL 
        LEFT OUTER JOIN TBL_COMPANY AS THIRDPARTY ON THIRDPARTY.ID = TBL_BUYINGBILL.THIRDPARTYID
        LEFT OUTER JOIN TBL_COMPANY AS PAYABLETOCOMPANY ON PAYABLETOCOMPANY.ID = TBL_BUYINGBILL.PAYABLETO
        LEFT OUTER JOIN TBL_COMPANY AS PAYABLEFROMCOMPANY ON PAYABLEFROMCOMPANY.ID = TBL_BUYINGBILL.PAYABLEFROM
        LEFT OUTER JOIN TBL_BOOKING_BILLTYPE ON TBL_BOOKING_BILLTYPE.ID=TBL_BUYINGBILL.BILL_TYPEID
        AND TBL_BUYINGBILL.BILL_DATE BETWEEN ? AND ?
        ''', [from_date_str, to_date_str])
        
        rows = cursor.fetchall()
        columns = [col[0] for col in cursor.description]
        data = pd.DataFrame(rows, columns=columns)

        df = data.copy()
        
        columns_to_remove = [ 'THIRDPARTYID','THIRDPARTYNAME']
        df = df.drop(columns=columns_to_remove)
        
        column_mapping = {
                    "TENANTID": "tenantid",
                    "OFFICEID": "officeId",
                    "PAYABLETONAME": "payToName",
                    "PAYABLEFROMNAME": "payFromName",
                    "BUYINGBILLTYPENAME": "buybillType",
                    "DISCOUNT": "discount",
                    "TDS_TAX": "tdsTax",
                    "NETTOTAL": "netTotal",
                    "SERVICETAX": "serviceTax",
                    "GROSSTOTAL": "grossTotal",
                    "BILLITEMS": "billItems",
                    "BILLNO": "billNo",
                    "BILL_DATE": "billDate",
                    "BILL_TYPEID": "billTypeId",
                    "PAYABLEFROM": "payableFrom",
                    "PAYABLETO": "payableTo",
                }
        
        df = df.rename(columns=column_mapping)
        df.dropna(inplace=True)
        csv_file_path = r"C:\Python\ANOMALY_DETECTION\app\uploads\buy.csv"

        try:
            existing_df = pd.read_csv(csv_file_path)
            updated_df = pd.concat([existing_df, df], ignore_index=True)
        except FileNotFoundError:
            updated_df = df

        updated_df.to_csv(csv_file_path, index=False)

        return {'message': 'Data processed successfully!'}
    except Exception as e:
        return {'err': str(e)}, 500