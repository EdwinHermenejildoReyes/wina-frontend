"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import type { Producto } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import CarritoFab from "@/components/CarritoFab";

export default function ProductoPage() {
  const { id } = useParams();
  const router = useRouter();
  const { agregar } = useCart();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [cantidad, setCantidad] = useState(1);
  const [personalizacion, setPersonalizacion] = useState("");

  useEffect(() => {
    api
      .get(`/productos/${id}/`)
      .then((r) => setProducto(r.data))
      .catch(() => router.replace("/menu"))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) return <LoadingSpinner />;
  if (!producto) return null;

  const subtotal = parseFloat(producto.precio) * cantidad;

  const handleAgregar = () => {
    agregar(producto, cantidad, personalizacion);
    toast.success(`${producto.nombre} agregado al carrito`);
    router.back();
  };

  return (
    <main className="min-h-screen bg-crema pb-28">
      {/* Imagen */}
      <div className="relative w-full aspect-square bg-gris">
        {producto.imagen ? (
          <Image src={producto.imagen} alt={producto.nombre} fill className="object-cover" priority />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-8xl">🍰</div>
        )}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-xl shadow"
        >
          <ArrowLeft className="w-5 h-5 text-dark" />
        </button>
      </div>

      {/* Info */}
      <div className="bg-white rounded-t-3xl -mt-4 relative px-5 pt-6 pb-4 shadow-sm">
        <h1 className="text-xl font-bold text-dark leading-tight">{producto.nombre}</h1>
        <p className="text-2xl font-bold text-rosa mt-1">${parseFloat(producto.precio).toFixed(2)}</p>

        {producto.descripcion && (
          <p className="text-sm text-gray-500 mt-3 leading-relaxed">{producto.descripcion}</p>
        )}

        {/* Personalización */}
        {producto.permite_personalizacion && (
          <div className="mt-5">
            <label className="block text-sm font-semibold text-dark mb-2">
              Personalización <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <textarea
              value={personalizacion}
              onChange={(e) => setPersonalizacion(e.target.value)}
              placeholder="Ej: Escríbeme 'Feliz Cumpleaños Ana', con rosas rosadas..."
              rows={3}
              className="w-full border border-gris-borde rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rosa resize-none"
            />
          </div>
        )}

        {/* Cantidad */}
        <div className="flex items-center justify-between mt-6">
          <span className="font-semibold text-dark">Cantidad</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCantidad(Math.max(1, cantidad - 1))}
              className="w-9 h-9 rounded-full border-2 border-gris-borde flex items-center justify-center active:bg-gris"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-bold text-lg w-6 text-center">{cantidad}</span>
            <button
              onClick={() => setCantidad(cantidad + 1)}
              className="w-9 h-9 rounded-full bg-rosa text-white flex items-center justify-center active:bg-rosa-dark"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Botón agregar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gris-borde px-5 py-4 safe-area-inset-bottom">
        <button
          onClick={handleAgregar}
          disabled={!producto.is_available}
          className="w-full bg-rosa text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 active:bg-rosa-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Agregar al carrito — ${subtotal.toFixed(2)}</span>
        </button>
      </div>

      <CarritoFab />
    </main>
  );
}
