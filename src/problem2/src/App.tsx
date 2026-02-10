import { useMemo } from "react";
import { Box, alpha } from "@mui/material";
import { Toaster } from "sonner";
import { WalletProvider } from "@/contexts/wallet-provider";
import { useTokenPrices } from "@/hooks/use-token-prices";
import SwapPage from "@/pages/swap-page";

/**
 * Root application component.
 * Sets up the layout, animated background, wallet provider, and toaster.
 */
const App = () => {
  const { data: tokens } = useTokenPrices();

  /** Build a currency -> price lookup for the wallet's USD calculation. */
  const priceMap = useMemo(() => {
    if (!tokens) return {};
    return tokens.reduce<Record<string, number>>((acc, t) => {
      acc[t.currency] = t.price;
      return acc;
    }, {});
  }, [tokens]);

  return (
    <WalletProvider prices={priceMap}>
      <Box
        component="main"
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          px: { xs: 1.5, sm: 2 },
          py: 3,
          overflow: "hidden",
        }}
      >
        {/* Animated Background Blobs */}
        <Box
          aria-hidden
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            "& .blob": {
              position: "absolute",
              borderRadius: "50%",
              filter: "blur(120px)",
              opacity: 0.4,
              animation: "float 20s ease-in-out infinite",
            },
            "@keyframes float": {
              "0%, 100%": { transform: "translate(0, 0) scale(1)" },
              "33%": { transform: "translate(30px, -20px) scale(1.05)" },
              "66%": { transform: "translate(-20px, 20px) scale(0.95)" },
            },
          }}
        >
          <Box
            className="blob"
            sx={{
              width: 500,
              height: 500,
              background: "radial-gradient(circle, #8b5cf6, transparent 70%)",
              top: "-10%",
              left: "-10%",
            }}
          />
          <Box
            className="blob"
            sx={{
              width: 400,
              height: 400,
              background: "radial-gradient(circle, #06b6d4, transparent 70%)",
              bottom: "-10%",
              right: "-10%",
              animationDelay: "-10s",
            }}
          />
        </Box>

        {/* Content */}
        <Box sx={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 480 }}>
          <SwapPage />
        </Box>

        {/* Sonner Toaster */}
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              background: alpha("#1a1030", 0.95),
              backdropFilter: "blur(16px)",
              border: `1px solid ${alpha("#ffffff", 0.1)}`,
              color: "#f1f5f9",
              borderRadius: 12,
            },
          }}
        />
      </Box>
    </WalletProvider>
  );
};

export default App;
