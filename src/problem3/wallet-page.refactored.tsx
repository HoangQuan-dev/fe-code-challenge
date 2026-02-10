/**
 * Problem 3 — Refactored WalletPage.
 *
 * Fixes all issues in PROBLEMS.md:
 * - 1: Type safety (blockchain type, WalletBalance.blockchain)
 * - 2: Filter logic (correct variable, positive amounts, simple expression)
 * - 3: useMemo deps (no unused prices)
 * - 4: Sort comparator (always return number)
 * - 5–6: Use formattedBalances for rows; memoise
 * - 7: React (stable key, getPriority outside, no unused children)
 * - 8: Safe price lookup (?? 0)
 * - 9: Design (priority constants, toFixed(2), extend interface, BoxProps)
 */

import React, { useMemo } from "react";

// Types

/** Known blockchains; avoids `any` (PROBLEMS 1.1). */
type Blockchain =
  | "Osmosis"
  | "Ethereum"
  | "Arbitrum"
  | "Zilliqa"
  | "Neo";

/** Includes `blockchain` so it matches runtime usage (PROBLEMS 1.2). */
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain;
}

/** Extends WalletBalance — DRY (PROBLEMS 9.3). */
interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {}
interface WalletRowProps {
  className: string;
  amount: number;
  usdValue: number;
  formattedAmount: string;
}

declare function useWalletBalances(): WalletBalance[];
declare function usePrices(): Record<string, number>;
declare const WalletRow: React.FC<WalletRowProps>;
declare const classes: { row: string };

/**
 * Priority lookup outside component — not recreated each render (PROBLEMS 7.2).
 * Named constants instead of magic numbers (PROBLEMS 9.1).
 */
const BLOCKCHAIN_PRIORITY: Record<string, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

const DEFAULT_PRIORITY = -99;

const getPriority = (blockchain: string): number =>
  BLOCKCHAIN_PRIORITY[blockchain] ?? DEFAULT_PRIORITY;

/** Props = BoxProps directly (PROBLEMS 9.4). No unused children (7.3). */
const WalletPage: React.FC<BoxProps> = ({ ...rest }) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  /**
   * Filter: correct variable and positive amounts only (PROBLEMS 2.1, 2.2, 2.3).
   * Sort: always return a number — descending by priority (PROBLEMS 4).
   * Deps: only [balances]; prices unused in this memo (PROBLEMS 3).
   */
  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance) => {
        const priority = getPriority(balance.blockchain);
        return priority > DEFAULT_PRIORITY && balance.amount > 0;
      })
      .sort((lhs, rhs) => {
        return getPriority(rhs.blockchain) - getPriority(lhs.blockchain);
      });
  }, [balances]);

  /**
   * Memoised; rows built from this so balance.formatted exists (PROBLEMS 5.1, 5.2, 6).
   * toFixed(2) for consistent decimals (PROBLEMS 9.2).
   */
  const formattedBalances: FormattedWalletBalance[] = useMemo(() => {
    return sortedBalances.map((balance) => ({
      ...balance,
      formatted: balance.amount.toFixed(2),
    }));
  }, [sortedBalances]);

  /**
   * Map over formattedBalances (has .formatted). Stable key (PROBLEMS 7.1).
   * Safe price lookup (PROBLEMS 8).
   */
  const rows = useMemo(() => {
    return formattedBalances.map((balance) => {
      const usdValue = (prices[balance.currency] ?? 0) * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={balance.currency}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    });
  }, [formattedBalances, prices]);

  return <div {...rest}>{rows}</div>;
};

export default WalletPage;
