import React, { useState } from "react";
import axios from "axios";

const AddFridgeItemForm = ({ setItems }) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState("個");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/fridge_items/", {
        name,
        quantity: parseInt(quantity),
        unit
      });

      setItems((prevItems) => {
        const updatedItems = prevItems.map((item) =>
          item.name === response.data.name ? response.data : item
        );

        // もし新しい食材ならリストに追加
        if (!prevItems.some((item) => item.name === response.data.name)) {
          return [...updatedItems, response.data];
        }

        return updatedItems;
      });

      // 入力欄をリセット
      setName("");
      setQuantity(1);
      setUnit("個");
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-item-form">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="食材名"
        required
      />
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        min="1"
        required
      />
      <select value={unit} onChange={(e) => setUnit(e.target.value)}>
        <option value="個">個</option>
        <option value="本">本</option>
        <option value="g">g</option>
      </select>
      <button type="submit">追加</button>
    </form>
  );
};

export default AddFridgeItemForm;
