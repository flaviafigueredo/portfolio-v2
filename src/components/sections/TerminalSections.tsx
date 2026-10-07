"use client";

import { motion, MotionConfig, type Variants } from "framer-motion";
import {
  aboutParagraphs,
  contactRows,
  githubUrl,
  hobbies,
  projects,
  sections,
  stackGroups,
  type TerminalSection,
} from "@/content/siteContent";

const linkClassName = "text-neon-cyan underline decoration-neon-cyan/40 underline-offset-4 transition-colors hover:text-neon-pink hover:decoration-neon-pink";

const promptColor = "text-neon-green";

const chamferWrapperClassName =
  "inline-block transition-[filter] duration-300 has-focus-visible:outline-2 has-focus-visible:outline-offset-4 has-focus-visible:outline-neon-cyan";

const linesVariants: Variants = {
  hidden: {},
  visible: (delay: number) => ({ transition: { delayChildren: delay, staggerChildren: 0.08 } }),
};

const lineVariants: Variants = {
  hidden: { opacity: 0, x: -6 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25 } },
};

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
      <span aria-hidden="true" className="h-4 w-2 animate-pulse bg-neon-green motion-reduce:animate-none" />
    </div>
  );
}

function TerminalPanel({ section, children }: { section: TerminalSection; children: React.ReactNode }) {
  const index = sections.indexOf(section) + 1;

  return (
    <div className="w-full max-w-xl rounded-[4px] border border-neon-green/25 bg-terminal/85 font-mono shadow-[0_0_30px_rgba(0,0,0,0.6)] backdrop-blur-[2px]">
      {section.heading && (
        <h2 id={`${section.id}-heading`} className="sr-only">
          {section.heading}
        </h2>
      )}
      <div aria-hidden="true" className="flex justify-between border-b border-neon-green/15 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-white/55">
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
          viewport={{ once: true, amount: 0.2 }}
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
            <span className="text-neon-pink">FIGUEREDO</span>
          </h1>
        </Line>
        <Line className="pt-2 text-neon-cyan">desenvolvedora front-end</Line>
        <Line className="text-white/60">
          Crio <span className="text-white">interfaces rápidas e responsivas</span> e cuido do caminho da informação por
          trás delas: <span className="text-neon-green">automações</span>, <span className="text-neon-green">integrações</span> e{" "}
          <span className="text-neon-green">dados</span>.
        </Line>
        <Line className="text-xs text-white/55">&gt; Porto Alegre, RS</Line>
        <Line className="flex flex-wrap gap-3 pt-4">
          {/* o brilho e o contorno de foco ficam no elemento de fora porque o clip-path cortaria os dois no próprio botão */}
          <span className={`${chamferWrapperClassName} hover:drop-shadow-[0_0_10px_rgba(255,171,243,0.6)]`}>
            <a
              href="#projects"
              className="clip-chamfer block bg-neon-pink px-5 py-2 text-xs font-bold uppercase tracking-[0.15em] text-neon-pink-ink focus-visible:outline-none"
            >
              view_projects
            </a>
          </span>
          {/* borda chanfrada feita com duas camadas: a de fora é a cor da borda, a de dentro (1px menor) é o fundo */}
          <span className={chamferWrapperClassName}>
            <a
              href="#contact"
              className="clip-chamfer-reverse group relative block bg-white/40 px-5 py-2 text-xs font-bold uppercase tracking-[0.15em] text-white focus-visible:outline-none"
            >
              <span className="clip-chamfer-reverse absolute inset-px bg-terminal transition-colors group-hover:bg-terminal-hover" />
              <span className="relative">init_contact</span>
            </a>
          </span>
        </Line>
      </>
    );
  }

  if (id === "about") {
    return (
      <>
        <Line className="text-neon-pink"># sobre</Line>
        {aboutParagraphs.map((paragraph) => (
          <Line key={paragraph}>{paragraph}</Line>
        ))}
        <Line className="pt-2 text-neon-pink"># fora do código</Line>
        <Line className="text-white/60">{hobbies.join(" · ")}</Line>
        <Line className="text-white/55">-- EOF</Line>
      </>
    );
  }

  if (id === "stack") {
    return (
      <>
        {stackGroups.map((group) => (
          <Line key={group.folder} className="pb-1">
            <div className="text-neon-cyan">{group.folder}</div>
            <div className="text-xs text-white/55"># {group.description}</div>
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
          <Line key={project.hash} className="pb-2">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="text-neon-pink">{project.hash}</span>
              <span className="text-white">{project.name}</span>
              <span className="text-xs text-white/55">
                ({project.tag}, {project.date})
              </span>
            </div>
            <div className="pl-[8ch] text-white/60">{project.description}</div>
            {project.links.length > 0 && (
              <div className="flex gap-4 pl-[8ch] text-xs">
                {project.links.map((link) => (
                  <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className={linkClassName}>
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </Line>
        ))}
        <Line className="text-xs text-white/55">
          -- projetos de estudo mais antigos em{" "}
          <a href={githubUrl} target="_blank" rel="noopener noreferrer" className={linkClassName}>
            github.com/flaviafigueredo
          </a>
        </Line>
      </>
    );
  }

  return (
    <>
      <Line className="text-white/50">conexão estabelecida.</Line>
      {contactRows.map((row) => (
        <Line key={row.label} className="flex gap-3">
          <span className="w-20 shrink-0 text-neon-cyan">{row.label}</span>
          {row.href ? (
            <a href={row.href} target="_blank" rel="noopener noreferrer" className={linkClassName}>
              {row.value}
            </a>
          ) : (
            <span>{row.value}</span>
          )}
        </Line>
      ))}
    </>
  );
}

export function TerminalSections() {
  return (
    // com "reduzir movimento" ativado no sistema, o framer-motion desliga os deslizamentos e mantém só o aparecer suave
    <MotionConfig reducedMotion="user">
      <main className="relative z-10">
        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            aria-labelledby={section.heading ? `${section.id}-heading` : undefined}
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
    </MotionConfig>
  );
}
