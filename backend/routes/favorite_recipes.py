from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
import crud, models, schemas
from database import get_db
from typing import List

router = APIRouter(prefix="/api/favorites", tags=["favorite_recipes"])

@router.post("/favorite_recipes/")
def add_favorite_recipe(
    favorite: schemas.FavoriteRecipeCreate,
    db: Session = Depends(get_db),
    user_id: int = Query(..., description="User ID")
):
    if not favorite:
        raise HTTPException(status_code=400, detail="Invalid request data")

    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    existing_favorite = db.query(models.FavoriteRecipe).filter(
        models.FavoriteRecipe.video_url == favorite.video_url,
        models.FavoriteRecipe.user_id == user_id
    ).first()

    if existing_favorite:
        raise HTTPException(status_code=400, detail="Recipe already in favorites")

    new_favorite = models.FavoriteRecipe(
        user_id=user_id,
        title=favorite.title,
        video_url=favorite.video_url,
        thumbnail_url=favorite.thumbnail_url
    )
    db.add(new_favorite)
    db.commit()
    db.refresh(new_favorite)
    return new_favorite

@router.get("/favorite_recipes/", response_model=List[schemas.FavoriteRecipe])
def get_favorite_recipes(user_id: int = Query(..., description="User ID"), db: Session = Depends(get_db)):
    favorites = db.query(models.FavoriteRecipe).filter(models.FavoriteRecipe.user_id == user_id).all()
    print(f"Retrieved favorites: {favorites}")  # デバッグ用
    return favorites

@router.delete("/favorite_recipes/")
def delete_favorite_recipe(
    user_id: int = Query(..., description="User ID"),
    video_url: str = Query(..., description="Video URL"),
    db: Session = Depends(get_db)
):
    return crud.delete_favorite_recipe(db, user_id, video_url)
