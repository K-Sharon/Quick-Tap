# Quick-Tap: QR Code Attendance System with Face Recognition

**Quick-Tap** is a smart attendance management system that integrates:
- QR Code-based access
- Face recognition verification
- Automatic time, date, and location logging
- Attendance storage using Google Sheets and Apps Script

This system ensures that only authorized users can mark their attendance, combining security with automation.

---

## Features

- Scan a QR code to open the web-based attendance form
- Capture and verify user's face via webcam using OpenCV and face_recognition
- Record current date, time, and location automatically using browser APIs
- Submit verified attendance to Google Sheets through Google Apps Script

---
## Technologies Used

- HTML, CSS, JavaScript (Frontend)
- Python (Flask, OpenCV, face_recognition)
- Google Apps Script (for integrating with Google Sheets)
- Google Sheets (for attendance record storage)
- Browser Geolocation API

---

## How It Works

1. User scans a QR code that links to the `index.html` form.
2. The form auto-fills the current time and geolocation.
3. Upon form submission, the system:
   - Captures a webcam image
   - Sends it to the Flask backend
   - Verifies the face against known entries
4. If the face is recognized, attendance is submitted to Google Sheets.

---
