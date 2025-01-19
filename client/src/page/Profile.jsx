import React, { useEffect, useState } from "react";
import Footer from "../sections/Footer";
import Nav from "../components/Nav";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      alert("Please log in to view your profile.");
      navigate("/login");
      return;
    }
    const userData = JSON.parse(userStr);
    setUser(userData);
  }, [navigate]);

  const handleTopUpSubmit = async () => {
    if (!topUpAmount || isNaN(topUpAmount) || Number(topUpAmount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    if (!cardNumber || cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
      alert("Please enter a valid 16-digit card number.");
      return;
    }
    if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
      alert("Please enter a valid expiry date in MM/YY format.");
      return;
    }
    if (!cvv || cvv.length !== 3 || !/^\d{3}$/.test(cvv)) {
      alert("Please enter a valid 3-digit CVV.");
      return;
    }

    try {
      const userStr = localStorage.getItem("user");
      const userData = JSON.parse(userStr);
      const newWalletBalance = Number(userData.wallet) + Number(topUpAmount);

      const response = await fetch(
        "http://localhost:8080/cat201project/WalletTopUp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "updateWallet",
            userId: userData.user_id,
            amount: Number(topUpAmount),
            operation: "add",
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        userData.wallet = newWalletBalance;
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        alert(
          `Successfully topped up $${topUpAmount}. New balance: $${newWalletBalance.toFixed(
            2
          )}`
        );
        handleModalClose();
      } else {
        alert("Failed to update wallet. Please try again.");
      }
    } catch (error) {
      console.error("Error updating wallet:", error);
      alert("An error occurred while updating the wallet. Please try again.");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setTopUpAmount("");
    setCardNumber("");
    setExpiryDate("");
    setCvv("");
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-lg text-gray-700">Loading profile...</p>
      </div>
    );
  }

  return (
    <main className="relative bg-gray-50 min-h-screen">
      <Nav noLinks={true} noLogo={true} />
      <section className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-2xl p-10">
  <div className="text-center mb-14">
    <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">User Profile</h1>
    <p className="text-xl text-gray-600 mt-3">Manage your profile details and account balance with ease.</p>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
    {Object.entries(user).map(([key, value]) => (
      <div key={key} className="p-6 border-2 border-gray-300 rounded-xl bg-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out transform">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ")}
        </h3>
        <p className="text-xl font-semibold text-gray-700 mt-2">{value}</p>
      </div>
    ))}
  </div>

  <div className="flex justify-center gap-4 mt-8">
  <button
    className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-semibold py-3 px-8 w-[200px] rounded-full transform transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"
    onClick={() => setIsModalOpen(true)}
  >
    <i className="fas fa-cogs mr-2"></i>Top up
  </button>

  <button
    className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold py-3 px-8 w-[200px] rounded-full transform transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300"
    onClick={() => navigate("/loginpage")}
  >
    <i className="fas fa-sign-out-alt mr-2"></i>Log Out
  </button>
</div>



</div>




        {isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-purple-800 via-black to-purple-800 bg-opacity-90 z-50">
    <div className="bg-gray-900 text-white p-8 rounded-xl shadow-2xl w-96 border-2 border-purple-500">
      <h2 className="text-2xl font-extrabold text-purple-300 mb-6 text-center">
        🔥 Top Up Credit 🔥
      </h2>
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="text-sm font-semibold text-purple-400 mb-2 block">
            Select Bank
          </label>
          <select
            className="w-full bg-gray-800 border border-purple-400 rounded-lg p-3 text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
            defaultValue=""
          >
            <option value="" disabled>
              🏦 Choose your bank
            </option>
            <option value="bank1">Maybank</option>
            <option value="bank2">Hong Leong</option>
            <option value="bank3">Bank Islam</option>
            <option value="bank4">CIMB</option>
            <option value="bank5">HSBC</option>
            <option value="bank6">Standard Chartered</option>
            <option value="bank7">BSN</option>
            <option value="bank8">Public Bank</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-purple-400 mb-2 block">
            Top-Up Amount
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-400">
              💵
            </span>
            <input
              type="number"
              className="w-full bg-gray-800 border border-purple-400 rounded-lg p-3 pl-10 text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Enter amount"
              value={topUpAmount}
              onChange={(e) => setTopUpAmount(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold text-purple-400 mb-2 block">
            Card Number
          </label>
          <input
            type="text"
            className="w-full bg-gray-800 border border-purple-400 rounded-lg p-3 text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-purple-400 mb-2 block">
              Expiry Date
            </label>
            <input
              type="text"
              className="w-full bg-gray-800 border border-purple-400 rounded-lg p-3 text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="MM/YY"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-purple-400 mb-2 block">
              CVV
            </label>
            <input
              type="password"
              className="w-full bg-gray-800 border border-purple-400 rounded-lg p-3 text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="123"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-between">
        <button
          className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-bold py-2 px-6 rounded-lg focus:outline-none shadow-lg transition-transform transform hover:scale-105"
          onClick={handleModalClose}
        >
          Cancel
        </button>
        <button
          className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-bold py-2 px-6 rounded-lg focus:outline-none shadow-lg transition-transform transform hover:scale-105"
          onClick={handleTopUpSubmit}
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
)}


      </section>
      <Footer />
    </main>
  );
};

export default Profile;
