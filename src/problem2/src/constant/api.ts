/**
 * API endpoint constants.
 */

export const API_BASE_URL = "https://interview.switcheo.com";

export const ENDPOINTS = {
  TOKEN_PRICES: `${API_BASE_URL}/prices.json`,
} as const;

export const TOKEN_ICON_BASE_URL =
  "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens";

/** TanStack Query cache configuration. */
export const QUERY_CONFIG = {
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
  GC_TIME: 10 * 60 * 1000, // 10 minutes
} as const;

/** TanStack Query keys — centralised to avoid typos and enable cache invalidation. */
export const QUERY_KEYS = {
  TOKEN_PRICES: ["tokenPrices"] as const,
} as const;
