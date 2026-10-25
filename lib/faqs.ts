export type FaqCategory = "ordering" | "delivery" | "payment" | "products" | "cakes" | "bulk";

export interface Faq {
  category: FaqCategory;
  question: string;
  answer: string;
}

export const faqCategories: { id: FaqCategory; label: string; blurb: string }[] = [
  { id: "ordering", label: "Ordering", blurb: "Baskets & WhatsApp" },
  { id: "delivery", label: "Delivery", blurb: "Where & how fast" },
  { id: "payment", label: "Payment", blurb: "UPI, cash, transfer" },
  { id: "products", label: "Products", blurb: "Freshness & storage" },
  { id: "cakes", label: "Custom cakes", blurb: "Flavours & notice" },
  { id: "bulk", label: "Bulk & business", blurb: "Cafés & shops" },
];

export const faqs: Faq[] = [
  {
    category: "ordering",
    question: "How do I place an order?",
    answer:
      "Open the Order page, tap \"Add to basket\" on what you'd like, then open your basket and tap \"Enquire on WhatsApp\". Your list arrives in our chat, we confirm stock, delivery and the final total, and you're done. No sign-up, no card details.",
  },
  {
    category: "ordering",
    question: "Can I ask about one product without ordering everything?",
    answer:
      "Of course. Every product has a green WhatsApp button to ask about just that item, and inside the basket each item has an \"Ask separately\" option.",
  },
  {
    category: "ordering",
    question: "Is there a minimum order?",
    answer:
      "No strict minimum — even a single item is fine. For deliveries further away, combining a few items keeps the delivery charge worthwhile.",
  },
  {
    category: "ordering",
    question: "Can I change or cancel my order?",
    answer:
      "Yes, as long as it hasn't been packed or dispatched. Just message us on WhatsApp with your name and what you'd like to change.",
  },
  {
    category: "delivery",
    question: "Do you deliver outside Bangalore?",
    answer:
      "Fresh items — eggs, meat and cakes — are delivered within Bangalore so they reach you at their best. Ragi flour, vetiver roots and powder, and goat milk soap ship across India and internationally.",
  },
  {
    category: "delivery",
    question: "How long does delivery take?",
    answer:
      "Within Bangalore, usually within 24 hours — often the same day if you order early. Courier orders across India take a few days, and international orders take 7–21 business days.",
  },
  {
    category: "delivery",
    question: "How much is delivery?",
    answer:
      "It depends on your location and order size, so we tell you the exact charge on WhatsApp before you pay. Larger local orders often qualify for free delivery — just ask.",
  },
  {
    category: "delivery",
    question: "Can I pick up from the farm?",
    answer: "Yes! Message us on WhatsApp and we'll share directions and a good time to come by.",
  },
  {
    category: "payment",
    question: "How do I pay?",
    answer:
      "There's no online payment on the website. Once we confirm your order on WhatsApp, pay by UPI (GPay, PhonePe, Paytm), bank transfer, or cash on delivery within Bangalore.",
  },
  {
    category: "payment",
    question: "Do I pay before or after delivery?",
    answer:
      "For local orders you can pay on delivery. For courier, international and custom cake orders, we'll let you know on WhatsApp if an advance is needed before we confirm.",
  },
  {
    category: "payment",
    question: "Why are prices shown in other currencies?",
    answer:
      "International customers can preview approximate prices in USD, EUR, GBP or AED. The final amount is always confirmed in Indian rupees on WhatsApp.",
  },
  {
    category: "products",
    question: "How fresh are the products?",
    answer:
      "Eggs are collected daily, meat is cut on the day of delivery, and our flour is stone-ground in small weekly batches. Nothing sits in a warehouse.",
  },
  {
    category: "products",
    question: "Do you use preservatives or chemicals?",
    answer:
      "No preservatives in anything we sell. Our hens and goats are raised naturally, and products come from our own farm or local partners we know personally.",
  },
  {
    category: "products",
    question: "Why is country chicken \"price on request\"?",
    answer:
      "Country chickens are slow-grown and vary in size each week, so we quote the price for the bird you'll actually get.",
  },
  {
    category: "products",
    question: "What if something arrives damaged or not fresh?",
    answer:
      "Send us a photo on WhatsApp straight away and we'll replace it or refund you — no fuss. Because products are perishable we can't accept returns otherwise.",
  },
  {
    category: "cakes",
    question: "How do I order a custom cake?",
    answer:
      "Open the Cakes page, choose eggless or with egg, pick a size and flavour, add your date and any notes, and tap send. Your cake details arrive on our WhatsApp and we reply with the price.",
  },
  {
    category: "cakes",
    question: "How much notice do you need?",
    answer: "At least 3 days for custom cakes and designs, so Nitara's Fine Bakes can make it perfect.",
  },
  {
    category: "cakes",
    question: "Do you make eggless cakes?",
    answer: "Yes — every flavour can be made eggless or with our own free-range farm eggs.",
  },
  {
    category: "cakes",
    question: "What sizes and flavours are available?",
    answer:
      "0.5 kg (serves 2–4), 1 kg, 1.5 kg and 2 kg (serves 14–16). Popular flavours are chocolate truffle, red velvet, vanilla bean, butterscotch, black forest and pineapple — or tell us your own idea.",
  },
  {
    category: "bulk",
    question: "Do you supply restaurants, cafés and shops?",
    answer:
      "Yes. We supply commercial kitchens and stores with flour, eggs and meat on a regular schedule. Fill in the bulk form on the homepage and we'll send a quote, usually within a day.",
  },
  {
    category: "bulk",
    question: "Do you offer wholesale pricing?",
    answer: "Yes — bulk and repeat orders get wholesale rates based on volume and frequency.",
  },
  {
    category: "bulk",
    question: "Can you put together gift hampers?",
    answer:
      "We'd love to. Goat milk soap, ragi flour and vetiver make lovely farm hampers, and we can add cakes for local orders. Share your budget and quantity on WhatsApp.",
  },
];
