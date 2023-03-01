from flask import Flask
from pyfladesk import init_gui

app = Flask(__name__)
# imports routes for flask
from routes import *
# logo path
logo_path="static/logo/OctoLogo.png"
#runs pyfladesk application, gui on port
if __name__ == '__main__':
    init_gui(app,port= 8081,window_title="OctoCam",icon=logo_path)