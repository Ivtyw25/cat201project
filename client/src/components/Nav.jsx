import { hamburger } from "../assets/icons";
import { homeLogo } from "../assets/icons";
import { useState, useEffect } from "react";
import { cart, profile } from "../assets/icons";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line react/prop-types
const Nav = ({ navLinks = [], noLinks }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);

  // Add an interval to check for wallet updates
  useEffect(() => {
    const updateWallet = () => {
      const userStr = localStorage.getItem("user");
      console.log("Nav - User data from localStorage:", userStr);

      if (userStr) {
        const user = JSON.parse(userStr);
        console.log("Nav - Parsed user data:", user);
        console.log("Nav - Wallet value:", user.wallet);
        setWalletBalance(user.wallet || 0);
      }
    };

    // Initial update
    updateWallet();

    // Set up interval to check for updates
    const interval = setInterval(updateWallet, 1000); // Check every second

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const handleNavigation = ({ route }) => {
    navigate(route);
  };
  return (
    <header className="py-4 padding-x z-10 w-full">
      <nav className="flex justify-between items-center max-container">
        <a href="/">
          <img
            src={homeLogo}
            alt="logo"
            width={75}
            height={75}
            className="m-0 z-0"
          />
        </a>
        <ul className="flex-1 flex justify-center items-center gap-16 max-lg:hidden">
          {navLinks.map((item) => (
            <li key={item.label} className="">
              <a
                href={item?.href}
                className="font-montserrat leading-normal text-lg text-slate-gray
                  hover:text-blue-400 tansform transition-transform ease-in-out duration-200"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex gap-10 items-center max-sm:gap-4">
          <div className="relative">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              onClick={() => setShowWallet(!showWallet)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path
                  fillRule="evenodd"
                  d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                  clipRule="evenodd"
                />
              </svg>
              Wallet
            </button>

            {showWallet && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl p-4 z-50">
                <div className="flex flex-col items-center">
                  <span className="text-gray-600 mb-2">Balance</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ${walletBalance.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
          <button
            className="hover:scale-110 transition-transform"
            onClick={() => handleNavigation({ route: "/cart" })}
          >
            <img src={cart} alt="shopping cart" width={24} height={24} />
          </button>
          <button
            className="hover:scale-110 transition-transform"
            onClick={() => handleNavigation({ route: "/profile" })}
          >
            <img src={profile} alt="user profile" width={24} height={24} />
          </button>
          {!noLinks && (
            <div
              className="hidden max-lg:block"
              onClick={() => setIsOpen((prevState) => !prevState)}
            >
              <img
                src={hamburger}
                alt="hamburger icon"
                width={25}
                height={25}
              />
            </div>
          )}
        </div>
      </nav>
      {isOpen && (
        <div className="fixed inset-0 bg-white z-20 flex flex-col items-center justify-center">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 text-2xl font-bold"
          >
            &times;
          </button>
          <ul className="flex flex-col gap-10 text-center">
            {navLinks.map((item) => (
              <li key={item.label}>
                <a
                  href={item?.href}
                  className="font-montserrat text-xl font-bold text-slate-grey hover:text-blue-400 tansform transition-transform ease-in-out duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Nav;
