### main.py에서 sub로 코드 돌릴 수 있는지 확인차 추가한 코드. 추후 삭제할 것

import os
import sys
import cv2
import argparse

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
