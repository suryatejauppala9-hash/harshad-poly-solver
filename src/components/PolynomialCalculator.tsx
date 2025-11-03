import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { 
  modifiedLegendrePolynomial, 
  companionMatrix, 
  luDecomposition,
  solveWithLU,
  findRootsNewtonRaphson,
  eigenvaluesFromLU
} from "@/lib/polynomial";

export const PolynomialCalculator = () => {
  const [order, setOrder] = useState("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["a", "e"]));

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const handleCalculation = async () => {
    const n = parseInt(order);
    if (isNaN(n) || n < 1 || n > 100) {
      toast.error("Please enter a number between 1 and 100");
      return;
    }

    setLoading(true);
    try {
      // A: Modified Legendre Polynomial
      const polynomial = modifiedLegendrePolynomial(n);
      
      // B: Companion Matrix
      const companion = companionMatrix(polynomial);
      
      // C: Eigenvalues (roots) using LU decomposition
      const { L, U, P } = luDecomposition(companion);
      const eigenvalues = eigenvaluesFromLU(companion);
      
      // D: Solve Ax=b where b = [1,2,3,...,n]
      const b = Array.from({ length: n }, (_, i) => i + 1);
      const x = solveWithLU(companion, b);
      
      // E: Newton-Raphson for smallest and largest roots
      const { smallest, largest } = findRootsNewtonRaphson(polynomial, eigenvalues);

      setResults({
        order: n,
        polynomial,
        companion,
        L,
        U,
        P,
        eigenvalues,
        x,
        smallest,
        largest
      });

      toast.success("All calculations completed!");
    } catch (error) {
      console.error(error);
      toast.error("Calculation failed. Try a smaller order.");
    } finally {
      setLoading(false);
    }
  };

  const formatArray = (arr: number[], precision = 4) => {
    if (arr.length <= 10) {
      return arr.map(x => x.toFixed(precision)).join(", ");
    }
    return `[${arr[0].toFixed(precision)}, ${arr[1].toFixed(precision)}, ..., ${arr[arr.length-1].toFixed(precision)}]`;
  };

  const formatMatrix = (matrix: number[][], precision = 4) => {
    if (matrix.length <= 5) {
      return matrix.map(row => 
        "[" + row.map(x => x.toFixed(precision).padStart(8)).join(" ") + "]"
      ).join("\n");
    }
    return `${matrix.length}×${matrix[0].length} matrix (too large to display)`;
  };

  return (
    <div className="space-y-6">
      {/* Input Card */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Legendre Polynomial Analysis</CardTitle>
          <CardDescription>
            Comprehensive analysis of modified Legendre polynomials
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="order">Polynomial Order (1-100)</Label>
            <Input
              id="order"
              type="number"
              placeholder="e.g., 10"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              min="1"
              max="100"
            />
          </div>
          <Button
            onClick={handleCalculation}
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary via-accent to-secondary"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Calculate All Problems (A-E)
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {results && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom">
          {/* Problem A */}
          <Card className="shadow-lg">
            <CardHeader 
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => toggleSection("a")}
            >
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg text-primary">A. Modified Legendre Polynomial</CardTitle>
                  <CardDescription>Order {results.order}</CardDescription>
                </div>
                {expandedSections.has("a") ? <ChevronUp /> : <ChevronDown />}
              </div>
            </CardHeader>
            {expandedSections.has("a") && (
              <CardContent>
                <div className="p-4 bg-muted rounded-lg font-mono text-sm">
                  P(x) = {formatArray(results.polynomial, 6)}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Coefficients from highest to lowest degree
                </p>
              </CardContent>
            )}
          </Card>

          {/* Problem B */}
          <Card className="shadow-lg">
            <CardHeader 
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => toggleSection("b")}
            >
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg text-primary">B. Companion Matrix</CardTitle>
                  <CardDescription>{results.order}×{results.order} matrix</CardDescription>
                </div>
                {expandedSections.has("b") ? <ChevronUp /> : <ChevronDown />}
              </div>
            </CardHeader>
            {expandedSections.has("b") && (
              <CardContent>
                <div className="p-4 bg-muted rounded-lg font-mono text-xs overflow-x-auto whitespace-pre">
                  {formatMatrix(results.companion)}
                </div>
              </CardContent>
            )}
          </Card>

          {/* Problem C */}
          <Card className="shadow-lg">
            <CardHeader 
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => toggleSection("c")}
            >
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg text-primary">C. Roots via LU Decomposition</CardTitle>
                  <CardDescription>Eigenvalues of companion matrix</CardDescription>
                </div>
                {expandedSections.has("c") ? <ChevronUp /> : <ChevronDown />}
              </div>
            </CardHeader>
            {expandedSections.has("c") && (
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold mb-2">Roots (Eigenvalues):</p>
                  <div className="p-4 bg-muted rounded-lg font-mono text-sm">
                    {formatArray(results.eigenvalues, 6)}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Problem D */}
          <Card className="shadow-lg">
            <CardHeader 
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => toggleSection("d")}
            >
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg text-primary">D. Solution of Ax=b</CardTitle>
                  <CardDescription>Where b = [1, 2, 3, ..., n]</CardDescription>
                </div>
                {expandedSections.has("d") ? <ChevronUp /> : <ChevronDown />}
              </div>
            </CardHeader>
            {expandedSections.has("d") && (
              <CardContent>
                <div className="p-4 bg-muted rounded-lg font-mono text-sm">
                  x = {formatArray(results.x, 6)}
                </div>
              </CardContent>
            )}
          </Card>

          {/* Problem E */}
          <Card className="shadow-lg border-primary/30">
            <CardHeader 
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => toggleSection("e")}
            >
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg text-primary">E. Extreme Roots (Newton-Raphson)</CardTitle>
                  <CardDescription>Smallest and largest roots refined</CardDescription>
                </div>
                {expandedSections.has("e") ? <ChevronUp /> : <ChevronDown />}
              </div>
            </CardHeader>
            {expandedSections.has("e") && (
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-accent/10 rounded-lg">
                    <p className="font-semibold text-accent mb-2">Smallest Root:</p>
                    <p className="font-mono text-lg">{results.smallest.toFixed(8)}</p>
                  </div>
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <p className="font-semibold text-primary mb-2">Largest Root:</p>
                    <p className="font-mono text-lg">{results.largest.toFixed(8)}</p>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};
