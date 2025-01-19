import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./components/Nav";
import axios from "axios";
import { FaShoppingCart, FaTrash } from "react-icons/fa";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cards, setCards] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartAndCards = async () => {
      try {
        const userStr = localStorage.getItem("user");
        if (!userStr) {
          console.log("No user found in localStorage");
          return;
        }
        const user = JSON.parse(userStr);
        console.log("Current user:", user);

        // Fetch cart items
        const cartResponse = await fetch(
          `http://localhost:8080/cat201project/Cart?action=getCart&userId=${user.user_id}`
        );
        console.log("Cart response status:", cartResponse.status);
        const cartData = await cartResponse.json();
        console.log("Cart data received:", cartData);

        // Fetch all cards
        const cardsResponse = await axios.get(
          "http://localhost:8080/cat201project/readCard"
        );
        console.log("Cards response status:", cardsResponse.status);
        const cardsData = cardsResponse.data;
        console.log("Cards data received:", cardsData);

        // Create cards map with integer keys
        const cardsMap = {};
        cardsData.forEach((card) => {
          const cardId = Math.floor(card.card_id);
          cardsMap[cardId] = card;
          console.log(`Mapped card ${cardId}:`, card);
        });

        // Convert floating-point card_ids to integers
        const normalizedCartItems = cartData.map((item) => {
          const normalizedItem = {
            ...item,
            card_id: Math.floor(item.card_id),
            quantity: Math.floor(item.quantity),
          };
          console.log("Normalized cart item:", normalizedItem);
          return normalizedItem;
        });

        console.log("Final normalized cart items:", normalizedCartItems);
        console.log("Final cards map:", cardsMap);

        setCards(cardsMap);
        setCartItems(normalizedCartItems);

        // Calculate total
        const total = normalizedCartItems.reduce((sum, item) => {
          const card = cardsMap[item.card_id];
          console.log(`Calculating price for card ${item.card_id}:`, card);
          return sum + (card ? card.price * item.quantity : 0);
        }, 0);
        setTotalPrice(total);
        console.log("Total price calculated:", total);
      } catch (error) {
        console.error("Error in fetchCartAndCards:", error);
        console.error("Error details:", error.message);
        if (error.response) {
          console.error("Response data:", error.response.data);
        }
      }
    };

    fetchCartAndCards();
  }, []);

  const handleRemoveItem = async (cardId) => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return;
      const user = JSON.parse(userStr);

      const response = await fetch("http://localhost:8080/cat201project/Cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `action=removeFromCart&userId=${user.user_id}&cardId=${cardId}`,
      });

      if (response.ok) {
        setCartItems(cartItems.filter((item) => item.card_id !== cardId));
        // Update total price
        const newTotal = cartItems.reduce((sum, item) => {
          if (item.card_id === cardId) return sum;
          const card = cards[item.card_id];
          return sum + (card ? card.price * item.quantity : 0);
        }, 0);
        setTotalPrice(newTotal);
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleItemSelect = (cardId) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(cardId)) {
      newSelected.delete(cardId);
    } else {
      newSelected.add(cardId);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === cartItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cartItems.map((item) => item.card_id)));
    }
  };

  const getSelectedTotal = () => {
    return cartItems.reduce((sum, item) => {
      const card = cards[Math.floor(item.card_id)];
      return selectedItems.has(item.card_id)
        ? sum + (card ? card.price * item.quantity : 0)
        : sum;
    }, 0);
  };

  const handleCheckout = () => {
    if (selectedItems.size === 0) {
      alert("Please select items to checkout");
      return;
    }
    // Store selected items in sessionStorage for Payment page
    sessionStorage.setItem(
      "selectedCartItems",
      JSON.stringify(Array.from(selectedItems))
    );
    navigate("/payment");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Nav />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-blue-600 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <FaShoppingCart className="mr-2" />
              Shopping Cart
            </h2>
            {cartItems.length > 0 && (
              <button
                onClick={handleSelectAll}
                className="text-white hover:text-gray-200 text-sm font-medium"
              >
                {selectedItems.size === cartItems.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
            )}
          </div>

          {cartItems.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <div>
              <ul className="divide-y divide-gray-200">
                {cartItems.map((item) => {
                  const card = cards[Math.floor(item.card_id)];
                  if (!card) return null;
                  return (
                    <li
                      key={item.card_id}
                      className={`p-6 flex items-center hover:bg-gray-50 transition-colors ${
                        selectedItems.has(item.card_id) ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(item.card_id)}
                          onChange={() => handleItemSelect(item.card_id)}
                          className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </div>
                      <div className="ml-4 flex-1 flex items-center">
                        <img
                          src={card.image_url}
                          alt={card.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="ml-6 flex-1">
                          <h3 className="text-lg font-medium text-gray-900">
                            {card.name}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                          <p className="mt-1 text-sm font-medium text-gray-900">
                            ${(card.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.card_id)}
                          className="ml-4 text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">
                      Selected Items: {selectedItems.size}
                    </p>
                    <p className="text-lg font-medium text-gray-900">
                      Selected Total: ${getSelectedTotal().toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={handleCheckout}
                    disabled={selectedItems.size === 0}
                    className={`px-6 py-3 rounded-lg text-white font-medium transition-colors ${
                      selectedItems.size === 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
