import type { Metadata } from "next";
import Link from "next/link";
import { CityRun } from "@/components/background/CityRun";

export const metadata: Metadata = {
  title: "Página não encontrada",
};

// Página 404 no estilo terminal. Na exportação estática ela vira o 404.html que o Cloudflare Pages usa.
export default function NotFound() {
  return (
    <>
      <CityRun />
      <main className="relative z-10 flex min-h-screen items-center px-4 py-24 sm:px-12">
        <div className="w-full max-w-xl rounded-[4px] border border-neon-green/25 bg-terminal/85 font-mono shadow-[0_0_30px_rgba(0,0,0,0.6)] backdrop-blur-[2px]">
          <div aria-hidden="true" className="border-b border-neon-green/15 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-white/55">
            tty0 :: 404
          </div>
          <div className="space-y-3 p-4 text-sm leading-relaxed sm:p-6">
            <p>
              <span className="text-neon-green">~$</span> <span className="text-white">cd /pagina-procurada</span>
            </p>
            <p className="text-neon-pink">bash: cd: /pagina-procurada: arquivo ou diretório inexistente</p>
            <h1 className="pt-4 text-4xl font-black leading-none tracking-tight text-white sm:text-6xl">404</h1>
            <p className="text-white/70">Essa página não existe ou mudou de lugar.</p>
            <div className="pt-4">
              <span className="inline-block has-focus-visible:outline-2 has-focus-visible:outline-offset-4 has-focus-visible:outline-neon-cyan">
                <Link
                  href="/"
                  className="clip-chamfer block bg-neon-pink px-5 py-2 text-xs font-bold uppercase tracking-[0.15em] text-neon-pink-ink focus-visible:outline-none"
                >
                  cd ~
                </Link>
              </span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
