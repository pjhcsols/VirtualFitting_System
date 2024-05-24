import requests
from PIL import Image
from io import BytesIO
import os
import argparse

def download_image(url):
    """
    이미지를 다운로드하여 PIL Image 객체로 반환하는 함수

    Parameters:
        url (str): 이미지의 URL

    Returns:
        PIL.Image.Image or None: 다운로드한 이미지의 PIL Image 객체 또는 다운로드 실패 시 None
    """
    try:
        response = requests.get(url)
        response.raise_for_status()  # HTTP 오류가 발생했는지 확인
        return Image.open(BytesIO(response.content))
    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err}")
    except Exception as err:
        print(f"An error occurred: {err}")
        return None

def crop_image(image, width_ratio, height_ratio, crop_position):
    """
    이미지를 주어진 비율과 위치에 맞게 자르는 함수

    Parameters:
        image (PIL.Image.Image): 자를 이미지의 PIL Image 객체
        width_ratio (float): 너비 비율
        height_ratio (float): 높이 비율
        crop_position (str): 이미지를 자를 위치 ('center', 'bottom', 'top')

    Returns:
        PIL.Image.Image: 자른 이미지의 PIL Image 객체
    """
    # 이미지 크기 가져오기
    width, height = image.size
    
    # 목표 비율 계산
    target_ratio = width_ratio / height_ratio
    
    # 현재 이미지의 비율
    current_ratio = width / height
    
    # 이미지를 자를 좌표 계산
    if current_ratio > target_ratio:
        # 이미지가 더 넓을 경우: 가로를 기준으로 자르기
        new_width = int(height * target_ratio)
        new_height = height
    else:
        # 이미지가 더 높을 경우: 세로를 기준으로 자르기
        new_width = width
        new_height = int(width / target_ratio)
    
    # 이미지를 자를 위치에 따라 좌표 설정
    if crop_position == 'center':
        # 이미지를 중앙에서 자르기
        left = (width - new_width) / 2
        top = (height - new_height) / 2
        right = (width + new_width) / 2
        bottom = (height + new_height) / 2
    elif crop_position == 'bottom':
        # 이미지를 하단에서 자르기
        left = (width - new_width) / 2
        top = height - new_height
        right = (width + new_width) / 2
        bottom = height
    elif crop_position == 'top':
        # 이미지를 상단에서 자르기
        left = (width - new_width) / 2
        top = 0
        right = (width + new_width) / 2
        bottom = new_height
    else:
        raise ValueError("crop_position must be 'center', 'bottom', or 'top'")
    
    # 이미지 자르기
    return image.crop((left, top, right, bottom))

def process_folder(folder_path, width_ratio, height_ratio, crop_position):
    """
    지정된 폴더 내 모든 이미지를 자르고 저장하는 함수

    Parameters:
        folder_path (str): 이미지가 저장된 폴더의 경로
        width_ratio (float): 너비 비율
        height_ratio (float): 높이 비율
        crop_position (str): 이미지를 자를 위치 ('center', 'bottom', 'top')
    """
    # 폴더 안의 모든 파일을 처리
    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)
        if os.path.isfile(file_path):
            try:
                img = Image.open(file_path)
                cropped_img = crop_image(img, width_ratio, height_ratio, crop_position)
                cropped_img.save(file_path)  # 같은 파일명으로 저장
                print(f"Processed and saved: {file_path}")
            except Exception as e:
                print(f"Failed to process {file_path}: {e}")

if __name__ == "__main__":
    # 명령줄 인수 파싱
    parser = argparse.ArgumentParser(description='Download and crop image')
    parser.add_argument('--image_url', type=str, help='URL of the image to download')
    parser.add_argument('--output_file', type=str, default='./output.png', help='Filename to save the cropped image')
    parser.add_argument('--folder_path', type=str, help='Path to folder containing images to crop')
    parser.add_argument('--width_ratio', type=float, required=True, help='Width ratio for cropping')
    parser.add_argument('--height_ratio', type=float, required=True, help='Height ratio for cropping')
    parser.add_argument('--crop_position', type=str, choices=['center', 'bottom', 'top'], default='center', help='Position to crop the image (center, bottom, or top)')
    args = parser.parse_args()
    
    width_ratio = args.width_ratio
    height_ratio = args.height_ratio
    crop_position = args.crop_position
    
    if args.image_url and args.output_file:
        # 이미지 다운로드 및 자르기
        img = download_image(args.image_url)
        if img is not None:
            cropped_img = crop_image(img, width_ratio, height_ratio, crop_position)
            # 결과 저장
            cropped_img.save(args.output_file)
            print(f"Image saved as: {args.output_file}")
    
    if args.folder_path:
        # 폴더 내 모든 이미지 자르기
        process_folder(args.folder_path, width_ratio, height_ratio, crop_position)
