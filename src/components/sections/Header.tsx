"use client";

import { motion } from "framer-motion";
import { sections, useActiveSection } from "./TerminalSections";

export function Header() {
  const activeId = useActiveSection();

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-[#131313]/80 backdrop-blur-md border-b border-[#564052]/20 shadow-[0_0_15px_rgba(255,0,255,0.1)]"
      style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 98% 100%, 0 100%)" }}
    >
      {/* logo / terminal ID */}
      <div className="text-xl font-bold text-[#ff00ff] drop-shadow-[0_0_8px_rgba(255,0,255,0.4)] font-headline tracking-[0.05em]">
        TERMINAL_v1.1.0
      </div>

      {/* navegação desktop */}
      <nav className="hidden md:flex gap-8 items-center">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={`font-headline uppercase tracking-[0.05em] text-sm transition-all duration-200 hover:text-[#00fbfb] hover:drop-shadow-[0_0_5px_rgba(0,251,251,0.5)] ${section.id === activeId
                ? "text-[#ff00ff] border-b-2 border-[#ff00ff] pb-1"
                : "text-white opacity-70"
              }`}
          >
            {section.id}
          </a>
        ))}
      </nav>

      {/* status e ícone de sensores */}
      <div className="flex items-center gap-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-radio text-primary drop-shadow-[0_0_8px_rgba(255,171,243,0.5)]"><path d="M16.247 7.761a6 6 0 0 1 0 8.478"/><path d="M19.075 4.933a10 10 0 0 1 0 14.134"/><path d="M4.925 19.067a10 10 0 0 1 0-14.134"/><path d="M7.753 16.239a6 6 0 0 1 0-8.478"/><circle cx="12" cy="12" r="2"/></svg>
      </div>
    </motion.header>
  );
}