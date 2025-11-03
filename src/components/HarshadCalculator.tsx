import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Info, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { findNthNonHarshadFactorial, findConsecutiveHarshads } from "@/lib/harshad";

export const HarshadCalculator = () => {
  const [nFactorial, setNFactorial] = useState("");
  const [nConsecutive, setNConsecutive] = useState("");
  const [factorialResult, setFactorialResult] = useState<any>(null);
  const [consecutiveResult, setConsecutiveResult] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFactorialCalculation = async () => {
    const n = parseInt(nFactorial);
    if (isNaN(n) || n < 1) {
      toast.error("Please enter a valid positive number");
      return;
    }

    setLoading(true);
    try {
      const result = await findNthNonHarshadFactorial(n);
      setFactorialResult(result);
      toast.success("Calculation completed!");
    } catch (error) {
      toast.error("Calculation failed. Number might be too large.");
    } finally {
      setLoading(false);
    }
  };

  const handleConsecutiveCalculation = async () => {
    const n = parseInt(nConsecutive);
    if (isNaN(n) || n < 1 || n > 20) {
      toast.error("Please enter a number between 1 and 20");
      return;
    }

    setLoading(true);
    try {
      const result = await findConsecutiveHarshads(n);
      setConsecutiveResult(result);
      toast.success("Found consecutive Harshad numbers!");
    } catch (error) {
      toast.error("Calculation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Theory Section */}
      <Card className="glass-effect border-primary/30 shadow-glow">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-5 h-5 text-primary" />
            <CardTitle className="text-2xl">Harshad Number Theory</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed">
          <div>
            <h4 className="font-semibold text-primary mb-2">Definition</h4>
            <p className="text-muted-foreground">
              A <span className="text-foreground font-semibold">Harshad number</span> (also known as a Niven number) is a positive integer 
              that is divisible by the sum of its digits. The name comes from the Sanskrit <span className="italic">harṣa</span> (joy) + 
              <span className="italic">da</span> (give), literally meaning "joy-giver".
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <h4 className="font-semibold text-primary mb-2">Examples</h4>
              <ul className="space-y-1 text-muted-foreground font-mono text-xs">
                <li>• 18: (1+8=9) → 18÷9=2 ✓</li>
                <li>• 21: (2+1=3) → 21÷3=7 ✓</li>
                <li>• 24: (2+4=6) → 24÷6=4 ✓</li>
                <li>• 27: (2+7=9) → 27÷9=3 ✓</li>
              </ul>
            </div>
            
            <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
              <h4 className="font-semibold text-accent mb-2">Non-Examples</h4>
              <ul className="space-y-1 text-muted-foreground font-mono text-xs">
                <li>• 19: (1+9=10) → 19÷10=1.9 ✗</li>
                <li>• 22: (2+2=4) → 22÷4=5.5 ✗</li>
                <li>• 23: (2+3=5) → 23÷5=4.6 ✗</li>
                <li>• 25: (2+5=7) → 25÷7≈3.57 ✗</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 p-4 rounded-lg bg-secondary/5 border border-secondary/20">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-secondary mb-2">Mathematical Properties</h4>
                <ul className="space-y-2 text-muted-foreground text-xs">
                  <li>• All numbers with a digital root of 9 are Harshad numbers</li>
                  <li>• The first 14 Harshad numbers are: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 18, 20, 21</li>
                  <li>• Harshad numbers are base-dependent (what's Harshad in base-10 may not be in other bases)</li>
                  <li>• Every positive integer is a Harshad number in base 2</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calculations */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Problem 1A */}
        <Card className="glass-effect border-primary/20 shadow-lg hover:shadow-glow transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-xl text-primary">Problem 1A: Non-Harshad Factorials</CardTitle>
            <CardDescription className="text-xs">
              Find the nth factorial that is NOT a Harshad number. This explores when factorial growth 
              produces numbers whose digit sums don't divide them evenly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="n-factorial" className="text-sm">Enter n</Label>
              <Input
                id="n-factorial"
                type="number"
                placeholder="e.g., 1"
                value={nFactorial}
                onChange={(e) => setNFactorial(e.target.value)}
                min="1"
                className="glass-effect border-primary/30 font-mono"
              />
            </div>
            <Button
              onClick={handleFactorialCalculation}
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 font-semibold"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Calculate
            </Button>

            {factorialResult && (
              <div className="mt-6 p-4 glass-effect rounded-lg space-y-3 animate-in fade-in border border-primary/20">
                <p className="font-semibold text-primary text-sm">Result:</p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center p-2 rounded bg-background/50">
                    <span className="text-muted-foreground">Factorial number:</span>
                    <span className="font-mono font-semibold text-primary">{factorialResult.factorialNumber}!</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-background/50">
                    <span className="text-muted-foreground">Sum of digits:</span>
                    <span className="font-mono font-semibold">{factorialResult.digitSum}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded bg-background/50">
                    <span className="text-muted-foreground">Is Harshad?</span>
                    <span className="font-mono font-semibold text-destructive">{factorialResult.isHarshad ? "Yes" : "No"}</span>
                  </div>
                </div>
                <div className="mt-3 p-3 rounded bg-muted/30 border border-border/50">
                  <p className="text-xs text-muted-foreground mb-1">Value:</p>
                  <p className="font-mono text-xs break-all text-foreground">{factorialResult.value}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Problem 1B */}
        <Card className="glass-effect border-accent/20 shadow-lg hover:shadow-glow-accent transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-xl text-accent">Problem 1B: Consecutive Harshads</CardTitle>
            <CardDescription className="text-xs">
              Find n consecutive Harshad numbers (max 20). This demonstrates clustering patterns in the 
              distribution of Harshad numbers along the number line.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="n-consecutive" className="text-sm">Enter n (1-20)</Label>
              <Input
                id="n-consecutive"
                type="number"
                placeholder="e.g., 10"
                value={nConsecutive}
                onChange={(e) => setNConsecutive(e.target.value)}
                min="1"
                max="20"
                className="glass-effect border-accent/30 font-mono"
              />
            </div>
            <Button
              onClick={handleConsecutiveCalculation}
              disabled={loading}
              className="w-full bg-gradient-to-r from-accent to-secondary hover:opacity-90 font-semibold"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Find Consecutive
            </Button>

            {consecutiveResult.length > 0 && (
              <div className="mt-6 p-4 glass-effect rounded-lg animate-in fade-in border border-accent/20">
                <p className="font-semibold text-accent mb-3 text-sm">
                  Found {consecutiveResult.length} consecutive Harshad numbers:
                </p>
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {consecutiveResult.map((num, idx) => (
                    <div key={idx} className="px-2 py-1 bg-accent/20 rounded text-center">
                      <span className="font-mono text-xs font-semibold">{num}</span>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground p-2 rounded bg-background/50">
                  <span className="font-semibold">Starting position:</span> {consecutiveResult[0]}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bonus Information */}
      <Card className="glass-effect border-secondary/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-secondary" />
            <CardTitle className="text-lg">Why Maximum 20 Consecutive Harshad Numbers?</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-3 leading-relaxed">
          <p>
            <span className="font-semibold text-foreground">Cooper and Kennedy</span> proved in 1993 that there can be 
            at most 20 consecutive Harshad numbers in base 10.
          </p>
          <div className="p-4 rounded-lg bg-secondary/5 border border-secondary/20">
            <p className="font-semibold text-secondary mb-2">Mathematical Reasoning:</p>
            <ul className="space-y-2 text-xs">
              <li>• For a sequence of k consecutive integers starting at n, at least one must be divisible by a prime p ≤ k+1</li>
              <li>• The sum of digits changes predictably in consecutive numbers (usually by ±1, with carries affecting this)</li>
              <li>• For 21+ consecutive Harshad numbers, the constraints on divisibility by digit sums and divisibility 
                  by small primes create impossible conditions</li>
              <li>• The proof uses modular arithmetic and properties of digit sum functions to show the impossibility</li>
            </ul>
          </div>
          <p className="text-xs">
            The longest known sequence of 20 consecutive Harshad numbers starts at 
            <span className="font-mono font-semibold text-foreground"> 510 </span>
            and is believed to be the only such sequence.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
