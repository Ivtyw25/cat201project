import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./components/Nav";
import { FaLock } from "react-icons/fa";
import { Images } from "./assets/images";
import { readCardEndpoint, readOrderEndpoint } from "./constants";


const Payment = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [cards, setCards] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const userData = JSON.parse(userStr);
      console.log("Payment - User data:", userData); // Debug log
      setUser(userData);
    }
  }, []);

  useEffect(() => {
    const fetchCartAndCards = async () => {
      try {
        const userStr = localStorage.getItem("user");
        if (!userStr) {
          alert("Please log in to proceed with payment");
          navigate("/login");
          return;
        }
        const userData = JSON.parse(userStr);
        setUser(userData); // Set user data here as well

        // Get selected items from sessionStorage
        const selectedItemsStr = sessionStorage.getItem("selectedCartItems");
        const selectedItemsSet = new Set(JSON.parse(selectedItemsStr));

        const cartResponse = await fetch(
          `http://localhost:8080/cat201project_war/Cart?action=getCart&userId=${userData.user_id}`
        );
        const cartData = await cartResponse.json();

        // Filter cart items based on selection
        const filteredCartItems = cartData.filter((item) =>
          selectedItemsSet.has(item.card_id)
        );

        // Prepare the filtered cart items to send to the serve

        const cardsResponse = await fetch(
          "http://localhost:8080/cat201project_war/readCard"
        );
        const cardsData = await cardsResponse.json();

        const cardsMap = {};
        cardsData.forEach((card) => {
          cardsMap[Math.floor(card.card_id)] = card;
        });

        setCards(cardsMap);
        setCartItems(filteredCartItems);

        const total = filteredCartItems.reduce((sum, item) => {
          const card = cardsMap[Math.floor(item.card_id)];
          return sum + (card ? card.price * item.quantity : 0);
        }, 0);
        setTotalAmount(total);
        console.log("Total Amount:", total); // Debug log
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCartAndCards();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return;
      const userData = JSON.parse(userStr);

      console.log("Starting wallet payment..."); // Debug log
      console.log("User data:", userData); // Debug log
      console.log("Total amount:", totalAmount); // Debug log

      // Check if user has enough balance
      if (userData.wallet < totalAmount) {
        alert("Insufficient balance in your wallet!");
        setIsProcessing(false);
        return;
      }

      // Update user balance
      const response = await fetch(
        "http://localhost:8080/cat201project_war/Wallet",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `action=updateWallet&userId=${userData.user_id}&amount=${totalAmount}`,
        }
      );

      console.log("Response status:", response.status); // Debug log
      const result = await response.json();
      console.log("Response data:", result); // Debug log

      if (result.success) {
        // Update local storage with new balance
        const updatedUser = {
          ...userData,
          wallet: userData.wallet - totalAmount,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        // Clear cart
        const clearCartResponse = await fetch("http://localhost:8080/cat201project_war/Cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            action: "clearCart",
            userId: user.user_id, // Ensure this is defined
            items: JSON.stringify(cartItems), // URL-encode your cart items if necessary
          }),
        });
        
        const updateQuantityResponse = await fetch(readCardEndpoint, {
          method: "POST",
          headers: { 
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            action: "deductQuantity",
            items: JSON.stringify(cartItems)
          })
        });

        const updateOrderResponse = await fetch(readOrderEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            items: JSON.stringify(cartItems),
            userId: user.user_id,
            action: "addOrder"
          })
        })

        if (!updateOrderResponse.ok) {
          console.error("Error submitting order to admin");
        } else {
          console.log("Succesfully submit the order ot admin");
        }


        if (!updateQuantityResponse.ok) {
          console.error("Failed to update card quantities");
        } else {
          console.log("Stock deduct succesfully");
        }

        if (!clearCartResponse.ok) {
          const errorMessage = await clearCartResponse.text();
          console.error("Clear Cart Error:", errorMessage); // Debug log
          alert("Failed to clear cart: " + errorMessage);
          return;
        } else {
          alert("Payment succesfully, redirect to homepage");
          navigate("/")
        }
      } else {
        alert("Payment failed: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Payment error details:", error); // Debug log
      alert("Error processing payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <Nav />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Checkout
          </h1>
          <p className="text-lg text-gray-600">
            Complete your purchase securely
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-blue-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Order Summary</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {cartItems.map((item) => {
                  const card = cards[Math.floor(item.card_id)];
                  if (!card) return null;
                  return (
                    <div
                      key={item.card_id}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <img
                        src={Images[card.category]?.[card.image_url]}
                        alt={card.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {card.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium text-gray-900">
                        ${(card.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-blue-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Payment Details</h2>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600 flex items-center">
                    <FaLock className="mr-2" />
                    Secure Payment
                  </span>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png"
                    alt="Visa"
                    className="h-6"
                  />
                </div>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="mt-4">
                  <div className="p-4 bg-blue-50 text-blue-700 rounded-lg mb-4">
                    <p className="font-medium">
                      Current Balance: ${user ? Number(user.wallet).toFixed(2) : "0.00"}
                    </p>
                  </div>

                  {user && Number(user.wallet) < Number(totalAmount) ? (
                    <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                      <p className="font-medium">
                        Insufficient balance in your wallet!
                      </p>
                      <p>
                        Required Amount: ${Number(totalAmount).toFixed(2)}
                      </p>
                      <p>
                        Missing Amount: $
                        {(Number(totalAmount) - Number(user.wallet)).toFixed(2)}
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 bg-green-50 text-green-700 rounded-lg">
                      <p className="font-medium">
                        Sufficient balance available!
                      </p>
                      <p>Payment Amount: ${Number(totalAmount).toFixed(2)}</p>
                      <p>
                        Remaining Balance after payment: $
                        {(user ? Number(user.wallet) - Number(totalAmount) : 0).toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className={`w-full py-4 px-6 rounded-lg text-white font-medium text-lg transition-all duration-200 ${
                    isProcessing || (user && user.wallet < totalAmount)
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
                  }`}
                  disabled={isProcessing || (user && user.wallet < totalAmount)}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span>Pay ${totalAmount.toFixed(2)}</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
