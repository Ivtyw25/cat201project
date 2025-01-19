import { useEffect, useState } from "react";
import axios from "axios";
import Nav from "./components/Nav";
import SideNav from "./components/SideNav";
import { readCardEndpoint } from "./constants";
import { Images } from "./assets/images";
import Footer from "./sections/Footer";
import ItemCard from "./components/ItemCard";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const CardCategory = ({ category }) => {
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await axios.get(readCardEndpoint);
        // Filter cards based on category prop
        const filteredCards = response.data.filter(
          (card) => card.category === category
        );
        setCards(filteredCards);
      } catch (error) {
        console.error("Error fetching cards:", error);
      }
    };

    fetchCards();
  }, [category]); // Re-fetch when category changes

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setQuantity(1);
    setShowModal(true);
  };

  const handleAddToCart = async (cardId) => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      alert("Please log in to add items to cart");
      navigate("/login");
      return;
    }

    const user = JSON.parse(userStr);
    const userId = user.user_id;

    if (!userId) {
      alert("User ID not found. Please log in again.");
      navigate("/login");
      return;
    }

    try {

      const response = await fetch("http://localhost:8080/cat201project/Cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          action: "addToCart",
          userId: user.user_id.toString(),
          cardId: cardId.toString(),
          quantity: quantity.toString(),
        }).toString(),
      });

      const data = await response.json();
      if (data.success) {
        alert("Added to cart successfully!");
        setShowModal(false);
      } else {
        alert(`Failed to add to cart: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert(`Error adding to cart: ${error.message}`);
    }
  };

  const getQuantityOptions = (stock) => {
    const options = [];
    for (let i = 1; i <= Math.min(stock, 10); i++) {
      options.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    return options;
  };

  return (
    <main className="relative">
      <Nav noLinks={true} />
      <section className="padding-x padding-t h-full">
        <div className="flex flex-row max-lg:flex-col gap-10">
          <SideNav />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-10 w-full">
            {cards.map((card) => {
              const image = Images[card.category]?.[card.image_url];
              return (
                <ItemCard
                  key={card.card_id}
                  card={card}
                  image={image}
                  onClick={() => handleCardClick(card)}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Card Details Modal */}
      {showModal && selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCard.name}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <img
                    src={
                      Images[selectedCard.category]?.[selectedCard.image_url]
                    }
                    alt={selectedCard.name}
                    className="w-full rounded-lg shadow-lg"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">
                      ${selectedCard.price}
                    </span>
                    <span className="px-3 py-1 text-sm font-semibold text-white bg-blue-500 rounded-full">
                      {selectedCard.rarity}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Description
                    </h3>
                    <p className="mt-2 text-gray-600">
                      {selectedCard.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Details
                    </h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Stock</span>
                        <span className="font-medium text-gray-900">
                          {selectedCard.stock} units
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category</span>
                        <span className="font-medium text-gray-900">
                          {selectedCard.category}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Card ID</span>
                        <span className="font-medium text-gray-900">
                          {selectedCard.card_id}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 space-y-4">
                    <div className="flex items-center space-x-4">
                      <label htmlFor="quantity" className="text-gray-700">
                        Quantity:
                      </label>
                      <select
                        id="quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="border rounded-md px-2 py-1"
                      >
                        {getQuantityOptions(selectedCard.stock)}
                      </select>
                      <span className="text-sm text-gray-500">
                        {selectedCard.stock} available
                      </span>
                    </div>

                    <div className="text-lg font-semibold text-gray-900">
                      Total: ${(selectedCard.price * quantity).toFixed(2)}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(selectedCard.card_id);
                      }}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                      disabled={selectedCard.stock === 0}
                    >
                      {selectedCard.stock === 0
                        ? "Out of Stock"
                        : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </main>
  );
};

export default CardCategory;
