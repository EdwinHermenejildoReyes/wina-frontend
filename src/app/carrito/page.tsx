"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingCart, Upload, X, Copy, Calendar } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import NavBar from "@/components/NavBar";

if (!process.env.NEXT_PUBLIC_IVA_PORCENTAJE) {
  throw new Error("Variable de entorno NEXT_PUBLIC_IVA_PORCENTAJE no definida");
}
const IVA_PORCENTAJE = parseFloat(process.env.NEXT_PUBLIC_IVA_PORCENTAJE);
const DIAS_MIN_PREPARACION = 2;

const DATOS_BANCARIOS = {
  banco:      "Banco de Guayaquil",
  tipo:       "Cuenta corriente",
  numero:     "Próximamente",
  titular:    "Wina Dulces y Pasteles",
  ruc:        "Próximamente",
  whatsapp:   "@dulcesypasteleswina",
};

// ── Helpers de validación ─────────────────────────────────────────────────────

function validarNombre(v: string): string | null {
  const s = v.trim();
  if (!s) return "El nombre es obligatorio";
  if (s.toLowerCase() === "consumidor final") return null;
  if (s.length < 3) return "El nombre es demasiado corto";
  if (!/[aeiouáéíóúAEIOUÁÉÍÓÚ]/u.test(s)) return "El nombre no parece válido";
  if (/[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]{5,}/u.test(s)) return "El nombre no parece válido";
  if (!/^[A-Za-záéíóúüñÁÉÍÓÚÜÑ][A-Za-záéíóúüñÁÉÍÓÚÜÑ\s'\-.]{2,}$/u.test(s)) return 'Solo letras. Escribe "Consumidor final" si no deseas indicar tu nombre';
  return null;
}

function validarTelefono(v: string): string | null {
  const d = v.replace(/[\s\-()]/g, "");
  if (!d) return "El teléfono es obligatorio";
  if (!/^0[2-9]\d{7,8}$/.test(d)) return "Ingresa un número ecuatoriano válido (ej: 0999 999 999)";
  return null;
}

function fechaMinEntrega(): string {
  const d = new Date();
  d.setDate(d.getDate() + DIAS_MIN_PREPARACION);
  return d.toISOString().split("T")[0];
}

export default function CarritoPage() {
  const router = useRouter();
  const { items, totalItems, totalPrecio, quitar, actualizarCantidad, limpiar } = useCart();
  const { user } = useAuth();

  const [nombre,        setNombre]        = useState(user ? `${user.first_name} ${user.last_name}`.trim() || user.username : "");
  const [telefono,      setTelefono]      = useState(user?.telefono || "");
  const [fechaEntrega,  setFechaEntrega]  = useState("");
  const [notas,         setNotas]         = useState("");

  const [nombreTocado,   setNombreTocado]   = useState(false);
  const [telefonoTocado, setTelefonoTocado] = useState(false);

  const errNombre   = nombreTocado   ? validarNombre(nombre)   : null;
  const errTelefono = telefonoTocado ? validarTelefono(telefono) : null;
  const [comprobante, setComprobante] = useState<File | null>(null);
  const [preview,     setPreview]     = useState<string | null>(null);
  const [enviando,    setEnviando]    = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const iva          = totalPrecio * IVA_PORCENTAJE;
  const totalConIva  = totalPrecio + iva;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setComprobante(file);
    setPreview(URL.createObjectURL(file));
  };

  const quitarComprobante = () => {
    setComprobante(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const copiar = (texto: string) => {
    navigator.clipboard.writeText(texto).then(() => toast.success("Copiado"));
  };

  // ── Carrito vacío ──────────────────────────────────────────────────────────
  if (totalItems === 0) {
    return (
      <main className="min-h-screen bg-crema">
        <NavBar />
        <section className="bg-cafe px-6 py-8">
          <div className="max-w-2xl mx-auto">
            <button onClick={() => router.push("/menu")} className="flex items-center gap-1.5 text-crema/60 hover:text-crema text-sm mb-3 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Menú
            </button>
            <p className="font-script text-rosa text-base">Tu pedido ♡</p>
            <h1 className="font-display text-3xl font-bold text-white leading-tight mt-0.5">Carrito vacío</h1>
          </div>
        </section>
        <div className="max-w-2xl mx-auto px-6 py-16 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-white border border-gris-borde flex items-center justify-center text-5xl shadow-sm mb-5">🛒</div>
          <p className="font-display font-bold text-cafe text-lg">Tu carrito está vacío</p>
          <p className="text-sm text-gray-400 mt-1">Agrega productos desde el menú</p>
          <button onClick={() => router.push("/menu")} className="mt-6 bg-cafe text-white font-semibold px-8 py-3 rounded-2xl active:opacity-80 transition-opacity">
            Ver menú
          </button>
        </div>
      </main>
    );
  }

  // ── Confirmar pedido ───────────────────────────────────────────────────────
  const handlePedir = async () => {
    setNombreTocado(true);
    setTelefonoTocado(true);
    if (validarNombre(nombre))   { toast.error(validarNombre(nombre)!);   return; }
    if (validarTelefono(telefono)) { toast.error(validarTelefono(telefono)!); return; }
    if (!comprobante) { toast.error("Adjunta el comprobante de pago para continuar"); return; }

    setEnviando(true);
    try {
      const form = new FormData();
      form.append("nombre_cliente",   nombre.trim());
      form.append("telefono_cliente", telefono.trim());
      form.append("notas",            notas.trim());
      form.append("comprobante",      comprobante);
      if (fechaEntrega) form.append("fecha_entrega", fechaEntrega);
      form.append("detalles", JSON.stringify(
        items.map((item) => ({
          producto:        item.producto.id,
          cantidad:        item.cantidad,
          personalizacion: item.personalizacion,
          ...(item.variante ? { variante: item.variante.id } : {}),
          extras_detalle:  item.extras.map((e) => ({ id: e.id, nombre: e.nombre, precio: e.precio })),
        }))
      ));

      const res = await api.post("/pedidos/", form);
      sessionStorage.setItem(`wina_pedido_${res.data.numero_pedido}`, JSON.stringify(res.data));
      limpiar();
      router.push(`/pedido/${res.data.numero_pedido}`);
    } catch {
      toast.error("No se pudo procesar el pedido. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  const inputCls = "w-full border border-gris-borde rounded-2xl px-4 py-3 text-sm bg-crema-alt focus:outline-none focus:ring-2 focus:ring-cafe placeholder:text-gray-400";
  const labelCls = "text-xs font-semibold text-dark/50 uppercase tracking-wide mb-1.5 block";

  return (
    <main className="min-h-screen bg-crema pb-36">
      <NavBar />

      {/* ── Hero ── */}
      <section className="bg-cafe px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <button onClick={() => router.back()} className="flex items-center gap-1.5 text-crema/60 hover:text-crema text-sm mb-3 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>
          <p className="font-script text-rosa text-base">Revisa tu selección ♡</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mt-0.5">Tu pedido</h1>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 mt-5 space-y-4">

        {/* ── Items ── */}
        {items.map((item) => {
          const precioUnit = parseFloat(item.variante?.precio_efectivo ?? item.producto.precio);
          return (
            <div key={item.carritoKey} className="bg-white rounded-3xl p-4 flex gap-4 shadow-sm border border-gris-borde">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-crema-alt shrink-0 border border-gris-borde">
                {item.producto.imagen
                  ? <Image src={item.producto.imagen} alt={item.producto.nombre} fill className="object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-3xl">🍰</div>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-cafe text-sm leading-tight truncate">{item.producto.nombre}</p>
                {item.variante && (
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                    {[item.variante.sabor_nombre, item.variante.relleno_nombre, `${item.variante.porcion_cantidad} porciones`, item.variante.estilo_nombre].filter(Boolean).join(" · ")}
                  </p>
                )}
                {item.personalizacion && (
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-1 italic">"{item.personalizacion}"</p>
                )}
                {item.extras.length > 0 && (
                  <div className="mt-1 space-y-0.5">
                    {item.extras.map((e) => (
                      <p key={e.id} className="text-xs text-gray-400 flex justify-between gap-2">
                        <span>+ {e.nombre}</span>
                        {e.precio > 0 && <span className="shrink-0">+${e.precio.toFixed(2)}</span>}
                      </p>
                    ))}
                  </div>
                )}
                <p className="text-rosa font-bold mt-1 text-sm">
                  ${((precioUnit + item.extras.reduce((s, e) => s + e.precio, 0)) * item.cantidad).toFixed(2)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => actualizarCantidad(item.carritoKey, item.cantidad - 1)} className="w-8 h-8 rounded-full border border-gris-borde flex items-center justify-center active:bg-crema transition-colors">
                    <Minus className="w-3 h-3 text-dark" />
                  </button>
                  <span className="text-sm font-bold w-5 text-center text-dark">{item.cantidad}</span>
                  <button onClick={() => actualizarCantidad(item.carritoKey, item.cantidad + 1)} className="w-8 h-8 rounded-full bg-rosa text-white flex items-center justify-center active:opacity-80 transition-opacity">
                    <Plus className="w-3 h-3" />
                  </button>
                  <button onClick={() => quitar(item.carritoKey)} className="ml-auto w-8 h-8 rounded-full border border-gris-borde flex items-center justify-center text-gray-300 active:text-red-400 active:border-red-200 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* ── Datos bancarios + pago total ── */}
        <div className="bg-cafe rounded-3xl px-5 py-5 shadow-sm">
          <p className="font-script text-rosa text-base mb-1">Paso 1 ♡</p>
          <h2 className="font-display font-bold text-white text-base mb-4">Realiza el pago total</h2>

          {/* Desglose de monto */}
          <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3 mb-4 space-y-1.5">
            <div className="flex justify-between text-sm text-crema/70">
              <span>Subtotal</span>
              <span>${totalPrecio.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-crema/70">
              <span>IVA ({(IVA_PORCENTAJE * 100).toFixed(0)}%)</span>
              <span>${iva.toFixed(2)}</span>
            </div>
            <div className="border-t border-white/20 pt-1.5 flex justify-between items-baseline">
              <span className="text-crema/80 text-xs uppercase tracking-wide font-semibold">Total a pagar</span>
              <span className="font-display font-bold text-white text-2xl">${totalConIva.toFixed(2)}</span>
            </div>
          </div>

          {/* Datos bancarios */}
          <div className="space-y-2">
            {[
              { label: "Banco",     valor: DATOS_BANCARIOS.banco },
              { label: "Tipo",      valor: DATOS_BANCARIOS.tipo },
              { label: "Cuenta",    valor: DATOS_BANCARIOS.numero },
              { label: "Titular",   valor: DATOS_BANCARIOS.titular },
              { label: "RUC",       valor: DATOS_BANCARIOS.ruc },
              { label: "WhatsApp",  valor: DATOS_BANCARIOS.whatsapp, copiable: true },
            ].map(({ label, valor, copiable }) => (
              <div key={label} className="flex items-center justify-between bg-white/10 rounded-xl px-3 py-2">
                <div>
                  <p className="text-crema/50 text-[10px] uppercase tracking-wide">{label}</p>
                  <p className="text-white text-sm font-semibold">{valor}</p>
                </div>
                {copiable && (
                  <button onClick={() => copiar(valor)} className="text-crema/60 hover:text-rosa transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Comprobante ── */}
        <div className="bg-white rounded-3xl px-5 py-5 shadow-sm border border-gris-borde">
          <p className="font-script text-rosa text-base mb-1">Paso 2 ♡</p>
          <h2 className="font-display font-bold text-cafe text-base mb-1">Adjunta el comprobante</h2>
          <p className="text-xs text-gray-400 mb-4">Foto o captura de pantalla del depósito/transferencia</p>

          {preview ? (
            <div className="relative">
              <img src={preview} alt="Comprobante" className="w-full rounded-2xl object-contain max-h-64 border border-gris-borde" />
              <button
                onClick={quitarComprobante}
                className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center border border-gris-borde active:bg-crema"
              >
                <X className="w-4 h-4 text-dark" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full border-2 border-dashed border-gris-borde rounded-2xl py-8 flex flex-col items-center gap-2 active:bg-crema-alt transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-crema-alt flex items-center justify-center">
                <Upload className="w-5 h-5 text-cafe/50" />
              </div>
              <p className="text-sm font-semibold text-cafe">Subir comprobante</p>
              <p className="text-xs text-gray-400">JPG, PNG o PDF</p>
            </button>
          )}

          <input
            ref={fileRef}
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFile}
            className="hidden"
          />
        </div>

        {/* ── Datos del cliente ── */}
        <div className="bg-white rounded-3xl px-5 py-5 shadow-sm border border-gris-borde space-y-4">
          <div>
            <p className="font-script text-rosa text-base mb-1">Paso 3 ♡</p>
            <h2 className="font-display font-bold text-cafe text-base">¿A nombre de quién?</h2>
          </div>

          <div>
            <label className={labelCls}>Nombre *</label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              onBlur={() => setNombreTocado(true)}
              placeholder='Tu nombre completo o "Consumidor final"'
              className={`${inputCls} ${errNombre ? "border-red-300 focus:ring-red-400" : nombreTocado && !errNombre ? "border-green-300" : ""}`}
            />
            {errNombre
              ? <p className="text-xs text-red-500 mt-1">{errNombre}</p>
              : nombreTocado && <p className="text-xs text-green-600 mt-1">✓ Nombre válido</p>
            }
          </div>

          <div>
            <label className={labelCls}>Teléfono *</label>
            <input
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              onBlur={() => setTelefonoTocado(true)}
              placeholder="0999 999 999"
              type="tel"
              className={`${inputCls} ${errTelefono ? "border-red-300 focus:ring-red-400" : telefonoTocado && !errTelefono ? "border-green-300" : ""}`}
            />
            {errTelefono
              ? <p className="text-xs text-red-500 mt-1">{errTelefono}</p>
              : telefonoTocado && <p className="text-xs text-green-600 mt-1">✓ Número válido</p>
            }
          </div>

          <div>
            <label className={labelCls}>
              <Calendar className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
              Fecha de entrega <span className="normal-case font-normal">(opcional)</span>
            </label>
            <input
              type="date"
              value={fechaEntrega}
              onChange={(e) => setFechaEntrega(e.target.value)}
              min={fechaMinEntrega()}
              className={`${inputCls} text-dark`}
            />
            <p className="text-xs text-gray-400 mt-1">
              Mínimo {DIAS_MIN_PREPARACION} días de anticipación para preparar tu pedido
            </p>
          </div>

          <div>
            <label className={labelCls}>Notas <span className="normal-case font-normal">(opcional)</span></label>
            <textarea value={notas} onChange={(e) => setNotas(e.target.value)} placeholder="Indicaciones especiales para tu pedido..." rows={2} className={`${inputCls} resize-none`} />
          </div>
        </div>

        {!user && (
          <div className="mb-4 bg-white rounded-2xl px-5 py-4 border border-gris-borde text-center">
            <p className="text-xs text-gray-400">
              ¿Tienes cuenta?{" "}
              <a href="/login" className="text-cafe font-semibold">Inicia sesión</a>
              {" "}para acumular puntos con tu pedido.
            </p>
          </div>
        )}
      </div>

      {/* ── Botón confirmar ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gris-borde px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-baseline mb-3 px-1">
            <span className="text-xs text-gray-400">{totalItems} {totalItems === 1 ? "producto" : "productos"}</span>
            <div className="text-right">
              <span className="text-xs text-gray-400">Total c/IVA </span>
              <span className="font-display font-bold text-cafe text-lg">${totalConIva.toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={handlePedir}
            disabled={enviando || !comprobante || !!validarNombre(nombre) || !!validarTelefono(telefono)}
            className="w-full bg-cafe text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 active:opacity-80 disabled:opacity-40 transition-opacity"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>{enviando ? "Enviando pedido..." : "Confirmar pedido"}</span>
          </button>
          {!comprobante && (
            <p className="text-center text-xs text-gray-400 mt-2">Adjunta el comprobante para continuar</p>
          )}
        </div>
      </div>
    </main>
  );
}
