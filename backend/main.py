from fastapi import FastAPI, Depends, HTTPException, Query, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine, Base, SessionLocal
import models, schemas, crud, database
from typing import List, Optional
from youtube_api import router as youtube_router
import requests
import os
import logging
from routes.favorites import router as favorites_router
from routes import router

# DB 初期化
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

# YouTube動画検索APIを追加
app.include_router(youtube_router)

app.include_router(favorites_router, prefix="/favorites", tags=["favorites"])

# ログ設定
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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

# ユーザー一覧取得
@app.get("/users/", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_users(db, skip, limit)

# 冷蔵庫の食材一覧取得
@app.get("/fridge_items/", response_model=List[schemas.FridgeItem]) 
def read_fridge_items(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_fridge_items(db, skip, limit)

# 食材を登録する
@app.post("/fridge_items/", response_model=schemas.FridgeItem)
def create_fridge_item(item: schemas.FridgeItemCreate, db: Session = Depends(get_db)):
    return crud.create_fridge_item(db=db, item=item)

# 食材を一つ減らす
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

# 食材を一つ増やす
@app.patch("/fridge_items/{item_id}/increase/")
def increase_quantity(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(models.FridgeItem).filter(models.FridgeItem.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    db_item.quantity += 1
    db.commit()
    db.refresh(db_item)
    return db_item

# 食材を削除
@app.delete("/fridge_items/{item_id}/")
def delete_food_item(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(models.FridgeItem).filter(models.FridgeItem.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(db_item)
    db.commit()
    return {"message": "Item deleted successfully"}

# レシピ検索
@app.get("/recipes/")
def get_recipes(
    ingredients: Optional[List[str]] = Query(None, description="食材リスト (複数指定可能)"),
    keywords: Optional[str] = Query(None, description="検索キーワード"),
):
    # 受け取ったパラメータをログに記録
    logger.info(f"Received request: ingredients={ingredients}, keywords={keywords}")

    # ingredientsがNoneの場合、空リストにする
    if ingredients is None:
        ingredients = []

    # keywordsがNoneの場合、空文字にする
    if not keywords:
        keywords = ""

    # クエリを組み立てる
    query_parts = [keywords] if keywords else []
    if ingredients:
        query_parts.append(" ".join(ingredients))  # 食材リストをスペース区切りで結合

    if not query_parts:
        raise HTTPException(status_code=400, detail="検索キーワードまたは食材を指定してください。")

    search_query = " ".join(query_parts) + " レシピ"
    logger.info(f"Final search query: {search_query}")

    youtube_api_url = f"https://www.googleapis.com/youtube/v3/search?part=snippet&q={search_query}&key={YOUTUBE_API_KEY}&maxResults=10&type=video"

    response = requests.get(youtube_api_url)
    if response.status_code != 200:
        logger.error(f"Failed to fetch videos. Status Code: {response.status_code}, Response: {response.text}")
        return {"error": "Failed to fetch videos"}

    video_data = response.json().get("items", [])
    logger.info(f"Fetched {len(video_data)} videos.")

    recipes = [
        {
            "title": item["snippet"]["title"],
            "video_url": f"https://www.youtube.com/watch?v={item['id']['videoId']}",
            "thumbnail_url": item["snippet"]["thumbnails"]["medium"]["url"]
        }
        for item in video_data
    ]

    return recipes

router = APIRouter()

@router.post("/favorites/")
def add_favorite(video_url: str, title: str, thumbnail_url: str, db: Session = Depends(database.get_db)):
    existing_favorite = db.query(models.Favorite).filter(models.Favorite.video_url == video_url).first()
    if existing_favorite:
        raise HTTPException(status_code=400, detail="Already in favorites")
    return crud.add_favorite(db, video_url, title, thumbnail_url)

@router.get("/favorites/")
def get_favorites(db: Session = Depends(database.get_db)):
    return crud.get_favorites(db)

@router.delete("/favorites/{video_url}")
def remove_favorite(video_url: str, db: Session = Depends(database.get_db)):
    favorite = crud.remove_favorite(db, video_url)
    if not favorite:
        raise HTTPException(status_code=404, detail="Not found")
    return {"message": "Favorite removed"}