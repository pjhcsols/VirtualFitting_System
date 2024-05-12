from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from typing import List
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

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
    closeimage: str

@app.post("/receive_data/")
async def receive_data(request_data: List[str]):
    try:
        # 배열 형태의 데이터를 각각의 필드에 맞게 파싱
        data = {
            "userId": request_data[0],
            "userImg": request_data[1],
            "closeimage": request_data[2]
        }
        request_model = RequestData(**data)
        return request_model.dict()
    except Exception as e:
        return JSONResponse(status_code=400, content={"message": str(e)})


# # Pydantic 모델 정의
# class RequestData(BaseModel):
#     userId: str
#     responseBodyText: str
#     productPhotoUrl: str
    
# @app.post("/")
# async def process_data_root(data: RequestData):
#     user_id = data.userId
#     response_body_text = data.responseBodyText
#     product_photo_url = data.productPhotoUrl
    
#     return {
#         "userId": user_id,
#         "responseBodyText": response_body_text,
#         "productPhotoUrl": product_photo_url
#     }

# # # POST 요청을 처리하는 경로
# # @app.post("/process_data/")
# # async def process_data(data: RequestData):
# #     user_id = data.userId
# #     response_body_text = data.responseBodyText
# #     product_photo_url = data.productPhotoUrl
    
# #     return {
# #         "userId": user_id,
# #         "responseBodyText": response_body_text,
# #         "productPhotoUrl": product_photo_url
# #     }

@app.get("/")
def root():
    return {"message": "Hello World"}



