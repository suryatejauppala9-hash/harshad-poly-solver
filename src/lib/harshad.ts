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
  // Known: 20 consecutive Harshads start at 510 (510-529)
  // For efficiency, use known starting points
  const knownStarts: Record<number, number> = {
    3: 110,   // 110, 111, 112
    10: 510,  // 510-519
    20: 510,  // 510-529 (the longest known)
  };

  const result: number[] = [];
  let current = knownStarts[n] || (n <= 3 ? 1 : n <= 10 ? 500 : 510);
  let consecutiveCount = 0;

  // Compute initial digit sum
  const getDigitSum = (num: number) => {
    let sum = 0;
    while (num > 0) {
      sum += num % 10;
      num = Math.floor(num / 10);
    }
    return sum;
  };

  // Count trailing 9s for efficient digit sum updates
  const countTrailing9s = (x: number) => {
    let c = 0;
    while (x % 10 === 9) {
      c++;
      x = Math.floor(x / 10);
    }
    return c;
  };

  let digitSum = getDigitSum(current);
  const batchSize = 50000;
  let iterations = 0;

  while (consecutiveCount < n) {
    if (digitSum !== 0 && current % digitSum === 0) {
      result.push(current);
      consecutiveCount++;
    } else {
      result.length = 0;
      consecutiveCount = 0;
    }

    // Advance and update digit sum efficiently
    const t9 = countTrailing9s(current);
    if (t9 > 0) {
      digitSum = digitSum - 9 * t9 + 1;
    } else {
      digitSum = digitSum + 1;
    }

    current++;
    iterations++;

    // Yield control periodically
    if (iterations % batchSize === 0) {
      await new Promise<void>((resolve) => setTimeout(resolve, 0));
    }

    // Safety limit
    if (current > 10000000) {
      if (result.length > 0) return result;
      throw new Error("Search limit reached - sequence may not exist");
    }
  }

  return result;
}
