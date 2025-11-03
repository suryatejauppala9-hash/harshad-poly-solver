import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { isHarshad, findNthNonHarshadFactorial, findConsecutiveHarshads } from "@/lib/harshad";

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
    <div className="grid md:grid-cols-2 gap-6">
      {/* Problem 1A */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Problem 1A: Non-Harshad Factorials</CardTitle>
          <CardDescription>
            Find the nth factorial that is NOT a Harshad number
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="n-factorial">Enter n</Label>
            <Input
              id="n-factorial"
              type="number"
              placeholder="e.g., 1"
              value={nFactorial}
              onChange={(e) => setNFactorial(e.target.value)}
              min="1"
            />
          </div>
          <Button
            onClick={handleFactorialCalculation}
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-primary-glow"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Calculate
          </Button>

          {factorialResult && (
            <div className="mt-6 p-4 bg-muted rounded-lg space-y-2 animate-in fade-in slide-in-from-bottom">
              <p className="font-semibold text-primary">Result:</p>
              <p className="text-sm">
                <span className="font-medium">Factorial number:</span> {factorialResult.factorialNumber}!
              </p>
              <p className="text-sm break-all">
                <span className="font-medium">Value:</span> {factorialResult.value}
              </p>
              <p className="text-sm">
                <span className="font-medium">Sum of digits:</span> {factorialResult.digitSum}
              </p>
              <p className="text-sm">
                <span className="font-medium">Is Harshad?</span> {factorialResult.isHarshad ? "Yes" : "No"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Problem 1B */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Problem 1B: Consecutive Harshads</CardTitle>
          <CardDescription>
            Find n consecutive Harshad numbers (max 20)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="n-consecutive">Enter n (1-20)</Label>
            <Input
              id="n-consecutive"
              type="number"
              placeholder="e.g., 10"
              value={nConsecutive}
              onChange={(e) => setNConsecutive(e.target.value)}
              min="1"
              max="20"
            />
          </div>
          <Button
            onClick={handleConsecutiveCalculation}
            disabled={loading}
            className="w-full bg-gradient-to-r from-accent to-secondary"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Find Consecutive
          </Button>

          {consecutiveResult.length > 0 && (
            <div className="mt-6 p-4 bg-muted rounded-lg animate-in fade-in slide-in-from-bottom">
              <p className="font-semibold text-primary mb-2">
                Found {consecutiveResult.length} consecutive Harshad numbers:
              </p>
              <div className="flex flex-wrap gap-2">
                {consecutiveResult.map((num, idx) => (
                  <span key={idx} className="px-3 py-1 bg-accent/20 text-accent-foreground rounded-md text-sm font-mono">
                    {num}
                  </span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Starting at: {consecutiveResult[0]}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="md:col-span-2 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">About Harshad Numbers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            A <span className="font-semibold text-foreground">Harshad number</span> (or Niven number) is a positive integer 
            that is divisible by the sum of its digits. For example, 18 is a Harshad number because 1 + 8 = 9, and 18 ÷ 9 = 2.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            <span className="font-semibold text-foreground">Why no 20+ consecutive?</span> Cooper and Kennedy proved in 1993 
            that there can be at most 20 consecutive Harshad numbers. This is because sequences longer than 20 would require 
            all remainders modulo certain primes to satisfy impossible conditions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
