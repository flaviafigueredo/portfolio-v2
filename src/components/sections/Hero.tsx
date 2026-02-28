"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { NeuralNetwork } from "./NeuralNetwork";
import { useState, useEffect } from "react";

export function Hero() {
  const [displayText, setDisplayText] = useState("");
  const fullText = "Frontend Developer";

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i <= fullText.length) {
        setDisplayText(fullText.slice(0, i)); i++;
      } else clearInterval(timer);
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-[#0a031a] via-[#020005] to-[#000000] flex items-center justify-center">
      <NeuralNetwork />

      {/* Ghost reflection */}
      <div
        className="absolute right-0 top-0 h-full w-full md:w-[60%] z-10 select-none pointer-events-none opacity-20 md:opacity-[0.25] grayscale contrast-125 transition-all duration-1000"
        style={{
          maskImage: 'linear-gradient(to left, black 15%, transparent 85%)',
          WebkitMaskImage: 'linear-gradient(to left, black 15%, transparent 85%)',
        }}
      >
        <Image
          src="/images/avatar.jpeg"
          alt="Avatar"
          fill
          className="object-cover object-right mix-blend-screen"
          priority
        />
      </div>

      <div className="z-30 container px-6 max-w-7xl flex flex-col md:flex-row items-center">
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-primary font-mono text-xs tracking-[0.5em] uppercase mb-4 flex items-center justify-center md:justify-start">
            {displayText}
            <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.8, repeat: Infinity }} className="inline-block w-0.5 h-3 bg-primary ml-2" />
          </h2>

          {/* Glitch */}
          <div className="relative group select-none">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 relative inline-block text-white">
              {/* Texto original branco */}
              <span className="relative z-10 text-white/95">
                Flávia Figueredo
              </span>
              
              {/* Camada fantasma ciano */}
              <span className="absolute top-0 left-0 w-full h-full text-cyan-400 opacity-40 animate-[glitch-slice-1-slow_1.5s_linear_infinite] pointer-events-none z-0 mix-blend-screen transition-opacity group-hover:opacity-70">
                Flávia Figueredo
              </span>
              
              {/* Camada fantasma roxa (primary) */}
              <span className="absolute top-0 left-0 w-full h-full text-primary opacity-50 animate-[glitch-slice-2-slow_1.8s_linear_infinite_reverse] pointer-events-none z-0 mix-blend-screen transition-opacity group-hover:opacity-80">
                Flávia Figueredo
              </span>
            </h1>
          </div>

          <p className="text-lg md:text-xl text-zinc-500 max-w-lg leading-relaxed font-mono mb-2"> 
            De Porto Alegre para o mundo. 
            </p>
          <p className="text-lg md:text-xl text-zinc-300 max-w-lg leading-relaxed font-mono">
            Unindo estética audiovisual à precisão da Engenharia de Software.
            </p>
        </div>
      </div>

      {/* Metadata */}
      <div className="absolute p-6 rounded-md bottom-8 left-8 z-30 font-mono text-[10px] text-primary/50 space-y-1 hidden md:block uppercase tracking-widest cursor-default select-none transition-all duration-500 hover:text-primary/90 hover:shadow-neon">
        <p className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse" />
          Location: 30.0346° S, 51.2177° W (POA)
        </p>
        <p className="pl-3.5">Memory: 64GB_DDR4_V2_ACTIVE</p>
        <p className="pl-3.5 opacity-80">Status: Authenticated_Access_Granted</p>
      </div>
    </section>
  );
}