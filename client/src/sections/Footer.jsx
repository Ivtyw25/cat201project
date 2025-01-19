import { homeLogo } from "../assets/icons";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center space-y-6">
          {/* Logo Section */}
          <div className="flex items-center space-x-2">
            <img src={homeLogo} alt="Website Logo" className="h-12 w-auto" />
            <span className="text-xl font-bold">CardMarket</span>
          </div>

          {/* Divider */}
          <div className="w-full border-t border-gray-700 my-4" />

          {/* Copyright Section */}
          <div className="text-center text-gray-400 text-sm">
            <p>&copy; {currentYear} CardMarket. All rights reserved.</p>
            <p className="mt-2">Trading Card Game Marketplace</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
