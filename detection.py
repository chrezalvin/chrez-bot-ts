import sys
import cv2
import numpy as np
import json
import os
import base64
from ultralytics import YOLO

from base64 import b64decode

dicts = {}

def predict_image(model_key: str, image: np.ndarray):
    model : YOLO = dicts[model_key]["model"]
    results = model.predict(
        source=image, 
        conf=dicts[model_key]["info"]["min_conf"],
        classes=dicts[model_key]["included_classes"],
        save=False,
        show=False,
        verbose=False,
    )
    return results

def load_dicts():
    model_dir = "./models/"
    info_json_file = "info.json"
    model_file = "model.pt"

    keyList = os.listdir(model_dir)

    for key in keyList:
        dicts[key] = {}
        dicts[key]["model"] = YOLO(os.path.join(model_dir, key, model_file))

        with open(os.path.join(model_dir, key, info_json_file), "r") as f:
            info = json.load(f)
            included_classes = []
            for i, class_name in enumerate(info["classes"]):
                included_classes.append(class_name["id"])
                    
            dicts[key]["included_classes"] = included_classes
            dicts[key]["info"] = info

def main():
    load_dicts()
    while True:
        try:
            raw_data = b64decode(sys.stdin.readline())

            json_data = json.loads(raw_data)

            # make sure the raw data have 'image' key
            if 'image' not in json_data:
                raise ValueError("No 'image' key found in the input data")
            
            # check if model key exists
            model = "yolo11m" # default model
            if 'model' in json_data:
                if json_data['model'] not in dicts:
                    raise ValueError(f"Model '{json_data['model']}' not found")
                
                model = json_data['model']

            image_decoded = b64decode(json_data['image'])
            image_array = np.frombuffer(image_decoded, np.uint8)
            image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

            results = predict_image(model, image)

            if not results or len(results) == 0:
                raise ValueError("No results returned from prediction")

            result_img = results[0].plot()
            cv2.imwrite("temp_result.png", result_img)

            first_res = results[0].boxes[0]
            cls_num = first_res.cls
            conf = first_res.conf
            class_name: str = results[0].names[int(cls_num)]

            json_response = {
                "content": f"{class_name.capitalize()} ({(float(conf) * 100):.0f}%)",
                "model": model,
                "image_path": "temp_result.png"
            }

            print(json.dumps(json_response))

        except Exception as e:
            json_response = {
                "error": f"{str(e)}"
            }

            print(json.dumps(json_response))

        finally:
            sys.stdout.flush()

if __name__ == "__main__":
    main()