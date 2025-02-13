import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import "../styles/globals.css";

export default function Home() {
  const [items, setItems] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/fridge_items/");
      setItems(response.data);
      setSelectedIngredients(response.data.map((item) => item.name)); // デフォルトで全選択
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const toggleIngredient = (ingredient) => {
    setSelectedIngredients((prevSelected) =>
      prevSelected.includes(ingredient)
        ? prevSelected.filter((i) => i !== ingredient)
        : [...prevSelected, ingredient]
    );
  };

  const handleSearchRecipes = () => {
    setLoading(true);
    router.push({
      pathname: "/recipes",
      query: { ingredients: selectedIngredients.join(",") },
    });
  };

  return (
    <div className="container">
      <h1>冷蔵庫管理</h1>
      
      <div className="ingredients-selection">
        <h2>検索に使用する食材</h2>
        {items.map((item) => (
          <label key={item.name} className="ingredient-checkbox">
            <input
              type="checkbox"
              checked={selectedIngredients.includes(item.name)}
              onChange={() => toggleIngredient(item.name)}
            />
            {item.name}
          </label>
        ))}
      </div>

      <button className="search-btn" onClick={handleSearchRecipes} disabled={loading}>
        {loading ? "検索中..." : "レシピを検索"}
      </button>

      <h2>現在の食材</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} - {item.quantity} {item.unit}
          </li>
        ))}
      </ul>
    </div>
  );
}
