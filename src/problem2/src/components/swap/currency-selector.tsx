import { memo, useMemo } from "react";
import {
  Autocomplete,
  Box,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import type { Token } from "@/types";
import TokenIcon from "@/components/common/token-icon";

interface CurrencySelectorProps {
  tokens: Token[];
  selectedToken: Token | null;
  onSelect: (token: Token | null) => void;
  excludeCurrency?: string;
  label: string;
  id: string;
}

/**
 * MUI Autocomplete-based currency selector with search and token icons.
 */
const CurrencySelector = memo(
  ({
    tokens,
    selectedToken,
    onSelect,
    excludeCurrency,
    label,
    id,
  }: CurrencySelectorProps) => {
    const options = useMemo(
      () => tokens.filter((t) => t.currency !== excludeCurrency),
      [tokens, excludeCurrency],
    );

    return (
      <Box sx={{ minWidth: 160, flexShrink: 0 }}>
        <Typography variant="caption" component="label" htmlFor={id} sx={{ mb: 0.75, display: "block" }}>
          {label}
        </Typography>
        <Autocomplete
          id={id}
          options={options}
          value={selectedToken}
          onChange={(_, value) => onSelect(value)}
          getOptionLabel={(option) => option.currency}
          isOptionEqualToValue={(option, value) =>
            option.currency === value.currency
          }
          disableClearable={!selectedToken}
          size="small"
          renderOption={(props, option) => {
            const { key, ...rest } = props;
            return (
              <Box
                component="li"
                key={key}
                {...rest}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  py: 1,
                }}
              >
                <TokenIcon src={option.icon} alt={option.currency} size={28} />
                <Typography variant="body2" sx={{ flex: 1, fontWeight: 500 }}>
                  {option.currency}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.disabled" }}>
                  ${option.price.toFixed(2)}
                </Typography>
              </Box>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Select token"
              InputProps={{
                ...params.InputProps,
                startAdornment: selectedToken ? (
                  <Box sx={{ display: "flex", alignItems: "center", ml: 0.5, mr: -0.5 }}>
                    <TokenIcon
                      src={selectedToken.icon}
                      alt={selectedToken.currency}
                      size={22}
                    />
                  </Box>
                ) : null,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: 48,
                  bgcolor: (t) => alpha(t.palette.common.white, 0.04),
                },
              }}
            />
          )}
          slotProps={{
            popper: {
              sx: { minWidth: 240 },
            },
          }}
        />
      </Box>
    );
  },
);

CurrencySelector.displayName = "CurrencySelector";

export default CurrencySelector;
