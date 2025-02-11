from sqlalchemy.orm import Session
import models, schemas

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
    db_item = models.FridgeItem(name=item.name, quantity=item.quantity, unit=item.unit)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

# 冷蔵庫の食材一覧取得
def get_fridge_items(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.FridgeItem).offset(skip).limit(limit).all()
