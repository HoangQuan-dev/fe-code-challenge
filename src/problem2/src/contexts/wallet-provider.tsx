import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { WalletBalances } from "@/types";
import { WalletContext } from "./wallet-context";
import {
  ERRORS,
  loadStoredBalances,
  saveStoredBalances,
  SWAP_DELAY_MS,
} from "@/constant";

interface WalletProviderProps {
  children: ReactNode;
  /** Optional: price lookup so we can compute total USD value. */
  prices?: Record<string, number>;
}

export function WalletProvider({ children, prices = {} }: WalletProviderProps) {
  const [balances, setBalances] = useState<WalletBalances>(loadStoredBalances);
  const [isSwapping, setIsSwapping] = useState(false);

  useEffect(() => {
    saveStoredBalances(balances);
  }, [balances]);

  const getBalance = useCallback(
    (currency: string): number => balances[currency] ?? 0,
    [balances],
  );

  const totalUsdValue = useMemo(() => {
    return Object.entries(balances).reduce((sum, [currency, amount]) => {
      const price = prices[currency] ?? (currency === "USD" ? 1 : 0);
      return sum + amount * price;
    }, 0);
  }, [balances, prices]);

  const executeSwap = useCallback(
    async (
      fromCurrency: string,
      fromAmount: number,
      toCurrency: string,
      toAmount: number,
    ) => {
      const currentBalance = balances[fromCurrency] ?? 0;
      if (currentBalance < fromAmount) {
        throw new Error(ERRORS.INSUFFICIENT_BALANCE);
      }

      setIsSwapping(true);

      try {
        await new Promise((resolve) => setTimeout(resolve, SWAP_DELAY_MS));

        setBalances((prev) => {
          const next = { ...prev };

          next[fromCurrency] = (next[fromCurrency] ?? 0) - fromAmount;
          if (next[fromCurrency] <= 0) {
            delete next[fromCurrency];
          }

          next[toCurrency] = (next[toCurrency] ?? 0) + toAmount;

          return next;
        });
      } finally {
        setIsSwapping(false);
      }
    },
    [balances],
  );

  const value = useMemo(
    () => ({ balances, totalUsdValue, getBalance, executeSwap, isSwapping }),
    [balances, totalUsdValue, getBalance, executeSwap, isSwapping],
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}
