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
      "Open the Order page, tap \"Add to basket\" on what you'd like, then open your basket and tap \"Enquire on WhatsApp\". Your list lands in our chat, we confirm stock, delivery and the final total, and that's it. No sign-up, no card details.",
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
      "No. Even a single item is fine. If you live further away, ordering a few things together makes the delivery charge worth it.",
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
      "Eggs, meat and cakes are delivered only within Bangalore so they reach you fresh. Ragi flour, vetiver roots and powder, and goat milk soap ship across India and abroad.",
  },
  {
    category: "delivery",
    question: "How long does delivery take?",
    answer:
      "Within Bangalore, usually within 24 hours, and often the same day if you order early. Courier orders across India take a few days. International orders take 7 to 21 business days.",
  },
  {
    category: "delivery",
    question: "How much is delivery?",
    answer:
      "It depends on where you are and how big the order is, so we tell you the exact charge on WhatsApp before you pay. Larger local orders often get free delivery. Just ask.",
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
    question: "Can I order and pay in my own currency?",
    answer:
      "Yes. On the Order page, switch the prices to USD, EUR, GBP or AED. Your basket and the order you send us stay in that currency, with the rupee amount shown small beside it. The rates on the site are approximate, so we confirm the exact amount on WhatsApp before you pay.",
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
    question: "Why are goat meat and country chicken \"price on request\"?",
    answer:
      "Fresh meat doesn't have one fixed price with us. Country chickens are slow grown and vary in size each week, and goat meat depends on the cut you want. Add it to your basket or tap the WhatsApp button and we'll quote you before you confirm.",
  },
  {
    category: "products",
    question: "What if something arrives damaged or not fresh?",
    answer:
      "Send us a photo on WhatsApp straight away and we'll replace it or refund you. Because the products are perishable we can't accept returns otherwise.",
  },
  {
    category: "cakes",
    question: "How do I order a custom cake?",
    answer:
      "Open the Cakes & Bakes page and scroll to \"Make it your way\". Describe the cake you have in mind, add your name and tap \"Send my note\". It lands on Nitara's WhatsApp and she replies with the price.",
  },
  {
    category: "cakes",
    question: "How much notice do you need?",
    answer: "At least 3 days for custom cakes and designs, so Nitara's Fine Bakes has time to get it right.",
  },
  {
    category: "cakes",
    question: "Do you make eggless cakes?",
    answer: "Yes. Every flavour can be made eggless for ₹150 extra, or with eggs from our own farm.",
  },
  {
    category: "cakes",
    question: "What sizes and flavours are available?",
    answer:
      "0.5 kg (serves 2 to 4), 1 kg, 1.5 kg and 2 kg (serves 14 to 16). Popular flavours are chocolate truffle, red velvet, vanilla, butterscotch, black forest and pineapple. You can also tell us your own idea.",
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
    answer: "Yes. Bulk and repeat orders get wholesale rates based on how much you buy and how often.",
  },
  {
    category: "bulk",
    question: "Can you put together gift hampers?",
    answer:
      "We'd love to. Goat milk soap, ragi flour and vetiver make lovely farm hampers, and we can add cakes for local orders. Share your budget and quantity on WhatsApp.",
  },
];
