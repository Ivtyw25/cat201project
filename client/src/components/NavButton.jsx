// eslint-disable-next-line react/prop-types
const NavButton = ({label, route }) => {

    return (
        <button
            className="cursor-pointer bg-gradient-to-b from-primary to-red-600 hover:from-orange-300 hover:to-yellow-400 px-6 py-3 rounded-xl border-[1px] border-white hover:text-slate-200 text-white font-medium group transition-all duration-300"
        >
            <div className="relative overflow-hidden">
                <p
                    className="group-hover:-translate-y-7 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]"
                >
                    {label}
                </p>
                <p
                    className="absolute top-7 left-0 group-hover:top-0 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]"
                >
                    {label}
                </p>
            </div>
        </button>
      );
      
}

export default NavButton;
