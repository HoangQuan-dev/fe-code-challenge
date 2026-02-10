import { createContext } from "react";
import type { WalletBalances } from "@/types";

export interface WalletContextValue {
  /** Current balances per currency. */
  balances: WalletBalances;
  /** Total portfolio value in USD. */
  totalUsdValue: number;
  /** Get the balance for a specific currency (0 if not held). */
  getBalance: (currency: string) => number;
  /** Execute a swap: deduct `fromAmount` of `fromCurrency`, add `toAmount` of `toCurrency`. */
  executeSwap: (
    fromCurrency: string,
    fromAmount: number,
    toCurrency: string,
    toAmount: number,
  ) => Promise<void>;
  /** Whether a swap is currently in flight. */
  isSwapping: boolean;
}

export const WalletContext = createContext<WalletContextValue | null>(null);
