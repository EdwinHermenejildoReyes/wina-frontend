"use client";

import Link from "next/link";
import Image from "next/image";
import { Producto } from "@/lib/types";

export default function ProductoCard({ producto }: { producto: Producto }) {
  return (
    <Link
      href={`/producto/${producto.id}`}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gris-borde active:scale-95 transition-transform"
    >
      {/* Imagen */}
      <div className="relative w-full aspect-square bg-crema-alt">
        {producto.imagen ? (
          <Image
            src={producto.imagen}
            alt={producto.nombre}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">🍰</div>
        )}
        {!producto.is_available && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-xs font-semibold text-gray-400 bg-white px-2 py-1 rounded-full border border-gris-borde">
              No disponible
            </span>
          </div>
        )}
        {producto.is_featured && (
          <div className="absolute top-2 left-2 bg-rosa text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            ✨ Destacado
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 pb-4">
        <p className="font-display font-bold text-cafe text-sm leading-tight line-clamp-2">
          {producto.nombre}
        </p>
        <p className="text-rosa font-bold mt-1 text-sm">
          {producto.tiene_variantes
            ? <span className="text-xs text-gray-400 font-normal">Desde ${parseFloat(producto.precio).toFixed(2)}</span>
            : `$${parseFloat(producto.precio).toFixed(2)}`
          }
        </p>
      </div>
    </Link>
  );
}
