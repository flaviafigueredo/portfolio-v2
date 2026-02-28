"use client";
import { useEffect, useRef } from "react";

class Particle {
  x: number; y: number; vx: number; vy: number;
  
  constructor() {
    this.x = Math.random() * window.innerWidth;
    this.y = Math.random() * window.innerHeight;
    this.vx = (Math.random() - 0.5) * 0.6;
    this.vy = (Math.random() - 0.5) * 0.6;
  }
  
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > window.innerWidth) this.vx *= -1;
    if (this.y < 0 || this.y > window.innerHeight) this.vy *= -1;
  }
}

export function NeuralNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId: number;

    let particles: Particle[] = [];
    const particleCount = 90; 
    const connectionDistance = 160;

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = Array.from({ length: particleCount }, () => new Particle());
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.shadowBlur = 15;
      ctx.shadowColor = "rgba(139, 92, 246, 0.8)"; 

      particles.forEach((p, i) => {
        p.update();
        ctx.fillStyle = "rgba(139, 92, 246, 0.7)"; 
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); 
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
          if (dist < connectionDistance) {
            const opacity = 1 - dist / connectionDistance;
            ctx.strokeStyle = `rgba(139, 92, 246, ${opacity * 0.8})`; 
            ctx.lineWidth = 1.2; 
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", init);
    init(); animate();
    return () => {
      window.removeEventListener("resize", init);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-70" />;
}