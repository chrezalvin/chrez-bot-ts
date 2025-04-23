import sys
import cv2
import numpy as np

from base64 import b64decode
from ultralytics import YOLO

def main():
    model = YOLO("yolo11m.pt")

    # list of classes labels to detect
    # 14 = bird, 15 = cat, 16 = dog, 17 = horse, 18 = sheep, 19 = cow, 20 = elephant, 21 = bear, 22 = zebra
    classes = [15, 16, 17, 18, 19, 20, 21, 22]
    min_conf = 0.25
    
    while True:
        try:
            image_data = b64decode(sys.stdin.readline())

            result = cv2.imdecode(np.frombuffer(image_data, np.uint8), cv2.IMREAD_COLOR)

            predict = model.predict(source=result, conf=min_conf, save=False, show=False, verbose=False)

            for result in predict:
                for boxes_ in result.boxes:
                    if boxes_.cls in classes:
                        print(f"{predict[0].names[int(boxes_.cls)].capitalize()} ({boxes_.conf[0].item() * 100:.0f}%)")
                        break

            sys.stdout.flush()

        except Exception as e:
            print(f"Error: {e}", file=sys.stderr)
            break

if __name__ == "__main__":
    main()