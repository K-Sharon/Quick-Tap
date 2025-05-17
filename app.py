from flask import Flask, Response, jsonify
from flask_cors import CORS

import cv2
import numpy as np
import face_recognition
import os

app = Flask(__name__)
CORS(app)
# Load known faces
known_encodings = []
known_names = []
known_dir = 'Training'  # Folder with known images

for file in os.listdir(known_dir):
    img_path = os.path.join(known_dir, file)
    if file.lower().endswith(('.png', '.jpg', '.jpeg')):
        img = face_recognition.load_image_file(img_path)
        encodings = face_recognition.face_encodings(img)
        if encodings:
            known_encodings.append(encodings[0])
            known_names.append(file.split('.')[0])

# Initialize webcam
cap = cv2.VideoCapture(0)

# ✅ Use a global dictionary to store the last detected name
global_data = {"detected_name": "Unknown"}

def generate_frames():
    while True:
        success, frame = cap.read()
        if not success:
            break
        
        small_frame = cv2.resize(frame, (500, int((frame.shape[0] / frame.shape[1]) * 500)))

        face_locations = face_recognition.face_locations(small_frame)
        encodings = face_recognition.face_encodings(small_frame, face_locations)

        global_data["detected_name"] = "Unknown"  # Reset before detection

        for enc in encodings:
            matches = face_recognition.compare_faces(known_encodings, enc)
            if True in matches:
                global_data["detected_name"] = known_names[matches.index(True)]
        
        # Draw rectangle & name
        for (top, right, bottom, left) in face_locations:
            cv2.rectangle(small_frame, (left, top), (right, bottom), (0, 255, 0), 2)
            cv2.putText(small_frame, global_data["detected_name"], (left, top - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
        
        _, buffer = cv2.imencode('.jpg', small_frame)
        frame_bytes = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/get_name')
def get_name():
    print(global_data["detected_name"])
    return jsonify({"name": global_data["detected_name"]})

if __name__ == '__main__':
    app.run(debug=True)
