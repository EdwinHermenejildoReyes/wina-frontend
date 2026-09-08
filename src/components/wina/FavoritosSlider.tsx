"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import api from "@/lib/api";
import type { Categoria, Producto } from "@/lib/types";

export default function FavoritosSlider() {
  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    api
      .get("/public/menu/completo/")
      .then((r) => {
        const todos: Producto[] = (r.data as Categoria[]).flatMap((cat) =>
          cat.subcategorias.flatMap((sub) => sub.productos)
        );
        const destacados = todos.filter((p) => p.is_featured && p.is_available);
        setProductos(destacados.length >= 3 ? destacados : todos.filter((p) => p.is_available).slice(0, 6));
      })
      .catch(() => setProductos([]));
  }, []);

  if (productos.length === 0) return null;

  return (
    <section className="bg-crema py-8">
      <div className="px-5 flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-cafe text-xl">Nuestros favoritos</h3>
        <Link href="/menu" className="text-xs text-rosa font-semibold flex items-center gap-1">
          Ver todos <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="flex gap-3 px-5 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none">
        {productos.map((p) => (
          <Link
            key={p.id}
            href={`/producto/${p.id}`}
            className="shrink-0 snap-start w-44 bg-white rounded-2xl overflow-hidden shadow-sm active:scale-95 transition-transform"
          >
            <div className="relative w-full aspect-square bg-crema-alt">
              {p.imagen ? (
                <Image src={p.imagen} alt={p.nombre} fill className="object-cover" sizes="176px" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">🎂</div>
              )}
            </div>
            <div className="p-3">
              <p className="text-xs font-semibold text-dark leading-tight line-clamp-2">{p.nombre}</p>
              <p className="text-sm font-bold text-rosa mt-1">${parseFloat(p.precio).toFixed(2)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
