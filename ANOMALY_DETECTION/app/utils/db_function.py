import jaydebeapi
from datetime import datetime
import pandas as pd

def process_data(json_input):
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
        SELECT TBL_BOOKING.TENANTID,TBL_BOOKING.OFFICEID, SHIPPER.NAME AS SHIPERNAME, CONSIGNEE.NAME AS CONSIGNEENAME, BILLTO_ADDRESSID AS BILLADDRESSID,
        BILLTOCOMPANY.NAME AS BILLTONAME, BILLFROMNAME.NAME AS BILLFROMNAME, TBL_BOOKING.SHIPMENTTYPE, TBL_BOOKING.GROSSWT,
        TBL_BOOKING.NETWT, TBL_BOOKING.CHARGEWT, NOTIFYPARTY.NAME AS NOTIFYPARTYNAME, ORIGINSEAPORT.DESCRIPTION AS SEAORIGINDESC,
        DESTINATIONSEAPORT.DESCRIPTION AS SEADESTINATIONDESC, ORIGINAIRPORT.DESCRIPTION AS AIRORIGINDESC,
        DESTINATIONAIRPORT.DESCRIPTION AS AIRORGINDESC, BILL.CURRENCY, BILL.COMPANYID, BILL.BILLTYPE, BILL.PLACE_OF_SUPPLY,
        BILL.EXTCURR1, BILL.EXTCURR2, BILL.OTHERCURRENCY_SERVICETAX, BILL.OTHERCURRENCY_TOTAL, BILL.OTHERCURRENCY_GROSSTOTAL,
        BILL.EXTCURR1_AMOUNT, BILL.EXTCURR2_AMOUNT, BILL.IS_SEZ, BILL.ISTHIRDPARTY, BILL.TAX_EXEMPTION, BILL.ISTHIRDPARTY_DELIVERY,
        DECODE(BILL.CGST_AMT, null, CHAR(DECIMAL(BILL.TAXTOTAL, 11, 2)), '0') AS TOTALIGST, 
        DECODE(BILL.CGST_AMT, 0, '0', CHAR(DECIMAL(BILL.CGST_AMT, 11, 2)))  AS TOTALCGST, 
        DECODE(BILL.SGST_AMT, 0, '0', CHAR(DECIMAL(BILL.SGST_AMT, 11, 2)))  AS TOTALSGST, 
        BILL.NETTOTAL, BILL.TAXTOTAL, BILL.GROSSTOTAL,
        (SELECT DISTINCT LISTAGG(TBL_CHARGECODES.NAME, ';') FROM TBL_BOOKING_BILL_ITEMS 
        LEFT OUTER JOIN TBL_BOOKING_RATE ON TBL_BOOKING_RATE.ID = TBL_BOOKING_BILL_ITEMS.BOOKINGRATEID
        LEFT OUTER JOIN TBL_CHARGECODES ON TBL_BOOKING_RATE.CHARGECODE = TBL_CHARGECODES.ID WHERE TBL_BOOKING_BILL_ITEMS.BILLID=BILL.ID
        GROUP BY TBL_BOOKING_BILL_ITEMS.BILLID) AS BILLITEMS,
        (SELECT TBL_BOOKING_BILLTYPE.DESC FROM TBL_BOOKING_BILLTYPE WHERE TBL_BOOKING_BILLTYPE.ID=BILL.BILLTYPE) AS BILLTYPE_DESC,
        BILL.BILLTOADDRESS 
        FROM TBL_BOOKING_BILL BILL  
        LEFT OUTER JOIN  TBL_BOOKING ON BILL.BOOKINGID=TBL_BOOKING.ID 
        LEFT OUTER JOIN  TBL_BOOKING_SHIPPER ON TBL_BOOKING_SHIPPER.BOOKINGID=TBL_BOOKING.ID 
        LEFT OUTER JOIN  TBL_COMPANY AS SHIPPER ON SHIPPER.ID=TBL_BOOKING_SHIPPER.SHIPPERID
        LEFT OUTER JOIN  TBL_COMPANY AS BILLTOCOMPANY ON BILLTOCOMPANY.ID=BILL.BILLTO
        LEFT OUTER JOIN  TBL_BOOKING_CONSIGNEE ON TBL_BOOKING_CONSIGNEE.BOOKINGID=TBL_BOOKING.ID 
        LEFT OUTER JOIN  TBL_COMPANY AS CONSIGNEE ON CONSIGNEE.ID=TBL_BOOKING_CONSIGNEE.CONSIGNEEID
        LEFT OUTER JOIN TBL_COMPANY AS NOTIFYPARTY ON NOTIFYPARTY.ID = TBL_BOOKING.NOTIFYPARTYID
        LEFT OUTER JOIN TBL_AIRBOOKING ON TBL_AIRBOOKING.BOOKINGID = TBL_BOOKING.ID
        LEFT OUTER JOIN TBL_SEABOOKING ON TBL_SEABOOKING.BOOKINGID = TBL_BOOKING.ID
        LEFT OUTER JOIN TBL_SEAPORT AS ORIGINSEAPORT ON ORIGINSEAPORT.CODE = TBL_SEABOOKING.ORIGIN 
        LEFT OUTER JOIN TBL_SEAPORT AS DESTINATIONSEAPORT ON DESTINATIONSEAPORT.CODE = TBL_SEABOOKING.DESTINATION
        LEFT OUTER JOIN TBL_AIRPORT AS ORIGINAIRPORT  ON ORIGINAIRPORT.CODE = TBL_AIRBOOKING.ORIGIN 
        LEFT OUTER JOIN TBL_COMPANY AS BILLFROMNAME ON BILLFROMNAME.ID = BILL.COMPANYID
        LEFT OUTER JOIN TBL_AIRPORT AS DESTINATIONAIRPORT  ON DESTINATIONAIRPORT.CODE = TBL_AIRBOOKING.DESTINATION 
        WHERE BILL.BOOKINGID > 0 AND TBL_BOOKING_SHIPPER.SHIPPERID > 0 AND TBL_BOOKING_CONSIGNEE.CONSIGNEEID > 0
        AND BILL.BILL_DATE BETWEEN ? AND ?
        ORDER BY BILLTOCOMPANY.NAME''', [from_date_str, to_date_str])
        
        rows = cursor.fetchall()
        columns = [col[0] for col in cursor.description]
        data = pd.DataFrame(rows, columns=columns)

        df = data.copy()

        df['ORIGIN'] = df['SEAORIGINDESC'].fillna(df['AIRORIGINDESC'])
        df['DESTINATION'] = df['SEADESTINATIONDESC'].fillna(df['AIRORGINDESC'])
        df.drop(['SEAORIGINDESC', 'AIRORIGINDESC', 'SEADESTINATIONDESC', 'AIRORGINDESC'], axis=1, inplace=True)
        df['TOTALIGST'].fillna(0, inplace=True)
        df['TOTALCGST'].fillna(0, inplace=True)
        df['TOTALSGST'].fillna(0, inplace=True)
        df['TAX_EXEMPTION'].fillna(0, inplace=True)
        columns_to_remove = [ 'ISTHIRDPARTY','EXTCURR1','ISTHIRDPARTY_DELIVERY',
                'EXTCURR2', 'OTHERCURRENCY_SERVICETAX', 'OTHERCURRENCY_TOTAL',
                'OTHERCURRENCY_GROSSTOTAL', 'EXTCURR1_AMOUNT', 'EXTCURR2_AMOUNT','NOTIFYPARTYNAME']
        df = df.drop(columns=columns_to_remove)
        df['NETWT'] = df['NETWT'].fillna(df['NETWT'].mean())
        df['GROSSWT'] = df['GROSSWT'].fillna(df['GROSSWT'].mean())
        df['CHARGEWT'] = df['CHARGEWT'].fillna(df['CHARGEWT'].mean())
        
        column_mapping = {
                "TENANTID": "tenantid",
                "OFFICEID": "officeId",
                "SHIPERNAME": "shipperName",
                "CONSIGNEENAME": "consigneeName",
                "BILLADDRESSID": "billAdressID",
                "BILLTONAME": "billToName",
                "BILLFROMNAME": "billFromName",
                "SHIPMENTTYPE": "shipmentType",
                "GROSSWT": "grossWt",
                "NETWT": "netWt",
                "CHARGEWT": "chargeWt",
                "CURRENCY": "currency",
                "BILLTYPE": "billType",
                "PLACE_OF_SUPPLY": "placeOfSupply",
                "IS_SEZ": "isSez",
                "TAX_EXEMPTION": "taxExemption",
                "TOTALIGST": "totalIgst",
                "TOTALCGST": "totalCgst",
                "TOTALSGST": "totalSgst",
                "NETTOTAL": "netTotal",
                "TAXTOTAL": "taxTotal",
                "GROSSTOTAL": "grossTotal",
                "BILLITEMS": "billItems",
                "ORIGIN": "origin",
                "DESTINATION": "destination",
                "BILLTYPE_DESC": "billTypeDesc",
                "BILLTOADDRESS": "billtoaddress"
            }
        df = df.rename(columns=column_mapping)
        df.dropna(inplace=True)
        csv_file_path = r"C:\Python\ANOMALY_DETECTION\app\uploads\output.csv"

        try:
            existing_df = pd.read_csv(csv_file_path)
            updated_df = pd.concat([existing_df, df], ignore_index=True)
        except FileNotFoundError:
            updated_df = df

        updated_df.to_csv(csv_file_path, index=False)

        return {'message': 'Data processed successfully!'}
    except Exception as e:
        return {'err': str(e)}, 500