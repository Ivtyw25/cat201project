import Nav from "./components/Nav"
import { navLinks } from "./constants"
import Hero from "./sections/Hero"
import ProductCategories from "./sections/ProductCategories"
import BestSelling from "./sections/BestSelling"
import Footer from "./sections/Footer"
const App = () => {

  return (
    <main className="relative">
        <Nav navLinks={navLinks}/>
        <section className="xl:padding-l wide:padding-r padding-b">
          <Hero/>
        </section>
        <section className="padding-x padding-b">
          <ProductCategories/>
        </section>
        <section className="padding-x padding-b">
          <BestSelling/>
        </section>
        <section className="padding-t">
          <Footer/>
        </section>

    </main>
  )
}

export default App
