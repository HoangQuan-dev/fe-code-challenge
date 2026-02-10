import type { WalletBalances } from "@/types";

/**
 * Wallet configuration constants.
 */

/** localStorage key for persisting wallet balances. */
export const WALLET_STORAGE_KEY = "fancy-form-wallet-balances";

/** Starting balances for the demo wallet. */
export const INITIAL_BALANCES: Record<string, number> = {
  USD: 100,
};

/** Simulated network delay for swap operations (ms). */
export const SWAP_DELAY_MS = 2000;

/**
 * Reads persisted balances from localStorage.
 * Returns INITIAL_BALANCES if missing, invalid, or not in browser.
 */
export function loadStoredBalances(): WalletBalances {
  if (typeof window === "undefined") return { ...INITIAL_BALANCES };
  try {
    const raw = window.localStorage.getItem(WALLET_STORAGE_KEY);
    if (!raw) return { ...INITIAL_BALANCES };
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { ...INITIAL_BALANCES };
    }
    const result: WalletBalances = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof key === "string" && typeof value === "number" && Number.isFinite(value) && value >= 0) {
        result[key] = value;
      }
    }
    return Object.keys(result).length > 0 ? result : { ...INITIAL_BALANCES };
  } catch {
    return { ...INITIAL_BALANCES };
  }
}

/**
 * Writes balances to localStorage. No-op if not in browser.
 */
export function saveStoredBalances(balances: WalletBalances): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(balances));
  } catch {
    // Ignore quota / private mode errors
  }
}
