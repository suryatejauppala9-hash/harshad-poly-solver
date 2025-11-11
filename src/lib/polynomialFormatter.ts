// Format polynomial coefficients into mathematical notation
export function formatPolynomialExpression(coefficients: number[], n: number): string {
  // Reverse to go from lowest to highest power
  const reversed = [...coefficients].reverse();
  
  // Build terms
  const terms: string[] = [];
  
  for (let i = reversed.length - 1; i >= 0; i--) {
    const coeff = reversed[i];
    const power = i;
    
    if (Math.abs(coeff) < 1e-10) continue; // Skip near-zero coefficients
    
    let term = "";
    
    // Handle coefficient
    const absCoeff = Math.abs(coeff);
    const sign = coeff >= 0 ? "+" : "-";
    
    if (power === 0) {
      // Constant term
      term = `${sign} ${absCoeff.toFixed(0)}`;
    } else {
      // Variable term
      if (Math.abs(absCoeff - 1) < 1e-10) {
        // Coefficient is 1 or -1
        term = sign;
      } else {
        // Format as fraction if it's a simple fraction
        const fracStr = formatAsFraction(absCoeff);
        term = `${sign} ${fracStr}`;
      }
      
      // Add variable
      if (power === 1) {
        term += "x";
      } else {
        term += `x^${power}`;
      }
    }
    
    terms.push(term);
  }
  
  // Join terms and clean up
  let result = terms.join(" ");
  result = result.trim();
  
  // Remove leading + if present
  if (result.startsWith("+")) {
    result = result.substring(1).trim();
  }
  
  return result || "0";
}

function formatAsFraction(value: number): string {
  // Check for common fractions
  const tolerance = 1e-6;
  
  // Check simple fractions up to denominator 256
  for (let denom = 2; denom <= 256; denom *= 2) {
    for (let numer = 1; numer < denom * 2; numer++) {
      if (Math.abs(value - numer / denom) < tolerance) {
        return `(${numer}/${denom})`;
      }
    }
  }
  
  // Check other common denominators
  const commonDenoms = [3, 5, 6, 7, 9, 10, 12, 15, 16, 20];
  for (const denom of commonDenoms) {
    for (let numer = 1; numer <= denom * 10; numer++) {
      if (Math.abs(value - numer / denom) < tolerance) {
        return `(${numer}/${denom})`;
      }
    }
  }
  
  // Return as decimal
  return value.toFixed(4);
}

export function generatePolynomialTable(maxN: number): Array<{ n: number; expression: string }> {
  // Import modifiedLegendrePolynomial dynamically to avoid circular dependency
  const results: Array<{ n: number; expression: string }> = [];
  
  return results;
}
