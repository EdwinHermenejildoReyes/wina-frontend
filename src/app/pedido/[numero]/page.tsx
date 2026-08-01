"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Clock, ChefHat, Package, ShoppingBag } from "lucide-react";
import api from "@/lib/api";
import type { Pedido, EstadoPedido } from "@/lib/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const ESTADO_CONFIG: Record<EstadoPedido, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  pendiente:      { label: "Recibido — lo confirmaremos pronto", icon: Clock,       color: "text-yellow-600", bg: "bg-yellow-50" },
  en_preparacion: { label: "En preparación",                      icon: ChefHat,     color: "text-orange-600", bg: "bg-orange-50" },
  listo:          { label: "¡Listo para retirar!",                icon: Package,     color: "text-green-600",  bg: "bg-green-50" },
  retirado:       { label: "Retirado",                            icon: ShoppingBag, color: "text-gray-600",   bg: "bg-gray-50" },
  cancelado:      { label: "Cancelado",                           icon: Clock,       color: "text-red-600",    bg: "bg-red-50" },
};

export default function PedidoPage() {
  const { numero } = useParams();
  const router = useRouter();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = sessionStorage.getItem(`wina_pedido_${numero}`);
    if (cached) {
      setPedido(JSON.parse(cached));
      setLoading(false);
      return;
    }
    api
      .get(`/pedidos/?numero_pedido=${numero}`)
      .then((r) => {
        const results = r.data.results ?? r.data;
        if (Array.isArray(results) && results.length > 0) {
          setPedido(results[0]);
        } else if (results?.numero_pedido) {
          setPedido(results);
        }
      })
      .catch(() => router.replace("/menu"))
      .finally(() => setLoading(false));
  }, [numero, router]);

  if (loading) return <LoadingSpinner texto="Cargando tu pedido..." />;
  if (!pedido) return null;

  const config = ESTADO_CONFIG[pedido.estado];
  const Icon = config.icon;

  return (
    <main className="min-h-screen bg-crema pb-28">
      {/* Ticket header */}
      <div className="bg-rosa px-6 pt-12 pb-10 text-center text-white">
        <p className="text-sm font-medium opacity-80 mb-1">Número de pedido</p>
        <h1 className="text-7xl font-black tracking-tight">#{pedido.numero_pedido}</h1>
        <p className="mt-3 text-sm opacity-90 font-medium">{pedido.nombre_cliente}</p>
      </div>

      {/* Estado */}
      <div className={`mx-4 mt-4 rounded-2xl p-4 flex items-center gap-3 ${config.bg}`}>
        <Icon className={`w-6 h-6 shrink-0 ${config.color}`} />
        <div>
          <p className={`font-semibold text-sm ${config.color}`}>{config.label}</p>
          {pedido.estado === "listo" && (
            <p className="text-xs text-gray-500 mt-0.5">Dirígete a la caja con este número</p>
          )}
        </div>
      </div>

      {/* Instrucción */}
      {pedido.estado !== "retirado" && pedido.estado !== "cancelado" && (
        <div className="mx-4 mt-3 bg-white rounded-2xl p-4 text-center shadow-sm">
          <p className="text-sm text-gray-600">
            Preséntalo en caja para retirar tu pedido
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Muestra este número o toma una captura de pantalla
          </p>
        </div>
      )}

      {/* Detalles del pedido */}
      <div className="mx-4 mt-3 bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gris-borde">
          <h2 className="font-semibold text-dark text-sm">Productos</h2>
        </div>
        {pedido.detalles?.map((d, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3 border-b border-gris-borde last:border-0">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-dark truncate">{d.producto_nombre}</p>
              {d.personalizacion && (
                <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{d.personalizacion}</p>
              )}
            </div>
            <div className="text-right ml-3 shrink-0">
              <p className="text-xs text-gray-400">x{d.cantidad}</p>
              <p className="text-sm font-semibold text-rosa">${(parseFloat(d.precio_unitario) * d.cantidad).toFixed(2)}</p>
            </div>
          </div>
        ))}
        <div className="flex justify-between items-center px-4 py-3 bg-gris">
          <span className="text-sm font-bold text-dark">Total</span>
          <span className="text-sm font-bold text-rosa">${parseFloat(pedido.total).toFixed(2)}</span>
        </div>
      </div>

      {pedido.notas && (
        <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-gray-500 font-semibold mb-1">Notas</p>
          <p className="text-sm text-gray-600">{pedido.notas}</p>
        </div>
      )}

      {/* CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gris-borde px-4 py-4">
        <button
          onClick={() => router.push("/menu")}
          className="w-full bg-rosa text-white font-bold py-3.5 rounded-2xl text-sm active:bg-rosa-dark"
        >
          Nuevo pedido
        </button>
      </div>
    </main>
  );
}
