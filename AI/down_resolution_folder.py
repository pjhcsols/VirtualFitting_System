import os
import cv2
import argparse

def resize_folder(input_folder, output_folder):
    image_extensions = ('.jpg', '.png', '.jpeg')
    
    # 입력 폴더 내의 모든 파일을 가져옴
    for filename in os.listdir(input_folder):
        input_path = os.path.join(input_folder, filename)
        output_path = os.path.join(output_folder, filename)
        
        # 파일이 이미지 파일인지 확인
        _, file_extension = os.path.splitext(input_path)
        if file_extension.lower() in image_extensions:
            print('이미지 파일:', input_path)
            img_resize(input_path, output_path)
        else:
            print('지원하지 않는 파일 형식:', input_path)

def set_output(input_path, output_folder):
    file_name = os.path.basename(input_path)
    output_path = os.path.join(output_folder, file_name)
    return output_path

def img_resize(input_path, output_path):
    input_image = cv2.imread(input_path)
    
    if input_image is None:
        print("이미지를 읽을 수 없습니다. 파일 경로를 확인하세요.")
        return
    
    # 원하는 해상도 값 바꾸기
    new_width = 1500
    new_height = 2000
    resized_image = cv2.resize(input_image, (new_width, new_height), interpolation=cv2.INTER_LANCZOS4)

    cv2.imwrite(output_path, resized_image)
    print('이미지 리사이징 완료:', output_path)

def main():
    parser = argparse.ArgumentParser(description='폴더 내 모든 이미지 파일의 해상도를 변경하는 스크립트')
    parser.add_argument('-input_folder', '-i', type=str, help='이미지 파일이 있는 입력 폴더 경로를 입력해주세요.')
    parser.add_argument('-output_folder', '-o', type=str, default='.', help='변경된 이미지 파일을 저장할 폴더 경로를 입력해주세요.')
    
    args = parser.parse_args()
    if not args.input_folder:
        print('사용법: python down_resolution_folder.py -input_folder [입력폴더경로] -output_folder [출력폴더경로]')
        print("-h 옵션을 사용하여 자세한 도움말을 확인하세요.")
        return
    
    input_folder = args.input_folder
    output_folder = args.output_folder

    print('입력 폴더 경로:', input_folder)
    print('출력 폴더 저장 경로:', output_folder)  
    resize_folder(input_folder, output_folder)

if __name__ == '__main__':
    main()