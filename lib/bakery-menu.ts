export const bakery = {
  name: "Nitara's Fine Bakes",
  tagline: "Homemade · Fresh · With love",
  promise: "Small batches, big dreams",
  phone: "8056950470",
  whatsapp: "916379805442",
  whatsappDisplay: "63798 05442",
  instagramHandle: "nitara_fine_bakes_bangalore",
  instagramUrl: "https://www.instagram.com/nitara_fine_bakes_bangalore/",
  location: "JP Nagar, Bangalore",
};

export interface CakeItem {
  name: string;
  price: number;
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
    tagline: "Timeless favourites, layered with fresh cream.",
    image: "/bakery/cake-fruit.webp",
    items: [
      { name: "Blackforest", price: 750 },
      { name: "Whiteforest", price: 850 },
      { name: "Strawberry", price: 850 },
      { name: "Butterscotch", price: 850 },
      { name: "Pineapple", price: 850 },
      { name: "Mango", price: 850 },
      { name: "Red velvet", price: 1050 },
      { name: "Blueberry", price: 950 },
      { name: "Twin flavour", price: 950 },
      { name: "Berry blast", price: 1050 },
      { name: "Pista", price: 1050 },
      { name: "Irish coffee", price: 950 },
      { name: "Blackcurrant", price: 850 },
      { name: "Vancho", price: 850 },
      { name: "Litchi", price: 850 },
      { name: "Vanilla", price: 750 },
    ],
  },
  {
    id: "exotic",
    title: "Exotic Flavours",
    tagline: "Indian sweets, reimagined as cake.",
    image: "/bakery/cake-exotic.webp",
    items: [
      { name: "Rasmalai", price: 1350 },
      { name: "Gulab jamun", price: 1150 },
      { name: "Rasagulla", price: 1150 },
      { name: "Motichoor laddu", price: 1250 },
      { name: "Kaju katli", price: 1550 },
      { name: "Rosemilk", price: 1050 },
      { name: "Crunchy caramel", price: 1050 },
      { name: "Fresh fruit fantasy", price: 1250 },
    ],
  },
  {
    id: "chocolate",
    title: "Chocolate Pastry",
    tagline: "Deep, dark and seriously indulgent.",
    image: "/bakery/cake-chocolate.webp",
    items: [
      { name: "Chocolate truffle", price: 1050 },
      { name: "Chocolate KitKat", price: 1250 },
      { name: "Chocolate pastry", price: 850 },
      { name: "Cookie & cream", price: 950 },
      { name: "Death by chocolate", price: 1350 },
      { name: "White chocolate truffle", price: 1250 },
      { name: "Chocolate mocha", price: 1250 },
      { name: "Ferrero Rocher", price: 1350 },
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
  { name: "Classic Brownie", description: "Rich chocolate. Soft centre. Pure happiness.", image: "/bakery/brownie-classic.webp", prices: sizes(300, 550, 1050) },
  { name: "Nuts Brownie", description: "Loaded with crunchy nuts. A wholesome treat.", image: "/bakery/brownie-nuts.webp", prices: sizes(360, 650, 1250) },
  { name: "Choco Chips Brownie", description: "More chips. More smiles.", image: "/bakery/brownie-choco-chips.webp", prices: sizes(340, 620, 1200) },
  { name: "Lotus Biscoff Brownie", description: "Biscoff crumbs. Caramel notes. Absolute heaven.", image: "/bakery/brownie-lotus-biscoff.webp", prices: sizes(380, 700, 1350) },
  { name: "Nutella Brownie", description: "Creamy Nutella. Fudgy bliss.", image: "/bakery/brownie-nutella.webp", prices: sizes(380, 700, 1350) },
  { name: "Double Chocolate Brownie", description: "Two kinds of chocolate. Twice the love.", image: "/bakery/brownie-double-chocolate.webp", prices: sizes(360, 650, 1250) },
  { name: "Triple Chocolate Brownie", description: "Dark. Milk. White. The ultimate indulgence.", image: "/bakery/brownie-triple-chocolate.webp", prices: sizes(400, 750, 1450) },
  { name: "Nuts & Choco Chips Brownie", description: "The best of both worlds.", image: "/bakery/brownie-nuts-choco-chips.webp", prices: sizes(380, 700, 1350) },
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
  { name: "Red velvet", tag: "Most loved", price: 1050, image: "/bakery/cake-celebration.webp", note: "Velvety sponge, cream cheese frosting." },
  { name: "Death by chocolate", tag: "For chocoholics", price: 1350, image: "/bakery/cake-chocolate.webp", note: "Layers of fudge, ganache and sponge." },
  { name: "Rasmalai", tag: "Exotic pick", price: 1350, image: "/bakery/cake-exotic.webp", note: "Saffron, pistachio and soft rasmalai." },
  { name: "Lotus Biscoff Brownie", tag: "Bestseller", price: 380, image: "/bakery/brownie-lotus-biscoff.webp", note: "Caramel Biscoff on a fudgy base." },
];

export const occasions = [
  { id: "birthday", phrase: "a birthday", title: "Birthdays", line: "Make a wish worth remembering.", body: "Names, numbers, themes — a cake that looks like the party feels.", image: "/bakery/cake-celebration.webp", picks: ["Red velvet", "Chocolate KitKat", "Birthday decorated brownies"] },
  { id: "anniversary", phrase: "an anniversary", title: "Anniversaries", line: "Sweet, like the years together.", body: "Elegant, understated cakes for the moments that matter most.", image: "/bakery/cake-fruit.webp", picks: ["Blueberry", "White chocolate truffle", "Ferrero Rocher"] },
  { id: "party", phrase: "a party", title: "Parties", line: "Enough to go around. Twice.", body: "Brownie tubs and big cakes made to feed a happy crowd.", image: "/bakery/brownie-tub.webp", picks: ["Brownie Tub", "Death by chocolate", "Triple Chocolate Brownie"] },
  { id: "gifting", phrase: "a gift", title: "Gifting", line: "Better than flowers.", body: "Hand-packed brownie boxes, tied up and ready to give.", image: "/bakery/brownie-box.webp", picks: ["Brownie Box", "Lotus Biscoff Brownie", "Nutella Brownie"] },
  { id: "festival", phrase: "a festival", title: "Festivals", line: "Mithai, meet cake.", body: "Indian sweets reimagined — the dessert table's new favourite.", image: "/bakery/cake-exotic.webp", picks: ["Rasmalai", "Kaju katli", "Motichoor laddu"] },
  { id: "office", phrase: "an office treat", title: "Office treats", line: "Instant team morale.", body: "Bulk brownies for birthdays, wins and Friday afternoons.", image: "/bakery/brownie-nuts-choco-chips.webp", picks: ["Classic Brownie", "Nuts & Choco Chips Brownie", "Choco Chips Brownie"] },
];

