import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { modifiedLegendrePolynomial, evaluatePolynomial } from "@/lib/polynomial";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface PolynomialGraphProps {
  maxN?: number;
}

const COLORS = [
  "#3b82f6", // blue
  "#22c55e", // green
  "#a855f7", // purple
  "#f97316", // orange
  "#ef4444", // red
  "#8b5cf6", // violet
];

export const PolynomialGraph = ({ maxN = 5 }: PolynomialGraphProps) => {
  // Generate data points for x from -1 to 1
  const xValues = [];
  for (let x = -1; x <= 1; x += 0.02) {
    xValues.push(x);
  }

  // Generate polynomial data
  const polynomials: Array<{ n: number; coeffs: number[]; expression: string }> = [];
  
  for (let n = 0; n <= maxN; n++) {
    const coeffs = modifiedLegendrePolynomial(n);
    const expression = formatPolynomialExpression(coeffs, n);
    polynomials.push({ n, coeffs, expression });
  }

  // Prepare chart data
  const chartData = xValues.map(x => {
    const dataPoint: any = { x: parseFloat(x.toFixed(2)) };
    
    polynomials.forEach(({ n, coeffs }) => {
      dataPoint[`P${n}`] = evaluatePolynomial(coeffs, x);
    });
    
    return dataPoint;
  });

  return (
    <div className="space-y-6">
      {/* Polynomial Table */}
      <Card className="glass-effect border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg text-primary">Modified Legendre Polynomials</CardTitle>
          <CardDescription className="text-xs">
            Mathematical expressions for P_n(x) from n = 0 to {maxN}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-20 text-center font-semibold">n</TableHead>
                  <TableHead className="font-semibold">P<sub>n</sub>(x)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {polynomials.map(({ n, expression }) => (
                  <TableRow key={n}>
                    <TableCell className="text-center font-mono font-semibold">{n}</TableCell>
                    <TableCell className="font-mono text-sm">{expression}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Graph */}
      <Card className="glass-effect border-accent/20">
        <CardHeader>
          <CardTitle className="text-lg text-accent">Polynomial Graphs</CardTitle>
          <CardDescription className="text-xs">
            Visualization of polynomials from n = 0 to {maxN} over the interval [-1, 1]
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="x" 
                stroke="hsl(var(--muted-foreground))"
                label={{ value: 'x', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                label={{ value: 'P(x)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              {polynomials.map(({ n }, idx) => (
                <Line
                  key={n}
                  type="monotone"
                  dataKey={`P${n}`}
                  stroke={COLORS[idx % COLORS.length]}
                  strokeWidth={2}
                  dot={false}
                  name={`P₍${n}₎`}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

function formatPolynomialExpression(coefficients: number[], n: number): string {
  if (n === 0) return "1";
  if (n === 1) return "x";
  
  // For display purposes, build a simplified expression
  const reversed = [...coefficients].reverse();
  const terms: string[] = [];
  
  for (let i = reversed.length - 1; i >= 0; i--) {
    const coeff = reversed[i];
    const power = i;
    
    if (Math.abs(coeff) < 1e-10) continue;
    
    let term = "";
    const absCoeff = Math.abs(coeff);
    const sign = coeff >= 0 ? "+" : "-";
    
    if (power === 0) {
      term = `${sign} ${absCoeff.toFixed(0)}`;
    } else {
      const fracStr = formatAsFraction(absCoeff);
      if (fracStr === "1") {
        term = sign;
      } else {
        term = `${sign} ${fracStr}`;
      }
      
      if (power === 1) {
        term += "x";
      } else {
        term += `x^${power}`;
      }
    }
    
    terms.push(term);
  }
  
  let result = terms.join(" ");
  result = result.trim();
  
  if (result.startsWith("+")) {
    result = result.substring(1).trim();
  }
  
  return result || "0";
}

function formatAsFraction(value: number): string {
  const tolerance = 1e-6;
  
  // Check powers of 2 denominators
  for (let denom = 2; denom <= 256; denom *= 2) {
    for (let numer = 1; numer < denom * 100; numer++) {
      if (Math.abs(value - numer / denom) < tolerance) {
        if (numer === denom) return "1";
        return `(${numer}/${denom})`;
      }
    }
  }
  
  // Check if it's 1
  if (Math.abs(value - 1) < tolerance) return "1";
  
  return value.toFixed(4);
}
