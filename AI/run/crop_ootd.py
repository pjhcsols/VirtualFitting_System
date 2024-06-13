from pathlib import Path
import sys
from PIL import Image
import numpy as np
import matplotlib.pyplot as plt
import cv2
from ultralytics import YOLO

# Project path settings
PROJECT_ROOT = Path(__file__).absolute().parents[1].absolute()
sys.path.insert(0, str(PROJECT_ROOT))

from utils_ootd import get_mask_location
from preprocess.openpose.run_openpose import OpenPose
from preprocess.humanparsing.run_parsing import Parsing
from ootd.inference_ootd_hd import OOTDiffusionHD
from ootd.inference_ootd_dc import OOTDiffusionDC

# Argument parsing
import argparse
parser = argparse.ArgumentParser(description='run ootd')
parser.add_argument('--gpu_id', '-g', type=int, default=0, required=False)
parser.add_argument('--model_path', type=str, default="", required=True)
parser.add_argument('--cloth_path', type=str, default="", required=True)
parser.add_argument('--id', type=str, default="", required=True)
parser.add_argument('--model_type', type=str, default="hd", required=False)
parser.add_argument('--category', '-c', type=int, default=0, required=False)
parser.add_argument('--scale', type=float, default=2.5, required=False)
parser.add_argument('--step', type=int, default=20, required=False)
parser.add_argument('--sample', type=int, default=1, required=False)
parser.add_argument('--seed', type=int, default=-1, required=False)
args = parser.parse_args()

# Model initialization
openpose_model = OpenPose(args.gpu_id)
parsing_model = Parsing(args.gpu_id)

category_dict = ['upperbody', 'lowerbody', 'dress']
category_dict_utils = ['upper_body', 'lower_body', 'dresses']

model_type = args.model_type
category = args.category
cloth_path = args.cloth_path
model_path = args.model_path
user_id = args.id

image_scale = args.scale
n_steps = args.step
n_samples = args.sample
seed = args.seed

if model_type == "hd":
    model = OOTDiffusionHD(args.gpu_id)
elif model_type == "dc":
    model = OOTDiffusionDC(args.gpu_id)
else:
    raise ValueError("model_type must be 'hd' or 'dc'!")

# YOLO model for object detection
yolo_model = YOLO('../yolov8n.pt')

def detect_objects(image_path):
    image = cv2.imread(image_path)
    results = yolo_model(image)[0]

    detections = []
    for result in results.boxes.data.tolist():
        x1, y1, x2, y2, score, class_id = result
        detections.append([int(x1), int(y1), int(x2), int(y2), round(score, 3),
                           results.names[int(class_id)]])
    return detections

def crop_image(image, width_ratio, height_ratio, crop_box=None):
    """
    이미지와 crop box를 입력받아 비율에 맞게 이미지를 자르는 함수.
    """
    width, height = image.size
    target_ratio = width_ratio / height_ratio
    current_ratio = width / height

    if current_ratio > target_ratio:
        new_width = int(height * target_ratio)
        new_height = height
    else:
        new_width = width
        new_height = int(width / target_ratio)
    
    if crop_box:
        x1, y1, x2, y2 = crop_box
        center_x = (x1 + x2) // 2
        center_y = (y1 + y2) // 2
        left = max(0, center_x - new_width // 2)
        top = max(0, center_y - new_height // 2)
        right = min(width, center_x + new_width // 2)
        bottom = min(height, center_y + new_height // 2)
        if right - left < new_width:
            left = max(0, right - new_width)
        if bottom - top < new_height:
            top = max(0, bottom - new_height)
    else:
        left = (width - new_width) / 2
        top = (height - new_height) / 2
        right = (width + new_width) / 2
        bottom = (height + new_height) / 2
    
    return image.crop((left, top, right, bottom))

if __name__ == '__main__':

    if model_type == 'hd' and category != 0:
        raise ValueError("model_type 'hd' requires category == 0 (upperbody)!")

    # Image paths
    cloth_image_path = args.cloth_path
    model_image_path = args.model_path

    # Load images
    cloth_image = Image.open(cloth_image_path)
    model_image = Image.open(model_image_path)

    # Object detection and cropping for cloth image
    cloth_detections = detect_objects(cloth_image_path)
    if cloth_detections:
        x1, y1, x2, y2, _, _ = cloth_detections[0]
        crop_box = (x1, y1, x2, y2)
        cropped_cloth_image = crop_image(cloth_image, 3, 4, crop_box=crop_box)
    else:
        cropped_cloth_image = crop_image(cloth_image, 3, 4)
    print("Cropped cloth image size:", cropped_cloth_image.size)

    # Object detection and cropping for model image
    model_detections = detect_objects(model_image_path)
    if model_detections:
        x1, y1, x2, y2, _, _ = model_detections[0]
        crop_box = (x1, y1, x2, y2)
        cropped_model_image = crop_image(model_image, 3, 4, crop_box=crop_box)
    else:
        cropped_model_image = crop_image(model_image, 3, 4)
    print("Cropped model image size:", cropped_model_image.size)

    # Display cropped images
    #plt.figure(figsize=(10, 5))
    #plt.subplot(1, 2, 1)
    #plt.imshow(cropped_cloth_image)
    #plt.axis('off')
    #plt.title('Cropped Cloth Image')

    #plt.subplot(1, 2, 2)
    #plt.imshow(cropped_model_image)
    #plt.axis('off')
    #plt.title('Cropped Model Image')

    #plt.show()

    # Resize cropped images to match required input size
    cloth_img = cropped_cloth_image.resize((768, 1024))
    model_img = cropped_model_image.resize((768, 1024))

    # Further processing with OpenPose and Parsing models
    keypoints = openpose_model(model_img.resize((384, 512)))
    model_parse, _ = parsing_model(model_img.resize((384, 512)))

    mask, mask_gray = get_mask_location(model_type, category_dict_utils[category], model_parse, keypoints)
    mask = mask.resize((768, 1024), Image.NEAREST)
    mask_gray = mask_gray.resize((768, 1024), Image.NEAREST)

    masked_vton_img = Image.composite(mask_gray, model_img, mask)
    masked_vton_img.save('./images_output/mask.jpg')

    # Running the OOTDiffusion model
    images = model(
        model_type=model_type,
        category=category_dict[category],
        image_garm=cloth_img,
        image_vton=masked_vton_img,
        mask=mask,
        image_ori=model_img,
        num_samples=n_samples,
        num_steps=n_steps,
        image_scale=image_scale,
        seed=seed,
    )

    save_path = "./" + user_id + "_fittingImg.png"

    for image in images:
        image.save(save_path)
