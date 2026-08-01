"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Star, TrendingUp, TrendingDown } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { MiHistorialResponse } from "@/lib/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function PuntosPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<MiHistorialResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    api
      .get("/puntos/mi_historial/")
      .then((r) => setData(r.data))
      .catch(() => router.replace("/menu"))
      .finally(() => setLoading(false));
  }, [user, authLoading, router]);

  if (authLoading || loading) return <LoadingSpinner texto="Cargando puntos..." />;
  if (!data) return null;

  return (
    <main className="min-h-screen bg-crema pb-10">
      {/* Header */}
      <div className="bg-white px-4 pt-6 pb-4 shadow-sm flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 -ml-2 rounded-xl active:bg-gris">
          <ArrowLeft className="w-5 h-5 text-dark" />
        </button>
        <h1 className="font-bold text-dark">Mis puntos</h1>
      </div>

      {/* Saldo */}
      <div className="mx-4 mt-4 bg-rosa rounded-3xl p-6 text-white text-center shadow">
        <Star className="w-8 h-8 mx-auto mb-2 opacity-80" />
        <p className="text-5xl font-black">{data.puntos}</p>
        <p className="text-sm opacity-80 mt-1">puntos disponibles</p>
        <p className="text-xs opacity-60 mt-3">Ganas 10 puntos por cada $1 en pedidos retirados</p>
      </div>

      {/* Historial */}
      <div className="mx-4 mt-4">
        <h2 className="font-semibold text-dark text-sm mb-3">Historial</h2>
        {data.historial.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <p className="text-sm text-gray-400">Aún no tienes movimientos de puntos.</p>
            <p className="text-xs text-gray-300 mt-1">Retira tu próximo pedido para ganar puntos.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {data.historial.map((h) => (
              <div key={h.id} className="bg-white rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${h.tipo === "compra" ? "bg-green-50" : "bg-red-50"}`}>
                  {h.tipo === "compra" ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-dark">
                    {h.tipo === "compra" ? "Pedido retirado" : "Canje de puntos"}
                  </p>
                  {h.pedido && (
                    <p className="text-xs text-gray-400">Pedido #{String(h.pedido).padStart(4, "0")}</p>
                  )}
                  <p className="text-xs text-gray-300 mt-0.5">{new Date(h.created_at).toLocaleDateString("es-EC", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
                <p className={`font-bold text-sm ${h.tipo === "compra" ? "text-green-500" : "text-red-400"}`}>
                  {h.tipo === "compra" ? "+" : "-"}{Math.abs(h.puntos)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
