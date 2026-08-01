"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { CarritoItem, Producto } from "@/lib/types";

interface CartContextType {
  items: CarritoItem[];
  totalItems: number;
  totalPrecio: number;
  agregar: (producto: Producto, cantidad: number, personalizacion: string) => void;
  quitar: (productoId: number) => void;
  actualizarCantidad: (productoId: number, cantidad: number) => void;
  limpiar: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "wina_carrito";

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

  const agregar = (producto: Producto, cantidad: number, personalizacion: string) => {
    setItems((prev) => {
      const existente = prev.find((i) => i.producto.id === producto.id);
      if (existente) {
        return prev.map((i) =>
          i.producto.id === producto.id
            ? { ...i, cantidad: i.cantidad + cantidad, personalizacion: personalizacion || i.personalizacion }
            : i
        );
      }
      return [...prev, { producto, cantidad, personalizacion }];
    });
  };

  const quitar = (productoId: number) => {
    setItems((prev) => prev.filter((i) => i.producto.id !== productoId));
  };

  const actualizarCantidad = (productoId: number, cantidad: number) => {
    if (cantidad <= 0) {
      quitar(productoId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.producto.id === productoId ? { ...i, cantidad } : i))
    );
  };

  const limpiar = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.cantidad, 0);
  const totalPrecio = items.reduce(
    (sum, i) => sum + parseFloat(i.producto.precio) * i.cantidad,
    0
  );

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
