import { memo, useCallback, type ReactNode } from "react";
import { Box, TextField, Typography, alpha } from "@mui/material";

interface AmountInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  error?: string;
  placeholder?: string;
  /** Optional balance hint shown below the label. */
  balanceHint?: string;
  /** Optional action (e.g. Max button) shown next to the balance hint. */
  rightAction?: ReactNode;
}

/**
 * Numeric-only input for currency amounts.
 */
const AmountInput = memo(
  ({
    id,
    label,
    value,
    onChange,
    readOnly = false,
    error,
    placeholder = "0.00",
    balanceHint,
    rightAction,
  }: AmountInputProps) => {
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        if (raw === "") {
          onChange("");
          return;
        }
        if (/^\d*\.?\d*$/.test(raw)) {
          onChange(raw);
        }
      },
      [onChange],
    );

    return (
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.75 }}>
          <Typography variant="caption" component="label" htmlFor={id}>
            {label}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {balanceHint && (
              <Typography variant="caption" sx={{ color: "text.disabled", fontSize: "0.6875rem", textTransform: "none", letterSpacing: 0 }}>
                {balanceHint}
              </Typography>
            )}
            {rightAction}
          </Box>
        </Box>
        <TextField
          id={id}
          fullWidth
          size="small"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          error={!!error}
          helperText={error}
          autoComplete="off"
          slotProps={{
            input: {
              readOnly,
              inputMode: "decimal" as const,
            },
            htmlInput: {
              "aria-invalid": !!error,
            },
            formHelperText: {
              role: "alert",
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              height: 48,
              fontSize: "1.125rem",
              fontWeight: 500,
              bgcolor: (t) => alpha(t.palette.common.white, 0.04),
              ...(readOnly && { opacity: 0.8 }),
            },
          }}
        />
      </Box>
    );
  },
);

AmountInput.displayName = "AmountInput";

export default AmountInput;
