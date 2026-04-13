const storeConfig = {
  // Store Info
  storeName: "J'manel Superstores",
  tagline: "Natural Hair Care",
  whatsapp: "08036868328",
  phone: "08036868328",
  email: "jmanelsuperstores@gmail.com",

  // Payment Details
  payment: {
    bankName: "OPay (9 Payment Service Bank)",
    accountName: "Juwonlo Akinlolu",
    accountNumber: "8036868328",
    whatsapp: "08036868328",
  },

  // Delivery Fees (in Naira)
  delivery: {
    lagos: 1500,
    outsideLagos: 3000,
    freeThreshold: 30000,
    podHandlingFee: 500,
  },

  // Tax
  vatRate: 0.075,

  // Admin credentials
  admin: {
    username: "jmaneladmin",
    password: "Jmanel2024@",
  },

  // Promo codes
  promoCodes: {
    JMANEL10: 10,
    HAIR20: 20,
  },
};

export default storeConfig;
