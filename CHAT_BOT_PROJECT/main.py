from flask import Flask, render_template, request, jsonify
from app.chat_input_bp import chat_bot_bp
from app.chat_bp import chat_bp
from app.image_process_bp import img_bp
from app.awb_bp import awb_bp
from app.db_bp import db_bp
from app.graph_bp import graph_bp
from app.db_bp import general_qs_random
from collections import OrderedDict
import os
import json
import logging
from app import db

# Initialize the Flask application
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:ezeeshipping123$@164.52.205.129:3307/chat_bot'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# Initialize SQLAlchemy with the Flask app context
db.init_app(app)

# Register blueprints for the chat functionality
app.register_blueprint(chat_bp, name='chat_bp')
app.register_blueprint(chat_bot_bp, name='chat_bot_bp')
app.register_blueprint(img_bp, name='img_bp')
app.register_blueprint(awb_bp, name='awb_bp')
app.register_blueprint(db_bp, name='db_bp')
app.register_blueprint(graph_bp, name='graph_bp')

# Configure logging
logging.basicConfig(
    filename=r'C:\Python\CHAT_BOT_PROJECT\looger\Chat_bot_log.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

@app.route('/chat_bot')
def home():
    """
    Render the home page for the chat bot with required data.
    """
    tenant_id = request.args.get('tenantId')
    office_id = request.args.get('officeId')
    user_id = request.args.get('userName')
    environment = request.args.get('environment')
    user_id_2 = request.args.get('userId')
    ffrid = request.args.get('ffrid')
    chaid = request.args.get('chaid')
    trpid = request.args.get('trpid')
    intent_name = request.args.get('buttonRef', default='SAO')

    input_data = {
        "tenantid": tenant_id,
        "officeid": office_id,
        "userid": user_id,
        "environment": environment,
        "userid2": user_id_2,
        "trpid": trpid,
        "ffrid": ffrid,
        "chaid": chaid
    }
    print(input_data)
    
    # Construct the path to the intents file
    intents_path = (
        'C:\\python\\CHAT_BOT_PROJECT\\app\\intents\\'
        f'{intent_name}.json'
    )

    # Check if the intents file exists
    if not os.path.exists(intents_path):
        raise FileNotFoundError("Intents file not found.")

    # Load intents from the JSON file
    with open(intents_path, 'r') as file:
        intents = json.load(file)

    # Filter out the "Search Engine" intent if it exists
    #intents = [intent for intent in intents if intent.get('tag') != 'Search Engine']

    # Extract patterns and tags from intents
    tags = []
    patterns = []
    for intent in intents:
        for pattern in intent['patterns']:
            tags.append(intent['tag'])
            patterns.append(pattern)

    # Map patterns to their corresponding tags
    patterns_tags_map = OrderedDict()
    for tag, pattern in zip(tags, patterns):
        if tag not in patterns_tags_map:
            patterns_tags_map[tag] = []
        patterns_tags_map[tag].append(pattern)

    # Capitalize tags and patterns for display
    tags = list(map(str, patterns_tags_map.keys()))
    patterns_by_tag = {
        tag: list(map(str, patterns)) 
        for tag, patterns in patterns_tags_map.items()
    }
    
    random_qs = general_qs_random(tenant_id, office_id)

    # Render the index template with the extracted data
    return render_template(
        'index.html', 
        randomQs=random_qs,
        tags=tags, 
        patterns_by_tag=patterns_by_tag, 
        input_data=input_data
    )

if __name__ == '__main__':
    # Run the Flask application
    app.run(host='0.0.0.0', debug=True, port=9603)