import React from "react";
import Slider from "react-slick";
import ItemCard from "./ItemCard";
import { Images } from "../assets/images";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ItemSlider = ({ cards }) => {
  console.log("Cards received:", cards);

  if (!cards || cards.length === 0) {
    return <div>No items to display</div>;
  }

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    autoplay: false,
    swipeToSlide: true,
    draggable: true,
    touchThreshold: 10,
    responsive: [
      {
        breakpoint: 9999,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
  };

  return (
    <div className="w-full px-4 md:px-8 lg:px-12">
      <div className="slider-wrapper">
        <Slider {...settings}>
          {cards.map((card, index) => {
            const image = Images[card.category]?.[card.image_url];
            console.log("Image path:", card.category, card.image_url, image);
            return (
              <div key={index} className="px-2 sm:px-3 md:px-4">
                <div className="card-wrapper">
                  <ItemCard card={card} image={image} />
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    </div>
  );
};

export default ItemSlider;
