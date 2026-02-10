/** Raw price entry from the Switcheo API. */
export interface TokenPrice {
  currency: string;
  date: string;
  price: number;
}

/** Processed token with a unique key and latest price. */
export interface Token {
  currency: string;
  price: number;
  /** URL for the token icon SVG from Switcheo repo. */
  icon: string;
}

/** Map of currency -> balance amount. */
export type WalletBalances = Record<string, number>;
