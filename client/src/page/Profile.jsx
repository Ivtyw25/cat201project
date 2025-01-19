import React, { useEffect, useState } from "react";
import Footer from "../sections/Footer";
import Nav from "../components/Nav";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");

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

    try {
      const userStr = localStorage.getItem("user");
      const userData = JSON.parse(userStr);
      const newWalletBalance = Number(userData.wallet) + Number(topUpAmount);

      const response = await fetch(
        "http://localhost:8080/cat201project/Wallet",
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
      console.log("User ID in profile:", userData.user_id); // Check if this is null
      console.log("User data:", userData);
      const result = await response.json();
      console.log("API response:", result);  // Debug the response
      
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
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">User Profile</h1>
            <p className="text-gray-500">
              Manage your profile details and account balance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {Object.entries(user).map(([key, value]) => (
              <div key={key} className="p-4 border rounded-md bg-gray-50">
                <h3 className="text-sm font-medium text-gray-500">
                  {key.charAt(0).toUpperCase() +
                    key.slice(1).replace(/_/g, " ")}
                </h3>
                <p className="text-lg font-semibold text-gray-700">{value}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:ring-4 focus:ring-blue-300"
              onClick={() => setIsModalOpen(true)}
            >
              Top Up Credit
            </button>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Top Up Credit
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Enter the amount you want to top up:
              </p>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter amount"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
              />
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none"
                  onClick={handleModalClose}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
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
