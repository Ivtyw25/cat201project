import { hamburger } from "../assets/icons";
import { homeLogo } from "../assets/icons";
import { useState } from "react";
import { cart, profile } from "../assets/icons";
// eslint-disable-next-line react/prop-types
const Nav = ({navLinks = [], noLinks}) => {
  
  const handleNavigation = ({route}) => {
    navigate(route);
  };
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header className='py-4 padding-x z-10 w-full'>
      <nav className='flex justify-between items-center max-container'>
        <a href='/'>
          <img
            src={homeLogo}
            alt='logo'
            width={75}
            height={75}
            className="m-0 z-0"
        />
        </a>
        <ul className='flex-1 flex justify-center items-center gap-16 max-lg:hidden'>
          {navLinks.map((item) => (
            <li key={item.label} className="">
              <a
                href={item?.href}
                className='font-montserrat leading-normal text-lg text-slate-gray
                  hover:text-blue-400 tansform transition-transform ease-in-out duration-200'
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex gap-10 items-center max-sm:gap-4">
          <button className="hover:scale-110 transition-transform"
                  onClick={() =>handleNavigation({route:"/cart"})} >
            <img src={cart} alt="shopping cart" width={24} height={24} />
          </button>
          <button className="hover:scale-110 transition-transform"
                  onClick={() => handleNavigation({route:"/profile"})}>
            <img src={profile} alt="user profile" width={24} height={24} />
          </button>
          {!noLinks && 
            <div className='hidden max-lg:block' onClick={() => setIsOpen((prevState) => !prevState)}>
              <img src={hamburger} alt='hamburger icon' width={25} height={25} />
            </div>
          }
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
