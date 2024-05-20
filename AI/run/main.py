from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse,FileResponse
from typing import List
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException

from fastapi import UploadFile, File, Form

import aiohttp
import asyncio
import os
import shutil
import subprocess
import aiofiles
import cv2
import sys

app = FastAPI()

# swagger 주소
# http://218.233.221.41:8080/swagger-ui/index.html#/

# uvicorn main:app --host 0.0.0.0 --port 9090 --reload  으로 실행

# 모든 출처에서의 요청을 허용
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 출처에서의 요청 허용
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메서드 허용
    allow_headers=["*"],  # 모든 헤더 허용
)

class RequestData(BaseModel):
    userId: str
    userImg: str
    clothImg: str
    
async def download_image(url: str, save_path: str):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            if response.status == 200:
                with open(save_path, 'wb') as f:
                    f.write(await response.read())
            else:
                raise HTTPException(status_code=response.status, detail=f"Failed to download image from {url}")
            
async def download_image_from_server(server_url: str, image_url: str, save_path: str):
    async with aiohttp.ClientSession() as session:
        async with session.post(server_url, data=image_url) as response:
            if response.status == 200:
                async with aiofiles.open(save_path, 'wb') as f:
                    await f.write(await response.read())
            else:
                detail = await response.text()
                raise HTTPException(status_code=response.status, detail=f"Failed to download image from server: {detail}")
            
# def run_ootd(model_path, cloth_path):
#     command = f"python run_ootd.py --model_path {model_path} --cloth_path {cloth_path}"
#     subprocess.run(command, shell=True)

    #shell=True를 설정하면 쉘에서 명령을 실행하므로, 명령어 문자열이 쉘에서 파싱되어 실행됩니다. 
    # 따라서 주의하여야 합니다. 만약 보안상의 이유로 shell=True를 사용하지 않고 실행하려면, 
    # 명령어를 리스트로 분할하여 subprocess.run()을 호출해야 합니다.
def run_ootd(model_path, cloth_path, userId):
    command = ["python", "run_ootd.py", "--model_path", model_path, "--cloth_path", cloth_path, "--id",userId]
    subprocess.run(command)

# def down_resolution(user_img_path, user_img_path):
#     command = ["python", "down_resolution.py", user_img_path, user_img_path]
#     subprocess.run(command)


# def test_py(str1, str2):
#     command = ["python", "test.py", "-i",str1, "-o", str2]
#     subprocess.run(command)
    
@app.post("/receive_data")
async def receive_data(request_data: RequestData):
    try:
        userId=request_data.userId
        user_img_url = request_data.userImg
        cloth_img_url = request_data.clothImg
        
        print(f"userId: {userId}")
        print(f"userImgUrl: {user_img_url}")
        print(f"clothImgUrl: {cloth_img_url}")
        
        cloth_img_path = "./"+userId+"_cloth.png"
        user_img_path="./"+userId+"_user.png"
    
        #download cloth image
        await download_image(cloth_img_url,cloth_img_path)
        
        # Download the user image from the specified server
        server_url = "http://218.233.221.41:8080/User/sentUserImageFile"
        await download_image_from_server(server_url, user_img_url, user_img_path)
        
        output_file = user_img_path
        input_image = cv2.imread(user_img_path)
    
        if input_image is None:
            print("이미지를 읽을 수 없습니다. 파일 경로를 확인하세요.")
            sys.exit()
    
        new_width=1500
        new_height=2000
        resized_image = cv2.resize(input_image, (new_width, new_height), interpolation=cv2.INTER_LANCZOS4)

        cv2.imwrite(output_file, resized_image)
        
        #test_py(cloth_img_url,user_img_url)

        run_ootd(user_img_path, cloth_img_path, userId)
        fitting_img_path="./"+userId+"_fittingImg.png"
    
        return FileResponse(fitting_img_path)
    except Exception as e:
        return JSONResponse(status_code=400, content={"message": str(e)})
    
    
class AcknowledgeData(BaseModel):
    userId: str
    
@app.post("/acknowledge_receipt")
async def acknowledge_receipt(ack_data: AcknowledgeData):
    try:
        
        userId = ack_data.userId
        # 파일 경로 설정
        cloth_img_path = f"./{userId}_cloth.png"
        user_img_path = f"./{userId}_user.png"
        fitting_img_path=f"./{userId}_fittingImg.png"
        
        # 이미지 파일 삭제
        if os.path.exists(cloth_img_path):
            os.remove(cloth_img_path)
        if os.path.exists(user_img_path):
            os.remove(user_img_path)
        if os.path.exists(fitting_img_path):
            os.remove(fitting_img_path)

        return JSONResponse(status_code=200, content={"message": "Images deleted successfully"})
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": str(e)})
