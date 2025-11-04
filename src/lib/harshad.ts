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
  let current = 1;
  let consecutiveCount = 0;

  // Efficient digit sum tracking
  const countTrailing9s = (x: number) => {
    let c = 0;
    while (x % 10 === 9) {
      c++;
      x = Math.floor(x / 10);
    }
    return c;
  };

  let digitSum = 1; // sum of digits of current (1)
  const batchSize = 100000;

  while (consecutiveCount < n) {
    if (current % digitSum === 0) {
      result.push(current);
      consecutiveCount++;
    } else {
      result.length = 0;
      consecutiveCount = 0;
    }

    // advance to next number and update digit sum quickly
    const t9 = countTrailing9s(current);
    if (t9 > 0) {
      digitSum = digitSum - 9 * t9 + 1;
    } else {
      digitSum = digitSum + 1;
    }

    current++;

    if (current % batchSize === 0) {
      await new Promise<void>((resolve) => setTimeout(resolve, 0));
    }

    // Very high safety limit to allow long searches
    if (current > 100000000) {
      if (result.length > 0) return result;
      throw new Error("Search limit reached");
    }
  }

  return result;
}
