import { useState } from "react";
import { HarshadCalculator } from "@/components/HarshadCalculator";
import { PolynomialCalculator } from "@/components/PolynomialCalculator";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Calculator, Sigma, GraduationCap } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"harshad" | "polynomial">("harshad");

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab("harshad")}
            className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "harshad"
                ? "glass-effect border-2 border-primary shadow-glow text-primary scale-105"
                : "glass-effect border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/50"
            }`}
          >
            <Calculator className="w-5 h-5" />
            <span>Problem 1: Harshad Numbers</span>
          </button>
          <button
            onClick={() => setActiveTab("polynomial")}
            className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "polynomial"
                ? "glass-effect border-2 border-accent shadow-glow-accent text-accent scale-105"
                : "glass-effect border border-border/50 text-muted-foreground hover:text-foreground hover:border-accent/50"
            }`}
          >
            <Sigma className="w-5 h-5" />
            <span>Problem 2: Legendre Polynomial</span>
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
