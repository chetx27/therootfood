export const businessInfo = {
  name: "TheRootFood",
  description: "Farm-direct flours, herbal roots, free-range eggs, and fresh artisanal foods.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://therootfood.com",
  email: "therootfoodsupport@gmail.com",
  phone: "+917619436055",
  currenciesAccepted: "INR",
  paymentAccepted: "Cash, UPI, Bank Transfer",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bangalore",
    addressRegion: "Karnataka",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "12.9716",
    longitude: "77.5946",
  }
};
