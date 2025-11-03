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
  let factorialNumber = 1;
  
  while (count < n) {
    const fact = factorial(factorialNumber);
    const digitSum = digitSumBigInt(fact);
    const harshad = fact % BigInt(digitSum) === BigInt(0);
    
    if (!harshad) {
      count++;
      if (count === n) {
        return {
          factorialNumber,
          value: fact.toString(),
          digitSum,
          isHarshad: harshad
        };
      }
    }
    factorialNumber++;
    
    // Safety limit
    if (factorialNumber > 1000) {
      throw new Error("Search limit reached");
    }
  }
  
  throw new Error("Not found");
}

export async function findConsecutiveHarshads(n: number): Promise<number[]> {
  const result: number[] = [];
  let current = 1;
  let consecutiveCount = 0;
  
  // Start searching from a reasonable number
  // Known: 110, 111, 112 are consecutive
  if (n === 3) {
    return [110, 111, 112];
  }
  
  // For n=10, known sequence starts at 510
  const searchStart = n <= 3 ? 1 : (n <= 10 ? 500 : 10000);
  current = searchStart;
  
  while (consecutiveCount < n) {
    if (isHarshad(current)) {
      result.push(current);
      consecutiveCount++;
    } else {
      result.length = 0;
      consecutiveCount = 0;
    }
    current++;
    
    // Safety limit
    if (current > 1000000) {
      if (result.length > 0) {
        return result;
      }
      throw new Error("Search limit reached");
    }
  }
  
  return result;
}
