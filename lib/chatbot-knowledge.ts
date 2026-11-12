import { products } from "@/data/products";
import type { Product } from "@/types/product";
import { bakery } from "@/lib/bakery-menu";
import { businessInfo, farmPhoneDisplay } from "@/lib/business-info";

export interface BotAction {
  label: string;
  href: string;
  external?: boolean;
}

export interface BotReply {
  text: string;
  suggestions: string[];
  action?: BotAction;
  /** Product the conversation is now about, for follow-ups like "how much is it?" */
  productId?: string;
}

export interface BotContext {
  lastProductId?: string;
  lastIntent?: string;
}

type Pick = <T>(options: T[]) => T;

interface Intent {
  id: string;
  /** Whole words or phrases; single words also match small typos. */
  patterns: string[];
  /** Small-talk intents only win when nothing more specific matched. */
  smallTalk?: boolean;
  reply: (ctx: { pick: Pick; hour: number; context: BotContext }) => Omit<BotReply, "productId">;
}

const WHATSAPP_URL = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "917483877595"}`;
const ORDER: BotAction = { label: "Open the order page", href: "/order" };
const CAKES: BotAction = { label: "See the cake & bakes menu", href: "/cakes" };
const BULK: BotAction = { label: "Bulk enquiry form", href: "/#bulk" };
const WHATSAPP: BotAction = { label: "Chat on WhatsApp", href: WHATSAPP_URL, external: true };

const DEFAULT_SUGGESTIONS = ["What do you sell?", "How does ordering work?", "Where do you deliver?", "Custom cakes"];

function partOfDay(hour: number) {
  if (hour < 5) return "Hello";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function priceLine(p: Product) {
  if (p.priceType === "fixed" && p.price) return `₹${p.price} ${p.unit ?? ""}`.trim();
  if (p.priceType === "custom-form") return "priced by size and design";
  return "price on request";
}

/** A full sentence answering "how much is it?" for any kind of product. */
function priceSentence(p: Product) {
  if (p.priceType === "fixed" && p.price) return `${p.name} is ${priceLine(p)}.`;
  if (p.priceType === "custom-form") return `${p.name} is ${priceLine(p)}.`;
  return `${p.name} is priced on request. Message us on WhatsApp and we'll quote you.`;
}

const productList = products.map((p) => `• ${p.name}: ${priceLine(p)}`).join("\n");

/** Extra words people use for each product. */
const productAliases: Record<string, string[]> = {
  "ragi-flour": ["ragi", "flour", "millet", "atta", "finger millet", "nachni", "gluten free", "gluten-free"],
  "vetiver-powder": ["vetiver powder", "lavancha powder", "khus powder"],
  "vetiver-roots": ["vetiver", "vetiver root", "vetiver roots", "lavancha", "khus", "roots"],
  "country-eggs": ["egg", "eggs", "country egg", "nati egg", "free range", "tray"],
  "goat-meat": ["goat", "mutton", "goat meat", "meat"],
  "country-chicken": ["chicken", "country chicken", "nati koli", "naati koli", "poultry"],
  "baked-cakes": ["cake", "cakes", "birthday cake"],
  "tea-cakes": ["tea cake", "tea cakes", "snack", "bakes"],
  "goat-milk-soap": ["soap", "goat milk", "goat milk soap", "bath"],
};

const productDetail: Record<string, string> = {
  "ragi-flour":
    "Our ragi flour is stone-ground slowly in small batches, so it keeps its nutty flavour and nutrients. It's naturally gluten-free and great for rotis, dosas, porridge and baking.",
  "vetiver-powder":
    "Vetiver (lavancha) powder is made from roots we grow and dry ourselves. People use it in face packs, bath powders, and to flavour cooling summer drinks.",
  "vetiver-roots":
    "Whole dried vetiver (lavancha) roots, grown and harvested on our farm. Drop a bundle into your drinking-water pot for that earthy, cooling taste, or use them for bath scrubs.",
  "country-eggs":
    "Our country eggs come from hens that roam the farm all day and eat a natural diet. That's where the richer yolks and proper flavour come from.",
  "goat-meat":
    "Farm-raised goat meat, cut fresh on the day of delivery. Tell us the cut you prefer (curry cut, boneless, chops) when you order.",
  "country-chicken":
    "Our country (naati) chickens are free-roaming and slow-grown, which is why the price depends on the bird's size each week.",
  "baked-cakes":
    "Custom cakes are baked to order, eggless or with egg, from 0.5 kg to 2 kg, in pretty much any flavour. Custom designs need at least 3 days notice.",
  "tea-cakes":
    "Tea cakes are our small-batch bakes made with farm eggs, good with evening chai. The price depends on the batch and quantity.",
  "goat-milk-soap":
    "Pure goat milk soap, handmade in 100 g bars. Gentle enough for sensitive skin and kids.",
};

const shipsWorldwide = new Set(["ragi-flour", "vetiver-powder", "vetiver-roots", "goat-milk-soap"]);

function productReply(p: Product, pick: Pick): BotReply {
  const where = shipsWorldwide.has(p.id)
    ? "It ships across India and internationally."
    : "It's delivered fresh within Bangalore.";
  const intro = pick(["Great choice!", "Ah, one of our favourites.", "Good pick."]);
  return {
    text: `${intro} ${productDetail[p.id] ?? ""}\n\n${priceSentence(p)} ${where}`,
    suggestions: p.priceType === "custom-form" ? ["Cake flavours?", "How much is a cake?"] : ["How do I order?", "Delivery charges?", "What else do you sell?"],
    action: p.priceType === "custom-form" ? CAKES : ORDER,
    productId: p.id,
  };
}

const intents: Intent[] = [
  {
    id: "greeting",
    smallTalk: true,
    patterns: ["hi", "hii", "hiii", "hello", "helo", "hey", "heyy", "hola", "namaste", "namaskara", "namaskaram", "vanakkam", "good morning", "good afternoon", "good evening", "yo", "sup", "hai"],
    reply: ({ pick, hour }) => ({
      text: pick([
        `${partOfDay(hour)}! 👋 Welcome to TheRootFood. I can tell you about our farm products, prices, delivery, custom cakes, or how ordering on WhatsApp works. What are you looking for today?`,
        `${partOfDay(hour)}, lovely to see you here! I'm the farm's little helper. Are you after something fresh like eggs, ragi flour or goat meat, or planning a cake?`,
        `Hi there! 🌱 ${partOfDay(hour)}. Ask me what's in stock, prices, delivery areas, or how to place an order.`,
      ]),
      suggestions: DEFAULT_SUGGESTIONS,
    }),
  },
  {
    id: "how-are-you",
    smallTalk: true,
    patterns: ["how are you", "how r u", "how are u", "how's it going", "hows it going", "how do you do", "whats up", "what's up", "wassup"],
    reply: ({ pick }) => ({
      text: pick([
        "I'm doing great, thanks for asking! The hens are laying, the ragi's freshly ground, and I'm here to help. How can I help you today?",
        "All good on the farm today! 😊 What can I help you with?",
      ]),
      suggestions: DEFAULT_SUGGESTIONS,
    }),
  },
  {
    id: "who-are-you",
    smallTalk: true,
    patterns: ["who are you", "are you a bot", "are you human", "are you real", "your name", "what are you", "robot", "ai"],
    reply: () => ({
      text: "I'm TheRootFood's virtual assistant. I know our products, prices, delivery and ordering inside out. For anything personal (a special request, an order update), the farm team replies on WhatsApp themselves.",
      suggestions: ["Talk to a person", "What do you sell?"],
      action: WHATSAPP,
    }),
  },
  {
    id: "thanks",
    smallTalk: true,
    patterns: ["thanks", "thank you", "thankyou", "thx", "ty", "tq", "thanku", "dhanyavad", "dhanyavaadagalu", "appreciate"],
    reply: ({ pick }) => ({
      text: pick([
        "You're very welcome! 🌾 Anything else I can help with?",
        "Happy to help! Let me know if you need anything else.",
        "Anytime! Hope to see you at the farm table soon.",
      ]),
      suggestions: ["How do I order?", "What do you sell?"],
    }),
  },
  {
    id: "bye",
    smallTalk: true,
    patterns: ["bye", "goodbye", "good night", "see you", "see ya", "cya", "later", "tata"],
    reply: ({ pick }) => ({
      text: pick([
        "Bye for now! Whenever you're ready, your basket will be waiting. 🌱",
        "Take care! Message us on WhatsApp anytime.",
      ]),
      suggestions: [],
    }),
  },
  {
    id: "ack",
    smallTalk: true,
    patterns: ["ok", "okay", "okk", "cool", "great", "nice", "alright", "got it", "fine", "awesome", "super", "hmm"],
    reply: ({ pick }) => ({
      text: pick(["Great! Anything else you'd like to know?", "👍 What else can I help with?"]),
      suggestions: DEFAULT_SUGGESTIONS,
    }),
  },
  {
    id: "compliment",
    smallTalk: true,
    patterns: ["love it", "love this", "amazing", "beautiful website", "nice website", "good job", "well done", "tasty", "delicious"],
    reply: () => ({
      text: "That honestly makes our day, thank you! 💚 Kind words mean a lot to the whole farm team.",
      suggestions: ["What do you sell?", "Custom cakes"],
    }),
  },
  {
    id: "frustrated",
    patterns: ["useless", "stupid", "not helpful", "doesn't help", "doesnt help", "angry", "worst", "bad service", "waste"],
    reply: () => ({
      text: "I'm sorry I couldn't help properly. Let me get you to a real person. Tap below and the farm team will sort it out on WhatsApp.",
      suggestions: [],
      action: WHATSAPP,
    }),
  },
  {
    id: "products",
    patterns: ["what do you sell", "products", "product", "catalog", "catalogue", "menu", "items", "what do you have", "what's available", "whats available", "in stock", "list", "everything", "what else"],
    reply: () => ({
      text: `Here's everything from the farm right now:\n\n${productList}\n\nAdd anything to your basket on the order page and send it to us on WhatsApp.`,
      suggestions: ["How does ordering work?", "Delivery charges?", "Custom cakes"],
      action: ORDER,
    }),
  },
  {
    id: "price",
    patterns: ["price", "prices", "cost", "how much", "rate", "rates", "charges for", "pricing", "expensive", "cheap"],
    reply: () => ({
      text: `Here are our current prices:\n\n${productList}\n\nWhich one are you interested in? I can tell you more about it.`,
      suggestions: ["Eggs", "Ragi flour", "Goat meat"],
      action: ORDER,
    }),
  },
  {
    id: "how-to-order",
    patterns: ["how to order", "how do i order", "how does ordering work", "place an order", "place order", "order online", "want to order", "i want to buy", "how to buy", "checkout", "basket", "cart", "add to cart", "purchase"],
    reply: () => ({
      text: "Ordering is simple:\n\n1. Open the order page and tap \"Add to basket\" on anything you like.\n2. Open your basket and tap \"Enquire on WhatsApp\". You can send everything together, or ask about each item separately.\n3. We reply personally to confirm stock, delivery and the final total.\n4. Pay by UPI, bank transfer, or cash on delivery.\n\nNo card details or online payment needed.",
      suggestions: ["How do I pay?", "Delivery charges?", "Where do you deliver?"],
      action: ORDER,
    }),
  },
  {
    id: "payment",
    patterns: ["pay", "payment", "upi", "gpay", "google pay", "phonepe", "paytm", "card", "credit card", "debit card", "cash", "cod", "cash on delivery", "bank transfer", "razorpay", "net banking"],
    reply: () => ({
      text: "We don't take payments on the website. Once we confirm your order on WhatsApp, you can pay by:\n\n• UPI (GPay, PhonePe, Paytm…)\n• Bank transfer\n• Cash on delivery (Bangalore)\n\nInternational orders are paid by bank transfer, in the currency you picked on the order page. We'll share the details.",
      suggestions: ["How does ordering work?", "Delivery charges?"],
    }),
  },
  {
    id: "delivery",
    patterns: ["deliver", "delivery", "ship", "shipping", "courier", "area", "location", "pincode", "pin code", "do you deliver", "outside bangalore", "my city", "chennai", "mumbai", "delhi", "hyderabad", "kerala"],
    reply: () => ({
      text: "Here's how delivery works:\n\n• Bangalore: everything, including fresh eggs, meat and cakes, usually within 24 hours.\n• Rest of India: ragi flour, vetiver roots/powder and goat milk soap, by courier.\n• Fresh items like eggs, meat and cakes stay within Bangalore so they reach you fresh.\n\nShare your pincode with us on WhatsApp and we'll confirm.",
      suggestions: ["Delivery charges?", "International shipping?", "How long does it take?"],
    }),
  },
  {
    id: "delivery-charges",
    patterns: ["delivery charge", "delivery charges", "shipping charge", "shipping cost", "delivery fee", "free delivery", "delivery cost"],
    reply: () => ({
      text: "Delivery charges depend on your location and the size of the order, so we confirm them on WhatsApp before you pay. Larger local orders often get free delivery, so just ask!",
      suggestions: ["How does ordering work?", "Where do you deliver?"],
      action: WHATSAPP,
    }),
  },
  {
    id: "delivery-time",
    patterns: ["how long", "when will", "delivery time", "how many days", "same day", "tomorrow", "today", "fast", "quick"],
    reply: () => ({
      text: "• Bangalore: usually within 24 hours (same day is often possible if you order early).\n• Elsewhere in India: about 3 to 7 days by courier.\n• International: 7 to 21 business days.\n• Custom cakes: at least 3 days notice.",
      suggestions: ["Delivery charges?", "How do I order?"],
    }),
  },
  {
    id: "international",
    patterns: ["international", "abroad", "outside india", "worldwide", "usa", "uk", "dubai", "uae", "canada", "australia", "singapore", "overseas"],
    reply: () => ({
      text: "Yes, we ship internationally! Ragi flour, vetiver roots and powder, and goat milk soap can go almost anywhere, usually in 7 to 21 business days. Fresh items (eggs, meat, cakes) are Bangalore-only.\n\nOn the order page you can switch prices to USD, EUR, GBP or AED. Your basket and order stay in that currency, and we confirm the exact amount on WhatsApp before you pay.",
      suggestions: ["How do I pay?", "What do you sell?"],
      action: ORDER,
    }),
  },
  {
    id: "cakes",
    patterns: ["cake", "cakes", "birthday", "anniversary", "celebration", "eggless", "custom cake", "wedding", "party", "brownie", "brownies", "nitara", "bakery", "dessert"],
    reply: () => ({
      text: "Our bakery, Nitara's Fine Bakes, makes cakes and brownies fresh to order! 🎂\n\n• 32 cake flavours, from classics like Blackforest & Red Velvet to Rasmalai, Kaju Katli and rich chocolate cakes (from ₹750)\n• 8 fudgy brownies, brownie tubs and gift boxes (from ₹300)\n• Eggless cake +₹150\n• Custom designs need at least 3 days notice\n\nSee the full menu and order on WhatsApp from the Cakes & Bakes page.",
      suggestions: ["How much is a cake?", "Brownie prices?"],
      action: CAKES,
    }),
  },
  {
    id: "cake-price",
    patterns: ["cake price", "how much is a cake", "cake cost", "cake rate"],
    reply: () => ({
      text: "Cakes start at ₹750 (Blackforest, Vanilla) and go up to ₹1,550 (Kaju Katli). Eggless is +₹150 and custom designs cost extra. The full price list is on the Cakes & Bakes page.",
      suggestions: ["Cake flavours?"],
      action: CAKES,
    }),
  },
  {
    id: "cake-flavours",
    patterns: ["flavour", "flavours", "flavor", "flavors", "chocolate", "red velvet", "butterscotch", "black forest", "vanilla", "pineapple"],
    reply: () => ({
      text: "Popular picks: Blackforest, Red Velvet, Rasmalai, Biscoff, Death by Chocolate and Ferrero Rocher. Want something different? Describe it in the \"make it your way\" note and Nitara's team will bake it for you.",
      suggestions: ["How much is a cake?"],
      action: CAKES,
    }),
  },
  {
    id: "brownies",
    patterns: ["brownie price", "brownie prices", "brownie cost", "brownie box", "brownie tub"],
    reply: () => ({
      text: "Brownies start at ₹300 for 4 pieces (Classic). Lotus Biscoff, Nutella, Triple Chocolate and more are on the menu, along with brownie tubs and gift boxes. 🍫",
      suggestions: ["How much is a cake?"],
      action: CAKES,
    }),
  },
  {
    id: "bulk",
    patterns: ["bulk", "wholesale", "restaurant", "hotel", "cafe", "café", "business", "b2b", "large order", "large quantity", "supplier", "supply", "catering", "caterer", "reseller"],
    reply: () => ({
      text: "Yes, we supply cafés, restaurants, caterers and shops! We offer wholesale pricing and a regular delivery schedule. Share your business name and roughly how much you need on the bulk form, and we'll come back with a quote, usually within a day.",
      suggestions: ["What do you sell?", "Talk to a person"],
      action: BULK,
    }),
  },
  {
    id: "discount",
    patterns: ["discount", "offer", "coupon", "promo", "deal", "sale", "cheaper"],
    reply: () => ({
      text: "We keep prices fair all year instead of running flash sales. That said, regular customers and larger orders often get a little extra, and bulk buyers get wholesale rates. Just ask on WhatsApp!",
      suggestions: ["Bulk orders", "How do I order?"],
    }),
  },
  {
    id: "fresh",
    patterns: ["fresh", "freshness", "organic", "natural", "chemical", "chemicals", "pesticide", "preservative", "preservatives", "hormone", "antibiotic", "pure", "quality"],
    reply: () => ({
      text: "Freshness is the whole point of what we do:\n\n• Eggs come from free-roaming hens and are collected daily.\n• Meat is cut fresh on the day of delivery.\n• Flour is stone-ground in small weekly batches.\n• No preservatives in anything we sell.\n\nWe grow and raise most of it ourselves, and the rest comes from farmers we know personally.",
      suggestions: ["What do you sell?", "Where is the farm?"],
    }),
  },
  {
    id: "storage",
    patterns: ["storage", "shelf life", "expiry", "expire", "how long does it last", "fridge", "refrigerate"],
    reply: () => ({
      text: "A few storage tips:\n\n• Ragi flour: airtight jar, cool dry place, best within 2 to 3 months.\n• Eggs: fridge, use within 2 to 3 weeks.\n• Goat meat & chicken: fridge for 1 to 2 days, or freeze.\n• Vetiver roots/powder: dry jar, lasts many months.\n• Soap: keep dry between uses.\n• Cakes: fridge, best within 2 to 3 days.",
      suggestions: ["What do you sell?"],
    }),
  },
  {
    id: "returns",
    patterns: ["return", "refund", "damaged", "spoiled", "broken", "replace", "replacement", "complaint", "wrong item", "not fresh", "issue", "problem"],
    reply: () => ({
      text: "I'm sorry if something wasn't right. Because our products are perishable we can't take returns, but if anything arrives damaged or below standard, send us a photo on WhatsApp and we'll replace it or refund you.",
      suggestions: [],
      action: WHATSAPP,
    }),
  },
  {
    id: "order-status",
    patterns: ["order status", "track", "tracking", "where is my order", "my order", "not received", "not delivered", "late", "delay", "cancel", "change my order", "modify"],
    reply: () => ({
      text: "For anything about an existing order, like tracking, changes or cancellations, message us on WhatsApp with your name and we'll check right away.",
      suggestions: [],
      action: WHATSAPP,
    }),
  },
  {
    id: "contact",
    patterns: ["contact", "phone", "call", "number", "email", "mail", "reach", "talk to a person", "talk to someone", "human", "person", "owner", "speak", "support", "customer care", "whatsapp"],
    reply: () => ({
      text: `You can reach the farm team directly:\n\n• WhatsApp / phone: ${farmPhoneDisplay}\n• Email: ${businessInfo.email}\n• Cakes (Nitara's Fine Bakes): ${bakery.phoneDisplay}\n\nWhatsApp is the fastest. We usually reply within a few hours.`,
      suggestions: [],
      action: WHATSAPP,
    }),
  },
  {
    id: "location",
    patterns: ["where are you", "where is the farm", "farm location", "address", "visit", "located", "pickup", "pick up", "come to"],
    reply: () => ({
      text: "We're based in Bangalore, Karnataka. Want to pick up an order or visit the farm? Message us on WhatsApp and we'll share directions and a good time to come by.",
      suggestions: ["Where do you deliver?"],
      action: WHATSAPP,
    }),
  },
  {
    id: "about",
    patterns: ["about you", "about the farm", "your story", "who runs", "family", "since when", "tell me about"],
    reply: () => ({
      text: "TheRootFood is a farm-direct business based in Bangalore. Stone-ground flours, herbal roots, free-range eggs, meat and small-batch bakes all come from our own farm or local partners we know, and are sold straight to you without middlemen. You get real food and the farmers get a fair price.",
      suggestions: ["What do you sell?", "Is it organic?"],
      action: { label: "Read our story", href: "/about" },
    }),
  },
  {
    id: "diet",
    patterns: ["gluten", "diabetic", "diabetes", "vegan", "vegetarian", "healthy", "weight loss", "protein", "kids", "baby", "allergy"],
    reply: () => ({
      text: "Good question! Our ragi flour is naturally gluten-free and high in fibre and calcium, a favourite for diabetic-friendly and kids' meals. Country eggs and goat meat are excellent protein sources. Our cakes can be made eggless. For specific medical needs, please check with your doctor.",
      suggestions: ["Ragi flour", "Custom cakes"],
    }),
  },
  {
    id: "minimum",
    patterns: ["minimum order", "minimum", "min order", "just one", "small order", "single"],
    reply: () => ({
      text: "There's no strict minimum. You can order as little as one item. For deliveries outside your area, combining a few items keeps the delivery charge worth it.",
      suggestions: ["Delivery charges?", "How do I order?"],
      action: ORDER,
    }),
  },
  {
    id: "gift",
    patterns: ["gift", "gifting", "hamper", "present", "diwali", "festival", "corporate gift"],
    reply: () => ({
      text: "We'd love to help with gifting! 🎁 Our goat milk soap, ragi flour and vetiver make lovely farm hampers, and we can add a custom cake for local orders. Tell us your budget and how many on WhatsApp and we'll put something together.",
      suggestions: ["Bulk orders", "Custom cakes"],
      action: WHATSAPP,
    }),
  },
];

/* ---------- matching ---------- */

function normalize(text: string) {
  return ` ${text.toLowerCase().replace(/[^\p{L}\p{N}\s'’-]/gu, " ").replace(/[’]/g, "'").replace(/\s+/g, " ").trim()} `;
}

function editDistanceAtMostOne(a: string, b: string) {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0, j = 0, edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i++; j++; continue; }
    if (++edits > 1) return false;
    if (a.length > b.length) i++;
    else if (b.length > a.length) j++;
    else { i++; j++; }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}

function matches(text: string, words: string[], pattern: string): number {
  if (text.includes(` ${pattern} `)) return pattern.split(" ").length + 1;
  if (!pattern.includes(" ") && pattern.length >= 5 && words.some((w) => editDistanceAtMostOne(w, pattern))) return 1;
  return 0;
}

function scoreIntent(text: string, words: string[], patterns: string[]) {
  return patterns.reduce((best, p) => Math.max(best, matches(text, words, p)), 0);
}

function findProduct(text: string, words: string[]): Product | undefined {
  let best: { product: Product; score: number } | undefined;
  for (const p of products) {
    const score = scoreIntent(text, words, productAliases[p.id] ?? [p.name.toLowerCase()]);
    if (score > 0 && (!best || score > best.score)) best = { product: p, score };
  }
  return best?.product;
}

const defaultPick: Pick = (options) => options[Math.floor(Math.random() * options.length)];

const PRICE_WORDS = ["price", "cost", "how much", "rate"];
const FOLLOW_UP_WORDS = [" it ", " that ", " this ", " them "];

export const quickReplies = DEFAULT_SUGGESTIONS;

export function welcomeReply(hour = new Date().getHours()): BotReply {
  return {
    text: `${partOfDay(hour)}! 👋 I'm TheRootFood's assistant. Ask me about our farm products, prices, delivery, custom cakes, or how ordering on WhatsApp works.`,
    suggestions: DEFAULT_SUGGESTIONS,
  };
}

export function getBotReply(
  message: string,
  context: BotContext = {},
  options: { pick?: Pick; hour?: number } = {}
): BotReply & { intent: string } {
  const pick = options.pick ?? defaultPick;
  const hour = options.hour ?? new Date().getHours();
  const text = normalize(message);
  const words = text.trim().split(" ");

  const scored = intents
    .map((intent) => ({ intent, score: scoreIntent(text, words, intent.patterns) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  const greeting = scored.find((s) => s.intent.id === "greeting");
  const business = scored.find((s) => !s.intent.smallTalk);
  const product = findProduct(text, words);
  const greetPrefix = greeting ? `${partOfDay(hour)}! ` : "";

  const asksPrice = PRICE_WORDS.some((w) => text.includes(` ${w}`));
  const isFollowUp = !product && context.lastProductId && (asksPrice || FOLLOW_UP_WORDS.some((w) => text.includes(w)));

  if (isFollowUp) {
    const p = products.find((x) => x.id === context.lastProductId)!;
    if (asksPrice) {
      return {
        intent: "product-price",
        text: `${priceSentence(p)} Want me to explain how to order it?`,
        suggestions: ["How do I order?", "Delivery charges?"],
        action: p.priceType === "custom-form" ? CAKES : ORDER,
        productId: p.id,
      };
    }
  }

  // A product mention beats generic intents like "price" or "delivery", unless it's specifically about cakes.
  const productFirst =
    product && (!business || ["price", "products", "fresh", "diet"].includes(business.intent.id) || (business.score <= 2 && !["cakes", "cake-price", "cake-flavours", "bulk", "returns", "order-status", "how-to-order", "delivery", "delivery-charges", "delivery-time", "international", "payment", "storage"].includes(business.intent.id)));

  if (product && productFirst) {
    const reply = productReply(product, pick);
    if (asksPrice) {
      reply.text = `${greetPrefix}${priceSentence(product)} ${productDetail[product.id] ?? ""}`;
    } else {
      reply.text = greetPrefix + reply.text;
    }
    return { ...reply, intent: "product" };
  }

  const chosen = business ?? scored[0];
  if (chosen) {
    const reply = chosen.intent.reply({ pick, hour, context });
    const prefix = business && greeting ? greetPrefix : "";
    return { ...reply, text: prefix + reply.text, intent: chosen.intent.id, productId: product?.id };
  }

  return {
    intent: "fallback",
    text: pick([
      "Hmm, I'm not sure I understood that one. I can help with products, prices, delivery, payments, custom cakes and bulk orders, or connect you with the farm team on WhatsApp.",
      "Sorry, that one's beyond me! Try asking about our products, delivery or cakes, or tap below to chat with a real person.",
    ]),
    suggestions: DEFAULT_SUGGESTIONS,
    action: WHATSAPP,
  };
}
