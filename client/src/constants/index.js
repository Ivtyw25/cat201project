export const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#product", label: "Product" },
    { href: "#help", label: "Help"},
    { href: "#contact", label: "Contact"}
];

export const navButtons = [
    {
        label: "Yu-Gi-Oh!",
        route: "/beaches",
        colorFrom: "yellow-200",
        colorTo: "orange-200"
    },
    {
        label: "Pokémon",
        route: "/themeparks"
    },
    {
        label: "Disney Lorcana",
        route: "/FoodAndBeverage"
    },
    {
        label: "One Piece",
        route: "/cultureandheritage"
    },
    {
        label: "Digimon",
        route: "/natureandwildlife"
    },
    {
        label: "Star Wars: Unlimited",
        route: "/accommodations"
    },
    {
        label: "Dragon Ball Super",
        route: "/transportations"
    },
]

export const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 1024 },
      items: 5,
      slidesToSlide: 2,
    },
    desktop: {
      breakpoint: { max: 1024, min: 800 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 800, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };