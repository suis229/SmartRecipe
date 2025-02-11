import { useState, useEffect } from "react";
import axios from "axios";
import AddFridgeItemForm from "../components/AddFridgeItemForm";

export default function Home() {
  const [items, setItems] = useState([]);

  // 食材一覧を取得
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

  const handleItemAdded = () => {
    fetchItems(); // 新しい食材を追加したらリストを更新
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">冷蔵庫の食材管理</h1>
      <AddFridgeItemForm onItemAdded={handleItemAdded} />
      <h2 className="text-xl font-bold mt-6">現在の食材</h2>
      <ul className="mt-2">
        {items.map((item) => (
          <li key={item.id} className="p-2 border-b">
            {item.name} - {item.quantity} {item.unit}
          </li>
        ))}
      </ul>
    </div>
  );
}
