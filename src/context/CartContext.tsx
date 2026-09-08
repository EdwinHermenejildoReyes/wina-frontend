"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { CarritoItem, Producto, VarianteProducto, ExtraWina } from "@/lib/types";

interface CartContextType {
  items: CarritoItem[];
  totalItems: number;
  totalPrecio: number;
  agregar: (producto: Producto, cantidad: number, personalizacion: string, variante?: VarianteProducto, extras?: ExtraWina[]) => void;
  quitar: (carritoKey: string) => void;
  actualizarCantidad: (carritoKey: string, cantidad: number) => void;
  limpiar: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "wina_carrito";

function makeKey(productoId: number, varianteId?: number) {
  return `${productoId}-${varianteId ?? "base"}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CarritoItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch { /* ignorar */ }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const agregar = (
    producto: Producto,
    cantidad: number,
    personalizacion: string,
    variante?: VarianteProducto,
    extras?: ExtraWina[],
  ) => {
    const key = makeKey(producto.id, variante?.id);
    setItems((prev) => {
      const existente = prev.find((i) => i.carritoKey === key);
      if (existente) {
        return prev.map((i) =>
          i.carritoKey === key
            ? {
                ...i,
                cantidad: i.cantidad + cantidad,
                personalizacion: personalizacion || i.personalizacion,
                extras: extras ?? i.extras,
              }
            : i
        );
      }
      return [...prev, { carritoKey: key, producto, variante, cantidad, personalizacion, extras: extras ?? [] }];
    });
  };

  const quitar = (carritoKey: string) => {
    setItems((prev) => prev.filter((i) => i.carritoKey !== carritoKey));
  };

  const actualizarCantidad = (carritoKey: string, cantidad: number) => {
    if (cantidad <= 0) {
      quitar(carritoKey);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.carritoKey === carritoKey ? { ...i, cantidad } : i))
    );
  };

  const limpiar = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.cantidad, 0);

  const totalPrecio = items.reduce((sum, i) => {
    const precio = parseFloat(i.variante?.precio_efectivo ?? i.producto.precio);
    const extrasTotal = i.extras.reduce((s, e) => s + e.precio, 0);
    return sum + (precio + extrasTotal) * i.cantidad;
  }, 0);

  return (
    <CartContext.Provider value={{ items, totalItems, totalPrecio, agregar, quitar, actualizarCantidad, limpiar }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
