/**
 * User-facing error messages.
 */

export const ERRORS = {
  // Input validation
  INVALID_NUMBER: "Please enter a valid number",
  AMOUNT_ZERO: "Amount must be greater than zero",
  MISSING_FIELDS: "Please fill in all fields correctly.",
  SAME_CURRENCY: "Cannot swap the same currency",

  // Wallet
  INSUFFICIENT_BALANCE: "Insufficient balance for this swap",
  TOKEN_NOT_IN_WALLET: "You don't hold this token",

  // Network / API
  FETCH_PRICES_FAILED: "Failed to fetch token prices",
  SWAP_FAILED: "Swap failed. Please try again.",

  // Generic
  UNKNOWN: "Something went wrong. Please try again.",
} as const;
