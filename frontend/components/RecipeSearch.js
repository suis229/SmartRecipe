import { useState } from "react";
import axios from "axios";

const RecipeSearch = () => {
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState([]);

  const handleSearch = async () => {
    if (!query) return;
    
    try {
      const response = await axios.get(`http://127.0.0.1:8000/search_videos/?query=${query}`);
      setVideos(response.data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  return (
    <div className="recipe-search">
      <h2>レシピ動画を検索</h2>
      <input
        type="text"
        placeholder="食材を入力（例: 卵 トマト）"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>検索</button>

      {/* 動画の一覧表示 */}
      <div className="video-list">
        {videos.map((video, index) => (
          <div key={index} className="video-item">
            <a href={video.video_url} target="_blank" rel="noopener noreferrer">
              <img src={video.thumbnail_url} alt={video.title} />
              <p>{video.title}</p>
            </a>
          </div>
        ))}
      </div>

      <style jsx>{`
        .recipe-search {
          margin-top: 20px;
          text-align: center;
        }
        input {
          width: 60%;
          padding: 8px;
          margin-right: 10px;
          font-size: 16px;
        }
        button {
          padding: 8px 12px;
          font-size: 16px;
          cursor: pointer;
        }
        .video-list {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 20px;
        }
        .video-item {
          margin: 10px;
          width: 200px;
          text-align: center;
        }
        .video-item img {
          width: 100%;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default RecipeSearch;
