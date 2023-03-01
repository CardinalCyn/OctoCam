from flask import render_template,Response,request
from app import app
from pygrabber.dshow_graph import FilterGraph
from utils import generate_feed,generate_snapshot
# renders html for application
@app.route('/')
def index():
    return render_template('base.html')
# returns success if server is online
@app.route('/serverOnline')
def get_server():
    return {'status':'successful'}

# iterates through camera list, returns list. returns objects of devices and their indices
@app.route('/get_cameras')
def get_cameras():
    devices = FilterGraph().get_input_devices()
    available_cameras = {}
    for device_index,device_name in enumerate(devices):
        available_cameras[device_name]=device_index
    return available_cameras

@app.route('/stream/<int:camera_index>/<int:frame_width>/<int:frame_height>')
def video_feed(camera_index,frame_width,frame_height):
    """
    Returns a video feed for the camera at the given index.
    """
    user_agent=request.headers.get('User-Agent')
    if "SuccessCode" in user_agent:
        return Response("success")
    return Response(generate_feed(camera_index,frame_width,frame_height),
                    mimetype='multipart/x-mixed-replace; boundary=frame')
@app.route('/snapshot/<int:camera_index>/<int:frame_width>/<int:frame_height>')
def snapshot(camera_index,frame_width,frame_height):
    """
    returns snapshot jpg for the camera at given index
    """
    user_agent=request.headers.get('User-Agent')
    if "SuccessCode" in user_agent:
        return Response("success")
    return next(generate_snapshot(camera_index,frame_width,frame_height))