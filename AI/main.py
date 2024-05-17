from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from typing import List
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException
from fastapi.responses import FileResponse

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
        # # 배열 형태의 데이터를 각각의 필드에 맞게 파싱
        # data = {
        #     "userId": request_data[0],
        #     "userImg": request_data[1],
        #     "closeimage": request_data[2]
        # }
        # request_model = RequestDa ta(**data)
        # #return request_model.dict()
        image_path = r"E:\VirtualFitting_System\AI\run\images_output\out_hd_0.png"
        return FileResponse(image_path)
    except Exception as e:
        return JSONResponse(status_code=400, content={"message": str(e)})

# uvicorn main:app --host 0.0.0.0 --port 9090 --reload  으로 실행

# E:\VirtualFitting_System\AI\run\images_output\out_hd_0.png

@app.get("/")
def root():
    return {"message": "Hello World"}



