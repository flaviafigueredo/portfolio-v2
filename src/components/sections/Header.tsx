"use client";

import { motion, MotionConfig } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { sections } from "@/content/siteContent";
import { useActiveSection } from "@/hooks/useActiveSection";

export function Header() {
  const activeId = useActiveSection();
  const [menuOpen, setMenuOpen] = useState(false);

  // fecha o menu do celular com a tecla Esc
  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  return (
    <MotionConfig reducedMotion="user">
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b border-neon-green/15 bg-terminal/85 px-4 font-mono shadow-[0_0_15px_rgba(255,171,243,0.08)] backdrop-blur-md sm:px-6"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 98% 100%, 0 100%)" }}
      >
        {/* logo no formato do prompt do terminal */}
        <Link href="/#boot" className="text-base font-bold tracking-tight sm:text-lg">
          <span className="text-neon-pink drop-shadow-[0_0_8px_rgba(255,171,243,0.4)]">flavia@portfolio</span>
          <span className="text-neon-green">:~$</span>
        </Link>

        {/* navegação desktop */}
        <nav aria-label="Seções" className="hidden items-center gap-8 md:flex">
          {sections.map((section) => (
            <Link
              key={section.id}
              href={`/#${section.id}`}
              aria-current={section.id === activeId ? "location" : undefined}
              className={`pb-1 text-xs uppercase tracking-[0.2em] transition-all duration-200 hover:text-neon-cyan hover:drop-shadow-[0_0_5px_rgba(0,251,251,0.5)] ${
                section.id === activeId
                  ? "border-b-2 border-neon-pink text-neon-pink"
                  : "border-b-2 border-transparent text-white/60"
              }`}
            >
              {section.id}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {/* status online */}
          <span className="hidden items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white/50 sm:flex">
            <span aria-hidden="true" className="h-2 w-2 animate-pulse rounded-full bg-neon-green motion-reduce:animate-none shadow-[0_0_6px_var(--color-neon-green)]" />
            online
          </span>

          {/* botão do menu no celular */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="text-xs uppercase tracking-[0.2em] text-white/80 transition-colors hover:text-neon-cyan md:hidden"
          >
            [ {menuOpen ? "close" : "menu"} ]
          </button>
        </div>
      </motion.header>

      {/* menu do celular em tela cheia */}
      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Seções"
          className="fixed inset-0 z-40 bg-terminal/95 px-4 pt-24 font-mono backdrop-blur-md md:hidden"
        >
          <div className="rounded-[4px] border border-neon-green/25">
            <div className="border-b border-neon-green/15 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-white/55">
              nav :: sections
            </div>
            <div className="space-y-1 p-4">
              <div className="pb-3 text-sm">
                <span className="text-neon-green">~$</span> <span className="text-white">ls ./sections</span>
              </div>
              {sections.map((section, index) => (
                <Link
                  key={section.id}
                  href={`/#${section.id}`}
                  onClick={() => setMenuOpen(false)}
                  className={`flex gap-4 py-2 text-lg uppercase tracking-[0.15em] transition-colors hover:text-neon-cyan ${
                    section.id === activeId ? "text-neon-pink" : "text-white/80"
                  }`}
                >
                  <span className="text-white/45">{String(index + 1).padStart(2, "0")}</span>
                  {section.id}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      )}
    </MotionConfig>
  );
}
