import { useState } from "react";
import axios from "axios";

export default function AddFridgeItemForm({ onItemAdded }) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/fridge_items/", {
        name,
        quantity: parseInt(quantity),
        unit,
      });
      onItemAdded(response.data); // 親コンポーネントに通知
      setName("");
      setQuantity("");
      setUnit("");
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded">
      <h2 className="text-xl font-bold mb-2">食材を追加</h2>
      <input
        type="text"
        placeholder="食材名"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="block w-full p-2 border mb-2"
        required
      />
      <input
        type="number"
        placeholder="数量"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        className="block w-full p-2 border mb-2"
        required
      />
      <input
        type="text"
        placeholder="単位 (g, ml, 個)"
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
        className="block w-full p-2 border mb-2"
        required
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        追加
      </button>
    </form>
  );
}
