"use client";

import Link from "next/link";
import Image from "next/image";
import { Producto } from "@/lib/types";

export default function ProductoCard({ producto }: { producto: Producto }) {
  return (
    <Link
      href={`/producto/${producto.id}`}
      className="bg-white rounded-2xl overflow-hidden shadow-sm active:scale-95 transition-transform"
    >
      <div className="relative w-full aspect-square bg-gris">
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
            <span className="text-xs font-semibold text-gray-500 bg-white px-2 py-1 rounded-full">
              No disponible
            </span>
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="font-semibold text-dark text-sm leading-tight line-clamp-2">{producto.nombre}</p>
        <p className="text-rosa font-bold mt-1">${parseFloat(producto.precio).toFixed(2)}</p>
      </div>
    </Link>
  );
}
