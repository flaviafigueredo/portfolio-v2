"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function Hero() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  // Efeito parallax: o fundo sobe mais devagar que o scroll
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={targetRef}
      className="relative h-screen w-full overflow-hidden bg-background flex items-center justify-center"
    >
      {/* Imagem de fundo */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 z-0 opacity-30 mix-blend-lighten"
      >
        <Image
          src="/images/background.jpg"
          alt="Cyber Background"
          fill
          className="object-cover"
          priority
        />
      </motion.div>

      {/* Overlay de gradiente */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-background/50 to-background" />

      <motion.div
        style={{ opacity: textOpacity }}
        className="z-20 container px-4 flex flex-col md:flex-row items-center gap-12"
      >
        {/* Lado esquerdo: texto */}
        <div className="flex-1 text-center md:text-left">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-primary font-mono text-sm tracking-widest uppercase mb-4"
          >
            Frontend Developer & Data Enthusiast
          </motion.h2>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter mb-6"
          >
            Flávia Figueredo
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed"
          >
            De Porto Alegre para o mundo. Unindo a estética do audiovisual 
            com a precisão da Engenharia de Software para construir interfaces 
            de alta performance.
          </motion.p>
        </div>

        {/* Lado direito: avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-primary rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-2 border-primary/20 shadow-neon">
            <Image
              src="/images/avatar.jpeg"
              alt="Flávia Figueredo Avatar"
              fill
              className="object-cover"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}