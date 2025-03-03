from sqlalchemy.orm import Session
import models, schemas
from models import FavoriteRecipe
from schemas import FavoriteRecipeCreate
from fastapi import HTTPException

# ユーザー作成
def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(email=user.email, hashed_password=user.password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# ユーザー取得
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

# ユーザー一覧取得
def get_users(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.User).offset(skip).limit(limit).all()

# 食材登録
def create_fridge_item(db: Session, item: schemas.FridgeItemCreate):
    # 既存の食材を検索
    db_item = db.query(models.FridgeItem).filter(models.FridgeItem.name == item.name).first()

    if db_item:
        # 既に存在する場合、数量を合計
        db_item.quantity += item.quantity
    else:
        # 存在しない場合、新規作成
        db_item = models.FridgeItem(name=item.name, quantity=item.quantity, unit=item.unit)
        db.add(db_item)

    db.commit()
    db.refresh(db_item)
    return db_item

# 冷蔵庫の食材一覧取得
def get_fridge_items(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.FridgeItem).offset(skip).limit(limit).all()

def add_favorite(db: Session, video_url: str, title: str, thumbnail_url: str):
    favorite = models.Favorite(video_url=video_url, title=title, thumbnail_url=thumbnail_url, user_id=1)
    db.add(favorite)
    db.commit()
    db.refresh(favorite)
    return favorite

def get_favorites(db: Session):
    return db.query(models.Favorite).all()

def delete_favorite_recipe(db: Session, user_id: int, video_url: str):
    favorite = db.query(models.FavoriteRecipe).filter(
        models.FavoriteRecipe.video_url == video_url,
        models.FavoriteRecipe.user_id == user_id
    ).first()

    if favorite:
        db.delete(favorite)
        db.commit()
        return {"message": "Favorite removed successfully"}
    
    raise HTTPException(status_code=404, detail="Favorite not found")


# 指定ユーザーのお気に入りレシピ一覧を取得
def get_favorite_recipes(db: Session, user_id: int):
    return db.query(models.FavoriteRecipe).filter(models.FavoriteRecipe.user_id == user_id).all()

# お気に入りレシピを追加
def add_favorite_recipe(db: Session, favorite: schemas.FavoriteRecipeCreate, user_id: int):
    existing_favorite = db.query(models.Favorite).filter(
        models.Favorite.video_url == favorite.video_url,
        models.Favorite.user_id == user_id
    ).first()

    if existing_favorite:
        raise HTTPException(status_code=400, detail="This recipe is already in favorites.")

    db_favorite = models.Favorite(
        user_id=user_id,
        title=favorite.title,
        video_url=favorite.video_url,
        thumbnail_url=favorite.thumbnail_url
    )

    db.add(db_favorite)
    db.commit()
    db.refresh(db_favorite)
    return db_favorite

