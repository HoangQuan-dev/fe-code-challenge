import { Box, Button, CircularProgress, Typography } from "@mui/material";
import SwapForm from "@/components/swap/swap-form";
import WalletCard from "@/components/wallet/wallet-card";
import { useTokenPrices } from "@/hooks/use-token-prices";
import { ERRORS } from "@/constant";

/**
 * Top-level page for the currency swap feature.
 * Handles data loading / error states and composes WalletCard + SwapForm.
 */
const SwapPage = () => {
  const { data: tokens, isLoading, isError, error, refetch } = useTokenPrices();

  if (isLoading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" gap={2} py={6}>
        <CircularProgress size={40} sx={{ color: "primary.main" }} />
        <Typography variant="body2" color="text.secondary">
          Loading tokens...
        </Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" gap={2} py={6} textAlign="center">
        <Typography variant="body2" color="error.main">
          {error instanceof Error ? error.message : ERRORS.FETCH_PRICES_FAILED}
        </Typography>
        <Button
          variant="contained"
          size="small"
          onClick={() => refetch()}
          sx={{ px: 3 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <>
      <WalletCard />
      <SwapForm tokens={tokens ?? []} />
    </>
  );
};

export default SwapPage;
