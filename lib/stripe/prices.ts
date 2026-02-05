export const STRIPE_PRICES = {
    USD: {
      enterprise: "price_usd_enterprise",
    },
    EUR: {
      enterprise: "price_eur_enterprise",
    },
    INR: {
      enterprise: "price_inr_enterprise",
    },
    MXN: {
      enterprise: "price_mxn_enterprise",
    },
  } as const;
  
  export type StripeCurrency = keyof typeof STRIPE_PRICES;
  