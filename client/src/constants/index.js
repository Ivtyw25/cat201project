export const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#product", label: "Product" },
    { href: "#help", label: "Help"},
    { href: "#contact", label: "Contact"}
];

export const readCardEndpoint = 'http://localhost:8080/cat201project/readCard'

export const navButtons = [
    {
        label: "Naruto",
        route: "/naruto",
    },
    {
        label: "Attack on Titan",
        route: "/aot"
    },
    {
        label: "One Piece",
        route: "/onepiece"
    },
    {
        label: "Demon Slayer",
        route: "/demonslayer"
    },
    {
        label: "My Hero Academia",
        route: "/myheroacademia"
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