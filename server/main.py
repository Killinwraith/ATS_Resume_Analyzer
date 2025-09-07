import datetime
from typing import Union
from fastapi import FastAPI

app = FastAPI(root_path="/api/v1")

@app.get("/")
async def read_root():
    return {"message": "Hello World"}


@app.get("/healthCheck")
async def healthCheck():
    return {"Message": "Server is running", "Status":"OK" , "Version":"1.0.0","Timestamp":datetime.datetime.now()}

@app.get("/items/{item_id}")
async def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}