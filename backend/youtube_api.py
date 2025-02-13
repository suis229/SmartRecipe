import os
import requests
from fastapi import APIRouter, Query
from dotenv import load_dotenv

# 環境変数の読み込み
load_dotenv()

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search"

router = APIRouter()

@router.get("/search_videos/")
def search_videos(query: str = Query(..., min_length=1)):
    """
    YouTubeで料理動画を検索するAPI
    :param query: 検索クエリ（例: "卵 トマト"）
    :return: 検索結果（動画タイトル・URL・サムネイル）
    """
    params = {
        "part": "snippet",
        "q": f"{query} レシピ",
        "key": YOUTUBE_API_KEY,
        "maxResults": 5,  # 検索結果の数
        "type": "video"
    }
    
    response = requests.get(YOUTUBE_SEARCH_URL, params=params)
    data = response.json()

    # 結果の整形
    videos = []
    for item in data.get("items", []):
        video_id = item["id"]["videoId"]
        videos.append({
            "title": item["snippet"]["title"],
            "video_url": f"https://www.youtube.com/watch?v={video_id}",
            "thumbnail_url": item["snippet"]["thumbnails"]["medium"]["url"]
        })

    return videos
