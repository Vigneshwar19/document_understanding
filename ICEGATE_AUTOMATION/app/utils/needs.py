import psutil
import requests

def kill_chromium_processes():
    print('Kill all Chromium or Chrome processes')
    found_processes = False
    for proc in psutil.process_iter(['pid', 'name']):
        try:
            # print(f"Found process: {proc.info['name']} (PID: {proc.info['pid']})")
            if 'chrome' in proc.info['name'].lower() or 'chromium' in proc.info['name'].lower():
                found_processes = True
                print(f"Killing process: {proc.info['name']} (PID: {proc.info['pid']})")
                proc.terminate()
                proc.wait(timeout=3)
                print(f"Successfully terminated: {proc.info['name']} (PID: {proc.info['pid']})")
        except psutil.NoSuchProcess:
            pass
        except psutil.AccessDenied:
            print(f"Access denied to terminate process: {proc.info['name']} (PID: {proc.info['pid']})")
        except psutil.TimeoutExpired:
            print(f"Timeout expired while terminating process: {proc.info['name']} (PID: {proc.info['pid']})")
            proc.kill()

    if not found_processes:
        print("No matching processes found.")
        
def download_file(url):
    response = requests.get(url)
    response.raise_for_status()
    return response.content