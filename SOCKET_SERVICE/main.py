import logging
from logging.handlers import RotatingFileHandler
from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit, join_room, leave_room
from sqlalchemy.event import listen
from app import db
from app.models import Notifications

# Configure logging to file
LOG_FILE = r'C:\Python\SOCKET_SERVICE\logger\socket_log.log'

# Create a rotating file handler to manage log file size
file_handler = RotatingFileHandler(LOG_FILE, maxBytes=1024 * 1024, backupCount=10)
file_handler.setLevel(logging.INFO)
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
file_handler.setFormatter(formatter)

# Create logger object and add file handler
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
logger.addHandler(file_handler)

# Remaining Flask-SocketIO setup
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:1234@localhost/chat_bot'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
socketio = SocketIO(app, cors_allowed_origins="*")

def handle_exceptions(func):
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            logger.error(f"Error in {func.__name__}: {str(e)}")
            raise 
    return wrapper

# Log database changes
def after_insert_update_delete(mapper, connection, target):
    print('yes')
    logger.info(f"Data Sent: {target.user_name} - {target.message}")
    message = {
        'name': target.user_name,
        'input': target.message
    }
    socketio.emit('database_change', message, room=f'tenant_{target.tenant_id}')

listen(Notifications, 'after_insert', after_insert_update_delete)

# Handle notifications endpoint with exception handling
@app.route('/notify', methods=['POST'])
@handle_exceptions
def notify():
    try:
        data = request.json
        logger.info(f"Received data: {data}")
        new_notification = Notifications(
            table_name=data.get('tableName'),
            type=data.get('type'),
            tenant_id=int(data.get('tenantid')),
            office_id=int(data.get('officeid')),
            user_name=data.get('username'),
            message=data.get('message'),
            date=data.get('current_date')
        )
        db.session.add(new_notification)
        db.session.commit()
        return jsonify({'message': 'Data received successfully'}), 200
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        return jsonify({'error': 'Internal Server Error'}), 500

# SocketIO event handlers with logging
@socketio.on('connect')
def handle_connect():
    logger.info('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    logger.info('Client disconnected')

@socketio.on('join_tenant_room')
def handle_join_tenant_room(data):
    tenant_id = data.get('tenantid')
    if tenant_id:
        join_room(f'tenant_{tenant_id}')
        logger.info(f'Client joined room for tenant {tenant_id}')

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=9604)