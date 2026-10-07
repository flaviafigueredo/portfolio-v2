import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // gera o site como arquivos estáticos na pasta out/, que é o que o Cloudflare Pages publica
  output: "export",
  reactCompiler: true,
};

export default nextConfig;
