"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CarritoFab() {
  const { totalItems, totalPrecio } = useCart();

  if (totalItems === 0) return null;

  return (
    <Link
      href="/carrito"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-rosa text-white px-5 py-3 rounded-full shadow-lg shadow-rosa/40 active:scale-95 transition-transform"
    >
      <div className="relative">
        <ShoppingCart className="w-5 h-5" />
        <span className="absolute -top-2 -right-2 bg-white text-rosa text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
          {totalItems}
        </span>
      </div>
      <span className="font-semibold text-sm">Ver carrito</span>
      <span className="font-bold text-sm">${totalPrecio.toFixed(2)}</span>
    </Link>
  );
}
