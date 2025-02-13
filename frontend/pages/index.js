import React, { useState, useEffect } from "react";
import axios from "axios";
import AddFridgeItemForm from "../components/AddFridgeItemForm";
import FridgeItem from "../components/FridgeItem";
import { useRouter } from "next/router";
import "../styles/globals.css";

const FridgeManagement = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false); // 検索中の状態
  const [selectedItems, setSelectedItems] = useState([]); // 検索対象の食材
  const router = useRouter();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/fridge_items/");
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const updateItem = (updatedItem) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  const deleteItem = (itemId) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const handleSelectItem = (itemName) => {
    setSelectedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName]
    );
  };

  const handleSearchRecipes = async () => {
    setLoading(true); // 検索中の状態をON
    try {
      const ingredients = selectedItems.length > 0 ? selectedItems.join(",") : items.map((item) => item.name).join(",");
      await axios.get(`http://127.0.0.1:8000/recipes/?ingredients=${ingredients}`);
      router.push(`/recipes?ingredients=${encodeURIComponent(ingredients)}`); // クエリパラメータを追加
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };  

  return (
    <div className="container">
      <h1>冷蔵庫の管理</h1>
  
      {/* PCでもスマホでも適切な位置にボタンを配置 */}
      {loading ? (
        <p className="loading-text">レシピを検索中...</p>
      ) : (
        <button className="recipe-search-btn" onClick={handleSearchRecipes}>
          レシピを検索
        </button>
      )}
  
      <AddFridgeItemForm setItems={setItems} />
      <ul className="fridge-list">
        {items.map((item) => (
          <li key={item.id} className="fridge-item">
            <input
              type="checkbox"
              checked={selectedItems.includes(item.name)}
              onChange={() => handleSelectItem(item.name)}
            />
            <FridgeItem item={item} onUpdate={updateItem} onDelete={deleteItem} />
          </li>
        ))}
      </ul>
    </div>
  );  
};

export default FridgeManagement;
