from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import crud, models, schemas
from database import get_db
from typing import List

router = APIRouter()

@router.post("/favorites/", response_model=schemas.FavoriteRecipe)
def add_favorite(recipe: schemas.FavoriteRecipeCreate, db: Session = Depends(get_db), user_id: int = 1):
    db_recipe = crud.add_favorite_recipe(db, recipe, user_id)
    return db_recipe

@router.get("/favorites/", response_model=List[schemas.FavoriteRecipe])
def get_favorites(db: Session = Depends(get_db), user_id: int = 1):
    return crud.get_favorite_recipes(db, user_id)

@router.delete("/favorites/{recipe_id}")
def delete_favorite(recipe_id: int, db: Session = Depends(get_db), user_id: int = 1):
    if not crud.delete_favorite_recipe(db, recipe_id, user_id):
        raise HTTPException(status_code=404, detail="Recipe not found")
    return {"message": "Favorite removed successfully"}
