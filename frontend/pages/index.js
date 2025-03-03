import React, { useState, useEffect } from "react";
import axios from "axios";
import AddFridgeItemForm from "../components/AddFridgeItemForm";
import FridgeItem from "../components/FridgeItem";
import { useRouter } from "next/router";
import "../styles/globals.css";

const FridgeManagement = () => {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]); // 選択された食材のID
  const [searchQuery, setSearchQuery] = useState(""); // キーワード入力用
  const [loading, setLoading] = useState(false);
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

  // 食材選択のハンドラー
  const handleItemSelection = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  // レシピ検索処理
  const handleSearchRecipes = async () => {
    setLoading(true);
    try {
        const selectedIngredientNames = items
            .filter((item) => selectedItems.includes(item.id))
            .map((item) => item.name);

        const query = searchQuery.trim();

        if (!query && selectedIngredientNames.length === 0) {
            alert("検索ワードを入力するか、食材を選択してください。");
            setLoading(false);
            return;
        }

        let params = new URLSearchParams();
        if (query) params.append("keywords", query);
        if (selectedIngredientNames.length > 0) {
            selectedIngredientNames.forEach((ingredient) => params.append("ingredients", ingredient));
        }

        // ここでフロントエンド側のURLにパラメータを追加して遷移
        router.push(`/recipes?${params.toString()}`);
    } catch (error) {
        console.error("レシピの検索中にエラーが発生しました:", error);
        alert("レシピの検索中にエラーが発生しました。");
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="container">
      <h1>冷蔵庫の管理</h1>

      {/* 検索ワード入力 */}
      <input
        type="text"
        placeholder="検索ワードを入力（例: 和風, スープ）"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />

      <button className="nav-btn" onClick={() => router.push("/favorites")}>
        ⭐ お気に入り一覧
      </button>

      {/* PCでもスマホでも適切な位置にボタンを配置 */}
      {loading ? (
        <p className="loading-text">レシピを検索中...</p>
      ) : (
        <button className="recipe-search-btn" onClick={handleSearchRecipes}>
          レシピを検索
        </button>
      )}

      <AddFridgeItemForm setItems={setItems} />

      {/* 食材リスト（選択用チェックボックス付き） */}
      <ul className="fridge-list">
        {items.map((item) => (
          <li key={item.id} className="fridge-item">
            <label>
              <input
                type="checkbox"
                checked={selectedItems.includes(item.id)}
                onChange={() => handleItemSelection(item.id)}
              />
              {item.name} - {item.quantity} {item.unit}
            </label>
            <div>
              <button onClick={() => updateItem({ ...item, quantity: item.quantity + 1 })} className="increase">＋</button>
              <button onClick={() => updateItem({ ...item, quantity: Math.max(item.quantity - 1, 0) })} className="decrease">－</button>
              <button onClick={() => deleteItem(item.id)} className="delete">🗑</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FridgeManagement;
