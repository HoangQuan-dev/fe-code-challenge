# Problem 2 — Currency Swap (Fancy Form)

## What This App Does

This is a **currency swap form** application. Users can swap assets from one currency to another with real-time conversion, balance validation, and persistent wallet state.

## How It Works

The app behaves as a **simple single-user wallet** with multiple currencies.

### Starting Balances & Persistence

- The user starts with a **configurable initial balance** (default: **100 USD** in the USD wallet).
- Each currency is represented as a separate wallet; balances are persisted in **localStorage**.

### Rates & Conversion

- Token prices are fetched from: **https://interview.switcheo.com/prices.json**
- Conversion is applied **in real time**:
  - When the user selects the source and target currency
  - When the user enters the amount to swap
  - The “You receive” amount updates automatically from the current rates

### What Gets Validated

The form validates:

- Empty or invalid numeric input
- Negative or zero amounts
- Insufficient balance in the source wallet
- Same currency for “from” and “to”

### Simulated Network Delay

- A short artificial delay simulates a network call during the swap (configurable in `constant/wallet.ts`).

---

## Project Layout

```
problem2/
├── public/                 # Static assets
├── index.html
├── src/
│   ├── main.tsx            # App bootstrap, providers, root render
│   ├── App.tsx             # Root layout, wallet provider, toaster
│   ├── theme.ts            # Material-UI theme
│   ├── index.css           # Global styles
│   │
│   ├── api/                # API layer — data fetching and client
│   │   ├── client.ts       # Fetch wrapper (apiGet)
│   │   ├── token-prices.ts # Token prices fetch + transform
│   │   └── index.ts        # Re-exports
│   │
│   ├── constant/           # App constants and config
│   │   ├── api.ts          # Endpoints, query config, query keys
│   │   ├── errors.ts       # User-facing error messages
│   │   ├── wallet.ts       # Wallet storage key, initial balances, swap delay
│   │   └── index.ts        # Re-exports
│   │
│   ├── contexts/           # React context for shared state
│   │   ├── wallet-context.ts   # Wallet state type and context
│   │   └── wallet-provider.tsx  # Wallet state, getBalance, executeSwap
│   │
│   ├── hooks/              # Custom hooks
│   │   ├── use-token-prices.ts # TanStack Query for token prices
│   │   └── use-wallet.ts       # Consumes wallet context
│   │
│   ├── components/         # Feature and shared UI
│   │   ├── common/         # Shared presentational components
│   │   │   └── token-icon.tsx
│   │   ├── swap/           # Swap form and controls
│   │   │   ├── swap-form.tsx
│   │   │   ├── amount-input.tsx
│   │   │   ├── currency-selector.tsx
│   │   │   ├── swap-button.tsx
│   │   │   └── switch-tokens-button.tsx
│   │   └── wallet/
│   │       └── wallet-card.tsx
│   │
│   ├── pages/
│   │   └── swap-page.tsx   # Main swap screen (form + wallet card)
│   │
│   ├── types/              # TypeScript types
│   │   └── index.ts        # Token, TokenPrice, WalletBalances, etc.
│   │
│   └── utils/              # Pure helpers
│       └── tokens.ts       # formatAmount, computeExchangeAmount, etc.
│
├── tsconfig.app.json       # TypeScript (with @/ path alias)
├── vite.config.ts         # Vite + @/ alias, chunk splitting
└── eslint.config.js        # ESLint
```

**Path alias:** `@/` resolves to `src/` (e.g. `@/constant`, `@/hooks/use-wallet`).

---

## Stack & Tools

| Area | Technology |
|------|------------|
| **Core** | React 19, TypeScript 5.9, Vite 7 |
| **UI** | Material-UI (MUI) v7, Emotion |
| **Data fetching** | TanStack React Query v5 |
| **Animations** | Framer Motion |
| **Feedback** | Sonner (toasts) |
| **Lint** | ESLint 9 (flat config) |

- **React** — Hooks and Context API for wallet state; no global Redux.
- **TypeScript** — Strict mode; types in `types/` and colocated where appropriate.
- **Vite** — Dev server, HMR, path alias `@/`, production build with manual chunks (MUI, Framer).
- **MUI** — Layout (Box, Stack, Grid), inputs, buttons, theme.
- **TanStack Query** — Server state for token prices (stale time 5 min, GC 10 min).
- **Sonner** — Success/error toasts for swap result and validation.

---

## Structure & Conventions

### Layers & Responsibilities

- **Pages** — Compose components and hooks; no business logic.
- **Components** — UI and user interaction; use hooks and context for data/actions.
- **Hooks** — Token prices (Query), wallet (context); reusable logic.
- **Context** — Wallet balances, `getBalance`, `executeSwap`, persistence in localStorage.
- **API** — Simple `fetch` wrapper and token-prices service; no auth (demo).
- **Constant / types / utils** — Centralised config, messages, types, and pure helpers.

### Config & Error Copy

- **`constant/`** — API URLs, query keys, query config, storage key, initial balances, swap delay, error copy.
- **`constant/errors.ts`** — User-facing strings (e.g. `ERRORS.INSUFFICIENT_BALANCE`) to keep UI and copy in one place.

### Hooks

- **`useTokenPrices`** — TanStack Query for token list and prices; uses `QUERY_KEYS.TOKEN_PRICES` and `QUERY_CONFIG`.
- **`useWallet`** — Reads wallet context (`getBalance`, `executeSwap`, `isSwapping`, `balances`, `totalUsdValue`).

### Caching & Bundle

- **Memoization** — `useMemo` for derived amounts and price maps; `useCallback` for handlers passed to children.
- **Query caching** — 5 min stale time for token prices to limit refetches.
- **Chunk splitting** — MUI and Framer Motion in separate vendor chunks in production.

### Naming & Style (kz-backoffice–aligned)

- **Kebab-case** file names (e.g. `swap-form.tsx`, `use-token-prices.ts`).
- **Path alias** `@/` for `src/` (e.g. `@/constant`, `@/types`).
- **Single `constant` folder** with re-exports from `index.ts`.
- See `PROBLEM2_VS_KZ_BACKOFFICE.md` for a detailed comparison.

---

## NPM Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Start dev server (Vite HMR) |
| `npm run build` | TypeScript check + production build |
| `npm run preview` | Serve production build locally |
| `npm run lint` | Run ESLint |

---

## Summary

- **Type safety** — Strict TypeScript and explicit types for tokens, wallet, and API.
- **Clear boundaries** — Pages → components → hooks → context/API → constants and utils.
- **Caching** — TanStack Query for token prices; localStorage for wallet balances.
- **UX** — Loading and disabled states during swap; Sonner toasts for success and errors.
- **Maintainability** — Central constants, error messages, and path alias; structure suitable to extend (e.g. more endpoints or screens).
