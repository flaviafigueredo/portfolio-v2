// Conteúdo do site: seções, sobre, stack, projetos e contatos. A frase de apresentação do boot fica no TerminalSections.tsx, porque tem palavras destacadas em cores.

export const aboutParagraphs = [
  "Comecei na Produção Audiovisual, mas o que eu queria mesmo era programar. Em 2022 decidi tirar isso do papel e mergulhei em HTML, CSS, JavaScript e React.",
  "Vieram duas pós-graduações (Desenvolvimento Full Stack e Engenharia de Software) e, em janeiro de 2025, meu primeiro trabalho como dev front-end, no Cálculo Jurídico.",
  "Lá eu faço parte do time de marketing, e foi onde o código encontrou os dados. Além da tela, estruturo o caminho da informação: automações com n8n e webhooks, integrações com CRMs e gateways de pagamento e dashboards no Metabase e no Looker Studio.",
];

export const hobbies = ["gaúcha", "café", "mate", "música", "séries e livros"];

export type TerminalSection = {
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

export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  hash: string;
  date: string;
  name: string;
  tag: string;
  description: string;
  links: ProjectLink[];
};

export const githubUrl = "https://github.com/flaviafigueredo";
export const linkedinUrl = "https://www.linkedin.com/in/flaviafigueredo/";

export const stackGroups = [
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

export const projects: Project[] = [
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

export const contactRows = [
  { label: "github", value: "github.com/flaviafigueredo", href: githubUrl },
  { label: "linkedin", value: "in/flaviafigueredo", href: linkedinUrl },
  { label: "local", value: "Porto Alegre, RS" },
  { label: "status", value: "aberta a freelas e novas conversas" },
];
