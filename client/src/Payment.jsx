import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./components/Nav";
import { FaCreditCard, FaLock } from "react-icons/fa";
import {
  BsCreditCard2Front,
  BsCalendarDate,
  BsShieldLock,
} from "react-icons/bs";

const Payment = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [cards, setCards] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
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
          `http://localhost:8080/cat201project/Cart?action=getCart&userId=${userData.user_id}`
        );
        const cartData = await cartResponse.json();

        // Filter cart items based on selection
        const filteredCartItems = cartData.filter((item) =>
          selectedItemsSet.has(item.card_id)
        );

        const cardsResponse = await fetch(
          "http://localhost:8080/cat201project/readCard"
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

      if (paymentMethod === "wallet") {
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
          "http://localhost:8080/cat201project/Wallet",
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
          await fetch("http://localhost:8080/cat201project/Cart", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `action=clearCart&userId=${userData.user_id}`,
          });

          alert("Payment successful! Thank you for your purchase.");
          navigate("/");
        } else {
          alert("Payment failed: " + (result.message || "Unknown error"));
        }
      } else {
        // Your existing credit/debit card payment logic
        const response = await fetch(
          "http://localhost:8080/cat201project/Payment",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `action=processPayment&userId=${userData.user_id}&amount=${totalAmount}`,
          }
        );

        const paymentData = await response.json();

        if (paymentData.success) {
          await fetch("http://localhost:8080/cat201project/Cart", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `action=clearCart&userId=${userData.user_id}`,
          });

          alert("Payment successful! Thank you for your purchase.");
          navigate("/");
        } else {
          alert("Payment failed: " + (paymentData.message || "Unknown error"));
        }
      }
    } catch (error) {
      console.error("Payment error details:", error); // Debug log
      alert("Error processing payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const handleCardNumberChange = (e) => {
    const value = formatCardNumber(e.target.value);
    setCardNumber(value);
  };

  const handleExpiryDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }
    setExpiryDate(value);
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
                        src={card.image_url}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center">
                      <FaCreditCard className="mr-2" />
                      Payment Method
                    </span>
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="wallet">
                      Wallet Balance (${user?.wallet?.toFixed(2) || "0.00"})
                    </option>
                    <option value="credit">Credit Card</option>
                    <option value="debit">Debit Card</option>
                  </select>
                </div>

                {paymentMethod === "wallet" && user && (
                  <div className="mt-4">
                    <div className="p-4 bg-blue-50 text-blue-700 rounded-lg mb-4">
                      <p className="font-medium">
                        Current Balance: ${Number(user.wallet).toFixed(2)}
                      </p>
                    </div>

                    {Number(user.wallet) < Number(totalAmount) ? (
                      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                        <p className="font-medium">
                          Insufficient balance in your wallet!
                        </p>
                        <p>
                          Required Amount: ${Number(totalAmount).toFixed(2)}
                        </p>
                        <p>
                          Missing Amount: $
                          {(Number(totalAmount) - Number(user.wallet)).toFixed(
                            2
                          )}
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
                          {(Number(user.wallet) - Number(totalAmount)).toFixed(
                            2
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Only show card details if payment method is not wallet */}
                {paymentMethod !== "wallet" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="flex items-center">
                          <BsCreditCard2Front className="mr-2" />
                          Card Number
                        </span>
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="4111 1111 1111 1111"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                        maxLength="19"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <span className="flex items-center">
                            <BsCalendarDate className="mr-2" />
                            Expiry Date
                          </span>
                        </label>
                        <input
                          type="text"
                          value={expiryDate}
                          onChange={handleExpiryDateChange}
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          required
                          maxLength="5"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <span className="flex items-center">
                            <BsShieldLock className="mr-2" />
                            CVV
                          </span>
                        </label>
                        <input
                          type="password"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.slice(0, 3))}
                          placeholder="123"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          required
                          maxLength="3"
                        />
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className={`w-full py-4 px-6 rounded-lg text-white font-medium text-lg transition-all duration-200 ${
                    isProcessing ||
                    (paymentMethod === "wallet" && user?.wallet < totalAmount)
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
                  }`}
                  disabled={
                    isProcessing ||
                    (paymentMethod === "wallet" && user?.wallet < totalAmount)
                  }
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
