/**
 * Token prices API endpoint.
 * Separated from hooks so the fetcher can be reused or tested independently.
 */

import type { Token, TokenPrice } from "@/types";
import { ENDPOINTS } from "@/constant";
import { processTokenPrices } from "@/utils/tokens";
import { apiGet } from "./client";

/**
 * Fetches raw token prices from the Switcheo API,
 * deduplicates them, and returns processed tokens.
 */
export async function fetchTokenPrices(): Promise<Token[]> {
  const raw = await apiGet<TokenPrice[]>(ENDPOINTS.TOKEN_PRICES);
  return processTokenPrices(raw);
}
