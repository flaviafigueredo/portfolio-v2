"use client";

import { motion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";

type TerminalSection = {
  id: string;
  file: string;
  command: string;
  align: "left" | "right";
};

export const sections: TerminalSection[] = [
  { id: "boot", file: "init.sh", command: "./init.sh", align: "left" },
  { id: "about", file: "about.md", command: "cat about.md", align: "right" },
  { id: "stack", file: "stack/", command: "ls -l ./stack", align: "left" },
  { id: "projects", file: "projects.log", command: "git log --oneline projects", align: "right" },
  { id: "contact", file: "contact", command: "ssh contact@flavia", align: "left" },
];

const stackGroups = [
  {
    folder: "frontend-engineering/",
    description: "Arquitetura de interfaces modernas com foco em escalabilidade e performance.",
    stack: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind"],
  },
  {
    folder: "production-ecosystem/",
    description: "Experiência sólida no desenvolvimento e manutenção de sistemas em larga escala.",
    stack: ["Vue.js", "Jekyll", "Liquid", "Sass", "Bootstrap"],
  },
  {
    folder: "technical-excellence/",
    description: "Padronização, controle de versão e garantia de qualidade de software.",
    stack: ["Git", "Jest", "Redux", "VS Code"],
  },
  {
    folder: "automation-analytics/",
    description: "Otimização de fluxos de trabalho e inteligência de dados estratégica.",
    stack: ["n8n", "Metabase", "Firestore", "GTM"],
  },
  {
    folder: "web-foundations/",
    description: "Base sólida em semântica, acessibilidade e design responsivo.",
    stack: ["HTML5", "CSS3", "Responsive Design"],
  },
];

const projects = [
  { hash: "a3f9c21", title: "Projeto exemplo um", description: "Descrição curta do que foi feito e com qual stack." },
  { hash: "7be04d8", title: "Projeto exemplo dois", description: "Outra descrição curta, uma linha só." },
  { hash: "c18e5f0", title: "Projeto exemplo três", description: "Mais uma linha para mostrar a lista crescendo." },
];

const contactRows = [
  { label: "github", value: "github.com/seu-usuario" },
  { label: "linkedin", value: "linkedin.com/in/seu-usuario" },
  { label: "status", value: "aberta a novas oportunidades" },
];

const promptColor = "text-[#2ae500]";

const linesVariants: Variants = {
  hidden: {},
  visible: (delay: number) => ({ transition: { delayChildren: delay, staggerChildren: 0.08 } }),
};

const lineVariants: Variants = {
  hidden: { opacity: 0, x: -6 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25 } },
};

// Devolve o id da seção que está ocupando a maior parte da tela.
export function useActiveSection() {
  const [activeId, setActiveId] = useState(sections[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { threshold: 0.5 },
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return activeId;
}

function typingDuration(text: string) {
  return text.length * 0.045;
}

// Digita o comando caractere por caractere quando o bloco entra na tela.
function TypedCommand({ text }: { text: string }) {
  const steps = text.length;

  return (
    <div className="flex items-center gap-2 text-xs sm:text-sm">
      <span className={`shrink-0 ${promptColor}`}>
        <span className="hidden sm:inline">flavia@portfolio:</span>~$
      </span>
      <motion.span
        className="inline-block overflow-hidden whitespace-nowrap text-white"
        initial={{ width: 0 }}
        whileInView={{ width: `${steps}ch` }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: typingDuration(text), ease: (progress) => Math.floor(progress * steps) / steps }}
      >
        {text}
      </motion.span>
      <span className="h-4 w-2 animate-pulse bg-[#2ae500]" />
    </div>
  );
}

function TerminalPanel({ section, children }: { section: TerminalSection; children: React.ReactNode }) {
  const index = sections.indexOf(section) + 1;

  return (
    <div className="w-full max-w-xl rounded-[4px] border border-[#2ae500]/25 bg-[#050507]/85 font-mono shadow-[0_0_30px_rgba(0,0,0,0.6)] backdrop-blur-[2px]">
      <div className="flex justify-between border-b border-[#2ae500]/15 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-white/40">
        <span>tty{index} :: {section.file}</span>
        <span>{String(index).padStart(2, "0")}/{String(sections.length).padStart(2, "0")}</span>
      </div>
      <div className="space-y-4 p-4 sm:p-6">
        <TypedCommand text={section.command} />
        <motion.div
          variants={linesVariants}
          custom={typingDuration(section.command) + 0.15}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          className="space-y-2 text-sm leading-relaxed text-white/80"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}

function Line({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={lineVariants} className={className}>
      {children}
    </motion.div>
  );
}

function SectionBody({ id }: { id: string }) {
  if (id === "boot") {
    return (
      <>
        <Line className="text-white/50">[ ok ] carregando módulos...</Line>
        <Line className="text-white/50">[ ok ] conexão estabelecida</Line>
        <Line>
          <h1 className="pt-4 text-4xl font-black leading-none tracking-tight text-white sm:text-6xl">
            FLÁVIA
            <br />
            <span className="text-[#ffabf3]">FIGUEREDO</span>
          </h1>
        </Line>
        <Line className="pt-2 text-[#00fbfb]">front-end developer</Line>
        <Line className="text-white/60">
          Specializing in high-performance modern architectures, <span className="text-[#2ae500]">Node.js</span> ecosystems,
          and precision <span className="text-[#00fbfb]">Frontend Engineering</span>.
        </Line>
        <Line className="flex flex-wrap gap-3 pt-4">
          <a
            href="#projects"
            className="rounded-[4px] bg-[#ffabf3] px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#5b005b] transition-shadow hover:shadow-[0_0_20px_rgba(255,171,243,0.5)]"
          >
            view_repositories
          </a>
          <a
            href="#contact"
            className="rounded-[4px] border border-white/40 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-white transition-colors hover:bg-white/10"
          >
            init_contact
          </a>
        </Line>
      </>
    );
  }

  if (id === "about") {
    return (
      <>
        <Line># sobre</Line>
        <Line>Texto de exemplo. Aqui entra um parágrafo curto.</Line>
        <Line>Uma segunda linha.</Line>
        <Line className="text-white/40">-- EOF</Line>
      </>
    );
  }

  if (id === "stack") {
    return (
      <>
        {stackGroups.map((group) => (
          <Line key={group.folder} className="pb-1">
            <div className="text-[#00fbfb]">{group.folder}</div>
            <div className="text-xs text-white/40"># {group.description}</div>
            <div>{group.stack.join("  ")}</div>
          </Line>
        ))}
      </>
    );
  }

  if (id === "projects") {
    return (
      <>
        {projects.map((project) => (
          <Line key={project.hash}>
            <span className="text-[#ffabf3]">{project.hash}</span>{" "}
            <span className="text-white">{project.title}</span>
            <div className="pl-[8ch] text-white/50">{project.description}</div>
          </Line>
        ))}
      </>
    );
  }

  return (
    <>
      <Line className="text-white/50">Connection established.</Line>
      {contactRows.map((row) => (
        <Line key={row.label} className="flex gap-3">
          <span className="w-20 shrink-0 text-[#00fbfb]">{row.label}</span>
          <span>{row.value}</span>
        </Line>
      ))}
    </>
  );
}

export function TerminalSections() {
  return (
    <main className="relative z-10">
      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className={`flex min-h-screen items-center px-4 py-24 sm:px-12 ${
            section.align === "right" ? "justify-end" : "justify-start"
          }`}
        >
          <TerminalPanel section={section}>
            <SectionBody id={section.id} />
          </TerminalPanel>
        </section>
      ))}
    </main>
  );
}
