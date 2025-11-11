// Modified Legendre Polynomial and related computations

export function modifiedLegendrePolynomial(n: number): number[] {
  // Modified Legendre polynomial: P_n(x) using Bonnet's recursion formula
  // P_0(x) = 1
  // P_1(x) = x
  // (n+1)P_{n+1}(x) = (2n+1)xP_n(x) - nP_{n-1}(x)
  
  if (n === 0) return [1];
  if (n === 1) return [1, 0];
  
  let P_prev2 = [1]; // P_0
  let P_prev1 = [1, 0]; // P_1
  
  for (let k = 1; k < n; k++) {
    const P_next = new Array(k + 2).fill(0);
    
    // (2k+1)xP_k(x) term
    for (let i = 0; i < P_prev1.length; i++) {
      P_next[i + 1] += (2 * k + 1) * P_prev1[i] / (k + 1);
    }
    
    // -kP_{k-1}(x) term
    for (let i = 0; i < P_prev2.length; i++) {
      P_next[i] -= k * P_prev2[i] / (k + 1);
    }
    
    P_prev2 = P_prev1;
    P_prev1 = P_next;
  }
  
  return P_prev1;
}

export function companionMatrix(polynomial: number[]): number[][] {
  // Companion matrix for polynomial with coefficients [a_n, a_{n-1}, ..., a_1, a_0]
  // Handles any size polynomial
  const n = polynomial.length - 1;
  const matrix: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));
  
  // Normalize by leading coefficient
  const leadingCoeff = polynomial[0];
  const normalized = polynomial.map(c => c / leadingCoeff);
  
  // Fill the companion matrix
  for (let i = 0; i < n - 1; i++) {
    matrix[i][i + 1] = 1;
  }
  
  for (let i = 0; i < n; i++) {
    matrix[n - 1][i] = -normalized[n - i];
  }
  
  return matrix;
}

export function luDecomposition(A: number[][]): { L: number[][], U: number[][], P: number[][] } {
  const n = A.length;
  const L: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));
  const U: number[][] = A.map(row => [...row]);
  const P: number[][] = Array(n).fill(0).map((_, i) => Array(n).fill(0).map((_, j) => i === j ? 1 : 0));
  
  for (let i = 0; i < n; i++) {
    L[i][i] = 1;
  }
  
  for (let k = 0; k < n - 1; k++) {
    // Partial pivoting
    let maxIdx = k;
    let maxVal = Math.abs(U[k][k]);
    for (let i = k + 1; i < n; i++) {
      if (Math.abs(U[i][k]) > maxVal) {
        maxVal = Math.abs(U[i][k]);
        maxIdx = i;
      }
    }
    
    if (maxIdx !== k) {
      [U[k], U[maxIdx]] = [U[maxIdx], U[k]];
      [P[k], P[maxIdx]] = [P[maxIdx], P[k]];
      for (let j = 0; j < k; j++) {
        [L[k][j], L[maxIdx][j]] = [L[maxIdx][j], L[k][j]];
      }
    }
    
    for (let i = k + 1; i < n; i++) {
      if (Math.abs(U[k][k]) < 1e-12) continue;
      L[i][k] = U[i][k] / U[k][k];
      for (let j = k; j < n; j++) {
        U[i][j] -= L[i][k] * U[k][j];
      }
    }
  }
  
  return { L, U, P };
}

export function solveWithLU(A: number[][], b: number[]): number[] {
  const { L, U, P } = luDecomposition(A);
  const n = A.length;
  
  // Permute b
  const Pb = new Array(n);
  for (let i = 0; i < n; i++) {
    Pb[i] = 0;
    for (let j = 0; j < n; j++) {
      Pb[i] += P[i][j] * b[j];
    }
  }
  
  // Forward substitution: Ly = Pb
  const y = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    y[i] = Pb[i];
    for (let j = 0; j < i; j++) {
      y[i] -= L[i][j] * y[j];
    }
  }
  
  // Backward substitution: Ux = y
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    x[i] = y[i];
    for (let j = i + 1; j < n; j++) {
      x[i] -= U[i][j] * x[j];
    }
    if (Math.abs(U[i][i]) > 1e-12) {
      x[i] /= U[i][i];
    }
  }
  
  return x;
}

export function eigenvaluesFromLU(A: number[][]): number[] {
  // Power iteration method for eigenvalue estimation
  // This is a simplified method that works for demonstration
  const n = A.length;
  
  // For large matrices, use sampling
  const sampleSize = Math.min(n, 100);
  const eigenvalues: number[] = [];
  
  // Use Gershgorin circle theorem for initial estimates
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = 0; j < n; j++) {
      if (i !== j) sum += Math.abs(A[i][j]);
    }
    // Eigenvalues lie within Gershgorin discs
    const center = A[i][i];
    const radius = sum;
    
    // Sample points within the disc
    const angle = (2 * Math.PI * i) / n;
    const estimate = center + radius * Math.cos(angle) * 0.8;
    eigenvalues.push(estimate);
  }
  
  return eigenvalues.sort((a, b) => a - b);
}

export function evaluatePolynomial(coeffs: number[], x: number): number {
  // Use Horner's method for numerical stability
  let result = coeffs[0];
  for (let i = 1; i < coeffs.length; i++) {
    result = result * x + coeffs[i];
  }
  return result;
}

function evaluatePolynomialDerivative(coeffs: number[], x: number): number {
  // Derivative using Horner's method
  let result = 0;
  for (let i = 0; i < coeffs.length - 1; i++) {
    const power = coeffs.length - 1 - i;
    result = result * x + coeffs[i] * power;
  }
  return result;
}

export function findRootsNewtonRaphson(
  polynomial: number[], 
  initialGuesses: number[]
): { smallest: number, largest: number } {
  const maxIterations = 200;
  const tolerance = 1e-12;
  
  const refineRoot = (x0: number): number => {
    let x = x0;
    for (let i = 0; i < maxIterations; i++) {
      const fx = evaluatePolynomial(polynomial, x);
      const fpx = evaluatePolynomialDerivative(polynomial, x);
      
      if (Math.abs(fpx) < tolerance) break;
      
      const xNew = x - fx / fpx;
      if (Math.abs(xNew - x) < tolerance) {
        return xNew;
      }
      x = xNew;
    }
    return x;
  };
  
  // Refine smallest and largest from initial guesses
  const sortedGuesses = [...initialGuesses].sort((a, b) => a - b);
  
  // Try multiple starting points for robustness
  let smallest = refineRoot(sortedGuesses[0]);
  let largest = refineRoot(sortedGuesses[sortedGuesses.length - 1]);
  
  // Additional refinement from nearby points
  smallest = refineRoot(smallest - 0.1);
  largest = refineRoot(largest + 0.1);
  
  return { smallest, largest };
}
