"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Clock, ChefHat, Package, ShoppingBag, CheckCircle, XCircle } from "lucide-react";
import api from "@/lib/api";
import type { Pedido, EstadoPedido } from "@/lib/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import NavBar from "@/components/NavBar";

// ── Config de estados ─────────────────────────────────────────────────────────

const ESTADO_CONFIG: Record<EstadoPedido, {
  label: string;
  sublabel?: string;
  icon: React.ElementType;
  textColor: string;
  borderColor: string;
  bgColor: string;
}> = {
  pendiente:      {
    label:      "Pedido recibido",
    sublabel:   "Lo confirmaremos muy pronto",
    icon:       Clock,
    textColor:  "text-amber-700",
    borderColor:"border-amber-200",
    bgColor:    "bg-amber-50",
  },
  en_preparacion: {
    label:      "En preparación",
    sublabel:   "Estamos trabajando en tu pedido",
    icon:       ChefHat,
    textColor:  "text-orange-700",
    borderColor:"border-orange-200",
    bgColor:    "bg-orange-50",
  },
  listo:          {
    label:      "¡Listo para retirar!",
    sublabel:   "Dirígete a la caja con este número",
    icon:       Package,
    textColor:  "text-green-700",
    borderColor:"border-green-200",
    bgColor:    "bg-green-50",
  },
  retirado:       {
    label:      "Pedido retirado",
    sublabel:   "¡Gracias por tu compra!",
    icon:       CheckCircle,
    textColor:  "text-cafe",
    borderColor:"border-gris-borde",
    bgColor:    "bg-crema-alt",
  },
  cancelado:      {
    label:      "Pedido cancelado",
    icon:       XCircle,
    textColor:  "text-red-600",
    borderColor:"border-red-200",
    bgColor:    "bg-red-50",
  },
};

// ── Componente ────────────────────────────────────────────────────────────────

export default function PedidoPage() {
  const { numero } = useParams();
  const router     = useRouter();
  const [pedido, setPedido]   = useState<Pedido | null>(null);
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
        if (Array.isArray(results) && results.length > 0) setPedido(results[0]);
        else if (results?.numero_pedido) setPedido(results);
      })
      .catch(() => router.replace("/menu"))
      .finally(() => setLoading(false));
  }, [numero, router]);

  if (loading) return <LoadingSpinner texto="Cargando tu pedido..." />;
  if (!pedido) return null;

  const cfg  = ESTADO_CONFIG[pedido.estado];
  const Icon = cfg.icon;

  return (
    <main className="min-h-screen bg-crema pb-32">
      <NavBar />

      {/* ── Hero bg-cafe ── */}
      <section className="bg-cafe px-6 pt-8 pb-10 text-center">
        <p className="font-script text-rosa text-lg mb-1">¡Gracias por tu pedido! ♡</p>
        <p className="text-crema/50 text-xs uppercase tracking-widest mb-3">Número de pedido</p>
        <div className="inline-block bg-white/10 border border-white/20 rounded-3xl px-8 py-4">
          <h1 className="font-display text-7xl md:text-8xl font-bold text-white leading-none tracking-tight">
            #{pedido.numero_pedido}
          </h1>
        </div>
        <p className="mt-4 font-semibold text-crema/80 text-sm">{pedido.nombre_cliente}</p>
      </section>

      <div className="max-w-2xl mx-auto px-4 -mt-4 space-y-4">

        {/* ── Badge de estado ── */}
        <div className={`rounded-3xl p-4 flex items-start gap-3 border ${cfg.bgColor} ${cfg.borderColor}`}>
          <div className={`w-10 h-10 rounded-full bg-white/60 flex items-center justify-center shrink-0 ${cfg.textColor}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className={`font-display font-bold text-base ${cfg.textColor}`}>{cfg.label}</p>
            {cfg.sublabel && (
              <p className={`text-xs mt-0.5 ${cfg.textColor} opacity-70`}>{cfg.sublabel}</p>
            )}
          </div>
        </div>

        {/* ── Instrucción de retiro ── */}
        {pedido.estado !== "retirado" && pedido.estado !== "cancelado" && (
          <div className="bg-white rounded-3xl px-5 py-4 border border-gris-borde shadow-sm text-center">
            <p className="text-sm text-dark/70">
              Presenta este número en caja para retirar tu pedido
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Muestra la pantalla o toma una captura de pantalla
            </p>
          </div>
        )}

        {/* ── Detalles del pedido ── */}
        <div className="bg-white rounded-3xl overflow-hidden border border-gris-borde shadow-sm">
          <div className="px-5 py-4 border-b border-gris-borde">
            <h2 className="font-display font-bold text-cafe text-base">Detalle del pedido</h2>
          </div>

          {pedido.detalles?.map((d, i) => (
            <div key={i} className="flex items-start gap-3 px-5 py-3.5 border-b border-gris-borde last:border-0">
              {/* Cantidad badge */}
              <div className="shrink-0 w-7 h-7 rounded-full bg-crema-alt border border-gris-borde flex items-center justify-center">
                <span className="text-xs font-bold text-cafe">{d.cantidad}</span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-dark leading-tight">{d.producto_nombre}</p>
                {d.variante_label && (
                  <p className="text-xs text-gray-400 mt-0.5">{d.variante_label}</p>
                )}
                {d.personalizacion && (
                  <p className="text-xs text-gray-400 mt-0.5 italic">"{d.personalizacion}"</p>
                )}
              </div>

              <p className="shrink-0 text-sm font-bold text-rosa ml-2">
                ${(parseFloat(d.precio_unitario) * d.cantidad).toFixed(2)}
              </p>
            </div>
          ))}

          {/* Total */}
          <div className="flex justify-between items-center px-5 py-4 bg-crema-alt border-t border-gris-borde">
            <span className="font-display font-bold text-cafe text-sm">Total</span>
            <span className="font-display font-bold text-rosa text-xl">
              ${parseFloat(pedido.total).toFixed(2)}
            </span>
          </div>
        </div>

        {/* ── Fecha de entrega ── */}
        {pedido.fecha_entrega && (
          <div className="bg-white rounded-3xl px-5 py-4 border border-gris-borde shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-crema-alt border border-gris-borde flex items-center justify-center shrink-0 text-lg">
              📅
            </div>
            <div>
              <p className="text-xs font-semibold text-dark/50 uppercase tracking-wide">Fecha de entrega</p>
              <p className="text-sm font-bold text-cafe mt-0.5">
                {new Date(pedido.fecha_entrega + "T00:00:00").toLocaleDateString("es-EC", {
                  weekday: "long", year: "numeric", month: "long", day: "numeric"
                })}
              </p>
            </div>
          </div>
        )}

        {/* ── Notas ── */}
        {pedido.notas && (
          <div className="bg-white rounded-3xl px-5 py-4 border border-gris-borde shadow-sm">
            <p className="text-xs font-semibold text-dark/50 uppercase tracking-wide mb-2">Notas</p>
            <p className="text-sm text-dark/70 italic">"{pedido.notas}"</p>
          </div>
        )}

      </div>

      {/* ── Botón fijo ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gris-borde px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => router.push("/menu")}
            className="w-full bg-cafe text-white font-semibold py-4 rounded-2xl active:opacity-80 transition-opacity"
          >
            Hacer otro pedido
          </button>
        </div>
      </div>
    </main>
  );
}
