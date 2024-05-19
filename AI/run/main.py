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
    userImg: str
    clothImg: str
    
#IMAGE_DIR = "./"
    
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
    
@app.post("/receive_data")
async def receive_data(request_data: RequestData):
    try:
       
        user_img_url = request_data.userImg
        cloth_img_url = request_data.clothImg
        
        print(f"userImgUrl: {user_img_url}")
        print(f"clothImgUrl: {cloth_img_url}")
        
        #save_img_path = os.path.join(IMAGE_DIR, "save_test.png")
        cloth_img_path = "./cloth.png"
        user_img_path="./user.png"
    
        #download cloth image
        await download_image(cloth_img_url,cloth_img_path)
        
        # Download the user image from the specified server
        server_url = "http://218.233.221.41:8080/User/sentUserImageFile"
        await download_image_from_server(server_url, user_img_url, user_img_path)
    
        #return request_model.dict()
        #image_path = r"E:\VirtualFitting_System\AI\run\images_output\out_hd_0.png"
        return FileResponse(user_img_path)
        #return save_img_path
    except Exception as e:
        return JSONResponse(status_code=400, content={"message": str(e)})

# Define the directory to store images

# IMAGE_DIR = "./images"
# os.makedirs(IMAGE_DIR, exist_ok=True)

# async def download_image(url: str, save_path: str):
#     async with aiohttp.ClientSession() as session:
#         async with session.get(url) as response:
#             if response.status == 200:
#                 with open(save_path, 'wb') as f:
#                     f.write(await response.read())
#             else:
#                 raise HTTPException(status_code=response.status, detail=f"Failed to download image from {url}")

# @app.post("/receive_data/")
# async def receive_data(request_data: RequestData):
    
#     try:
        
#         print(f"userImgUrl: {request_data.userImgUrl}")
#         print(f"productImgUrl: {request_data.productImgUrl}")
#         # user_img_path = os.path.join(IMAGE_DIR, "user_image.png")
#         # #user_img_path="C:/Users/LG/Desktop/VirtualFitting_System/basilium-server/src/main/java/basilium/basiliumserver/userImageStorage/example_1713958965868_mysql.png"
#         # product_img_path = os.path.join(IMAGE_DIR, "product_image.png")
#         # #product_img_path = "https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/brand01_1714827354089_ad.png"

#         # # Download images
#         # await asyncio.gather(
#         #     download_image(request_data.userImgUrl, user_img_path),
#         #     download_image(request_data.productImgUrl, product_img_path)
#         # )

#         # # Run the virtual fitting script (replace 'run_ootd.py' with your actual script)
#         # result_img_path = os.path.join(IMAGE_DIR, "result_image.png")
#         # #subprocess.run(["python", "run_ootd.py", user_img_path, product_img_path, result_img_path], check=True)

#         # # Return the result image
#         # return FileResponse(result_img_path)
#         image_path = r"E:\VirtualFitting_System\AI\run\images_output\out_hd_0.png"
#         return FileResponse(image_path)
    
#     except Exception as e:
#         return JSONResponse(status_code=400, content={"message": str(e)})


#프론트에서 string 3개 받기, 내 컴퓨터에 저장된 이미지 프론트로 보내기 성공

# class RequestData(BaseModel):
#     userImg: str
#     closeimage: str

# @app.post("/receive_data/")
# async def receive_data(request_data: RequestData):
#     try:
#         # 배열 형태의 데이터를 각각의 필드에 맞게 파싱
#         data = {
#             "userImg": request_data.userImg,
#             "closeimage": request_data.closeimage
#         }
#         request_model = RequestData(**data)
#         print(f"userImgUrl: {request_model.userImg}")
#         print(f"productImgUrl: {request_model.closeimage}")
#         print(request_model.dict())
#         #return request_model.dict()
#         image_path = r"E:\VirtualFitting_System\AI\run\images_output\out_hd_0.png"
#         return FileResponse(image_path)
#     except Exception as e:
#         return JSONResponse(status_code=400, content={"message": str(e)})



@app.get("/")
def root():
    return {"message": "Hello World"}



