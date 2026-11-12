export const businessInfo = {
  name: "TheRootFood",
  description: "Flours, herbal roots, country eggs and fresh meat from our farm, plus cakes and brownies from Nitara's Fine Bakes. Based in Bangalore.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://therootfood.com",
  email: "therootfoodsupport@gmail.com",
  phone: "+917483877595",
  currenciesAccepted: "INR, USD, EUR, GBP, AED",
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

/** The farm's phone number the way we print it on the site. */
export const farmPhoneDisplay = "+91 74838 77595";
