import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Info, Eye, EyeOff } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { PolynomialGraph } from "./PolynomialGraph";
import { 
  legendrePolynomial, 
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
  const [showFullMatrices, setShowFullMatrices] = useState(true);

  const handleCalculation = async () => {
    const n = parseInt(order);
    if (isNaN(n) || n < 1) {
      toast.error("Please enter a valid positive number");
      return;
    }

    if (n > 500) {
      toast("Large computation", {
        description: "This may take a while for n > 500",
      });
    }

    setLoading(true);
    try {
      // A: Legendre Polynomial
      const polynomial = legendrePolynomial(n);
      
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
      toast.error("Calculation failed. Try a smaller order if the error persists.");
    } finally {
      setLoading(false);
    }
  };

  const formatMatrix = (matrix: number[][], precision = 4): string => {
    return matrix.map(row => 
      "[" + row.map(x => x.toFixed(precision).padStart(10)).join(" ") + "]"
    ).join("\n");
  };

  const formatArray = (arr: number[], precision = 6) => {
    return arr.map(x => x.toFixed(precision)).join(", ");
  };

  return (
    <div className="space-y-6">
      {/* Polynomial Table and Graph */}
      <PolynomialGraph maxN={10} />
      
      {/* Theory Section */}
      <Card className="glass-effect border-primary/30 shadow-glow">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-5 h-5 text-primary" />
            <CardTitle className="text-2xl">Legendre Polynomial Theory</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed">
          <div>
            <h4 className="font-semibold text-primary mb-2">Definition & Properties</h4>
            <p className="text-muted-foreground mb-3">
              <span className="text-foreground font-semibold">Legendre polynomials</span> are solutions to Legendre's 
              differential equation and form an orthogonal polynomial sequence. They are crucial in physics, particularly 
              in solving problems with spherical symmetry.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <h4 className="font-semibold text-primary mb-2">Recurrence Relation</h4>
              <div className="font-mono text-xs space-y-1 text-muted-foreground">
                <p>P₀(x) = 1</p>
                <p>P₁(x) = x</p>
                <p className="text-foreground">(n+1)Pₙ₊₁(x) = (2n+1)xPₙ(x) - nPₙ₋₁(x)</p>
              </div>
            </div>

          </div>

          <div className="p-4 rounded-lg bg-secondary/5 border border-secondary/20">
            <h4 className="font-semibold text-secondary mb-2">Companion Matrix Method</h4>
            <p className="text-muted-foreground text-xs">
              The companion matrix is a special matrix whose eigenvalues are the roots of a polynomial. 
              For a monic polynomial p(x) = xⁿ + aₙ₋₁xⁿ⁻¹ + ... + a₁x + a₀, the companion matrix has 
              1's on the superdiagonal and -aᵢ in the last row, making eigenvalue computation equivalent 
              to root finding.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Input Card */}
      <Card className="glass-effect border-accent/20 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-accent">Comprehensive Polynomial Analysis</CardTitle>
          <CardDescription className="text-xs">
            Complete analysis including polynomial generation, matrix operations, LU decomposition, 
            root finding, and Newton-Raphson refinement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="order" className="text-sm">Polynomial Order (any positive integer)</Label>
            <Input
              id="order"
              type="number"
              placeholder="e.g., 10, 50, 100, or even 1000"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              min="1"
              className="glass-effect border-accent/30 font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Note: Orders above 100 may take longer to compute. Orders above 500 may take significantly longer.
            </p>
          </div>
          <Button
            onClick={handleCalculation}
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary via-accent to-secondary hover:opacity-90 font-semibold"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Computing..." : "Calculate All Problems (A-E)"}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {results && (
        <Tabs defaultValue="A" className="w-full animate-in fade-in slide-in-from-bottom">
          <TabsList className="w-full justify-start gap-2 overflow-x-auto sticky top-0 z-20 glass-effect border border-border/40 backdrop-blur-xl bg-background/95 py-6 mb-4">
            <TabsTrigger value="A" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">2A. Polynomial</TabsTrigger>
            <TabsTrigger value="B" className="data-[state=active]:bg-accent/20 data-[state=active]:text-accent">2B. Companion Matrix</TabsTrigger>
            <TabsTrigger value="C" className="data-[state=active]:bg-secondary/20 data-[state=active]:text-secondary">2C. Roots via LU</TabsTrigger>
            <TabsTrigger value="D" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">2D. Solve Ax=b</TabsTrigger>
            <TabsTrigger value="E" className="data-[state=active]:bg-accent/20 data-[state=active]:text-accent">2E. Extreme Roots</TabsTrigger>
          </TabsList>

          <TabsContent value="A" className="space-y-4">
            <Card className="glass-effect border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg text-primary">A. Legendre Polynomial P_{results.order}(x)</CardTitle>
                <CardDescription className="text-xs">
                  Polynomial coefficients from highest to lowest degree
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 glass-effect rounded-lg font-mono text-xs overflow-x-auto border border-primary/20">
                  <div className="whitespace-pre-wrap break-all">
                    {results.polynomial.map((coef: number, idx: number) => {
                      const power = results.order - idx;
                      return (
                        <span key={idx} className="inline-block mr-4 mb-2">
                          {coef >= 0 && idx > 0 ? "+ " : ""}
                          <span className="text-primary font-semibold">{coef.toFixed(6)}</span>
                          {power > 0 && <span className="text-muted-foreground">x^{power}</span>}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Total coefficients: {results.polynomial.length}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="B" className="space-y-4">
            <Card className="glass-effect border-accent/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg text-accent">B. Companion Matrix</CardTitle>
                    <CardDescription className="text-xs">
                      {results.order}×{results.order} matrix with eigenvalues equal to polynomial roots
                    </CardDescription>
                  </div>
                  {results.order > 10 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFullMatrices(!showFullMatrices)}
                      className="text-xs"
                    >
                      {showFullMatrices ? (
                        <>
                          <EyeOff className="w-4 h-4 mr-1" /> Hide Full Matrix
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-1" /> Show Full Matrix
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="p-4 glass-effect rounded-lg font-mono text-xs overflow-auto max-h-[60vh] border border-accent/20">
                  <pre className="whitespace-pre">
                    {showFullMatrices || results.order <= 10
                      ? formatMatrix(results.companion)
                      : `Matrix size: ${results.order}×${results.order}\n\nFirst 5x5 block:\n${formatMatrix(results.companion.slice(0, 5).map((row: number[]) => row.slice(0, 5)))}\n\n...\n\n(Use "Show Full Matrix" button to view entire matrix)`
                    }
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="C" className="space-y-4">
            <Card className="glass-effect border-secondary/20">
              <CardHeader>
                <CardTitle className="text-lg text-secondary">C. Roots via LU Decomposition</CardTitle>
                <CardDescription className="text-xs">
                  Eigenvalues of the companion matrix (polynomial roots)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold mb-2 text-sm text-secondary">All Roots ({results.eigenvalues.length}):</p>
                  <div className="p-4 glass-effect rounded-lg font-mono text-xs overflow-x-auto border border-secondary/20">
                    {results.eigenvalues.length <= 20 ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {results.eigenvalues.map((val: number, idx: number) => (
                          <div key={idx} className="p-2 rounded bg-secondary/10 text-center">
                            {val.toFixed(6)}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap break-all">
                        {formatArray(results.eigenvalues)}
                      </div>
                    )}
                  </div>
                </div>

                {showFullMatrices && (
                  <>
                    <div>
                      <p className="font-semibold mb-2 text-sm">L Matrix (Lower Triangular):</p>
                      <div className="p-4 glass-effect rounded-lg font-mono text-xs overflow-auto max-h-64 border border-border/20">
                        <pre>{formatMatrix(results.L)}</pre>
                      </div>
                    </div>

                    <div>
                      <p className="font-semibold mb-2 text-sm">U Matrix (Upper Triangular):</p>
                      <div className="p-4 glass-effect rounded-lg font-mono text-xs overflow-auto max-h-64 border border-border/20">
                        <pre>{formatMatrix(results.U)}</pre>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="D" className="space-y-4">
            <Card className="glass-effect border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg text-primary">D. Solution of Ax = b</CardTitle>
                <CardDescription className="text-xs">
                  Where A is the companion matrix and b = [1, 2, 3, ..., n]
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 glass-effect rounded-lg font-mono text-xs overflow-x-auto border border-primary/20">
                  {results.x.length <= 20 ? (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {results.x.map((val: number, idx: number) => (
                        <div key={idx} className="p-2 rounded bg-primary/10">
                          <span className="text-muted-foreground">x[{idx}] = </span>
                          <span className="text-primary font-semibold">{val.toFixed(6)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap break-all">
                      x = [{formatArray(results.x)}]
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="E" className="space-y-4">
            <Card className="glass-effect border-accent/20 shadow-glow-accent">
              <CardHeader>
                <CardTitle className="text-lg text-accent">E. Extreme Roots (Newton-Raphson Method)</CardTitle>
                <CardDescription className="text-xs">
                  Refined calculation of smallest and largest roots using iterative root-finding
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-6 rounded-xl glass-effect border-2 border-secondary/30">
                    <p className="text-xs text-muted-foreground mb-2">Smallest Root</p>
                    <p className="font-mono text-3xl font-bold text-secondary">
                      {results.smallest.toFixed(10)}
                    </p>
                  </div>
                  <div className="p-6 rounded-xl glass-effect border-2 border-primary/30">
                    <p className="text-xs text-muted-foreground mb-2">Largest Root</p>
                    <p className="font-mono text-3xl font-bold text-primary">
                      {results.largest.toFixed(10)}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 p-4 rounded-lg bg-muted/20 border border-border/50 text-xs text-muted-foreground">
                  <p className="font-semibold text-foreground mb-1">Newton-Raphson Formula:</p>
                  <p className="font-mono">xₙ₊₁ = xₙ - f(xₙ)/f'(xₙ)</p>
                  <p className="mt-2">
                    Starting from eigenvalue estimates, this iterative method refines the roots to high precision 
                    by using the polynomial and its derivative.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
