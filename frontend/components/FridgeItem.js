import React from "react";
import axios from "axios";

const FridgeItem = ({ item, onUpdate }) => {
  const handleDecrease = async () => {
    try {
      const response = await axios.patch(`http://127.0.0.1:8000/fridge_items/${item.id}/decrease/`);
      onUpdate(response.data); // 親コンポーネントに変更を通知
    } catch (error) {
      console.error("Error decreasing item quantity:", error);
    }
  };

  return (
    <div className="fridge-item">
      <span>{item.name} - {item.quantity} {item.unit}</span>
      <button onClick={handleDecrease} disabled={item.quantity === 0}>-</button>
    </div>
  );
};

export default FridgeItem;
