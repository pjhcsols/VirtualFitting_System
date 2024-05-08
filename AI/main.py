from fastapi import FastAPI

app = FastAPI()

@app.get("/image/{userid}")
def read_userid(user_id:int, user_iamge: str, cloth_image:str, type:Optional[int]=None):
    return {"user_id":user_id, "user_image_url":user_iamge, "cloth_image_url":cloth_image, "cloth_type": type}

@app.post("result/{userid}")
def save_result(user_id:int, image_location:str):
    return{"user_id":user_id, "image_location":image_location}