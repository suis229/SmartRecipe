import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/globals.css";

const Recipes = () => {
  const router = useRouter();
  const { ingredients } = router.query;
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ingredients) {
      fetchRecipes();
    }
  }, [ingredients]);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/recipes/?ingredients=${ingredients}`);
      setRecipes(response.data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="recipe-title">おすすめレシピ</h1>
      <div className="recipe-container">
        {loading ? (
          <p className="loading-text">レシピを検索中...</p>
        ) : recipes.length > 0 ? (
          <ul className="recipe-list">
            {recipes.slice(0, 30).map((recipe, index) => (
              <li key={index} className="recipe-item">
                <a href={recipe.video_url} target="_blank" rel="noopener noreferrer">
                  <img src={recipe.thumbnail_url} alt={recipe.title} className="recipe-thumbnail" />
                  <p className="recipe-title-text">
                    {recipe.title.length > 15 ? `${recipe.title.substring(0, 15)}...` : recipe.title}
                  </p>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-recipes-text">レシピが見つかりませんでした。</p>
        )}
      </div>
      <button className="back-btn" onClick={() => router.push("/")}>
        ← 冷蔵庫管理へ戻る
      </button>
    </div>
  );
};

export default Recipes;
