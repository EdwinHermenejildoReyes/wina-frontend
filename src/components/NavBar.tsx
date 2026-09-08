"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Instagram, Facebook } from "lucide-react";

const INSTAGRAM_URL = "https://www.instagram.com/dulcesypasteleswina";
const FACEBOOK_URL  = "#";

const tabs = [
  { label: "Menú",      href: "/menu"      },
  { label: "Wina",      href: "/wina"      },
  { label: "Contactos", href: "/contactos" },
];

export default function NavBar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/menu"
      ? pathname.startsWith("/menu") || pathname.startsWith("/producto")
      : pathname === href;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">

      {/* ── Desktop row (md+): logo | tabs | social + CTA ── */}
      <div className="hidden md:flex items-center px-8 h-16 gap-6">
        {/* Logo */}
        <Link href="/wina" className="flex flex-col leading-none shrink-0">
          <span className="font-display text-xl font-bold text-cafe">Wina</span>
          <span className="font-script text-rosa text-xs">Dulces y Pasteles</span>
        </Link>

        {/* Tabs centrados */}
        <nav className="flex flex-1 items-center justify-center gap-8">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`text-sm font-semibold pb-0.5 border-b-2 transition-colors ${
                isActive(tab.href)
                  ? "border-rosa text-rosa"
                  : "border-transparent text-gray-500 hover:text-dark"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>

        {/* Social + CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
             className="text-gray-400 hover:text-rosa transition-colors">
            <Instagram className="w-5 h-5" />
          </a>
          <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer"
             className="text-gray-400 hover:text-rosa transition-colors">
            <Facebook className="w-5 h-5" />
          </a>
          <Link
            href="/menu"
            className="bg-cafe text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-rosa transition-colors"
          >
            Hacer tu pedido
          </Link>
        </div>
      </div>

      {/* ── Mobile: logo centrado + tabs ── */}
      <div className="md:hidden">
        <div className="px-4 pt-4 pb-2 text-center">
          <p className="font-display text-xl font-bold text-cafe leading-none">Wina</p>
          <p className="font-script text-rosa text-sm mt-0.5">Dulces y Pasteles</p>
        </div>
        <nav className="flex border-t border-gris-borde">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex-1 text-center py-3 text-sm font-semibold transition-colors border-b-2 ${
                isActive(tab.href)
                  ? "border-rosa text-rosa"
                  : "border-transparent text-gray-400"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>

    </header>
  );
}
