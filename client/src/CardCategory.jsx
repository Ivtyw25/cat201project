import { useEffect, useState } from "react";
import axios from "axios";
import Nav from "./components/Nav";
import SideNav from "./components/SideNav";
import { readCardEndpoint } from "./constants";

// eslint-disable-next-line react/prop-types
const CardCategory = ({ category }) => {
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
    setShowModal(true);
  };

  return (
    <main className="relative">
      <Nav noLinks={true} />
      <section className="padding-x padding-t h-full">
        <div className="flex flex-row max-lg:flex-col gap-10">
          <SideNav />
          <div className="flex flex-wrap -m-4">
            {cards.map((card) => (
              <div
                key={card.card_id}
                className="p-4 w-full md:w-1/2 lg:w-1/3 cursor-pointer"
                onClick={() => handleCardClick(card)}
              >
                <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <img
                    src={card.image_url}
                    alt={card.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <h3 className="text-xl font-semibold mt-2">{card.name}</h3>
                  <p className="text-gray-600 line-clamp-2">
                    {card.description}
                  </p>
                  <div className="mt-2">
                    <span className="font-bold">${card.price}</span>
                    <span className="ml-2 text-sm text-gray-500">
                      Stock: {card.stock}
                    </span>
                    <span className="ml-2 text-sm text-blue-500">
                      {card.rarity}
                    </span>
                  </div>
                </div>
              </div>
            ))}
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
                    src={selectedCard.image_url}
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

                  <div className="pt-4">
                    <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default CardCategory;
