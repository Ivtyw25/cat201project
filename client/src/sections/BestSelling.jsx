import Line from "../components/Line";
import TitleBlock from "../components/TitleBlock";
import "react-multi-carousel/lib/styles.css";
import ItemSlider from "../components/ItemSlider";
import { useState, useEffect } from "react";
import axios from "axios";
import { readCardEndpoint } from "../constants";

const BestSelling = () => {
  const [cards, setCards] = useState([]);
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await axios.get(readCardEndpoint);
        const filteredCards = response.data.filter(
          (card) => card.category === "Pokemon"
        );
        console.log("Filtered cards:", filteredCards);
        setCards(filteredCards);
      } catch (error) {
        console.error("Error fetching cards:", error);
      }
    };

    fetchCards();
  }, []);

  return (
    <section id="product" className="max-container w-full flex flex-col">
      <div className="flex flex-col">
        <div className="flex items-center justify-start gap-6">
          <TitleBlock />
          <h1 className="text-xl font-bold font-palanquin">
            <span className="text-secondary"> This Month </span>
          </h1>
        </div>
        <div className="pt-2 justify-between items-center gap-5 flex flex-row">
          <p className="max-md:text-2xl text-3xl flex-1 mt-2 font-bold font-palanquin">
            Best Selling Cards
          </p>
          <a className="px-8 py-3 text-lg font-semibold border hover-2 rounded cursor-pointer border-gray-800">
            View All
          </a>
        </div>
      </div>
      <div>
        <ItemSlider cards={cards} />
      </div>
      <Line />
    </section>
  );
};

export default BestSelling;
