import { useContext } from "react";
import { WalletContext } from "@/contexts/wallet-context";

/**
 * Hook to access the wallet context.
 * Must be used inside a `<WalletProvider>`.
 */
export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return ctx;
}
