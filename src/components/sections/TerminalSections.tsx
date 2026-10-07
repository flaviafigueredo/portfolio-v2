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

type ProjectLink = {
  label: string;
  href: string;
};

type Project = {
  hash: string;
  date: string;
  name: string;
  tag: string;
  description: string;
  links: ProjectLink[];
};

const githubUrl = "https://github.com/flaviafigueredo";
const linkedinUrl = "https://www.linkedin.com/in/flaviafigueredo/";

const stackGroups = [
  {
    folder: "daily/",
    description: "o que uso no trabalho todos os dias",
    stack: ["Vue.js", "JavaScript", "Jekyll", "Liquid", "HTML5", "CSS3", "Sass", "Bootstrap"],
  },
  {
    folder: "react-ecosystem/",
    description: "estudos e projetos pessoais",
    stack: ["React", "Next.js", "TypeScript", "Tailwind", "Redux", "Jest"],
  },
  {
    folder: "data/",
    description: "bancos, métricas e dashboards",
    stack: ["Firebase", "BigQuery", "Metabase", "Looker Studio", "Google Analytics", "Google Tag Manager"],
  },
  {
    folder: "automation/",
    description: "fluxos e integrações entre sistemas",
    stack: ["n8n", "Webhooks", "APIs"],
  },
  {
    folder: "tools/",
    description: "o básico de todo dia",
    stack: ["Git", "GitHub", "VS Code"],
  },
];

const projects: Project[] = [
  {
    hash: "e91b7a4",
    date: "2026.10",
    name: "gr-vegetal",
    tag: "freela",
    description:
      "Site institucional de uma consultoria agronômica: quatro páginas, blog e os vídeos mais recentes do YouTube puxados automaticamente no build. Jekyll, Liquid e Tailwind v4, publicado na Cloudflare Pages.",
    links: [
      { label: "site", href: "https://grvegetal.com.br/" },
      { label: "código", href: "https://github.com/grvegetal/grvegetal" },
    ],
  },
  {
    hash: "c4d02f8",
    date: "2026.10",
    name: "portfolio-v2",
    tag: "este site",
    description: "Next.js, TypeScript e canvas 2D. A cidade passando atrás deste texto é desenhada em tempo real e anda com o seu scroll.",
    links: [],
  },
  {
    hash: "7a3e19c",
    date: "2024.12",
    name: "redux-shop",
    tag: "estudo",
    description: "Loja com carrinho e estado global em Redux Toolkit. React, Redux e React Router.",
    links: [
      { label: "demo", href: "https://redux-shop-livid.vercel.app" },
      { label: "código", href: `${githubUrl}/redux-shop` },
    ],
  },
  {
    hash: "3f8d6b2",
    date: "2024.11",
    name: "rick-and-morty-hub-next",
    tag: "estudo",
    description: "Explorador de personagens com busca e paginação, consumindo a API de Rick and Morty. Next.js, TypeScript e Tailwind.",
    links: [
      { label: "demo", href: "https://rick-and-morty-hub-next.vercel.app" },
      { label: "código", href: `${githubUrl}/rick-and-morty-hub-next` },
    ],
  },
];

const contactRows = [
  { label: "github", value: "github.com/flaviafigueredo", href: githubUrl },
  { label: "linkedin", value: "in/flaviafigueredo", href: linkedinUrl },
  { label: "local", value: "Porto Alegre, RS" },
  { label: "status", value: "aberta a freelas e novas conversas" },
];

const linkClassName = "text-[#00fbfb] underline decoration-[#00fbfb]/40 underline-offset-4 transition-colors hover:text-[#ffabf3] hover:decoration-[#ffabf3]";

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
            <span className="text-[#ffabf3]">FIGUEREDO</span>
          </h1>
        </Line>
        <Line className="pt-2 text-[#00fbfb]">desenvolvedora front-end</Line>
        <Line className="text-white/60">
          Crio <span className="text-white">interfaces rápidas e responsivas</span> e cuido do caminho da informação por
          trás delas: <span className="text-[#2ae500]">automações</span>, <span className="text-[#2ae500]">integrações</span> e{" "}
          <span className="text-[#2ae500]">dados</span>.
        </Line>
        <Line className="text-xs text-white/40">&gt; Porto Alegre, RS</Line>
        <Line className="flex flex-wrap gap-3 pt-4">
          {/* o brilho fica no elemento de fora porque o clip-path cortaria a sombra do próprio botão */}
          <span className="inline-block transition-[filter] duration-300 hover:drop-shadow-[0_0_10px_rgba(255,171,243,0.6)]">
            <a
              href="#projects"
              className="clip-chamfer block bg-[#ffabf3] px-5 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#5b005b]"
            >
              view_projects
            </a>
          </span>
          {/* borda chanfrada feita com duas camadas: a de fora é a cor da borda, a de dentro (1px menor) é o fundo */}
          <a
            href="#contact"
            className="clip-chamfer-reverse group relative block bg-white/40 px-5 py-2 text-xs font-bold uppercase tracking-[0.15em] text-white"
          >
            <span className="clip-chamfer-reverse absolute inset-px bg-[#050507] transition-colors group-hover:bg-[#1a1a20]" />
            <span className="relative">init_contact</span>
          </a>
        </Line>
      </>
    );
  }

  if (id === "about") {
    return (
      <>
        <Line className="text-[#ffabf3]"># sobre</Line>
        <Line>
          Comecei na Produção Audiovisual, mas o que eu queria mesmo era programar. Em 2022 decidi tirar isso do papel e
          mergulhei em HTML, CSS, JavaScript e React.
        </Line>
        <Line>
          Vieram duas pós-graduações (Desenvolvimento Full Stack e Engenharia de Software) e, em janeiro de 2025, meu
          primeiro trabalho como dev front-end, no Cálculo Jurídico.
        </Line>
        <Line>
          Lá eu faço parte do time de marketing, e foi onde o código encontrou os dados. Além da tela, estruturo o caminho
          da informação: automações com n8n e webhooks, integrações com CRMs e gateways de pagamento e dashboards no
          Metabase e no Looker Studio.
        </Line>
        <Line className="pt-2 text-[#ffabf3]"># fora do código</Line>
        <Line className="text-white/60">gaúcha · café · mate · música · séries e livros</Line>
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
          <Line key={project.hash} className="pb-2">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="text-[#ffabf3]">{project.hash}</span>
              <span className="text-white">{project.name}</span>
              <span className="text-xs text-white/40">
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
        <Line className="text-xs text-white/40">
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
          <span className="w-20 shrink-0 text-[#00fbfb]">{row.label}</span>
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
