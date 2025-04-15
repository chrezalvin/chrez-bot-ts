from ultralytics import YOLO
import sys
import numpy as np
import cv2

model = YOLO("yolo11m.pt")
buffer_input = sys.stdin.buffer.read()

# convert buffer to numpy array
nparr = np.frombuffer(buffer_input, np.uint8)
image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

predict = model.predict(source=image, conf=0.25, save=False, show=False, verbose=False)

# check if the picture contains cat or dog (15 or 16)
for result in predict:
    for boxes_ in result.boxes:
        if boxes_.cls == 15:
            print("Cat ({:.0f}%)".format(boxes_.conf[0].item() * 100))
            break
        elif boxes_.cls == 16:
            print("Dog ({:.0f}%)".format(boxes_.conf[0].item() * 100))
            break