import React, { useState } from "react";
import axios from "axios";

function Card() {
  const [cardData, setCardData] = useState([]); // Store all cards
  const [categories, setCategories] = useState({});
  const [error, setError] = useState(""); // Store any error messages

  const handleFetchCards = async () => {
    try {
      console.log("Fetching cards..."); // Debug log
      const response = await axios.get(
        "http://localhost:8080/cat201project/readCard"
      );
      console.log("Raw response data:", response.data); // Debug log

      const data = response.data;
      if (Array.isArray(data) && data.length > 0) {
        // Group cards by category
        const groupedCards = {};
        data.forEach((card) => {
          const category = card.category || "Uncategorized";
          if (!groupedCards[category]) {
            groupedCards[category] = [];
          }
          groupedCards[category].push(card);
        });

        console.log("Grouped cards:", groupedCards); // Debug log
        setCategories(groupedCards);
        setError("");
      } else {
        console.log("No cards found in response"); // Debug log
        setError("No cards found");
        setCategories({});
      }
    } catch (err) {
      console.error("Fetch error:", err); // Detailed error log
      setError(`Error fetching data: ${err.message}`);
      setCategories({});
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      console.log("Attempting to delete card with ID:", cardId); // Debug log
      // Make a DELETE request to the servlet
      await axios.delete(
        `http://localhost:8080/cat201project/readCard?id=${cardId}`
      );

      // After successful deletion, refresh the card list
      handleFetchCards();
    } catch (err) {
      console.error("Delete error:", err); // Debug log
      setError("Error deleting card: " + err.message);
    }
  };

  /*Here is for pop-up window*/
  const [showPopup, setShowPopup] = useState(false);
  const [newCard, setNewCard] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    rarity: "",
    image_url: "",
    category: "", // Make sure this exists
  });

  // Add this function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCard((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add this function to handle form submission
  const handleAddCard = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/cat201project/readCard", newCard);
      setShowPopup(false);
      setNewCard({
        name: "",
        description: "",
        price: "",
        stock: "",
        rarity: "",
        image_url: "",
      });
      handleFetchCards(); // Refresh the card list
    } catch (err) {
      setError("Error adding card: " + err.message);
    }
  };
  /*Here done pop-up window*/

  return (
    <div>
      <h1>Card List</h1>
      <div style={{ marginBottom: "20px" }}>
        <button onClick={handleFetchCards}>Fetch All Cards</button>
        <button
          onClick={() => setShowPopup(true)}
          style={{ marginLeft: "10px" }}
        >
          Add New Card
        </button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      {/* Display error message if any */}
      {/*Start Pop-up window*/}
      {/* Add Card Popup */}
      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "400px",
            }}
          >
            <h2>Add New Card</h2>
            <div style={{ marginBottom: "10px" }}>
              <label>Category:</label>
              <select
                name="category"
                value={newCard.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a category</option>
                <option value="Category1">Category 1</option>
                <option value="Category2">Category 2</option>
                <option value="Category3">Category 3</option>
                <option value="Category4">Category 4</option>
              </select>
            </div>
            <form onSubmit={handleAddCard}>
              <div style={{ marginBottom: "10px" }}>
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={newCard.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Description:</label>
                <textarea
                  name="description"
                  value={newCard.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Price:</label>
                <input
                  type="number"
                  name="price"
                  value={newCard.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Stock:</label>
                <input
                  type="number"
                  name="stock"
                  value={newCard.stock}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Rarity:</label>
                <input
                  type="text"
                  name="rarity"
                  value={newCard.rarity}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label>Image URL:</label>
                <input
                  type="text"
                  name="image_url"
                  value={newCard.image_url}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button type="submit">Add Card</button>
                <button type="button" onClick={() => setShowPopup(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/*End Pop-up window*/}
      {/* Display cards by category */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          padding: "20px",
        }}
      >
        {Object.entries(categories).map(([category, cards]) => (
          <div
            key={category}
            style={{
              flex: "1",
              minWidth: "300px",
              backgroundColor: "#f5f5f5",
              padding: "15px",
              borderRadius: "8px",
            }}
          >
            <h2>{category}</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {cards.map((card, index) => (
                <div
                  key={index}
                  style={{
                    border: "1px solid #ddd",
                    padding: "10px",
                    borderRadius: "4px",
                    backgroundColor: "white",
                    width: "250px",
                  }}
                >
                  <h3>{card.name}</h3>
                  <p>
                    <strong>Description:</strong> {card.description}
                  </p>
                  <p>
                    <strong>Price:</strong> ${card.price}
                  </p>
                  <p>
                    <strong>Stock:</strong> {card.stock}
                  </p>
                  <p>
                    <strong>Rarity:</strong> {card.rarity}
                  </p>
                  {card.image_url && (
                    <img
                      src={card.image_url}
                      alt={card.name}
                      style={{ width: "100px", height: "auto" }}
                    />
                  )}
                  <button
                    onClick={() => handleDeleteCard(card.card_id)}
                    style={{ marginTop: "10px", width: "100%" }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Card;
