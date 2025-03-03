from fastapi import APIRouter
from routes.favorite_recipes import router as favorite_recipes_router

router = APIRouter()

# ルートを統合
router.include_router(favorite_recipes_router, prefix="/favorites", tags=["favorites"])