import { useNavigate } from "react-router";
import { Images } from "../assets/images";
import Line from "../components/Line";
const Hero = () => {
  const navigate = useNavigate();
  const handleNavigation = ({ route }) => {
    navigate(route);
  };
  return (
    <section id="home" className="max-container">
      <div className="container flex flex-col justify-center p-6 mx-auto sm:py-12 lg:py-24 lg:flex-row lg:justify-between">
        <div className="flex items-center justify-center p-6 mt-8 lg:ml-32 lg:mt-0 h-72 sm:h-80 lg:h-96 xl:h-112 ">
          <img
            src={Images.hero.HeroImage}
            alt="HeroImage"
            className="flex rotate-12 items-center justify-center p-6 mt-8 lg:mt-0 h-72 sm:h-80 lg:h-96 xl:h-[450px]"
          />
        </div>
        <div className="flex flex-col justify-center p-4 text-center lg:max-w-lg xl:max-w-xl lg:text-left rounded-sm">
          <h1 className="text-3xl font-bold font-palanquin leading-none sm:text-6xl">
            Trading <span className="font-palanquin text-primary">Card</span>{" "}
            Collection{" "}
            <span className="font-palanquin text-secondary">Store</span>
          </h1>
          <p className="mt-6 mb-8 text-lg sm:mb-12 font-montserrat info-text">
            Not sure where to find all the trading card collection?
            <br />
            Find it here!
          </p>
          <div className="flex flex-col space-y-4 sm:items-center sm:justify-center sm:flex-row sm:space-y-0 sm:space-x-4 lg:justify-start">
            <a
              className="px-8 py-3 text-lg font-semibold rounded-lg bg-gradient-to-r from-violet-600 to-purple-700 text-gray-50 shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-violet-600 hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => handleNavigation({ route: "/profile" })}
            >
              Ka-Ching!
            </a>

            <a className="px-8 py-3 text-lg font-semibold border hover-2 rounded cursor-pointer border-gray-800">
              Explore More
            </a>
          </div>
        </div>
      </div>
      <Line />
    </section>
  );
};

export default Hero;
