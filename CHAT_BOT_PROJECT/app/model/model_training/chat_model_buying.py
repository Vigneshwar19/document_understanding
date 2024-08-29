from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import os
import json
from joblib import dump

intents_path = r'C:\Python\CHAT_BOT_PROJECT\app\intents\buying_intents.json'

if not os.path.exists(intents_path):
    raise FileNotFoundError("Intents file not found.")

with open(intents_path, 'r') as file:
    intents = json.load(file)

tags2 = []
patterns2 = []

for intent in intents:
    for pattern in intent['patterns']:
        tags2.append(intent['tag'])
        patterns2.append(pattern)

vectorizer = TfidfVectorizer()

x = vectorizer.fit_transform(patterns2)

clf = LogisticRegression(random_state=0, max_iter=10000)

clf.fit(x, tags2)

dump(vectorizer, r'C:\Python\CHAT_BOT_PROJECT\app\model\chat_model\buying\vectorizer.joblib')
dump(clf, r'C:\Python\CHAT_BOT_PROJECT\app\model\chat_model\buying\classifier.joblib')
