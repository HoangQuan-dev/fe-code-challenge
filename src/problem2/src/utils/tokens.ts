import type { Token, TokenPrice } from "@/types";
import { TOKEN_ICON_BASE_URL } from "@/constant";

/**
 * Builds the icon URL for a given currency symbol.
 */
export const getTokenIconUrl = (currency: string): string =>
  `${TOKEN_ICON_BASE_URL}/${currency}.svg`;

/**
 * Deduplicates price entries by currency, keeping the most recent price
 * (latest date). Filters out entries without a valid price.
 */
export const processTokenPrices = (prices: TokenPrice[]): Token[] => {
  const latestBySymbol = new Map<string, TokenPrice>();

  for (const entry of prices) {
    if (entry.price == null || entry.price <= 0) continue;

    const existing = latestBySymbol.get(entry.currency);
    if (!existing || new Date(entry.date) > new Date(existing.date)) {
      latestBySymbol.set(entry.currency, entry);
    }
  }

  return Array.from(latestBySymbol.values()).map((entry) => ({
    currency: entry.currency,
    price: entry.price,
    icon: getTokenIconUrl(entry.currency),
  }));
};

/**
 * Computes the exchange amount from one token to another.
 * Returns `null` if either price is missing/zero.
 */
export const computeExchangeAmount = (
  amount: number,
  fromPrice: number,
  toPrice: number,
): number | null => {
  if (!fromPrice || !toPrice || toPrice === 0) return null;
  return (amount * fromPrice) / toPrice;
};

/**
 * Formats a number for display — up to 6 decimal places, strips trailing zeros.
 */
export const formatAmount = (value: number): string => {
  if (value === 0) return "0";
  if (Math.abs(value) >= 1) {
    return parseFloat(value.toFixed(4)).toString();
  }
  return parseFloat(value.toFixed(6)).toString();
};
