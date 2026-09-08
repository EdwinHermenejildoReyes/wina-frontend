"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Star, TrendingUp, TrendingDown, Gift, MessageCircle } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { MiHistorialResponse } from "@/lib/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import NavBar from "@/components/NavBar";

const META_PUNTOS    = 500;
const WHATSAPP_NUMBER = "593XXXXXXXXX"; // reemplazar cuando María active el número de empresa

function labelTipo(tipo: string) {
  switch (tipo) {
    case "compra":           return "Pedido retirado";
    case "canje":            return "Canje de regalo";
    case "bono_bienvenida":  return "Bono de bienvenida";
    case "ajuste":           return "Ajuste manual";
    default:                 return tipo;
  }
}

export default function PuntosPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<MiHistorialResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.replace("/login"); return; }
    api.get("/puntos/mi_historial/")
      .then((r) => setData(r.data))
      .catch(() => router.replace("/menu"))
      .finally(() => setLoading(false));
  }, [user, authLoading, router]);

  if (authLoading || loading) return <LoadingSpinner texto="Cargando puntos..." />;
  if (!data) return null;

  const puntos     = data.puntos;
  const alcanzado  = puntos >= META_PUNTOS;
  const progreso   = Math.min((puntos / META_PUNTOS) * 100, 100);
  const faltan     = Math.max(META_PUNTOS - puntos, 0);

  const mensajeWA  = encodeURIComponent(
    `Hola Wina! Tengo ${puntos} puntos acumulados y quiero canjear mi torta de regalo 🎂`
  );
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${mensajeWA}`;

  return (
    <main className="min-h-screen bg-crema pb-10">
      <NavBar />

      {/* ── Tarjeta principal ── */}
      <div className={`mx-4 mt-4 rounded-3xl p-6 text-white text-center shadow ${alcanzado ? "bg-cafe" : "bg-rosa"}`}>
        <Star className="w-7 h-7 mx-auto mb-2 opacity-80" />
        <p className="text-5xl font-black">{puntos}</p>
        <p className="text-sm opacity-80 mt-1">puntos acumulados</p>

        {/* Barra de progreso */}
        <div className="mt-5">
          <div className="flex justify-between text-xs opacity-70 mb-1.5">
            <span>0</span>
            <span>{META_PUNTOS} pts = torta gratis</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-700"
              style={{ width: `${progreso}%` }}
            />
          </div>
          <p className="text-xs opacity-70 mt-2">
            {alcanzado
              ? `¡Superaste la meta con ${puntos - META_PUNTOS} pts extra!`
              : `Te faltan ${faltan} puntos`}
          </p>
        </div>

        <p className="text-xs opacity-50 mt-4">Ganas 10 puntos por cada $1 en pedidos retirados</p>
      </div>

      {/* ── Premio alcanzado ── */}
      {alcanzado ? (
        <div className="mx-4 mt-4 bg-white rounded-3xl p-6 shadow-sm border-2 border-cafe/20 text-center">
          <div className="w-14 h-14 bg-crema-alt rounded-full flex items-center justify-center mx-auto mb-3">
            <Gift className="w-7 h-7 text-cafe" />
          </div>
          <h2 className="font-display font-bold text-cafe text-lg">¡Tienes una torta de regalo!</h2>
          <p className="text-sm text-dark/60 mt-2 leading-relaxed">
            Escríbenos por WhatsApp para coordinar cuándo y cómo retiras tu torta.
          </p>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-2 bg-cafe text-white font-semibold py-3.5 px-6 rounded-2xl active:opacity-80 transition-opacity"
          >
            <MessageCircle className="w-5 h-5" />
            Canjear por WhatsApp
          </a>
        </div>
      ) : (
        /* ── Cómo funciona ── */
        <div className="mx-4 mt-4 bg-white rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-crema-alt rounded-full flex items-center justify-center shrink-0">
              <Gift className="w-6 h-6 text-cafe" />
            </div>
            <div>
              <p className="font-semibold text-dark text-sm">Tu próximo regalo</p>
              <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                Acumula <span className="font-semibold text-cafe">{META_PUNTOS} puntos</span> y te regalamos una torta.
                Equivale a aproximadamente <span className="font-semibold text-cafe">${(META_PUNTOS / 10).toFixed(0)} en compras</span>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Historial ── */}
      <div className="mx-4 mt-5">
        <h2 className="font-semibold text-dark text-sm mb-3">Historial</h2>
        {data.historial.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <p className="text-sm text-gray-400">Aún no tienes movimientos.</p>
            <p className="text-xs text-gray-300 mt-1">Retira tu próximo pedido para ganar puntos.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {data.historial.map((h) => {
              const esSuma = h.tipo === "compra" || h.tipo === "bono_bienvenida";
              return (
                <div key={h.id} className="bg-white rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${esSuma ? "bg-green-50" : "bg-red-50"}`}>
                    {esSuma
                      ? <TrendingUp className="w-4 h-4 text-green-500" />
                      : <TrendingDown className="w-4 h-4 text-red-400" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-dark">{labelTipo(h.tipo)}</p>
                    {h.pedido && (
                      <p className="text-xs text-gray-400">Pedido #{String(h.pedido).padStart(4, "0")}</p>
                    )}
                    <p className="text-xs text-gray-300 mt-0.5">
                      {new Date(h.created_at).toLocaleDateString("es-EC", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <p className={`font-bold text-sm ${esSuma ? "text-green-500" : "text-red-400"}`}>
                    {esSuma ? "+" : "-"}{Math.abs(h.puntos)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
