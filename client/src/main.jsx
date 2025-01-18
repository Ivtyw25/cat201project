import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Card from "./Card.jsx";
import App from "./App.jsx";
import CardCategory from "./CardCategory.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CardCategory />
  </StrictMode>
);
