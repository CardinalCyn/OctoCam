from flask import Flask
import webbrowser
from config import DEFAULT_PORT
import os
import sys
path = os.getcwd()
if getattr(sys, 'frozen', False):  # Check if running as a PyInstaller bundle
    base_path = sys._MEIPASS
else:
    base_path = os.getcwd()

app = Flask(__name__, template_folder=os.path.join(base_path, 'templates'), static_folder=os.path.join(base_path, 'static'))
# imports routes for flask
from routes import *
# logo path
logo_path="static/logo/OctoLogo.png"

# returns success if server is online
#runs pyfladesk application, gui on port
if __name__ == '__main__':
    hostname = socket.gethostname()
    local_ip = socket.gethostbyname(hostname)
    local_url = f'http://{local_ip}:{DEFAULT_PORT}'  # Change this if necessary to your local IP
    
    print(local_url)
    # Open the URL in the default web browser (Chrome)
    webbrowser.open(local_url)
    pythoncom.CoInitialize()
    app.run(host='0.0.0.0', port=DEFAULT_PORT)
