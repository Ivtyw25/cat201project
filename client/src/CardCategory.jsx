import { useEffect, useState } from "react";
import axios from "axios";
import Nav from "./components/Nav";
import SideNav from "./components/SideNav";
import { readCardEndpoint } from "./constants";
import { Images } from "./assets/images";

// eslint-disable-next-line react/prop-types
const CardCategory = ({ category }) => {
  const [cards, setCards] = useState([]);

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

  return (
    <main className="relative">
      <Nav noLinks={true} />
      <section className="padding-x padding-t h-full">
        <div className="flex flex-row max-lg:flex-col gap-10">
          <SideNav />
          <div className="flex flex-wrap gap-4 sm:gap-6 justify-center sm:justify-start w-full">
            {cards.map((card) => {
              const image = Images[card.category]?.[card.image_url];
              return (
                <div
                  key={card.card_id}
                  className="w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px] 
                           bg-white rounded-xl shadow-md overflow-hidden 
                           hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="h-[220px] sm:h-[280px] md:h-[340px] lg:h-[380px] overflow-hidden">
                    <img
                      src={image}
                      alt={card.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-2 sm:p-3 md:p-4 space-y-1 sm:space-y-2">
                    <h3 className="text-base sm:text-lg font-semibold truncate">
                      {card.name}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">
                      {card.description}
                    </p>
                    <div className="flex items-center justify-between pt-1 sm:pt-2">
                      <span className="text-lg sm:text-xl font-bold text-blue-600">
                        ${card.price}
                      </span>
                      <div className="flex flex-col items-end">
                        <span className="text-xs sm:text-sm text-gray-500">
                          Stock: {card.stock}
                        </span>
                        <span className="text-xs sm:text-sm font-medium text-blue-500">
                          {card.rarity}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
};

export default CardCategory;
