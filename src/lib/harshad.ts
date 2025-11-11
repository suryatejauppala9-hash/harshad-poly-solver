// Harshad number utilities

export function isHarshad(n: number): boolean {
  const digitSum = n.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  return n % digitSum === 0;
}

export function factorial(n: number): bigint {
  if (n <= 1) return BigInt(1);
  let result = BigInt(1);
  for (let i = 2; i <= n; i++) {
    result *= BigInt(i);
  }
  return result;
}

export function digitSumBigInt(n: bigint): number {
  return n.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
}

export function isHarshadFactorial(n: number): boolean {
  const fact = factorial(n);
  const digitSum = digitSumBigInt(fact);
  // For very large numbers, we check divisibility
  return fact % BigInt(digitSum) === BigInt(0);
}

export async function findNthNonHarshadFactorial(n: number): Promise<{
  factorialNumber: number;
  value: string;
  digitSum: number;
  isHarshad: boolean;
}> {
  let count = 0;
  let i = 1;
  let fact = BigInt(1);
  const yieldEvery = 25;

  while (count < n) {
    fact *= BigInt(i);
    const digitSum = digitSumBigInt(fact);
    const harshad = digitSum !== 0 && fact % BigInt(digitSum) === BigInt(0);

    if (!harshad) {
      count++;
      if (count === n) {
        return {
          factorialNumber: i,
          value: fact.toString(),
          digitSum,
          isHarshad: harshad,
        };
      }
    }

    i++;
    if (i % yieldEvery === 0) {
      await new Promise<void>((resolve) => setTimeout(resolve, 0));
    }

    if (i > 100000 && count < n) {
      throw new Error("Search limit reached");
    }
  }

  throw new Error("Not found");
}

export async function findConsecutiveHarshads(n: number): Promise<number[]> {
  const result: number[] = [];
  let consecutive = 0;
  let current = 1;

  const batchSize = 10000;
  let iterations = 0;
  const maxSearch = 10000000; // safety cap; correctness over speed

  const sumDigits = (x: number): number => x.toString().split("").reduce((s, d) => s + Number(d), 0);

  while (current <= maxSearch) {
    const ds = sumDigits(current);
    if (ds !== 0 && current % ds === 0) {
      result.push(current);
      consecutive++;
      if (consecutive === n) return result;
    } else {
      // reset window
      result.length = 0;
      consecutive = 0;
    }

    current++;
    iterations++;

    if (iterations % batchSize === 0) {
      // keep UI responsive
      await new Promise<void>((resolve) => setTimeout(resolve, 0));
    }
  }

  if (result.length > 0) return result;
  throw new Error(`Could not find ${n} consecutive Harshad numbers within search limit`);
}
