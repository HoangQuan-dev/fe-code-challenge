/**
 * Problem 1: Three ways to sum to n
 *
 * Each function computes the summation from 1 to n.
 * i.e. sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15
 *
 * Run:  npx tsx src/problem1/index.ts
 */

/**
 * Solution A — Gauss's formula (direct calculation).
 *
 * Should be the fastest — no loop, no recursion, just one arithmetic expression.
 * Uses the closed-form identity: 1 + 2 + ... + n = n × (n + 1) / 2
 *
 * Time:  O(1)
 * Space: O(1)
 *
 * @example sum_to_n_a(5)  // 15
 * @example sum_to_n_a(10) // 55
 */
function sum_to_n_a(n: number): number {
  return (n * (n + 1)) / 2;
}

/**
 * Solution B — Iterative loop.
 *
 * Easy to read, maintain, and adapt to other operations (+, -, *, etc.).
 * Expected to be slower than Gauss's formula because of the loop,
 * but uses constant space.
 *
 * Time:  O(n)
 * Space: O(1)
 *
 * @example sum_to_n_b(5)  // 15
 * @example sum_to_n_b(10) // 55
 */
function sum_to_n_b(n: number): number {
  let total = 0;
  for (let i = 1; i <= n; i++) {
    total += i;
  }
  return total;
}

/**
 * Solution C — Tail-recursive approach.
 *
 * The recursive call is the very last operation, which means engines that
 * support Tail-Call Optimisation (TCO, specified in ES2015+) can rewrite
 * this into a constant-space loop — preventing stack overflow for large n.
 *
 * Caution: most engines (V8/Node, SpiderMonkey) do NOT implement TCO yet;
 * only Safari/JavaScriptCore does. Without TCO the call stack grows
 * linearly and will overflow around n ≈ 10 000 in Node.js.
 *
 * Time:  O(n)
 * Space: O(1) with TCO · O(n) without TCO
 *
 * @example sum_to_n_c(5)  // 15
 * @example sum_to_n_c(10) // 55
 */
function sum_to_n_c(n: number): number {
  const tailSum = (current: number, accumulator: number): number => {
    if (current <= 0) return accumulator;
    return tailSum(current - 1, accumulator + current);
  };
  return tailSum(n, 0);
}

function runCorrectnessTests(): void {
  const testCases: Array<{ input: number; expected: number }> = [
    { input: 0, expected: 0 },
    { input: 1, expected: 1 },
    { input: 5, expected: 15 },
    { input: 10, expected: 55 },
    { input: 100, expected: 5050 },
    { input: 1000, expected: 500500 },
  ];

  const fns = [sum_to_n_a, sum_to_n_b, sum_to_n_c];

  console.log("=== Correctness Tests ===\n");

  let allPassed = true;

  for (const { input, expected } of testCases) {
    for (const fn of fns) {
      const result = fn(input);
      const passed = result === expected;
      if (!passed) {
        allPassed = false;
        console.log(`  FAIL  ${fn.name}(${input}) = ${result}, expected ${expected}`);
      }
    }
  }

  if (allPassed) {
    console.log(`  All ${testCases.length * fns.length} assertions passed.\n`);
  }
}

// Performance benchmark

function benchmarkFunction(
  fn: (n: number) => number,
  testInputs: number[],
  iterations: number = 100,
): Array<{ input: number; avgMs: number }> {
  return testInputs.map((input) => {
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      fn(input);
    }
    const elapsed = performance.now() - start;
    return { input, avgMs: elapsed / iterations };
  });
}

function runBenchmark(): void {
  console.log("=== Performance Benchmark ===\n");

  // If you encounter a stack overflow (maximum call stack size exceeded), try lowering the largest test input value
  const testInputs = [10, 100, 500, 1_000, 5_000];
  const fns = [sum_to_n_a, sum_to_n_b, sum_to_n_c];

  const allResults = fns.map((fn) => benchmarkFunction(fn, testInputs));

  // Build a table for console.table
  const table = testInputs.map((input, inputIdx) => {
    const row: Record<string, string | number> = { n: input };

    let fastestTime = Infinity;
    let slowestTime = -Infinity;
    let fastestName = "";
    let slowestName = "";

    fns.forEach((fn, fnIdx) => {
      const avgMs = allResults[fnIdx][inputIdx].avgMs;
      const key = `${fn.name} (ms)`;
      row[key] = +avgMs.toFixed(6);

      if (avgMs < fastestTime) {
        fastestTime = avgMs;
        fastestName = fn.name;
      }
      if (avgMs > slowestTime) {
        slowestTime = avgMs;
        slowestName = fn.name;
      }
    });

    row.fastest = fastestName;
    row.slowest = slowestName;
    return row;
  });

  console.table(table);
}

function main(): void {
  runCorrectnessTests();
  runBenchmark();
}

main();
