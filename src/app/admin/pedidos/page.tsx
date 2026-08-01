"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { Pedido, EstadoPedido } from "@/lib/types";

const ESTADOS: { value: EstadoPedido | "todos"; label: string }[] = [
  { value: "todos",          label: "Todos" },
  { value: "pendiente",      label: "Pendiente" },
  { value: "confirmado",     label: "Confirmado" },
  { value: "en_preparacion", label: "En preparación" },
  { value: "listo",          label: "Listo" },
  { value: "retirado",       label: "Retirado" },
  { value: "cancelado",      label: "Cancelado" },
];

const ESTADO_COLORES: Record<EstadoPedido, string> = {
  pendiente:      "bg-yellow-100 text-yellow-700",
  confirmado:     "bg-blue-100 text-blue-700",
  en_preparacion: "bg-orange-100 text-orange-700",
  listo:          "bg-green-100 text-green-700",
  retirado:       "bg-gray-100 text-gray-600",
  cancelado:      "bg-red-100 text-red-600",
};

const TRANSICIONES: Record<EstadoPedido, { accion: string; label: string } | null> = {
  pendiente:      { accion: "confirmar",   label: "Confirmar" },
  confirmado:     { accion: "preparar",    label: "En preparación" },
  en_preparacion: { accion: "listo",       label: "Marcar listo" },
  listo:          { accion: "retirar",     label: "Retirado" },
  retirado:       null,
  cancelado:      null,
};

export default function AdminPedidosPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filtro, setFiltro] = useState<EstadoPedido | "todos">("todos");
  const [loading, setLoading] = useState(true);
  const [actualizando, setActualizando] = useState<string | null>(null);

  const cargar = useCallback(async (silencioso = false) => {
    if (!silencioso) setLoading(true);
    try {
      const params = filtro !== "todos" ? { estado: filtro } : {};
      const r = await api.get("/pedidos/", { params });
      const results = r.data.results ?? r.data;
      setPedidos(Array.isArray(results) ? results : []);
    } catch {
      if (!silencioso) toast.error("No se pudieron cargar los pedidos");
    } finally {
      if (!silencioso) setLoading(false);
    }
  }, [filtro]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  useEffect(() => {
    const interval = setInterval(() => cargar(true), 30_000);
    return () => clearInterval(interval);
  }, [cargar]);

  const avanzar = async (pedido: Pedido) => {
    const trans = TRANSICIONES[pedido.estado];
    if (!trans) return;
    setActualizando(pedido.numero_pedido);
    try {
      await api.post(`/pedidos/${pedido.id}/${trans.accion}/`);
      await cargar(true);
      toast.success(`Pedido #${pedido.numero_pedido} → ${trans.label}`);
    } catch {
      toast.error("No se pudo actualizar el estado");
    } finally {
      setActualizando(null);
    }
  };

  const cancelar = async (pedido: Pedido) => {
    if (!confirm(`¿Cancelar el pedido #${pedido.numero_pedido}?`)) return;
    setActualizando(pedido.numero_pedido);
    try {
      await api.post(`/pedidos/${pedido.id}/cancelar/`);
      await cargar(true);
      toast.success(`Pedido #${pedido.numero_pedido} cancelado`);
    } catch {
      toast.error("No se pudo cancelar el pedido");
    } finally {
      setActualizando(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/menu");
  };

  const pedidosFiltrados = filtro === "todos"
    ? pedidos
    : pedidos.filter((p) => p.estado === filtro);

  return (
    <main className="min-h-screen bg-crema pb-10">
      {/* Header */}
      <div className="bg-white px-4 pt-6 pb-4 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="font-bold text-dark">Pedidos</h1>
          <p className="text-xs text-gray-400">Hola, {user?.first_name || user?.username}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => cargar()} className="p-2 rounded-xl active:bg-gris">
            <RefreshCw className={`w-5 h-5 text-gray-400 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={handleLogout} className="p-2 rounded-xl active:bg-gris">
            <LogOut className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="px-4 mt-4 overflow-x-auto">
        <div className="flex gap-2 pb-1 w-max">
          {ESTADOS.map((e) => (
            <button
              key={e.value}
              onClick={() => setFiltro(e.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                filtro === e.value
                  ? "bg-rosa text-white"
                  : "bg-white text-gray-500 border border-gris-borde"
              }`}
            >
              {e.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista */}
      <div className="px-4 mt-4 space-y-3">
        {loading ? (
          <p className="text-center text-gray-400 py-12 text-sm">Cargando pedidos...</p>
        ) : pedidosFiltrados.length === 0 ? (
          <p className="text-center text-gray-400 py-12 text-sm">No hay pedidos con este estado.</p>
        ) : (
          pedidosFiltrados.map((p) => {
            const trans = TRANSICIONES[p.estado];
            const bloqueado = actualizando === p.numero_pedido;
            return (
              <div key={p.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="px-4 py-3 flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black text-rosa">#{p.numero_pedido}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${ESTADO_COLORES[p.estado]}`}>
                        {ESTADOS.find((e) => e.value === p.estado)?.label}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-dark mt-0.5">{p.nombre_cliente}</p>
                    {p.telefono_cliente && (
                      <p className="text-xs text-gray-400">{p.telefono_cliente}</p>
                    )}
                  </div>
                  <p className="text-sm font-bold text-dark shrink-0">${parseFloat(p.total).toFixed(2)}</p>
                </div>

                {p.detalles && p.detalles.length > 0 && (
                  <div className="border-t border-gris-borde px-4 py-2 space-y-1">
                    {p.detalles.map((d, i) => (
                      <div key={i} className="flex justify-between text-xs text-gray-500">
                        <span>{d.cantidad}x {d.producto_nombre}</span>
                        {d.personalizacion && (
                          <span className="text-gray-400 truncate ml-2 max-w-[60%]">{d.personalizacion}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {p.notas && (
                  <div className="px-4 pb-2">
                    <p className="text-xs text-gray-400 italic">"{p.notas}"</p>
                  </div>
                )}

                {(trans || (p.estado !== "cancelado" && p.estado !== "retirado")) && (
                  <div className="border-t border-gris-borde px-4 py-3 flex gap-2">
                    {trans && (
                      <button
                        onClick={() => avanzar(p)}
                        disabled={bloqueado}
                        className="flex-1 bg-rosa text-white text-sm font-semibold py-2 rounded-xl disabled:opacity-60 active:bg-rosa-dark"
                      >
                        {bloqueado ? "..." : trans.label}
                      </button>
                    )}
                    {p.estado !== "cancelado" && p.estado !== "retirado" && (
                      <button
                        onClick={() => cancelar(p)}
                        disabled={bloqueado}
                        className="px-3 py-2 border border-red-200 text-red-400 text-sm rounded-xl disabled:opacity-60 active:bg-red-50"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}
