import { navButtons } from "../constants"
import { useNavigate } from "react-router-dom";
const SideNav = () => {
    const navigate = useNavigate();
    
    const handleClick = (route) => {
        navigate(route)
    };
  return (
    <div>
        <div className="min-w-56 max-lg:hidden flex flex-col gap-10">
            <h3 className="font-bold text-lg font-montserrat">Other Categories</h3>
            <div className="flex flex-col mt-8 gap-5 text-lg text-slate-gray font-palanquin">
            {navButtons.map((item, index) => (
                <p
                    key={index}
                    className="cursor-pointer hover:text-black"
                    onClick={() => handleClick(item.route)}
                >
                    {item.label}
                </p>
            ))}
            </div>
        </div>
    </div>
  )
}

export default SideNav
