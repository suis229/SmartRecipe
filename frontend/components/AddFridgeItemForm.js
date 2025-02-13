import React, { useState } from "react";
import axios from "axios";

const AddFridgeItemForm = ({ items, setItems }) => {
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

      setItems((prevItems) => {
        const existingItem = prevItems.find(item => item.name === response.data.name);
        if (existingItem) {
          return prevItems.map(item =>
            item.name === response.data.name
              ? { ...item, quantity: item.quantity + parseInt(quantity) }
              : item
          );
        }
        return [...prevItems, response.data];
      });

      setName("");
      setQuantity("");
      setUnit("");
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="食材名" value={name} onChange={(e) => setName(e.target.value)} required />
      <input type="number" placeholder="数量" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
      <input type="text" placeholder="単位" value={unit} onChange={(e) => setUnit(e.target.value)} required />
      <button type="submit">追加</button>
    </form>
  );
};

export default AddFridgeItemForm;
