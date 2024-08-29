import os
from flask import Blueprint, request, jsonify
import requests
from .utils.gemini_img import generate_image_content

img_bp = Blueprint("img_bp", __name__, template_folder="templates")

@img_bp.route('/img', methods=['POST'])
def img():
    if 'image' not in request.files:
        return jsonify({"error": "No image part"}), 400
    
    file = request.files['image']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Save the uploaded image to a folder
    upload_folder = r"C:\Python\CHAT_BOT_PROJECT\app\uploaded_images"
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)
    
    file_path = os.path.join(upload_folder, file.filename)
    file.save(file_path)
    
    user_text = request.form.get('userText')

    # Generate content from the uploaded image
    generated_content = generate_image_content(file_path, user_text)

    # You can perform additional processing or send the content to the client as needed
    return jsonify({"generated_content": generated_content}), 200
