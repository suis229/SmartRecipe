import { useState, useEffect } from "react";
import axios from "axios";

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [userId, setUserId] = useState(1); // ユーザーIDを適切に管理

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/favorites/favorite_recipes/?user_id=${userId}`);
            console.log("Fetched Favorites:", response.data);
            setFavorites(response.data);
        } catch (error) {
            console.error("Error fetching favorites:", error);
        }
    };

    const removeFromFavorites = async (video_url) => {
        try {
            await axios.delete(
                `http://127.0.0.1:8000/api/favorites/favorite_recipes/?user_id=${userId}&video_url=${encodeURIComponent(video_url)}`
            );
            console.log("Removed from favorites:", video_url);
            fetchFavorites(); // 削除後にリストを更新
        } catch (error) {
            console.error("Error removing favorite:", error);
        }
    };

    return (
        <div className="container">
            <h1 className="favorites-title">お気に入り一覧</h1>
            <div className="favorites-container"> {/* レイアウトを変更 */}
                {favorites.length > 0 ? (
                    favorites.map((fav, index) => (
                        <div key={index} className="favorite-item">
                            <a href={fav.video_url} target="_blank" rel="noopener noreferrer">
                                <img src={fav.thumbnail_url} alt={fav.title} className="favorite-thumbnail" />
                                <p className="favorite-item-title">
                                    {fav.title.length > 15 ? `${fav.title.substring(0, 15)}...` : fav.title}
                                </p>
                            </a>
                            <button 
                                onClick={() => removeFromFavorites(fav.video_url)} 
                                className="remove-favorite-btn"
                            >
                                お気に入りから削除
                            </button>
                        </div>
                    ))
                ) : (
                    <p>お気に入りがありません。</p>
                )}
            </div>
            <button className="back-btn" onClick={() => window.history.back()}>
                ← 戻る
            </button>
        </div>
    );    
};

export default Favorites;
