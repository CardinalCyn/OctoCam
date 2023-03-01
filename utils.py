from flask import Response
import cv2
def generate_feed(camera_index,frame_width,frame_height):
    """
    Generates a video feed from the camera at the given index. stops video feed if its cut off/ cant read frame
    """
    cap = cv2.VideoCapture(camera_index)
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        frame = cv2.resize(frame, (frame_width, frame_height))
        ret, buffer = cv2.imencode('.jpg', frame)
        if not ret:
            break
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')
    cap.release()
def generate_snapshot(camera_index,frame_width,frame_height):
    """
    Generates snapshot from the camera at the given index. if the frame didnt return, return error
    """
    cap = cv2.VideoCapture(camera_index)
    ret, frame = cap.read()
    if not ret:
        yield Response("error: could not capture frame")
    else:
        frame = cv2.resize(frame, (frame_width, frame_height))
        ret, buffer = cv2.imencode('.jpg', frame)
        if not ret:
            yield Response("error: could not encode frame")
        else:
            yield Response(buffer.tobytes(), mimetype='image/jpeg')
    cap.release()