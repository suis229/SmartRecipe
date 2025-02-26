from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)

    favorites = relationship("FavoriteRecipe", back_populates="user")

class FridgeItem(Base):
    __tablename__ = "fridge_items"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    quantity = Column(Float)
    unit = Column(String)
    expiration = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User")

class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True)
    video_url = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    thumbnail_url = Column(String, nullable=False)
    user_id = Column(Integer, nullable=False) 
    
class FavoriteRecipe(Base):
    __tablename__ = "favorite_recipes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    video_url = Column(String, nullable=False, unique=True)
    thumbnail_url = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    user = relationship("User", back_populates="favorites")