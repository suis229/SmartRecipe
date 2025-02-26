from fastapi import APIRouter
from routes.favorites import router as favorites_router  # 他のルートも同様に追加

router = APIRouter()

# ルートを統合
router.include_router(favorites_router, prefix="/favorites", tags=["favorites"])