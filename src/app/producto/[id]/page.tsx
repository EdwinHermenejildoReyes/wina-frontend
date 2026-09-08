"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Minus, Plus, ShoppingCart, Check } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import type { Producto, VarianteProducto, ExtraWina } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import NavBar from "@/components/NavBar";

// ── helpers ───────────────────────────────────────────────────────────────────

function uniqueBy<T>(arr: T[], key: keyof T): T[] {
  const seen = new Set();
  return arr.filter((item) => {
    const val = item[key];
    if (seen.has(val)) return false;
    seen.add(val);
    return true;
  });
}

function Pill({
  label,
  activo,
  deshabilitado,
  onClick,
}: {
  label: string;
  activo: boolean;
  deshabilitado: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={deshabilitado}
      className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors
        ${activo
          ? "bg-cafe text-white border-cafe"
          : deshabilitado
          ? "bg-gris text-gray-300 border-gris-borde cursor-not-allowed"
          : "bg-white text-dark border-gris-borde active:bg-crema"
        }`}
    >
      {label}
    </button>
  );
}

// ── componente principal ──────────────────────────────────────────────────────

export default function ProductoPage() {
  const { id }      = useParams();
  const router      = useRouter();
  const { agregar } = useCart();

  const [producto, setProducto]               = useState<Producto | null>(null);
  const [loading, setLoading]                 = useState(true);
  const [cantidad, setCantidad]               = useState(1);
  const [personalizacion, setPersonalizacion] = useState("");

  const [estiloSel,  setEstiloSel]  = useState<number | null>(null);
  const [saborSel,   setSaborSel]   = useState<number | null>(null);
  const [rellenoSel, setRellenoSel] = useState<number | null>(null);
  const [porcionSel, setPorcionSel] = useState<number | null>(null);

  const [extrasDisp,          setExtrasDisp]          = useState<ExtraWina[]>([]);
  const [extrasSeleccionados, setExtrasSeleccionados] = useState<ExtraWina[]>([]);
  const [extraModal,          setExtraModal]          = useState<ExtraWina | null>(null);

  const toggleExtra = (extra: ExtraWina) => {
    setExtrasSeleccionados((prev) => {
      const existe = prev.some((e) => e.id === extra.id);
      return existe ? prev.filter((e) => e.id !== extra.id) : [...prev, extra];
    });
  };

  const extrasTotal = extrasSeleccionados.reduce((s, e) => s + e.precio, 0);

  useEffect(() => {
    api.get("/extras/").then((r) => {
      const lista = Array.isArray(r.data) ? r.data : (r.data.results ?? []);
      setExtrasDisp(lista.map((e: { id: number; nombre: string; categoria: string; precio: string; orden: number }) => ({
        ...e,
        precio: parseFloat(e.precio),
      })));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    api
      .get(`/productos/${id}/`)
      .then((r) => {
        const p: Producto = r.data;
        setProducto(p);
        if (p.tiene_variantes && p.variantes?.length) {
          const estilos = uniqueBy(p.variantes.filter(v => v.estilo), 'estilo');
          if (estilos.length === 1) setEstiloSel(estilos[0].estilo);
        }
      })
      .catch(() => router.replace("/menu"))
      .finally(() => setLoading(false));
  }, [id, router]);

  const variantes: VarianteProducto[] = producto?.variantes ?? [];

  const estilosDisp = useMemo(() =>
    uniqueBy(variantes, 'estilo').map(v => ({ id: v.estilo, nombre: v.estilo_nombre })),
  [variantes]);

  const saboresDisp = useMemo(() =>
    uniqueBy(
      variantes.filter(v => !estiloSel || v.estilo === estiloSel),
      'sabor'
    ).map(v => ({ id: v.sabor, nombre: v.sabor_nombre })),
  [variantes, estiloSel]);

  const rellenosDisp = useMemo(() =>
    uniqueBy(
      variantes.filter(v =>
        (!estiloSel || v.estilo === estiloSel) &&
        (!saborSel  || v.sabor  === saborSel)
      ),
      'relleno'
    ).map(v => ({ id: v.relleno, nombre: v.relleno_nombre })),
  [variantes, estiloSel, saborSel]);

  const porcionesDisp = useMemo(() =>
    uniqueBy(
      variantes.filter(v =>
        (!estiloSel  || v.estilo  === estiloSel) &&
        (!saborSel   || v.sabor   === saborSel)  &&
        (!rellenoSel || v.relleno === rellenoSel)
      ),
      'porcion'
    ).map(v => ({ id: v.porcion, cantidad: v.porcion_cantidad }))
      .sort((a, b) => a.cantidad - b.cantidad),
  [variantes, estiloSel, saborSel, rellenoSel]);

  const varianteSeleccionada = useMemo(() =>
    (estiloSel && saborSel && rellenoSel && porcionSel)
      ? variantes.find(v =>
          v.estilo  === estiloSel  &&
          v.sabor   === saborSel   &&
          v.relleno === rellenoSel &&
          v.porcion === porcionSel
        ) ?? null
      : null,
  [variantes, estiloSel, saborSel, rellenoSel, porcionSel]);

  const seleccionarEstilo = (id: number) => { setEstiloSel(id); setSaborSel(null); setRellenoSel(null); setPorcionSel(null); };
  const seleccionarSabor  = (id: number) => { setSaborSel(id);  setRellenoSel(null); setPorcionSel(null); };
  const seleccionarRelleno = (id: number) => { setRellenoSel(id); setPorcionSel(null); };

  if (loading) return <LoadingSpinner />;
  if (!producto) return null;

  const tieneVariantes    = producto.tiene_variantes && variantes.length > 0;
  const seleccionCompleta = tieneVariantes ? varianteSeleccionada !== null : true;

  const precioMostrar = varianteSeleccionada
    ? parseFloat(varianteSeleccionada.precio_efectivo)
    : tieneVariantes
    ? null
    : parseFloat(producto.precio);

  const subtotal = precioMostrar !== null ? (precioMostrar + extrasTotal) * cantidad : null;

  const handleAgregar = () => {
    agregar(producto, cantidad, personalizacion, varianteSeleccionada ?? undefined, extrasSeleccionados);
    toast.success(`${producto.nombre} agregado al carrito`);
    router.back();
  };

  return (
    <main className="min-h-screen bg-crema pb-28">
      <NavBar />

      {/* ── Hero bg-cafe ── */}
      <section className="bg-cafe px-6 pt-6 pb-0">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-crema/60 hover:text-crema text-sm mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>
          <p className="font-script text-rosa text-base">
            {producto.permite_personalizacion ? "Personaliza tu pedido ♡" : "Hecho con amor ♡"}
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mt-0.5 pb-6">
            {producto.nombre}
          </h1>
        </div>
      </section>

      {/* ── Imagen superpuesta al hero ── */}
      <div className="max-w-2xl mx-auto px-4 -mt-4 relative z-10">
        <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-crema-alt shadow-md border border-gris-borde">
          {producto.imagen ? (
            <Image
              src={producto.imagen}
              alt={producto.nombre}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-8xl">🍰</div>
          )}
          {!producto.is_available && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-3xl">
              <span className="font-semibold text-gray-500 bg-white px-4 py-2 rounded-full border border-gris-borde">
                No disponible
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Panel de información ── */}
      <div className="max-w-2xl mx-auto px-4 mt-4 space-y-4">

        {/* Precio */}
        <div className="bg-white rounded-3xl px-5 py-4 shadow-sm border border-gris-borde">
          <p className="text-2xl font-bold text-rosa">
            {precioMostrar !== null
              ? `$${precioMostrar.toFixed(2)}`
              : <span className="text-base text-gray-400 font-normal">Selecciona las opciones para ver el precio</span>
            }
          </p>
          {producto.descripcion && (
            <p className="text-sm text-dark/60 mt-2 leading-relaxed">{producto.descripcion}</p>
          )}
        </div>

        {/* ── Selectores de variante ── */}
        {tieneVariantes && (
          <div className="bg-white rounded-3xl px-5 py-5 shadow-sm border border-gris-borde space-y-5">

            <h2 className="font-display font-bold text-cafe text-base">Personaliza tu torta</h2>

            {estilosDisp.length > 1 && (
              <div>
                <p className="text-xs font-semibold text-dark/50 uppercase tracking-wide mb-2">Estilo</p>
                <div className="flex flex-wrap gap-2">
                  {estilosDisp.map((e) => (
                    <Pill key={e.id} label={e.nombre} activo={estiloSel === e.id} deshabilitado={false} onClick={() => seleccionarEstilo(e.id)} />
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-xs font-semibold text-dark/50 uppercase tracking-wide mb-2">Sabor</p>
              <div className="flex flex-wrap gap-2">
                {saboresDisp.map((s) => (
                  <Pill key={s.id} label={s.nombre} activo={saborSel === s.id} deshabilitado={false} onClick={() => seleccionarSabor(s.id)} />
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-dark/50 uppercase tracking-wide mb-2">Relleno</p>
              <div className="flex flex-wrap gap-2">
                {rellenosDisp.map((r) => (
                  <Pill key={r.id} label={r.nombre} activo={rellenoSel === r.id} deshabilitado={!saborSel} onClick={() => seleccionarRelleno(r.id)} />
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-dark/50 uppercase tracking-wide mb-2">Porciones</p>
              <div className="flex flex-wrap gap-2">
                {porcionesDisp.map((p) => (
                  <Pill key={p.id} label={`${p.cantidad} personas`} activo={porcionSel === p.id} deshabilitado={!rellenoSel} onClick={() => setPorcionSel(p.id)} />
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Personalización */}
        {producto.permite_personalizacion && (
          <div className="bg-white rounded-3xl px-5 py-5 shadow-sm border border-gris-borde">
            <label className="block font-display font-bold text-cafe text-base mb-3">
              Mensaje personalizado
            </label>
            <textarea
              value={personalizacion}
              onChange={(e) => setPersonalizacion(e.target.value)}
              placeholder='Ej: "Feliz Cumpleaños Ana", con rosas rosadas...'
              rows={3}
              className="w-full border border-gris-borde rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rosa resize-none bg-crema-alt placeholder:text-gray-400"
            />
          </div>
        )}

        {/* ── Extras ── */}
        {extrasDisp.length > 0 && (() => {
          const grupos = extrasDisp.reduce<Record<string, ExtraWina[]>>((acc, e) => {
            const cat = e.categoria || 'Otros';
            (acc[cat] ??= []).push(e);
            return acc;
          }, {});
          return (
            <div className="bg-white rounded-3xl px-5 py-5 shadow-sm border border-gris-borde">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-cafe text-base">Extras</h2>
                <span className="text-xs text-gray-400 bg-crema-alt px-2 py-1 rounded-full">opcionales</span>
              </div>

              <div className="space-y-5">
                {Object.entries(grupos).map(([cat, lista]) => (
                  <div key={cat}>
                    <p className="text-xs font-semibold text-dark/40 uppercase tracking-wide mb-2">{cat}</p>
                    <div className="flex flex-wrap gap-2">
                      {lista.map((extra) => {
                        const seleccionado = extrasSeleccionados.some((e) => e.id === extra.id);
                        return (
                          <button
                            key={extra.id}
                            onClick={() => setExtraModal(extra)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium border transition-colors
                              ${seleccionado
                                ? "bg-cafe text-white border-cafe"
                                : "bg-white text-dark border-gris-borde active:bg-crema"
                              }`}
                          >
                            {seleccionado && <Check className="w-3.5 h-3.5 shrink-0" />}
                            {extra.nombre}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {extrasSeleccionados.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gris-borde flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {extrasSeleccionados.length} extra{extrasSeleccionados.length > 1 ? "s" : ""} seleccionado{extrasSeleccionados.length > 1 ? "s" : ""}
                  </span>
                  <span className="font-semibold text-cafe">+${extrasTotal.toFixed(2)}</span>
                </div>
              )}
            </div>
          );
        })()}

        {/* Cantidad */}
        <div className="bg-white rounded-3xl px-5 py-4 shadow-sm border border-gris-borde flex items-center justify-between">
          <div>
            <p className="font-display font-bold text-cafe text-base">Cantidad</p>
            {subtotal !== null && (
              <p className="text-xs text-gray-400 mt-0.5">
                Subtotal: <span className="text-rosa font-semibold">${subtotal.toFixed(2)}</span>
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCantidad(Math.max(1, cantidad - 1))}
              className="w-10 h-10 rounded-full border-2 border-gris-borde flex items-center justify-center active:bg-crema transition-colors"
            >
              <Minus className="w-4 h-4 text-dark" />
            </button>
            <span className="font-bold text-xl w-6 text-center text-dark">{cantidad}</span>
            <button
              onClick={() => setCantidad(cantidad + 1)}
              className="w-10 h-10 rounded-full bg-rosa text-white flex items-center justify-center active:opacity-80 transition-opacity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* ── Botón agregar (fijo) ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gris-borde px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleAgregar}
            disabled={!producto.is_available || !seleccionCompleta}
            className="w-full bg-cafe text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 active:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>
              {!producto.is_available
                ? "No disponible"
                : !seleccionCompleta
                ? "Completa las opciones"
                : subtotal !== null
                ? `Agregar al carrito — $${subtotal.toFixed(2)}`
                : "Agregar al carrito"
              }
            </span>
          </button>
        </div>
      </div>

      {/* ── Modal de confirmación de extra ── */}
      {extraModal && (() => {
        const estaSeleccionado = extrasSeleccionados.some((e) => e.id === extraModal.id);
        return (
          <>
            <div
              className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center px-4"
              onClick={() => setExtraModal(null)}
            >
            <div
              className="bg-white rounded-3xl px-6 pt-6 pb-8 shadow-2xl w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >

              <p className="text-xs font-semibold text-dark/40 uppercase tracking-wide mb-1">
                {extraModal.categoria || 'Extra'}
              </p>
              <h3 className="font-display font-bold text-dark text-lg leading-snug mb-3">
                {extraModal.nombre}
              </h3>

              <div className="bg-crema-alt rounded-2xl px-5 py-4 mb-6 flex items-center justify-between">
                <span className="text-sm text-dark/60">Precio adicional</span>
                <span className="text-xl font-bold text-rosa">
                  {extraModal.precio === 0 ? 'A coordinar con Wina' : `+$${extraModal.precio.toFixed(2)}`}
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setExtraModal(null)}
                  className="flex-1 py-3.5 rounded-2xl border-2 border-gris-borde text-dark font-semibold text-sm active:bg-crema transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => { toggleExtra(extraModal); setExtraModal(null); }}
                  className={`flex-1 py-3.5 rounded-2xl font-semibold text-sm transition-colors
                    ${estaSeleccionado
                      ? "bg-red-50 text-red-600 border-2 border-red-200 active:bg-red-100"
                      : "bg-cafe text-white active:opacity-80"
                    }`}
                >
                  {estaSeleccionado ? 'Quitar extra' : 'Agregar extra'}
                </button>
              </div>
            </div>
            </div>
          </>
        );
      })()}

    </main>
  );
}
