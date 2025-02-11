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
