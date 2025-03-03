import React from "react";
import axios from "axios";

const FridgeItem = ({ item, onUpdate, onDelete, onToggleSelect, isSelected }) => {
  const handleIncrease = async () => {
    try {
      const response = await axios.patch(`http://127.0.0.1:8000/fridge_items/${item.id}/increase/`);
      onUpdate(response.data);
    } catch (error) {
      console.error("Error increasing item quantity:", error);
    }
  };

  const handleDecrease = async () => {
    try {
      const response = await axios.patch(`http://127.0.0.1:8000/fridge_items/${item.id}/decrease/`);
      onUpdate(response.data);
    } catch (error) {
      console.error("Error decreasing item quantity:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/fridge_items/${item.id}/`);
      onDelete(item.id);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <li 
      className={`fridge-item ${isSelected ? "selected" : ""}`} 
      onClick={onToggleSelect}
    >
      <span>{item.name} - {item.quantity} {item.unit}</span>
      <div>
        <button onClick={handleIncrease} className="increase">＋</button>
        <button onClick={handleDecrease} className="decrease" disabled={item.quantity === 0}>－</button>
        <button onClick={handleDelete} className="delete">🗑</button>
      </div>
    </li>
  );
};

export default FridgeItem;
