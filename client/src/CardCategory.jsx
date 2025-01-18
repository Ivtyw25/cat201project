import React, { useState, useEffect } from "react";
import axios from "axios";

function CardCategory() {
  const [cardData, setCardData] = useState([]);
  const [categories, setCategories] = useState({});
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [newCard, setNewCard] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    rarity: "",
    image_url: "",
    category: "",
  });

  // Define the categories
  const categoryButtons = [
    { name: "Naruto", color: "#ff9800" },
    { name: "Attack on Titan", color: "#4caf50" },
    { name: "One Piece", color: "#2196f3" },
    { name: "Demon Slayer", color: "#9c27b0" },
    { name: "My Hero Academia", color: "#e91e63" }
  ];

  const handleFetchCards = async () => {
    try {
      console.log("Fetching cards..."); // Debug log
      const response = await axios.get(
        "http://localhost:8080/cat201project/readCard"
      );
      console.log("Raw response data:", response.data); // Debug log

      const data = response.data;
      if (Array.isArray(data) && data.length > 0) {
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
      console.error("Fetch error:", err);
      setError(`Error fetching data: ${err.message}`);
      setCategories({});
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      await axios.delete(
        `http://localhost:8080/cat201project/readCard?id=${cardId}`
      );
      handleFetchCards(); // Refresh the cards
      setShowCardDetails(false); // Close the popup if open
    } catch (err) {
      setError("Error deleting card: " + err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCard((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
        category: "",
      });
      handleFetchCards();
    } catch (err) {
      setError("Error adding card: " + err.message);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setShowCardDetails(true);
  };

  // Filter cards based on selected category
  const getFilteredCards = () => {
    if (!selectedCategory) {
      return categories;
    }
    const filtered = {};
    if (categories[selectedCategory]) {
      filtered[selectedCategory] = categories[selectedCategory];
    }
    return filtered;
  };

  useEffect(() => {
    handleFetchCards();
  }, []);

  return (
    <div>
      <h1>Card List</h1>

      {/* Category Buttons */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        gap: '15px', 
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px'
      }}>
        {categoryButtons.map((cat) => (
          <button
            key={cat.name}
            onClick={() => handleCategoryClick(cat.name)}
            style={{
              padding: '12px 24px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: selectedCategory === cat.name ? cat.color : '#ddd',
              color: selectedCategory === cat.name ? 'white' : 'black',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '16px',
              fontWeight: 'bold',
              boxShadow: selectedCategory === cat.name 
                ? '0 4px 8px rgba(0,0,0,0.2)' 
                : '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            {cat.name}
          </button>
        ))}
        <button
          onClick={() => handleCategoryClick(null)}
          style={{
            padding: '12px 24px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: selectedCategory === null ? '#333' : '#ddd',
            color: selectedCategory === null ? 'white' : 'black',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: selectedCategory === null 
              ? '0 4px 8px rgba(0,0,0,0.2)' 
              : '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          Show All
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setShowPopup(true)}>
          Add New Card
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Display filtered cards */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', padding: '20px' }}>
        {Object.entries(getFilteredCards()).map(([category, cards]) => (
          <div key={category} style={{
            flex: '1',
            minWidth: '300px',
            backgroundColor: '#f5f5f5',
            padding: '15px',
            borderRadius: '8px'
          }}>
            <h2>{category}</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {cards.map((card, index) => (
                <div 
                  key={index} 
                  onClick={() => handleCardClick(card)}
                  style={{
                    border: '1px solid #ddd',
                    padding: '10px',
                    borderRadius: '4px',
                    backgroundColor: 'white',
                    width: '250px',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    ':hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
                    }
                  }}
                >
                  <h3>{card.name}</h3>
                  <p><strong>Description:</strong> {card.description}</p>
                  <p><strong>Price:</strong> ${card.price}</p>
                  <p><strong>Stock:</strong> {card.stock}</p>
                  <p><strong>Rarity:</strong> {card.rarity}</p>
                  {card.image_url && (
                    <img 
                      src={card.image_url} 
                      alt={card.name} 
                      style={{ width: '100px', height: 'auto' }} 
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Card Details Popup */}
      {showCardDetails && selectedCard && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '15px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative',
            boxShadow: '0 5px 25px rgba(0,0,0,0.2)'
          }}>
            <button 
              onClick={() => setShowCardDetails(false)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666'
              }}
            >
              ×
            </button>

            <div style={{ marginTop: '20px' }}>
              <h2 style={{ 
                color: '#333',
                borderBottom: '2px solid #eee',
                paddingBottom: '10px',
                marginBottom: '20px'
              }}>
                {selectedCard.name}
              </h2>

              {selectedCard.image_url && (
                <img 
                  src={selectedCard.image_url} 
                  alt={selectedCard.name}
                  style={{
                    width: '200px',
                    height: 'auto',
                    display: 'block',
                    margin: '0 auto 20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                  }}
                />
              )}

              <div style={{ 
                display: 'grid', 
                gap: '15px',
                fontSize: '16px'
              }}>
                <p><strong>Category:</strong> {selectedCard.category}</p>
                <p><strong>Description:</strong> {selectedCard.description}</p>
                <p><strong>Price:</strong> ${selectedCard.price}</p>
                <p><strong>Stock:</strong> {selectedCard.stock}</p>
                <p><strong>Rarity:</strong> 
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: 
                      selectedCard.rarity === 'Legendary' ? '#ffd700' :
                      selectedCard.rarity === 'Epic' ? '#9c27b0' :
                      selectedCard.rarity === 'Rare' ? '#2196f3' :
                      '#4caf50',
                    color: 'white',
                    marginLeft: '8px'
                  }}>
                    {selectedCard.rarity}
                  </span>
                </p>
                <p><strong>Card ID:</strong> {selectedCard.card_id}</p>
              </div>

              <div style={{
                marginTop: '25px',
                display: 'flex',
                gap: '10px',
                justifyContent: 'flex-end'
              }}>
                <button 
                  onClick={() => handleDeleteCard(selectedCard.card_id)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#ff4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Delete Card
                </button>
                <button 
                  onClick={() => setShowCardDetails(false)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#666',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Card Popup */}
      {showPopup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '400px',
          }}>
            <h2>Add New Card</h2>
            <form onSubmit={handleAddCard}>
              <div style={{ marginBottom: '10px' }}>
                <label>Category:</label>
                <select
                  name="category"
                  value={newCard.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categoryButtons.map(cat => (
                    <option key={cat.name} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={newCard.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Description:</label>
                <textarea
                  name="description"
                  value={newCard.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Price:</label>
                <input
                  type="number"
                  name="price"
                  value={newCard.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Stock:</label>
                <input
                  type="number"
                  name="stock"
                  value={newCard.stock}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Rarity:</label>
                <input
                  type="text"
                  name="rarity"
                  value={newCard.rarity}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Image URL:</label>
                <input
                  type="text"
                  name="image_url"
                  value={newCard.image_url}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit">Add Card</button>
                <button type="button" onClick={() => setShowPopup(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CardCategory;