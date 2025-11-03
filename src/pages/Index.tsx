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
        {/* Header with Student Info */}
        <header className="text-center mb-12 animate-in fade-in slide-in-from-top duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect mb-4 border border-primary/20">
            <GraduationCap className="w-5 h-5 text-primary" />
            <span className="text-sm font-mono text-muted-foreground">Academic Assignment</span>
          </div>
          
          <h1 className="text-6xl font-bold mb-2 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-glow">
            Numerical Methods
          </h1>
          <p className="text-2xl font-light text-muted-foreground mb-6">Assignment 2</p>
          
          <div className="flex flex-wrap justify-center gap-8 mt-8 text-sm">
            <div className="glass-effect px-6 py-3 rounded-lg border border-primary/20">
              <p className="font-semibold text-primary">Surya Teja Uppala</p>
              <p className="text-muted-foreground font-mono">ES24BTECH11038</p>
            </div>
            <div className="glass-effect px-6 py-3 rounded-lg border border-accent/20">
              <p className="font-semibold text-accent">Angara Sai Shanmukhi</p>
              <p className="text-muted-foreground font-mono">ES24BTECH11008</p>
            </div>
          </div>
        </header>

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
