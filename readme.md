# 99Tech Code Challenge

This repository contains solutions for the 99Tech code challenge: three problems implemented in TypeScript/React.

---

## Problems Overview

| Problem | Description | Location |
|--------|-------------|----------|
| **Problem 1** | Three ways to sum from 1 to n (Gauss, loop, recursion) with correctness tests and a performance benchmark | [`src/problem1/`](src/problem1/) |
| **Problem 2** | Currency swap form — single-user wallet, real-time conversion, validation, localStorage persistence | [`src/problem2/`](src/problem2/) |
| **Problem 3** | Code review & refactor of a React WalletPage — type safety, filter/sort logic, hooks, and structure | [`src/problem3/`](src/problem3/) |

---

## Quick Start

### Problem 1 (CLI)

From the repo root:

```bash
npx tsx src/problem1/index.ts
```

Runs correctness tests and a performance benchmark. See [src/problem1/README.md](src/problem1/README.md) for details and sample output.

### Problem 2 (Web app)

```bash
cd src/problem2
npm install
npm run dev
```

Open the URL shown (e.g. http://localhost:5173). See [src/problem2/README.md](src/problem2/README.md) for structure, stack, and scripts.

### Problem 3 (Code only)

No runnable app. The folder contains:

- **`wallet-page.original.tsx`** — Supplied code with issues.
- **`wallet-page.refactored.tsx`** — Refactored version with all fixes applied.
- **`PROBLEMS.md`** — List of issues (type safety, logic, React, design) and how they were fixed.