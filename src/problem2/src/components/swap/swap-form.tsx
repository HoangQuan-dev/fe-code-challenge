import { useCallback, useMemo, useState } from "react";
import { Box, Button, Stack, Typography, alpha } from "@mui/material";
import { motion } from "framer-motion";
import { toast } from "sonner";
import type { Token } from "@/types";
import { ERRORS } from "@/constant";
import { useWallet } from "@/hooks/use-wallet";
import { computeExchangeAmount, formatAmount } from "@/utils/tokens";
import AmountInput from "./amount-input";
import CurrencySelector from "./currency-selector";
import SwapButton from "./swap-button";
import SwitchTokensButton from "./switch-tokens-button";

interface SwapFormProps {
  tokens: Token[];
}

/**
 * Main currency swap form.
 * Auto-fills FROM with a wallet currency that has balance (Binance-like).
 * Manages token selection, amount input, Max button, validation, and swaps.
 */
const SwapForm = ({ tokens }: SwapFormProps) => {
  const { getBalance, executeSwap, isSwapping } = useWallet();

  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [fromAmount, setFromAmount] = useState("");

  // Default FROM = token with highest balance (Binance-like); user override via fromToken
  const defaultFromToken = useMemo(() => {
    if (!tokens.length) return null;
    const withBalance = tokens.filter((t) => getBalance(t.currency) > 0);
    if (!withBalance.length) return null;
    const byBalance = [...withBalance].sort(
      (a, b) => getBalance(b.currency) - getBalance(a.currency),
    );
    return byBalance[0];
  }, [tokens, getBalance]);

  const effectiveFromToken = fromToken ?? defaultFromToken;

  // Derived state
  const toAmount = useMemo(() => {
    const num = parseFloat(fromAmount);
    if (!effectiveFromToken || !toToken || isNaN(num) || num <= 0) return "";
    const result = computeExchangeAmount(num, effectiveFromToken.price, toToken.price);
    return result !== null ? formatAmount(result) : "";
  }, [fromAmount, effectiveFromToken, toToken]);

  const exchangeRateText = useMemo(() => {
    if (!effectiveFromToken || !toToken) return null;
    const rate = computeExchangeAmount(1, effectiveFromToken.price, toToken.price);
    if (rate === null) return null;
    return `1 ${effectiveFromToken.currency} = ${formatAmount(rate)} ${toToken.currency}`;
  }, [effectiveFromToken, toToken]);

  // Validation
  const validationError = useMemo((): string | null => {
    if (fromAmount === "") return null;
    const num = parseFloat(fromAmount);
    if (isNaN(num)) return ERRORS.INVALID_NUMBER;
    if (num <= 0) return ERRORS.AMOUNT_ZERO;

    if (effectiveFromToken) {
      const balance = getBalance(effectiveFromToken.currency);
      if (num > balance) return ERRORS.INSUFFICIENT_BALANCE;
    }

    return null;
  }, [fromAmount, effectiveFromToken, getBalance]);

  const canSubmit =
    effectiveFromToken !== null &&
    toToken !== null &&
    fromAmount !== "" &&
    parseFloat(fromAmount) > 0 &&
    !validationError &&
    !isSwapping;

  const fromBalanceHint = effectiveFromToken
    ? `Balance: ${formatAmount(getBalance(effectiveFromToken.currency))}`
    : undefined;

  const toBalanceHint = toToken
    ? `Balance: ${formatAmount(getBalance(toToken.currency))}`
    : undefined;

  // Handlers
  const handleSwitch = useCallback(() => {
    const prevFrom = effectiveFromToken;
    const prevTo = toToken;
    setFromToken(prevTo);
    setToToken(prevFrom);
    if (toAmount) setFromAmount(toAmount);
  }, [effectiveFromToken, toToken, toAmount]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!canSubmit || !effectiveFromToken || !toToken) {
        toast.error(ERRORS.MISSING_FIELDS);
        return;
      }

      const numFrom = parseFloat(fromAmount);
      const numTo = parseFloat(toAmount);

      try {
        await executeSwap(
          effectiveFromToken.currency,
          numFrom,
          toToken.currency,
          numTo,
        );

        toast.success(
          `Swapped ${fromAmount} ${effectiveFromToken.currency} for ${toAmount} ${toToken.currency}`,
        );

        setFromAmount("");
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : ERRORS.SWAP_FAILED,
        );
      }
    },
    [canSubmit, fromAmount, toAmount, effectiveFromToken, toToken, executeSwap],
  );

  // Render
  return (
    <Box
      component={motion.form}
      onSubmit={handleSubmit}
      noValidate
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      sx={{
        p: { xs: "20px 16px", sm: "32px 28px" },
        border: (t) => `1px solid ${alpha(t.palette.common.white, 0.1)}`,
        borderRadius: "20px",
        bgcolor: (t) => alpha(t.palette.common.white, 0.06),
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      }}
    >
      <Typography variant="h1" align="center" gutterBottom>
        Currency Swap
      </Typography>
      <Typography variant="subtitle1" component="p" align="center" sx={{ mb: 3.5 }}>
        Trade tokens instantly at the best rates
      </Typography>

      {/* From */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        alignItems={{ sm: "flex-start" }}
      >
        <AmountInput
          id="from-amount"
          label="You pay"
          value={fromAmount}
          onChange={setFromAmount}
          error={validationError ?? undefined}
          balanceHint={fromBalanceHint}
          rightAction={
            effectiveFromToken ? (
              <Button
                size="small"
                onClick={() => {
                  setFromAmount(formatAmount(getBalance(effectiveFromToken.currency)));
                }}
                sx={{
                  minWidth: 0,
                  py: 0,
                  px: 0.75,
                  fontSize: "0.6875rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  color: "primary.main",
                  "&:hover": {
                    bgcolor: (theme: { palette: { primary: { main: string } } }) =>
                      alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                Max
              </Button>
            ) : undefined
          }
        />
        <CurrencySelector
          id="from-currency"
          label="From"
          tokens={tokens}
          selectedToken={effectiveFromToken}
          onSelect={setFromToken}
          excludeCurrency={toToken?.currency}
        />
      </Stack>

      {/* Switch */}
      <Box display="flex" justifyContent="center" my={1}>
        <SwitchTokensButton
          onClick={handleSwitch}
          disabled={!effectiveFromToken || !toToken || isSwapping}
        />
      </Box>

      {/* To */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        alignItems={{ sm: "flex-start" }}
      >
        <AmountInput
          id="to-amount"
          label="You receive"
          value={toAmount}
          onChange={() => {}}
          readOnly
          balanceHint={toBalanceHint}
        />
        <CurrencySelector
          id="to-currency"
          label="To"
          tokens={tokens}
          selectedToken={toToken}
          onSelect={setToToken}
          excludeCurrency={effectiveFromToken?.currency}
        />
      </Stack>

      {/* Exchange Rate */}
      {exchangeRateText && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Typography
            variant="body2"
            align="center"
            sx={{
              mt: 1.5,
              py: 1,
              px: 1.5,
              bgcolor: (t) => alpha(t.palette.common.white, 0.04),
              borderRadius: 1,
              color: "text.secondary",
            }}
          >
            {exchangeRateText}
          </Typography>
        </motion.div>
      )}

      {/* Submit */}
      <SwapButton loading={isSwapping} disabled={!canSubmit} />
    </Box>
  );
};

export default SwapForm;
