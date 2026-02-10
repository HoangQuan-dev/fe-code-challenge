# Problem 1 — Sum to n (Three Implementations)

Implement three functions that compute the sum of integers from `1` to `n` (inclusive).  
e.g. `sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15`.

## What Was Done

| Solution | Approach | Time | Space |
|----------|----------|------|--------|
| **A** | Gauss's formula: `n × (n + 1) / 2` | O(1) | O(1) |
| **B** | Iterative `for` loop | O(n) | O(1) |
| **C** | Tail recursion | O(n) | O(1) with TCO, O(n) without |

- **Correctness:** All three are tested against the same expectations (0, 1, 5, 10, 100, 1000).
- **Performance:** A small benchmark compares average execution time per call for `n = 10, 100, 500, 1000, 5000`.

## How to Run

From the **repo root**:

```bash
npx tsx src/problem1/index.ts
```

From this directory:

```bash
npx tsx index.ts
```

## Sample Result

Correctness tests plus a performance benchmark (example output):

```
=== Correctness Tests ===

  All 18 assertions passed.

=== Performance Benchmark ===

┌─────────┬──────┬─────────────────┬─────────────────┬─────────────────┬──────────────┬──────────────┐
│ (index) │ n    │ sum_to_n_a (ms) │ sum_to_n_b (ms) │ sum_to_n_c (ms) │ fastest      │ slowest      │
├─────────┼──────┼─────────────────┼─────────────────┼─────────────────┼──────────────┼──────────────┤
│ 0       │ 10   │ 0.000082        │ 0.000139        │ 0.000327        │ 'sum_to_n_a' │ 'sum_to_n_c' │
│ 1       │ 100  │ 0.000041        │ 0.001196        │ 0.001542        │ 'sum_to_n_a' │ 'sum_to_n_c' │
│ 2       │ 500  │ 0.000041        │ 0.001907        │ 0.004112        │ 'sum_to_n_a' │ 'sum_to_n_c' │
│ 3       │ 1000 │ 0.000041        │ 0.000568        │ 0.007067        │ 'sum_to_n_a' │ 'sum_to_n_c' │
│ 4       │ 5000 │ 0.000045        │ 0.002901        │ 0.037928        │ 'sum_to_n_a' │ 'sum_to_n_c' │
└─────────┴──────┴─────────────────┴─────────────────┴─────────────────┴──────────────┴──────────────┘
```

**Takeaway:** Solution A (Gauss) is consistently fastest; C (recursion) is slowest and, without TCO, can stack-overflow for large `n`.
