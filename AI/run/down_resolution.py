import os
import sys
import cv2
import argparse

def resize(input, output):
    image_extension = ('.jpg', '.png', '.jpeg')
    _, file_extension = os.path.splitext(input)
    
    if file_extension in image_extension:
        print('확장자:', file_extension)
        print('이미지 파일입니다.')
        img_resize(input, output)
    else:
        print(file_extension, '은(는) 지원하지 않는 파일 형식입니다. 이미지 파일을 입력해주세요.')
        sys.exit()  

def set_output(input, output):
    file_path = os.path.basename(input)
    file_name, file_extension = os.path.splitext(file_path)
    file_name = file_name + file_extension
    output_file = os.path.join(output, file_name)
    return output_file

def img_resize(input, output):
    output_file = set_output(input, output)
    input_image = cv2.imread(input)
    
    if input_image is None:
        print("이미지를 읽을 수 없습니다. 파일 경로를 확인하세요.")
        sys.exit()
    
    #원하는 해상도 값 바꾸고 싶다면 여기서 바꾸기
    new_width=768
    new_height=1024
    resized_image = cv2.resize(input_image, (new_width, new_height), interpolation=cv2.INTER_LANCZOS4)

    cv2.imwrite(output_file, resized_image)
    print('이미지 리사이징 완료')
    
def main():
    parser = argparse.ArgumentParser(description='명령줄에서 해상도 설정을 변경하는 스크립트')
    parser.add_argument('-input', '-i', type=str, help='이미지 파일 경로를 입력해주세요.')
    parser.add_argument('-output', '-o', type=str, default='.', help='출력 파일 경로를 입력해주세요.')
    
    args = parser.parse_args()
    if not args.input:
        print('사용법: down_resolution.py [-h] [-input INPUT] [-output OUTPUT] [-mode {FHD,HD,SD}] [-ratio RATIO]')
        print("-h 옵션을 사용하여 자세한 도움말을 확인하세요.")
        sys.exit()
    
    input = args.input
    output = args.output

    print('입력 파일 경로:', input)
    print('출력 파일 저장 경로:', output)  
    resize(input, output)

if __name__ == '__main__':
    main()
