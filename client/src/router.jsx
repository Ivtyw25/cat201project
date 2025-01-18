import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Card from "./Card";
import LoginPage from "./LoginPage";
import CardCategory from "./CardCategory";


export const router = createBrowserRouter([
    {path: "/", element: <App/>},
    {path: "/card", element: <Card/>},
    {path: "/loginpage", element: <LoginPage/>},
    {path: "/cardcategory", element: <CardCategory/>}
  
]);
