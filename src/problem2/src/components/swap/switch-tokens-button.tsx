import { memo } from "react";
import { IconButton, alpha } from "@mui/material";
import SwapVertIcon from "@mui/icons-material/SwapVert";

interface SwitchTokensButtonProps {
  onClick: () => void;
  disabled: boolean;
}

/**
 * Circular icon button to swap the "from" and "to" selections.
 */
const SwitchTokensButton = memo(
  ({ onClick, disabled }: SwitchTokensButtonProps) => (
    <IconButton
      onClick={onClick}
      disabled={disabled}
      aria-label="Switch currencies"
      title="Switch currencies"
      sx={{
        width: 42,
        height: 42,
        bgcolor: (t) => alpha(t.palette.common.white, 0.06),
        border: (t) => `1px solid ${alpha(t.palette.common.white, 0.1)}`,
        color: "text.secondary",
        transition: "all 250ms ease",
        "&:hover:not(:disabled)": {
          bgcolor: "primary.main",
          borderColor: "primary.main",
          color: "#fff",
          transform: "rotate(180deg)",
        },
        "&.Mui-disabled": { opacity: 0.4, color: "text.disabled" },
      }}
    >
      <SwapVertIcon fontSize="small" />
    </IconButton>
  ),
);

SwitchTokensButton.displayName = "SwitchTokensButton";

export default SwitchTokensButton;
