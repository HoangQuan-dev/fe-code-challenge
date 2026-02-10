import { memo } from "react";
import { Button, CircularProgress } from "@mui/material";

interface SwapButtonProps {
  loading: boolean;
  disabled: boolean;
}

/**
 * Gradient submit button with loading spinner.
 * Fixed height prevents layout shift during loading state.
 */
const SwapButton = memo(({ loading, disabled }: SwapButtonProps) => (
  <Button
    type="submit"
    variant="contained"
    fullWidth
    disabled={disabled || loading}
    sx={{
      height: 52,
      mt: 2.5,
      fontSize: "1rem",
      fontWeight: 600,
      cursor: "pointer",
      background: (t) =>
        `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.primary.dark})`,
      boxShadow: (t) => `0 4px 16px ${t.palette.primary.main}40`,
      "&:hover:not(:disabled)": {
        opacity: 0.92,
        transform: "translateY(-1px)",
        boxShadow: (t) => `0 6px 24px ${t.palette.primary.main}55`,
      },
      "&:active:not(:disabled)": { transform: "translateY(0)" },
      "&.Mui-disabled": {
        background: (t) =>
          `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.primary.dark})`,
        opacity: 0.45,
        color: "#fff",
      },
      transition: "opacity 150ms ease, transform 150ms ease, box-shadow 150ms ease",
    }}
  >
    {loading ? (
      <>
        <CircularProgress size={20} sx={{ color: "#fff", mr: 1.25 }} />
        Swapping...
      </>
    ) : (
      "Confirm Swap"
    )}
  </Button>
));

SwapButton.displayName = "SwapButton";

export default SwapButton;
