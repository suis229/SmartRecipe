import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const Recipes = () => {
    const router = useRouter();
    const [recipes, setRecipes] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [userId, setUserId] = useState(1); // ユーザーIDを適切に管理

    useEffect(() => {
        // 🔹 URLクエリから検索ワードを取得
        const query = router.query.keywords || "";
        setSearchQuery(query);

        // 🔹 選択された食材もURLから取得し、単一文字列の場合は配列に変換
        const ingredients = router.query.ingredients || [];
        const ingredientsArray = Array.isArray(ingredients) ? ingredients : [ingredients];

        setSelectedIngredients(ingredientsArray);
        fetchRecipes(query, ingredientsArray);
        fetchFavorites();
    }, [router.query]);

    const fetchRecipes = async (query, ingredientsArray) => {
        try {
            const params = new URLSearchParams();
            if (query) params.append("keywords", query);
            if (ingredientsArray.length > 0) {
                ingredientsArray.forEach((ingredient) => params.append("ingredients", ingredient));
            }

            const response = await axios.get(`http://127.0.0.1:8000/recipes/?${params.toString()}`);
            setRecipes(response.data);
        } catch (error) {
            console.error("レシピの取得中にエラーが発生しました:", error);
        }
    };

    const fetchFavorites = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/favorites/favorite_recipes/?user_id=${userId}`);
            console.log("Fetched Favorites:", response.data);
            setFavorites(response.data.map((fav) => fav.video_url));
        } catch (error) {
            console.error("Error fetching favorites:", error);
        }
    };

    const addToFavorites = async (recipe) => {
        try {
            await axios.post(
                `http://127.0.0.1:8000/api/favorites/favorite_recipes/?user_id=${userId}`,
                {
                    title: recipe.title,
                    video_url: recipe.video_url,
                    thumbnail_url: recipe.thumbnail_url
                }
            );
            console.log("Added to favorites:", recipe.title);
            fetchFavorites(); // お気に入りを更新
        } catch (error) {
            console.error("Error adding favorite:", error);
        }
    };

    const removeFromFavorites = async (recipe) => {
        try {
            await axios.delete(
                `http://127.0.0.1:8000/api/favorites/favorite_recipes/?user_id=${userId}&video_url=${encodeURIComponent(recipe.video_url)}`
            );
            console.log("Removed from favorites:", recipe.title);
            fetchFavorites(); // お気に入りリストを更新
        } catch (error) {
            console.error("Error removing favorite:", error);
        }
    };

    return (
        <div className="container">
            <h1 className="recipe-title">おすすめレシピ</h1>
            <div className="recipe-container">
                {recipes.length > 0 ? (
                    <ul className="recipe-list">
                        {recipes.map((recipe, index) => (
                            <li key={index} className="recipe-item">
                                <a href={recipe.video_url} target="_blank" rel="noopener noreferrer">
                                    <img src={recipe.thumbnail_url} alt={recipe.title} className="recipe-thumbnail" />
                                    <p>{recipe.title.length > 15 ? `${recipe.title.substring(0, 15)}...` : recipe.title}</p>
                                </a>
                                {favorites.includes(recipe.video_url) ? (
                                    <button 
                                        onClick={() => removeFromFavorites(recipe)} 
                                        className="remove-favorite-btn"
                                    >
                                        お気に入りから削除
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => addToFavorites(recipe)} 
                                        className="favorite-btn"
                                    >
                                        お気に入りに追加
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>レシピが見つかりませんでした。</p>
                )}
            </div>
            <button className="back-btn" onClick={() => router.push("/")}>
                ← 冷蔵庫管理へ戻る
            </button>
        </div>
    );
};

export default Recipes;
