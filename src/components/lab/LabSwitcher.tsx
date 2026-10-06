import Link from "next/link";

const labRoutes = [
  { href: "/lab/tunnel", label: "tunnel" },
  { href: "/lab/parallax", label: "parallax" },
  { href: "/lab/city", label: "city" },
];

// Botões para alternar entre as páginas de teste de fundo.
export function LabSwitcher() {
  return (
    <nav className="fixed bottom-4 right-4 z-20 flex gap-1 rounded-[4px] border border-white/15 bg-black/80 p-1 font-mono text-xs">
      {labRoutes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className="rounded-[2px] px-3 py-1 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          lab/{route.label}
        </Link>
      ))}
    </nav>
  );
}
