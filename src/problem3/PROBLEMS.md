# Problem 3: Issues & Anti-Patterns Found in the Supplied Code

Issues in the original `WalletPage` (see `wallet-page.original.tsx`), with **problem** and **fix** code blocks. All fixes are applied in `wallet-page.refactored.tsx`.

---

## 1. Type Safety Problems

### 1.1 `blockchain: any`

**Problem:**

```tsx
const getPriority = (blockchain: any): number => {
  switch (blockchain) {
    case 'Osmosis':
      return 100
    // ...
  }
}
```

**Why bad:**

- Removes compile-time safety.
- Allows invalid chain names to pass silently.
- Switch is non-exhaustive; TypeScript cannot warn on missing cases.

**Fix:** Use a union type (or enum).

```tsx
type Blockchain = "Osmosis" | "Ethereum" | "Arbitrum" | "Zilliqa" | "Neo";

const getPriority = (blockchain: string): number =>
  BLOCKCHAIN_PRIORITY[blockchain] ?? DEFAULT_PRIORITY;
```

---

### 1.2 `WalletBalance` missing `blockchain`

**Problem:** Code calls `getPriority(balance.blockchain)` but the interface does not declare `blockchain`.

```tsx
interface WalletBalance {
  currency: string;
  amount: number;
}
// ...
return balances.filter((balance: WalletBalance) => {
  const balancePriority = getPriority(balance.blockchain);  // property doesn't exist on type
```

**Why bad:** Type definition does not match runtime usage; TypeScript would error (or you lose type safety if `balance` is typed loosely).

**Fix:** Add `blockchain` to the interface.

```tsx
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain;
}
```

---

## 2. Broken Filter Logic (Critical Bug)

### 2.1 Uses undefined variable

**Problem:**

```tsx
return balances.filter((balance: WalletBalance) => {
  const balancePriority = getPriority(balance.blockchain);
  if (lhsPriority > -99) {   // lhsPriority is never declared
    if (balance.amount <= 0) {
      return true;
    }
  }
  return false;
})
```

**Why bad:** `lhsPriority` is undefined. You assigned to `balancePriority` but then used the wrong name. Results in a ReferenceError or always-falsy condition.

**Fix:** Use the variable you assigned.

```tsx
const priority = getPriority(balance.blockchain);
return priority > DEFAULT_PRIORITY && balance.amount > 0;
```

---

### 2.2 Filtering logic inverted

**Problem:** Current behavior keeps balances with **valid priority AND amount <= 0**. For a wallet you almost always want **positive** balances only.

```tsx
if (lhsPriority > -99) {
  if (balance.amount <= 0) {
    return true;   // keeps zero/negative
  }
}
return false;
```

**Fix:** Keep only known blockchains and positive amounts.

```tsx
const priority = getPriority(balance.blockchain);
return priority > DEFAULT_PRIORITY && balance.amount > 0;
```

---

### 2.3 Over-complex filter nesting

**Problem:** Nested `if` with multiple `return` paths is harder to read and easy to get wrong.

```tsx
if (lhsPriority > -99) {
  if (balance.amount <= 0) {
    return true;
  }
}
return false;
```

**Fix:** Single boolean expression.

```tsx
return priority > DEFAULT_PRIORITY && balance.amount > 0;
```

---

## 3. Incorrect useMemo Dependencies

**Problem:** `prices` is in the dependency array but not used inside the memo. Causes unnecessary recalculation whenever `prices` changes.

```tsx
const sortedBalances = useMemo(() => {
  return balances.filter((balance: WalletBalance) => {
    // ... filter uses only balance, getPriority
  }).sort(/* ... */);
}, [balances, prices]);   // prices not used inside
```

**Fix:** Depend only on what you use.

```tsx
}, [balances]);
```

---

## 4. Sort Comparator Is Invalid

**Problem:** When `leftPriority === rightPriority`, the comparator returns `undefined`. `Array.prototype.sort` expects a number; missing return leads to unstable sort.

```tsx
.sort((lhs: WalletBalance, rhs: WalletBalance) => {
  const leftPriority = getPriority(lhs.blockchain);
  const rightPriority = getPriority(rhs.blockchain);
  if (leftPriority > rightPriority) {
    return -1;
  } else if (rightPriority > leftPriority) {
    return 1;
  }
  // no return 0
});
```

**Fix:** Always return a number (e.g. descending by priority).

```tsx
.sort((lhs, rhs) => {
  return getPriority(rhs.blockchain) - getPriority(lhs.blockchain);
});
```

---

## 5. Double Iteration + Unused Computation

### 5.1 `formattedBalances` computed but never used

**Problem:** You build `formattedBalances` then never use it. Waste of CPU and memory.

```tsx
const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
  return {
    ...balance,
    formatted: balance.amount.toFixed()
  }
})

const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
  // rows comes from sortedBalances, not formattedBalances
  formattedAmount={balance.formatted}   // so .formatted is undefined
```

**Fix:** Use `formattedBalances` for building rows (and memoise it).

```tsx
const formattedBalances: FormattedWalletBalance[] = useMemo(() => {
  return sortedBalances.map((balance) => ({
    ...balance,
    formatted: balance.amount.toFixed(2),
  }));
}, [sortedBalances]);

const rows = useMemo(() => {
  return formattedBalances.map((balance) => { /* ... */ });
}, [formattedBalances, prices]);
```

---

### 5.2 Two separate maps instead of one logical pass

**Problem:** One map creates `formattedBalances`, another builds `rows` from `sortedBalances`. Could be a single flow: filter/sort -> format -> rows, with each step memoised as needed.

**Fix:** Keep two steps for clarity (sorted -> formatted -> rows) but use `formattedBalances` for rows and memoise both.

---

## 6. Wrong Types in Rows Mapping

**Problem:** You map over `sortedBalances` (type `WalletBalance[]`) but type the callback parameter as `FormattedWalletBalance` and use `balance.formatted`. Runtime type mismatch — `sortedBalances` items have no `formatted`, so it’s undefined.

```tsx
const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
  const usdValue = prices[balance.currency] * balance.amount;
  return (
    <WalletRow
      formattedAmount={balance.formatted}   // undefined
      // ...
    />
  );
});
```

**Fix:** Map over `formattedBalances` (which has `formatted`).

```tsx
const rows = useMemo(() => {
  return formattedBalances.map((balance) => {
    const usdValue = (prices[balance.currency] ?? 0) * balance.amount;
    return (
      <WalletRow
        formattedAmount={balance.formatted}
        key={balance.currency}
        // ...
      />
    );
  });
}, [formattedBalances, prices]);
```

---

## 7. React Anti-Patterns

### 7.1 Using index as key

**Problem:** `key={index}` causes reconciliation bugs when the list is filtered or reordered.

```tsx
const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
  return (
    <WalletRow
      key={index}
      // ...
    />
  );
});
```

**Fix:** Use a stable identity: e.g. `currency`, or `blockchain + currency` if needed.

```tsx
key={balance.currency}
```

---

### 7.2 Recreating `getPriority` each render

**Problem:** `getPriority` is defined inside the component, so a new function is created on every render and called many times in filter/sort.

```tsx
const WalletPage: React.FC<Props> = (props: Props) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  const getPriority = (blockchain: any): number => { /* switch */ };

  const sortedBalances = useMemo(() => {
    return balances.filter((b) => getPriority(b.blockchain) /* ... */).sort(/* ... */);
  }, [balances, prices]);
```

**Fix:** Move lookup outside the component; use a constant map.

```tsx
const BLOCKCHAIN_PRIORITY: Record<string, number> = { /* ... */ };
const getPriority = (blockchain: string): number =>
  BLOCKCHAIN_PRIORITY[blockchain] ?? DEFAULT_PRIORITY;

const WalletPage: React.FC<BoxProps> = ({ children, ...rest }) => {
  // ...
};
```

---

### 7.3 Destructured but unused

**Problem:** `children` is destructured from `props` but never used.

```tsx
const { children, ...rest } = props;
// children unused
return <div {...rest}>{rows}</div>;
```

**Fix:** Omit from destructuring if not needed, or use `children` in the JSX. No functional bug, but avoids unused variable warnings.

```tsx
const WalletPage: React.FC<BoxProps> = ({ ...rest }) => {
  // or: ({ children, ...rest }) and render {children} if required
```

---

## 8. Potential Runtime Risk

**Problem:** If `prices[balance.currency]` is undefined, the expression yields `NaN`.

```tsx
const usdValue = prices[balance.currency] * balance.amount;
```

**Fix:** Provide a default so the product is always a number.

```tsx
const usdValue = (prices[balance.currency] ?? 0) * balance.amount;
```

---

## 9. Minor Design Smells

### 9.1 Magic numbers for priority

**Problem:** Raw numbers (100, 50, 30, 20, -99) with no named constants make intent and future changes harder.

**Fix:** Use a named constant map and `DEFAULT_PRIORITY`.

```tsx
const BLOCKCHAIN_PRIORITY: Record<string, number> = {
  Osmosis: 100,
  Ethereum: 50,
  // ...
};
const DEFAULT_PRIORITY = -99;
```

---

### 9.2 No default decimals in `toFixed()`

**Problem:** `balance.amount.toFixed()` with no argument can be unclear; explicitly passing decimals improves consistency (e.g. 2 for currency).

```tsx
formatted: balance.amount.toFixed()
```

**Fix:**

```tsx
formatted: balance.amount.toFixed(2)
```

---

### 9.3 FormattedWalletBalance duplicates WalletBalance

**Problem:** `FormattedWalletBalance` re-declares `currency` and `amount` instead of extending `WalletBalance` (DRY violation).

```tsx
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}
```

**Fix:**

```tsx
interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}
```

---

### 9.4 Redundant Props interface

**Problem:** `interface Props extends BoxProps {}` adds no fields.

**Fix:** Use `BoxProps` directly: `React.FC<BoxProps>`.

---

## Summary table

| #   | Category     | Issue |
|-----|--------------|--------|
| 1.1 | Type safety  | `blockchain: any` |
| 1.2 | Type safety  | `WalletBalance` missing `blockchain` |
| 2.1 | Filter bug   | Undefined variable `lhsPriority` (should be `balancePriority`) |
| 2.2 | Filter bug   | Inverted logic — keeps amount <= 0 instead of > 0 |
| 2.3 | Filter       | Over-complex nested ifs |
| 3   | useMemo      | `prices` in deps but unused |
| 4   | Sort         | Comparator missing return 0 for equal case |
| 5.1 | Logic        | `formattedBalances` computed but never used |
| 5.2 | Logic        | Double iteration; could use single flow |
| 6   | Types        | Rows map over `sortedBalances` but use `FormattedWalletBalance` / `.formatted` |
| 7.1 | React        | Using index as key |
| 7.2 | React        | `getPriority` recreated each render |
| 7.3 | React        | `children` destructured but unused |
| 8   | Runtime      | Unsafe price lookup -> NaN |
| 9.1 | Design       | Magic numbers for priority |
| 9.2 | Design       | No decimals in `toFixed()` |
| 9.3 | Design       | `FormattedWalletBalance` duplicates `WalletBalance` |
| 9.4 | Design       | Redundant `Props` interface |

All of these are addressed in `wallet-page.refactored.tsx`.
