import { createTheme, alpha } from "@mui/material/styles";

/**
 * Custom dark theme with glassmorphism aesthetic.
 * Mirrors the visual language used in the interviewer's design system.
 */
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#8b5cf6",
      light: "#a78bfa",
      dark: "#6d28d9",
    },
    secondary: {
      main: "#06b6d4",
    },
    background: {
      default: "#0f0b1e",
      paper: alpha("#ffffff", 0.06),
    },
    text: {
      primary: "#f1f5f9",
      secondary: "#94a3b8",
      disabled: "#64748b",
    },
    error: {
      main: "#ef4444",
    },
    success: {
      main: "#22c55e",
    },
    divider: alpha("#ffffff", 0.1),
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    h1: {
      fontSize: "1.5rem",
      fontWeight: 700,
    },
    subtitle1: {
      fontSize: "0.875rem",
      color: "#94a3b8",
    },
    caption: {
      fontSize: "0.75rem",
      fontWeight: 600,
      textTransform: "uppercase" as const,
      letterSpacing: "0.05em",
      color: "#94a3b8",
    },
    body2: {
      fontSize: "0.8125rem",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minHeight: "100vh",
          background: "#0f0b1e",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none" as const,
          fontWeight: 600,
          borderRadius: 12,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: alpha("#ffffff", 0.1),
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: alpha("#ffffff", 0.2),
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#8b5cf6",
            borderWidth: 1,
            boxShadow: `0 0 0 3px ${alpha("#8b5cf6", 0.25)}`,
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          background: "rgba(20, 15, 40, 0.95)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: `1px solid ${alpha("#ffffff", 0.1)}`,
          borderRadius: 12,
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        },
        listbox: {
          padding: 4,
          maxHeight: 280,
        },
        option: {
          borderRadius: 8,
          margin: "2px 4px",
          "&:hover": {
            background: alpha("#ffffff", 0.08),
          },
          '&[aria-selected="true"]': {
            background: `${alpha("#ffffff", 0.12)} !important`,
          },
        },
      },
    },
  },
});

export default theme;
