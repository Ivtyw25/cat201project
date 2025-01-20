import Nav from "./components/Nav";
import { navLinks } from "./constants";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

import Hero from "./sections/Hero";
import ProductCategories from "./sections/ProductCategories";
import BestSelling from "./sections/BestSelling";
import Footer from "./sections/Footer";
const App = () => {
  const [user, setUser] = useState(null); // Initialize state
  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {

    // Check if this is the first visit during the session
    const firstVisit = sessionStorage.getItem("firstVisit");

    if (!firstVisit) {
      // Mark as visited in sessionStorage
      sessionStorage.setItem("firstVisit", "true");

      // Clear localStorage data if required
      console.log("First visit: clearing local storage.");
      localStorage.clear();
    } else {
      console.log("Subsequent visit: no action taken.");
    }

    
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      console.log("Stored: " + storedUser);
      navigate("/"); // Navigate to the main page if user is found
    } else {
      navigate("/loginpage"); // Navigate to the login page if no user is found
    }
  }, [navigate]); // Add navigate as a dependency

  if (!user) {
    return <p>Loading...</p>; // Show a loading message while checking user data
  }

  return (
    <main className="relative">
      <Nav navLinks={navLinks} />
      <section id="home" className="xl:padding-l wide:padding-r padding-b">
        <Hero />
      </section>
      <section id="product" className="padding-x padding-b">
        <ProductCategories />
      </section>
      <section className="padding-x padding-b">
        <BestSelling />
      </section>
      <section id="footer" className="padding-t">
        <Footer />
      </section>
    </main>
  );
};

export default App;
