from flask import Flask, render_template, send_from_directory
from app.ecopy_bp import ecopy_bp
from app.cth import cth_bp
from app.cth_enq import cth_enq_bp

app = Flask(__name__)

app.register_blueprint(ecopy_bp, name='ecopy_bp')
app.register_blueprint(cth_bp, name='cth_bp')
app.register_blueprint(cth_enq_bp, name='cth_enq_bp')

@app.route('/')
def index():
    return render_template('home.html')

@app.route('/ecopy')
def ecopy():
    return render_template('ecopy.html')

@app.route('/cth')
def cth():
    return render_template('cth.html')

@app.route('/cthenq')
def cthenq():
    return render_template('cth_enq.html')

@app.route('/downloads/<filename>')
def download_file(filename):
    return send_from_directory('C:/Python/ICEGATE_AUTOMATION/downloads', filename)

if __name__ == '__main__':
    app.run(debug=False, port=9605, host='0.0.0.0')
