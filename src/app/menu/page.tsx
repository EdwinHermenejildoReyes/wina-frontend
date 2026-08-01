"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import api from "@/lib/api";
import type { Categoria } from "@/lib/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import CarritoFab from "@/components/CarritoFab";

export default function MenuPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandida, setExpandida] = useState<number | null>(null);

  useEffect(() => {
    api
      .get("/public/menu/completo/")
      .then((r) => setCategorias(r.data))
      .catch(() => setCategorias([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner texto="Cargando menú..." />;

  return (
    <main className="min-h-screen bg-crema pb-28">
      {/* Header */}
      <div className="bg-white px-4 pt-8 pb-5 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-rosa">Wina</h1>
        <p className="text-sm text-gray-400 mt-0.5">Dulces y Pasteles</p>
      </div>

      <div className="px-4 mt-5 space-y-3">
        {categorias.map((cat) => (
          <div key={cat.id} className="bg-white rounded-2xl overflow-hidden shadow-sm">
            {/* Categoría header */}
            <button
              className="w-full flex items-center gap-3 p-4 text-left active:bg-gris transition-colors"
              onClick={() => setExpandida(expandida === cat.id ? null : cat.id)}
            >
              {cat.imagen ? (
                <Image
                  src={cat.imagen}
                  alt={cat.nombre}
                  width={48}
                  height={48}
                  className="rounded-xl object-cover w-12 h-12 shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-crema flex items-center justify-center text-2xl shrink-0">🎂</div>
              )}
              <div className="flex-1">
                <p className="font-semibold text-dark">{cat.nombre}</p>
                <p className="text-xs text-gray-400">{cat.subcategorias.length} subcategorías</p>
              </div>
              <ChevronRight
                className={`w-5 h-5 text-gray-400 transition-transform ${expandida === cat.id ? "rotate-90" : ""}`}
              />
            </button>

            {/* Subcategorías expandidas */}
            {expandida === cat.id && (
              <div className="border-t border-gris-borde">
                {cat.subcategorias.map((sub) => (
                  <Link
                    key={sub.id}
                    href={`/menu/${sub.id}`}
                    className="flex items-center gap-3 px-4 py-3 border-b border-gris-borde last:border-0 active:bg-gris transition-colors"
                  >
                    {sub.imagen ? (
                      <Image
                        src={sub.imagen}
                        alt={sub.nombre}
                        width={40}
                        height={40}
                        className="rounded-lg object-cover w-10 h-10 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-crema flex items-center justify-center text-lg shrink-0">🍰</div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-dark">{sub.nombre}</p>
                      <p className="text-xs text-gray-400">{sub.productos.length} productos</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        {categorias.length === 0 && (
          <p className="text-center text-gray-400 py-12 text-sm">No hay productos disponibles por ahora.</p>
        )}
      </div>

      <CarritoFab />
    </main>
  );
}
