import requests
from datetime import datetime, timedelta
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
import logging

# Configure logging
logging.basicConfig(filename=r'C:\Python\ANOMALY_DETECTION\logger\scheduler.log', level=logging.INFO, 
                    format='%(asctime)s - %(message)s')

def scheduled_task():
    current_time = datetime.now()
    twenty_four_hours_ago = current_time - timedelta(hours=24)
    
    fromDate = twenty_four_hours_ago.strftime("%Y%m%d%H%M%S")
    toDate = current_time.strftime("%Y%m%d%H%M%S")
    
    url = "http://164.52.205.129:9602/api/bill/train"
    
    print(fromDate, toDate)
    
    input_json = {
        "url": "jdbc:db2://164.52.193.146:50000/EZEEPUB",#VIRTVPSQ #EZEPUBT #EZEEPUB
        "username": "s1db1espubone",
        "password": "v1rt_s1db1espub1123*",
        "fromdate": fromDate,
        "todate": toDate
    }
    
    logging.info(f"Executing task with fromDate: {fromDate} and toDate: {toDate}")
    headers = {'Content-Type': 'application/json'}
    response = requests.post(url, json=input_json, headers=headers)
    if response.status_code == 200:
        logging.info("Task executed successfully.")
    else:
        logging.error(f"Task execution failed: {response.status_code}")

if __name__ == "__main__":
    print("Scheduler is running")
    scheduler = BackgroundScheduler()
    scheduler.add_job(scheduled_task, trigger=CronTrigger(hour=23, minute=13), id='train_job', replace_existing=True)
    scheduler.start()

    logging.info("Scheduler started, will run the task at 00:00 every day.")

    try:
        # Keep the script running
        while True:
            pass
    except (KeyboardInterrupt, SystemExit):
        scheduler.shutdown()
        logging.info("Scheduler shut down.")
