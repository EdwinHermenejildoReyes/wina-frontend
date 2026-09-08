"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import api from "@/lib/api";
import type { Categoria } from "@/lib/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import CarritoFab from "@/components/CarritoFab";
import NavBar from "@/components/NavBar";

export default function MenuPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading]       = useState(true);
  const [expandida, setExpandida]   = useState<number | null>(null);

  useEffect(() => {
    api
      .get("/public/menu/completo/")
      .then((r) => {
        setCategorias(r.data);
        if (r.data.length === 1) setExpandida(r.data[0].id);
      })
      .catch(() => setCategorias([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner texto="Cargando menú..." />;

  return (
    <main className="min-h-screen bg-crema pb-28">
      <NavBar />

      {/* ── Hero ── */}
      <section className="bg-cafe px-6 py-8 md:py-12">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-script text-rosa text-lg md:text-xl mb-1">
            Hecho con amor ♡
          </p>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white leading-none">
            Nuestro Menú
          </h1>
          <p className="text-crema/60 text-sm mt-3">
            Tortas y postres artesanales personalizados
          </p>
        </div>
      </section>

      {/* ── Categorías ── */}
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">

        {categorias.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🎂</p>
            <p className="font-display text-cafe font-bold text-lg">Pronto más opciones</p>
            <p className="text-sm text-gray-400 mt-1">No hay productos disponibles por ahora.</p>
          </div>
        )}

        {categorias.map((cat) => (
          <div key={cat.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gris-borde">

            {/* Cabecera de categoría */}
            <button
              className="w-full flex items-center gap-4 px-5 py-4 text-left active:bg-crema transition-colors"
              onClick={() => setExpandida(expandida === cat.id ? null : cat.id)}
            >
              {/* Icono circular */}
              <div className="shrink-0 w-14 h-14 rounded-full overflow-hidden bg-crema-alt border-2 border-gris-borde flex items-center justify-center text-3xl">
                {cat.imagen
                  ? <Image src={cat.imagen} alt={cat.nombre} width={56} height={56} className="object-cover w-full h-full" />
                  : "🎂"}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-cafe text-base leading-tight">{cat.nombre}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {cat.subcategorias.length} {cat.subcategorias.length === 1 ? "colección" : "colecciones"}
                </p>
              </div>

              <ChevronDown
                className={`shrink-0 w-5 h-5 text-cafe/50 transition-transform duration-200 ${expandida === cat.id ? "rotate-180" : ""}`}
              />
            </button>

            {/* Subcategorías */}
            {expandida === cat.id && (
              <div className="border-t border-gris-borde bg-crema-alt px-4 py-4 flex flex-col gap-3">
                {cat.subcategorias.map((sub) => (
                  <Link
                    key={sub.id}
                    href={`/menu/${sub.id}`}
                    className="flex items-center gap-4 bg-white rounded-2xl px-4 py-3 shadow-sm border border-gris-borde active:bg-crema transition-colors"
                  >
                    {/* Icono subcategoría */}
                    <div className="shrink-0 w-11 h-11 rounded-full overflow-hidden bg-crema-alt border border-gris-borde flex items-center justify-center text-xl">
                      {sub.imagen
                        ? <Image src={sub.imagen} alt={sub.nombre} width={44} height={44} className="object-cover w-full h-full" />
                        : "🍰"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-dark text-sm leading-tight">{sub.nombre}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {sub.productos.length} {sub.productos.length === 1 ? "producto" : "productos"}
                      </p>
                    </div>

                    {/* Flecha rosa */}
                    <div className="shrink-0 w-7 h-7 rounded-full bg-rosa/10 flex items-center justify-center">
                      <ChevronDown className="w-4 h-4 text-rosa -rotate-90" />
                    </div>
                  </Link>
                ))}
              </div>
            )}

          </div>
        ))}
      </div>

      <CarritoFab />
    </main>
  );
}
