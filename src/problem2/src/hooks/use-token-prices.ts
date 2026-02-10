import { useQuery } from "@tanstack/react-query";
import { fetchTokenPrices } from "@/api";
import { QUERY_CONFIG, QUERY_KEYS } from "@/constant";

/**
 * TanStack Query hook for fetching and caching token prices.
 *
 * - Automatically caches & deduplicates requests.
 * - Retries on failure (3 times by default).
 * - Stale time of 5 min keeps the UI responsive without spamming the API.
 */
export const useTokenPrices = () => {
  return useQuery({
    queryKey: QUERY_KEYS.TOKEN_PRICES,
    queryFn: fetchTokenPrices,
    staleTime: QUERY_CONFIG.STALE_TIME,
    gcTime: QUERY_CONFIG.GC_TIME,
    refetchOnWindowFocus: false,
  });
};
