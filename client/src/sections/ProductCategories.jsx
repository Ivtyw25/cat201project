import Line from "../components/Line"
import NavButton from "../components/NavButton"
import TitleBlock from "../components/TitleBlock"
import { navButtons } from "../constants"


const ProductCategories = () => {
  return (
    <section id="#navigation" className="max-container w-full flex flex-col">
        <div className="flex flex-col">
            <div className="flex items-center justify-start gap-6">
                <TitleBlock/>
                <h1 className="text-xl font-bold font-palanquin">
                    <span className="text-secondary"> Categories </span>
                </h1>
            </div>
            <div className="pt-2 justify-between items-center gap-5 flex flex-row">
                <p className="max-md:text-2xl text-3xl flex-1 mt-2 font-bold font-palanquin">Explore By Categories</p>
            </div>
        </div>
        <div className="mt-10 gap-10 max-sm:grid max-sm:grid-cols-2 max-w-screen-xl flex flex-wrap">
            {navButtons.map((item,index) => (
                <NavButton key={index} route={item.route} label={item.label}/>
            ))}
        </div>
        <Line/>
    </section>
  )
}

export default ProductCategories
