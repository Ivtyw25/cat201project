import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Card from "./Card";
import CardCategory from "./CardCategory";
import Login from "./page/Login";
import SignUp from "./page/SignUp";


export const router = createBrowserRouter([
    {path: "/", element: <App/>},
    {path: "/card", element: <Card/>},
    {path: "/loginpage", element: <Login/>},
    {path: "/signuppage", element: <SignUp/>},
    {path: "/naruto", element: <CardCategory category="Naruto"/>},
    {path: "/aot", element: <CardCategory category="Attack on Titan"/>},
    {path: "/onepiece", element: <CardCategory category="One Piece"/>},
    {path: "/demonslayer", element: <CardCategory category="Demon Slayer"/>}, 
    {path: "/myheroacademia", element: <CardCategory category="My Hero Academia"/>},
]);
