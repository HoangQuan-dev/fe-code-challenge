import { memo, useMemo, useState } from "react";
import {
  Box,
  Chip,
  Divider,
  IconButton,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@/hooks/use-wallet";
import { formatAmount, getTokenIconUrl } from "@/utils/tokens";
import TokenIcon from "@/components/common/token-icon";

/**
 * Displays the user's wallet balances.
 * Header shows total USD value and a toggle to expand/collapse the asset list.
 */
const WalletCard = memo(() => {
  const { balances, totalUsdValue } = useWallet();
  const [expanded, setExpanded] = useState(true);

  const entries = useMemo(
    () =>
      Object.entries(balances)
        .filter(([, amount]) => amount > 0)
        .sort(([a], [b]) => a.localeCompare(b)),
    [balances],
  );

  const hasEntries = entries.length > 0;
  const showToggle = hasEntries;

  return (
    <Box
      sx={{
        mb: 2,
        p: { xs: "16px 14px", sm: "20px 24px" },
        border: (t) => `1px solid ${alpha(t.palette.common.white, 0.08)}`,
        borderRadius: "16px",
        bgcolor: (t) => alpha(t.palette.common.white, 0.04),
        backdropFilter: "blur(16px)",
      }}
    >
      {/* Header: title, total value, expand/collapse toggle */}
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <AccountBalanceWalletIcon sx={{ color: "primary.main", fontSize: 20 }} />
        <Typography variant="body2" sx={{ fontWeight: 600, flex: 1 }}>
          My Wallet
        </Typography>
        <Chip
          label={`$${formatAmount(totalUsdValue)}`}
          size="small"
          sx={{
            fontWeight: 700,
            fontSize: "0.75rem",
            bgcolor: (t) => alpha(t.palette.primary.main, 0.15),
            color: "primary.light",
          }}
        />
        {showToggle && (
          <IconButton
            size="small"
            onClick={() => setExpanded((e) => !e)}
            aria-label={expanded ? "Collapse wallet list" : "Expand wallet list"}
            sx={{
              color: "text.secondary",
              "&:hover": { color: "primary.main", bgcolor: (t) => alpha(t.palette.primary.main, 0.08) },
            }}
          >
            {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
          </IconButton>
        )}
      </Stack>

      <AnimatePresence initial={false}>
        {(expanded || !showToggle) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: "hidden" }}
          >
            <Divider sx={{ borderColor: (t) => alpha(t.palette.common.white, 0.06), my: 1.5 }} />

            {!hasEntries ? (
              <Typography variant="body2" color="text.disabled" align="center" py={1}>
                No balances yet
              </Typography>
            ) : (
              <Stack spacing={0.75} sx={{ pt: 0 }}>
                <AnimatePresence mode="popLayout">
                  {entries.map(([currency, amount]) => (
                    <motion.div
                      key={currency}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{
                          py: 0.75,
                          px: 1,
                          borderRadius: 1,
                          "&:hover": {
                            bgcolor: (t) => alpha(t.palette.common.white, 0.04),
                          },
                        }}
                      >
                        <TokenIcon
                          src={getTokenIconUrl(currency)}
                          alt={currency}
                          size={22}
                        />
                        <Typography variant="body2" sx={{ flex: 1, fontWeight: 500 }}>
                          {currency}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                          {formatAmount(amount)}
                        </Typography>
                      </Stack>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </Stack>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
});

WalletCard.displayName = "WalletCard";

export default WalletCard;
