"use client";

import { useSyncExternalStore } from "react";

// O ano não muda enquanto a página está aberta, então não há nada para escutar.
const subscribeToYear = () => () => {};
const getCurrentYear = () => new Date().getFullYear();

// Rodapé com os direitos reservados. O canto superior esquerdo é chanfrado, espelhando o corte do Header.
// O ano começa como o ano do build (igual ao HTML gerado) e, já no navegador, passa a ser o ano atual de quem visita.
// Assim ele fica certo mesmo que o site passe um ano sem ser publicado de novo.
export function Footer({ buildYear }: { buildYear: number }) {
  const year = useSyncExternalStore(subscribeToYear, getCurrentYear, () => buildYear);

  return (
    <footer
      className="relative z-10 border-t border-neon-green/15 bg-terminal/85 px-4 py-5 font-mono backdrop-blur-md sm:px-6"
      style={{ clipPath: "polygon(2% 0, 100% 0, 100% 100%, 0 100%, 0 30%)" }}
    >
      <p className="text-center text-[11px] uppercase tracking-[0.2em] text-white/55">
        © {year} Flávia Figueredo. Todos os direitos reservados.
      </p>
    </footer>
  );
}
