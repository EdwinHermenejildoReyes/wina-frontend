"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import type { PedidoCreatePayload } from "@/lib/types";

export default function CarritoPage() {
  const router = useRouter();
  const { items, totalItems, totalPrecio, quitar, actualizarCantidad, limpiar } = useCart();
  const { user } = useAuth();

  const [nombre, setNombre] = useState(user ? `${user.first_name} ${user.last_name}`.trim() || user.username : "");
  const [telefono, setTelefono] = useState(user?.telefono || "");
  const [notas, setNotas] = useState("");
  const [enviando, setEnviando] = useState(false);

  if (totalItems === 0) {
    return (
      <main className="min-h-screen bg-crema flex flex-col items-center justify-center px-6 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-lg font-bold text-dark">Tu carrito está vacío</h2>
        <p className="text-sm text-gray-400 mt-1">Agrega productos desde el menú</p>
        <button
          onClick={() => router.push("/menu")}
          className="mt-6 bg-rosa text-white font-semibold px-6 py-3 rounded-2xl active:bg-rosa-dark"
        >
          Ver menú
        </button>
      </main>
    );
  }

  const handlePedir = async () => {
    if (!nombre.trim()) {
      toast.error("Por favor ingresa tu nombre");
      return;
    }
    setEnviando(true);
    try {
      const payload: PedidoCreatePayload = {
        nombre_cliente: nombre.trim(),
        telefono_cliente: telefono.trim(),
        notas: notas.trim(),
        detalles: items.map((i) => ({
          producto: i.producto.id,
          cantidad: i.cantidad,
          personalizacion: i.personalizacion,
        })),
      };
      const res = await api.post("/pedidos/", payload);
      limpiar();
      router.push(`/pedido/${res.data.numero_pedido}`);
    } catch {
      toast.error("No se pudo procesar el pedido. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className="min-h-screen bg-crema pb-44">
      {/* Header */}
      <div className="bg-white px-4 pt-6 pb-4 shadow-sm flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 -ml-2 rounded-xl active:bg-gris">
          <ArrowLeft className="w-5 h-5 text-dark" />
        </button>
        <h1 className="font-bold text-dark">Tu pedido</h1>
      </div>

      <div className="px-4 mt-4 space-y-3">
        {/* Items */}
        {items.map((item) => (
          <div key={item.producto.id} className="bg-white rounded-2xl p-4 flex gap-3 shadow-sm">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gris shrink-0">
              {item.producto.imagen ? (
                <Image src={item.producto.imagen} alt={item.producto.nombre} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">🍰</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-dark truncate">{item.producto.nombre}</p>
              {item.personalizacion && (
                <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{item.personalizacion}</p>
              )}
              <p className="text-rosa font-bold mt-1 text-sm">
                ${(parseFloat(item.producto.precio) * item.cantidad).toFixed(2)}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <button onClick={() => actualizarCantidad(item.producto.id, item.cantidad - 1)} className="w-7 h-7 rounded-full border border-gris-borde flex items-center justify-center">
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-sm font-bold">{item.cantidad}</span>
                <button onClick={() => actualizarCantidad(item.producto.id, item.cantidad + 1)} className="w-7 h-7 rounded-full bg-rosa text-white flex items-center justify-center">
                  <Plus className="w-3 h-3" />
                </button>
                <button onClick={() => quitar(item.producto.id)} className="ml-auto p-1 text-gray-300 active:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Datos del cliente */}
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
          <h2 className="font-semibold text-dark">¿A nombre de quién?</h2>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Nombre *</label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
              className="w-full border border-gris-borde rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rosa"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Teléfono (opcional)</label>
            <input
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="0999 999 999"
              type="tel"
              className="w-full border border-gris-borde rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rosa"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Notas generales (opcional)</label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Alguna indicación especial para todo el pedido..."
              rows={2}
              className="w-full border border-gris-borde rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rosa resize-none"
            />
          </div>
        </div>

        {!user && (
          <p className="text-xs text-gray-400 text-center">
            ¿Tienes cuenta?{" "}
            <a href="/login" className="text-rosa font-medium">Inicia sesión</a>{" "}
            para acumular puntos con tu pedido.
          </p>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gris-borde px-4 py-4">
        <div className="flex justify-between text-sm mb-3">
          <span className="text-gray-500">{totalItems} producto{totalItems !== 1 ? "s" : ""}</span>
          <span className="font-bold text-dark">Total: ${totalPrecio.toFixed(2)}</span>
        </div>
        <button
          onClick={handlePedir}
          disabled={enviando}
          className="w-full bg-rosa text-white font-bold py-3.5 rounded-2xl active:bg-rosa-dark disabled:opacity-60 transition-colors text-sm"
        >
          {enviando ? "Procesando..." : "Confirmar pedido"}
        </button>
      </div>
    </main>
  );
}
