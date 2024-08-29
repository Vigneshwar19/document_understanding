from flask import Blueprint, request, jsonify
from playwright.sync_api import sync_playwright
import os
from datetime import datetime, timedelta
from app.utils.needs import kill_chromium_processes

ecopy_bp = Blueprint("ecopy_bp", __name__, template_folder="templates")

@ecopy_bp.route('/api/icegate/ecopy', methods=['POST'])
def search():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    days_back = int(data.get('noOfDays', 0))
    download_dir = data.get('url')
    option = data.get('option')
    no_of_rows = int(data.get('noOfRows', 1))
    row_index = 0

    today = datetime.now()
    today_date = today.strftime('%d-%m-%Y')
    
    target_date = datetime.now() - timedelta(days=days_back)
    date_to_set = target_date.strftime('%d-%m-%Y')
    
    current_time = datetime.now().strftime('%y-%m-%d_%H-%M-%S')
    collections = []
    
    option_mapping = {
        '1': 'Shipping Bill / SB',
        '2': 'Let Export Order / LEO',
        '3': 'Gatepass for Let Export Order / LEO',
        '4': 'Bill of Entry / BoE',
        '5': 'Out of Charge / OOC',
        '6': 'Gatepass for Out of Charge / OOC'
    }
    option_to_fill = option_mapping.get(option, '')  
    print(f"Option to fill: {option_to_fill}")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            accept_downloads=True
        )
        page = browser.new_page()
        overlay_selector = "div.overlay"

        try:
            page.goto("https://www.icegate.gov.in/")
            page.click(".login", timeout=5000)

            page.wait_for_event('popup')
            new_page = page.context.pages[-1]
            new_page.fill("#icegateId", username)
            new_page.fill("#password", password)
            new_page.click(".btn.login")

            new_page.click('h5 >> text="Download e-Copy"')
            print('clicked')

            shipping_bill_link_xpath = f"//a[@class='change-cursor' and contains(text(), '{option_to_fill}')]"
            shipping_bill_link = new_page.query_selector(shipping_bill_link_xpath)
            if shipping_bill_link:
                shipping_bill_link.scroll_into_view_if_needed()
                new_page.wait_for_selector(shipping_bill_link_xpath, timeout=5000)
                shipping_bill_link.click()
            else:
                return jsonify({"status": "error", "message": "Shipping bill link not found."}), 200

            date_input = new_page.wait_for_selector("input[formcontrolname='fromDate']", timeout=10000)
            if date_input:
                date_input.evaluate(f"element => element.value = '{date_to_set}';")
            else:
                new_page.screenshot(path="error_screenshot.png")
                return jsonify({"status": "error", "message": "Date input element not found."}), 200
            
            new_page.click("//button[contains(@class, 'btn-info') and contains(text(), 'Search')]")
            new_page.wait_for_selector(overlay_selector, state='hidden', timeout=30000)

            while row_index < no_of_rows:
                rows = new_page.query_selector_all("table.resultTable.table tbody tr")
                
                if not rows:
                    break

                for index, row in enumerate(rows):
                    if row_index >= no_of_rows:
                        break 

                    td_elements = row.query_selector_all("td")[:5]
                    row_data = [td.text_content() for td in td_elements]

                    ack_file = ""
                    signed_copy = ""

                    ack_file_download_link = row.query_selector("td:nth-child(6) a:has-text('Download Link')")
                    if ack_file_download_link:
                        if 'disableClick' not in ack_file_download_link.get_attribute('class'):
                            with new_page.expect_download() as download_info:
                                ack_file_download_link.scroll_into_view_if_needed()
                                ack_file_download_link.click()
                                new_page.wait_for_selector(overlay_selector, state='hidden', timeout=50000)
                            download = download_info.value
                            new_file_name = f"ack_file_row-{index + 1}_{current_time}.ack"
                            new_file_path = os.path.join(download_dir, new_file_name)
                            download.save_as(new_file_path)
                            ack_file = new_file_path
                        else:
                            ack_file = "Download link is disabled"
                    else:
                        ack_file = "Download link not found"

                    signed_copy_download_link = row.query_selector("td:nth-child(7) a:has-text('Download Link')")
                    if signed_copy_download_link:
                        if 'disableClick' not in signed_copy_download_link.get_attribute('class'):
                            with new_page.expect_download() as download_info:
                                signed_copy_download_link.scroll_into_view_if_needed()
                                signed_copy_download_link.click()
                                new_page.wait_for_selector(overlay_selector, state='hidden', timeout=50000)
                            download = download_info.value
                            new_file_name = f"signed_copy_row-{index + 1}_{current_time}.pdf"
                            new_file_path = os.path.join(download_dir, new_file_name)
                            download.save_as(new_file_path)
                            signed_copy = new_file_path
                        else:
                            signed_copy = "Download link is disabled"
                    else:
                        signed_copy = "Download link not found"

                    collection = {
                        "optionClicked": option_to_fill,
                        "jobNo": row_data[0],
                        "jobDate": row_data[1],
                        "sbNo": row_data[2],
                        "sbDate": row_data[3],
                        "customLocation": row_data[4],
                        "ack_file": ack_file,
                        "signed_copy": signed_copy,
                        "status": "success"
                    }
                    row_index += 1 
                    collections.append(collection)

                if row_index >= no_of_rows:
                    break 

                next_buttons = new_page.query_selector_all("span.next-page svg#first-page")

                if len(next_buttons) >= 2:
                    second_button = next_buttons[1]
                    
                    initial_scroll_position = new_page.evaluate("window.scrollY")
                    print(f"Initial scroll position: {initial_scroll_position}")

                    second_button.click()
                    print('Second "next page" button clicked')
                    
                    new_page.wait_for_timeout(2000)

                    new_scroll_position = new_page.evaluate("window.scrollY")
                    print(f"New scroll position: {new_scroll_position}")

                    if new_scroll_position == 0:
                        print("The screen has scrolled to the top.")
                    else:
                        print("The screen has not scrolled to the top.")
                        break
                else:
                    print('Next page button is not here')
                    break

        except Exception as e:
            print("error: ", str(e))
            return jsonify({"status": "error", "message": str(e)}), 200

        finally:
            browser.close()
            #kill_chromium_processes()

    return jsonify(collections)
