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

  const updateQuantity = async (id, change) => {
    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/fridge_items/${id}/${change}/`
      );
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, quantity: response.data.quantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/fridge_items/${id}/`);
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="container">
      <h1>冷蔵庫管理</h1>
      <button className="search-btn" onClick={handleSearchRecipes} disabled={loading}>
        {loading ? "検索中..." : "レシピを検索"}
      </button>
      
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

      <h2>現在の食材</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id} className="item">
            {item.name} - {item.quantity} {item.unit}
            <button onClick={() => updateQuantity(item.id, "increase")} className="btn">＋</button>
            <button onClick={() => updateQuantity(item.id, "decrease")} className="btn">－</button>
            <button onClick={() => deleteItem(item.id)} className="btn delete">削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
