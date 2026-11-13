export const bakery = {
  name: "Nitara's Fine Bakes",
  tagline: "Homemade · Fresh · With love",
  promise: "Small batches, big dreams",
  phone: "+916379805442",
  phoneDisplay: "+91 63798 05442",
  whatsapp: "916379805442",
  instagramHandle: "nitaras_fine_bakes_bangalore",
  instagramUrl: "https://www.instagram.com/nitaras_fine_bakes_bangalore/",
  location: "JP Nagar, Bangalore",
};

export interface CakeItem {
  name: string;
  price: number;
  /** Photo shown beside this cake in the menu and in the basket. */
  image: string;
}

export interface CakeCategory {
  id: string;
  title: string;
  tagline: string;
  image: string;
  items: CakeItem[];
}

export const cakeMenu: CakeCategory[] = [
  {
    id: "classic",
    title: "Pastry Cakes",
    tagline: "The classics, layered with fresh cream.",
    image: "/bakery/cake-fruit.webp",
    items: [
      { name: "Blackforest", price: 750, image: "/bakery/cakes/blackforest.webp" },
      { name: "Whiteforest", price: 850, image: "/bakery/cakes/whiteforest.webp" },
      { name: "Strawberry", price: 850, image: "/bakery/cakes/strawberry.webp" },
      { name: "Butterscotch", price: 850, image: "/bakery/cakes/butterscotch.webp" },
      { name: "Pineapple", price: 850, image: "/bakery/cakes/pineapple.webp" },
      { name: "Mango", price: 850, image: "/bakery/cakes/mango.webp" },
      { name: "Red velvet", price: 1050, image: "/bakery/cakes/red-velvet.webp" },
      { name: "Blueberry", price: 950, image: "/bakery/cakes/blueberry.webp" },
      { name: "Twin flavour", price: 950, image: "/bakery/cakes/twin-flavour.webp" },
      { name: "Berry blast", price: 1050, image: "/bakery/cakes/berry-blast.webp" },
      { name: "Pista", price: 1050, image: "/bakery/cakes/pista.webp" },
      { name: "Irish coffee", price: 950, image: "/bakery/cakes/irish-coffee.webp" },
      { name: "Blackcurrant", price: 850, image: "/bakery/cakes/blackcurrant.webp" },
      { name: "Vancho", price: 850, image: "/bakery/cakes/vancho.webp" },
      { name: "Litchi", price: 850, image: "/bakery/cakes/litchi.webp" },
      { name: "Vanilla", price: 750, image: "/bakery/cakes/vanilla.webp" },
    ],
  },
  {
    id: "exotic",
    title: "Exotic Flavours",
    tagline: "Your favourite Indian sweets, baked into a cake.",
    image: "/bakery/cake-exotic.webp",
    items: [
      { name: "Rasmalai", price: 1350, image: "/bakery/cakes/rasmalai.webp" },
      { name: "Gulab jamun", price: 1150, image: "/bakery/cakes/gulab-jamun.webp" },
      { name: "Rasagulla", price: 1150, image: "/bakery/cakes/rasagulla.webp" },
      { name: "Motichoor laddu", price: 1250, image: "/bakery/cakes/motichoor-laddu.webp" },
      { name: "Kaju katli", price: 1550, image: "/bakery/cakes/kaju-katli.webp" },
      { name: "Rosemilk", price: 1050, image: "/bakery/cakes/rosemilk.webp" },
      { name: "Crunchy caramel", price: 1050, image: "/bakery/cakes/crunchy-caramel.webp" },
      { name: "Fresh fruit fantasy", price: 1250, image: "/bakery/cakes/fresh-fruit-fantasy.webp" },
    ],
  },
  {
    id: "chocolate",
    title: "Chocolate Pastry",
    tagline: "For when it has to be chocolate.",
    image: "/bakery/cake-chocolate.webp",
    items: [
      { name: "Chocolate truffle", price: 1050, image: "/bakery/cakes/chocolate-truffle.webp" },
      { name: "Chocolate KitKat", price: 1250, image: "/bakery/cakes/chocolate-wafer.webp" },
      { name: "Chocolate pastry", price: 850, image: "/bakery/cakes/chocolate-pastry.webp" },
      { name: "Cookie & cream", price: 950, image: "/bakery/cakes/cookie-cream.webp" },
      { name: "Death by chocolate", price: 1350, image: "/bakery/cakes/death-by-chocolate.webp" },
      { name: "White chocolate truffle", price: 1250, image: "/bakery/cakes/white-chocolate-truffle.webp" },
      { name: "Chocolate mocha", price: 1250, image: "/bakery/cakes/chocolate-mocha.webp" },
      { name: "Ferrero Rocher", price: 1350, image: "/bakery/cakes/hazelnut-chocolate.webp" },
    ],
  },
];

export const cakeNotes = ["Customised cakes at extra cost", "Eggless cake +₹150"];

export interface BrownieItem {
  name: string;
  description: string;
  image: string;
  prices: { size: string; pieces: string; price: number }[];
}

const sizes = (a: number, b: number, c: number) => [
  { size: "250 g", pieces: "4 pcs", price: a },
  { size: "500 g", pieces: "8 pcs", price: b },
  { size: "1 kg", pieces: "16 pcs", price: c },
];

export const brownies: BrownieItem[] = [
  { name: "Classic Brownie", description: "Plain chocolate, soft and fudgy in the middle.", image: "/bakery/brownie-classic.webp", prices: sizes(300, 550, 1050) },
  { name: "Nuts Brownie", description: "The classic, loaded with crunchy nuts.", image: "/bakery/brownie-nuts.webp", prices: sizes(360, 650, 1250) },
  { name: "Choco Chips Brownie", description: "Chocolate chips in every bite.", image: "/bakery/brownie-choco-chips.webp", prices: sizes(340, 620, 1200) },
  { name: "Lotus Biscoff Brownie", description: "Biscoff crumbs and caramel on a fudgy base.", image: "/bakery/brownie-lotus-biscoff.webp", prices: sizes(380, 700, 1350) },
  { name: "Nutella Brownie", description: "Creamy Nutella on a fudgy brownie.", image: "/bakery/brownie-nutella.webp", prices: sizes(380, 700, 1350) },
  { name: "Double Chocolate Brownie", description: "Two kinds of chocolate in one brownie.", image: "/bakery/brownie-double-chocolate.webp", prices: sizes(360, 650, 1250) },
  { name: "Triple Chocolate Brownie", description: "Dark, milk and white chocolate together.", image: "/bakery/brownie-triple-chocolate.webp", prices: sizes(400, 750, 1450) },
  { name: "Nuts & Choco Chips Brownie", description: "Crunchy nuts and chocolate chips, both.", image: "/bakery/brownie-nuts-choco-chips.webp", prices: sizes(380, 700, 1350) },
];

export const brownieTub = {
  name: "Brownie Tub",
  description: "Perfect for sharing (or not!).",
  image: "/bakery/brownie-tub.webp",
  prices: [
    { label: "Half tub (250 g)", price: 320 },
    { label: "Full tub (500 g)", price: 580 },
  ],
};

export const brownieBox = {
  name: "Brownie Box",
  description: "A little bit of everything!",
  image: "/bakery/brownie-box.webp",
  prices: [
    { label: "Box of 4", price: 300 },
    { label: "Box of 6", price: 450 },
    { label: "Box of 8", price: 550 },
    { label: "Box of 12", price: 800 },
    { label: "Box of 16 (1 kg)", price: 1050 },
  ],
};

export const brownieAddOns = [
  { name: "Birthday decorated brownies", price: 30 },
  { name: "Oreo / cookie crunch", price: 20 },
  { name: "Lotus Biscoff", price: 25 },
  { name: "Choco chips", price: 15 },
  { name: "Nuts topping", price: 20 },
];

export const bakeryInfo = [
  { title: "Shipping / delivery", body: "Extra, depending on location." },
  { title: "Order in advance", body: "Minimum 3 days for custom orders." },
  { title: "Payment", body: "UPI, bank transfer or cash." },
];

export const signatureBakes = [
  { name: "Red velvet", tag: "Most loved", price: 1050, image: "/bakery/cakes/red-velvet.webp", note: "Velvety sponge, cream cheese frosting." },
  { name: "Death by chocolate", tag: "For chocoholics", price: 1350, image: "/bakery/cakes/death-by-chocolate.webp", note: "Layers of fudge, ganache and sponge." },
  { name: "Rasmalai", tag: "Exotic pick", price: 1350, image: "/bakery/cakes/rasmalai.webp", note: "Saffron, pistachio and soft rasmalai." },
  { name: "Lotus Biscoff Brownie", tag: "Bestseller", price: 380, image: "/bakery/brownie-lotus-biscoff.webp", note: "Caramel Biscoff on a fudgy base." },
];

export const occasions = [
  { id: "birthday", phrase: "a birthday", title: "Birthdays", line: "Make a wish.", body: "Tell us the name, the age and the theme, and we'll put it on the cake.", image: "/bakery/cake-celebration.webp", picks: ["Red velvet", "Chocolate KitKat", "Birthday decorated brownies"] },
  { id: "anniversary", phrase: "an anniversary", title: "Anniversaries", line: "Sweet, like the years together.", body: "Simple, pretty cakes for a dinner for two or the whole family.", image: "/bakery/cake-fruit.webp", picks: ["Blueberry", "White chocolate truffle", "Ferrero Rocher"] },
  { id: "party", phrase: "a party", title: "Parties", line: "Enough to go around. Twice.", body: "Brownie tubs and big cakes that feed a crowd.", image: "/bakery/brownie-tub.webp", picks: ["Brownie Tub", "Death by chocolate", "Triple Chocolate Brownie"] },
  { id: "gifting", phrase: "a gift", title: "Gifting", line: "Better than flowers.", body: "Brownie boxes packed by hand and ready to give.", image: "/bakery/brownie-box.webp", picks: ["Brownie Box", "Lotus Biscoff Brownie", "Nutella Brownie"] },
  { id: "festival", phrase: "a festival", title: "Festivals", line: "Mithai, meet cake.", body: "Rasmalai, kaju katli and motichoor laddu, baked into cakes.", image: "/bakery/cake-exotic.webp", picks: ["Rasmalai", "Kaju katli", "Motichoor laddu"] },
  { id: "office", phrase: "an office treat", title: "Office treats", line: "The whole team will thank you.", body: "Brownies in bulk for birthdays, wins and Friday afternoons.", image: "/bakery/brownie-nuts-choco-chips.webp", picks: ["Classic Brownie", "Nuts & Choco Chips Brownie", "Choco Chips Brownie"] },
];

