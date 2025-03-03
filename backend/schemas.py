from pydantic import BaseModel

# ユーザー作成用スキーマ
class UserCreate(BaseModel):
    email: str
    password: str

class User(UserCreate):
    id: int

    class Config:
        orm_mode = True

# 冷蔵庫の食材スキーマ
class FridgeItemCreate(BaseModel):
    name: str
    quantity: int
    unit: str

class FridgeItem(FridgeItemCreate):
    id: int

    class Config:
        orm_mode = True

# お気に入りレシピの作成リクエスト用スキーマ
class FavoriteRecipeCreate(BaseModel):
    # user_id: int
    title: str
    video_url: str
    thumbnail_url: str

# お気に入りレシピのレスポンス用スキーマ
class FavoriteRecipe(FavoriteRecipeCreate):
    id: int
    user_id: int

    class Config:
        from_attributes = True
