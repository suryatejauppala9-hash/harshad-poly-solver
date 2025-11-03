import { useEffect, useRef } from "react";

export const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const symbols = ["∑", "∫", "π", "∞", "√", "≈", "≠", "∂", "λ", "θ", "φ", "Ω", "α", "β", "γ", "δ", "∆", "∇", "±", "×", "÷", "≤", "≥"];
    const particles: Array<{
      x: number;
      y: number;
      symbol: string;
      speed: number;
      size: number;
      opacity: number;
      drift: number;
    }> = [];

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        speed: 0.2 + Math.random() * 0.5,
        size: 20 + Math.random() * 30,
        opacity: 0.1 + Math.random() * 0.2,
        drift: (Math.random() - 0.5) * 0.5,
      });
    }

    const animate = () => {
      ctx.fillStyle = "rgba(22, 26, 36, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        ctx.font = `${particle.size}px 'JetBrains Mono', monospace`;
        ctx.fillStyle = `rgba(168, 85, 247, ${particle.opacity})`;
        ctx.fillText(particle.symbol, particle.x, particle.y);

        particle.y += particle.speed;
        particle.x += particle.drift;

        if (particle.y > canvas.height + 50) {
          particle.y = -50;
          particle.x = Math.random() * canvas.width;
        }

        if (particle.x < -50 || particle.x > canvas.width + 50) {
          particle.x = Math.random() * canvas.width;
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-40 z-0"
      style={{ background: "transparent" }}
    />
  );
};
