import { useEffect, useState } from "react"
import axios from "axios"
import Nav from "./components/Nav"
import SideNav from "./components/SideNav"
import { readCardEndpoint } from "./constants"

// eslint-disable-next-line react/prop-types
const CardCategory = ({category}) => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await axios.get(readCardEndpoint);
        // Filter cards based on category prop
        const filteredCards = response.data.filter(card => card.category === category);
        setCards(filteredCards);
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    };

    fetchCards();
  }, [category]); // Re-fetch when category changes

  return (
    <main className="relative">
        <Nav noLinks={true}/>
        <section className="padding-x padding-t h-full">
          <div className="flex flex-row max-lg:flex-col gap-10">
            <SideNav/>
            <div className='flex flex-wrap -m-4'>
              {cards.map((card) => (
                <div key={card.card_id} className="p-4 w-full md:w-1/2 lg:w-1/3">
                  <div className="border rounded-lg p-4">
                    <img src={card.image_url} alt={card.name} className="w-full h-48 object-cover rounded-lg"/>
                    <h3 className="text-xl font-semibold mt-2">{card.name}</h3>
                    <p className="text-gray-600">{card.description}</p>
                    <div className="mt-2">
                      <span className="font-bold">${card.price}</span>
                      <span className="ml-2 text-sm text-gray-500">Stock: {card.stock}</span>
                      <span className="ml-2 text-sm text-blue-500">{card.rarity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
    </main>
  )
}

export default CardCategory
