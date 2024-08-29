import requests

API_KEY = 'AIzaSyCanIEX9G_L8UbWpsVR6EYUc_cd38Z5dvw'
CX = 'a0a39d0b15cce477c'

def fetch_news(input_text):
    url = f'https://www.googleapis.com/customsearch/v1?key={API_KEY}&cx={CX}&q={input_text}&num=5'
    try:
        response = requests.get(url)
        response.raise_for_status() 
        data = response.json()
        items = data.get('items', [])
        news_results = []
        for item in items:
            title = item.get('title', '')
            link = item.get('link', '')
            snippet = item.get('snippet', '')
            news_results.append({
                'title': title,
                'link': link,
                'snippet': snippet
            })
        return news_results
    except requests.exceptions.RequestException as e:
        print('Error fetching news:', e)
        return []

def search_engine(input_text):
    print("entered_here")
    news_results = fetch_news(input_text)
    if not news_results:
        return ("Sorry, your daily limit reached.")
    else:
        #print(news_results)
        return news_results
