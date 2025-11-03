import { useState } from "react";
import { HarshadCalculator } from "@/components/HarshadCalculator";
import { PolynomialCalculator } from "@/components/PolynomialCalculator";
import { Calculator, Sigma } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"harshad" | "polynomial">("harshad");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-12 animate-in fade-in slide-in-from-top duration-700">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Mathematical Computation Tool
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Advanced algorithms for Harshad numbers and Legendre polynomial analysis
          </p>
        </header>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab("harshad")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === "harshad"
                ? "bg-primary text-primary-foreground shadow-lg scale-105"
                : "bg-card text-card-foreground hover:bg-muted"
            }`}
          >
            <Calculator className="w-5 h-5" />
            Harshad Numbers
          </button>
          <button
            onClick={() => setActiveTab("polynomial")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === "polynomial"
                ? "bg-primary text-primary-foreground shadow-lg scale-105"
                : "bg-card text-card-foreground hover:bg-muted"
            }`}
          >
            <Sigma className="w-5 h-5" />
            Legendre Polynomial
          </button>
        </div>

        {/* Content */}
        <div className="animate-in fade-in slide-in-from-bottom duration-500">
          {activeTab === "harshad" ? <HarshadCalculator /> : <PolynomialCalculator />}
        </div>
      </div>
    </div>
  );
};

export default Index;
