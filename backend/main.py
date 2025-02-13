from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine, Base, SessionLocal
import models, schemas, crud, database
from typing import List

# DB 初期化
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS 設定 (フロントエンドとの通信を許可)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB セッション取得
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Welcome to SmartRecipe API!"}

# ユーザー一覧取得エンドポイント
@app.get("/users/", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_users(db, skip, limit)

# 冷蔵庫の食材一覧取得エンドポイント
@app.get("/fridge_items/", response_model=List[schemas.FridgeItem]) 
def read_fridge_items(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_fridge_items(db, skip, limit)

# 食材を登録するエンドポイント
@app.post("/fridge_items/", response_model=schemas.FridgeItem)
def create_fridge_item(item: schemas.FridgeItemCreate, db: Session = Depends(get_db)):
    return crud.create_fridge_item(db=db, item=item)

@app.patch("/fridge_items/{item_id}/decrease/")
def decrease_fridge_item(item_id: int, db: Session = Depends(get_db)):
    """食材の数を1つ減らす"""
    item = db.query(models.FridgeItem).filter(models.FridgeItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if item.quantity > 0:
        item.quantity -= 1
        db.commit()
        db.refresh(item)
    return item