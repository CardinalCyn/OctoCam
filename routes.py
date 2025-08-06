import socket
from flask import render_template,Response,request,jsonify
from app import app
from config import DEFAULT_PORT
from pygrabber.dshow_graph import FilterGraph
from utils import generate_feed,generate_snapshot
import pythoncom


# Renders the HTML for the application
@app.route("/")
def index():
    return render_template("base.html")

@app.route("/serverOnline")
def get_server():
    return {"status":"successful"}

# iterates through camera list, returns list. returns objects of devices and their indices
@app.route("/get_cameras")
def get_cameras():
    try:
        available_cameras = {}
        pythoncom.CoInitialize()
        devices = FilterGraph().get_input_devices()
        available_cameras = {}
        for device_index,device_name in enumerate(devices):
            available_cameras[device_name]=device_index
        print(available_cameras)
        return {"status": "successful", "cameras": available_cameras}
    except Exception as ex:
        print(ex)
        return {"status": "error", "error": str(ex)}

@app.route("/stream/<int:camera_index>/<int:frame_width>/<int:frame_height>")
def video_feed(camera_index,frame_width,frame_height):
    """
    Returns a video feed for the camera at the given index.
    """
    return Response(generate_feed(camera_index,frame_width,frame_height),
                    mimetype="multipart/x-mixed-replace; boundary=frame")
@app.route("/snapshot/<int:camera_index>/<int:frame_width>/<int:frame_height>")
def snapshot(camera_index,frame_width,frame_height):
    """
    returns snapshot jpg for the camera at given index
    """
    return next(generate_snapshot(camera_index,frame_width,frame_height))
@app.route("/get_ip")
def get_ip():
    """
    returns local ip address
    """
    hostname = socket.gethostname()
    local_ip = socket.gethostbyname(hostname)
    return {'ip': local_ip,'port':DEFAULT_PORT}
