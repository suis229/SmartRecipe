import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";

const Recipes = () => {
  const router = useRouter();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      const query = router.asPath.split("?")[1];
      console.log("Fetching recipes with query:", query);

      try {
        const response = await axios.get(`http://127.0.0.1:8000/recipes/?${query}`);
        console.log("API Response:", response.data);

        if (response.status === 200 && Array.isArray(response.data) && response.data.length > 0) {
          setRecipes(response.data);
        } else {
          setRecipes([]); // 取得は成功したが空のリスト
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    if (router.isReady) {
      fetchRecipes();
    }
  }, [router.isReady, router.asPath]);

  return (
    <div className="container">
      <h1 className="recipe-title">おすすめレシピ</h1>
      {loading ? (
        <p>レシピを検索中...</p>
      ) : recipes.length > 0 ? (
        <ul className="recipe-list">
          {recipes.map((recipe, index) => (
            <li key={index} className="recipe-item">
              <a href={recipe.video_url} target="_blank" rel="noopener noreferrer">
                <img src={recipe.thumbnail_url} alt={recipe.title} className="recipe-thumbnail" />
                <p>{recipe.title.length > 10 ? `${recipe.title.substring(0, 10)}...` : recipe.title}</p>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>レシピが見つかりませんでした。</p>
      )}
      <button className="back-btn" onClick={() => router.push("/")}>
        ← 冷蔵庫管理へ戻る
      </button>
    </div>
  );
};

export default Recipes;
