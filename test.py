# bottle_and_cap_detector.py

import cv2
import numpy as np
from ultralytics import YOLO

# Class ID for 'bottle' in COCO
BOTTLE_ID = 39

# Load YOLOv8 pretrained on COCO
model = YOLO("yolov8n.pt")

# Start webcam
cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print("❌ Cannot open webcam")
    exit()

print("🎥 Press 'q' to quit")
while True:
    ret, frame = cap.read()
    if not ret:
        print("❌ Failed to grab frame")
        break

    results = model(frame, verbose=False)[0]
    boxes = results.boxes

    annotated = frame.copy()
    found_bottle = False

    for i, box in enumerate(boxes):
        cls = int(box.cls[0])
        if cls == BOTTLE_ID:
            found_bottle = True
            x1, y1, x2, y2 = map(int, box.xyxy[0])

            # Draw bounding box around the bottle
            cv2.rectangle(annotated, (x1, y1), (x2, y2), (0, 255, 0), 2)

            # Crop top of the bottle (20% of top area)
            top_crop = frame[y1 : y1 + int((y2 - y1) * 0.2), x1:x2]

            # Simple check: average brightness
            if top_crop.size == 0:
                cap_present = False
            else:
                avg_brightness = np.mean(cv2.cvtColor(top_crop, cv2.COLOR_BGR2GRAY))
                cap_present = avg_brightness < 100  # You can tune this threshold

            status = "✅ Cap ON" if cap_present else "❌ Cap OFF"
            color = (0, 255, 0) if cap_present else (0, 0, 255)
            cv2.putText(
                annotated,
                status,
                (x1, y1 - 10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.8,
                color,
                2,
            )

    if not found_bottle:
        cv2.putText(
            annotated,
            "No bottle detected",
            (20, 40),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (0, 0, 255),
            2,
        )

    # Show the frame
    cv2.imshow("Bottle + Cap Detection", annotated)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()
