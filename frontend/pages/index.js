import React, { useState, useEffect } from "react";
import axios from "axios";
import AddFridgeItemForm from "../components/AddFridgeItemForm";
import FridgeItem from "../components/FridgeItem";

const App = () => {
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/fridge_items/");
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleUpdate = (updatedItem) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === updatedItem.id ? updatedItem : item
      )
    );
  };

  return (
    <div>
      <h1>冷蔵庫の食材</h1>
      <AddFridgeItemForm onAdd={fetchItems} />
      <div>
        {items.map(item => (
          <FridgeItem key={item.id} item={item} onUpdate={handleUpdate} />
        ))}
      </div>
    </div>
  );
};

export default App;
