import { useEffect, useState } from "react";
import axios from "axios";
import Nav from "./components/Nav";
import SideNav from "./components/SideNav";
import { readCardEndpoint } from "./constants";
import { Images } from "./assets/images";
import Footer from "./sections/Footer";
import ItemCard from "./components/ItemCard";

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
  }, []); 

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
                <ItemCard card={card} image={image} />
              );
            })}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default CardCategory;
