"use client";

import { useState } from "react";
import { Instagram, MessageCircle, Send, Leaf, Heart, Star, Clock, Gift, Facebook } from "lucide-react";
import IconTikTok from "@/components/ui/IconTikTok";
import NavBar from "@/components/NavBar";

const WHATSAPP_URL  = "https://wa.me/dulcesypasteleswina";
const INSTAGRAM_URL = "https://www.instagram.com/dulcesypasteleswina";
const FACEBOOK_URL  = "https://www.facebook.com/dulcesypasteleswina";
const TIKTOK_URL    = "https://www.tiktok.com/@dulcesypasteleswina";

const redesSociales = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="white" className="w-9 h-9">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
    bg: "bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045]",
    href: INSTAGRAM_URL,
    titulo: "Instagram",
    handle: "@dulcesypasteleswina",
    descripcion: "Mira nuestras creaciones más recientes y síguenos para no perderte ningún lanzamiento.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="white" className="w-9 h-9">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
    bg: "bg-[#25D366]",
    href: WHATSAPP_URL,
    titulo: "WhatsApp",
    handle: "@dulcesypasteleswina",
    descripcion: "La forma más rápida de hacer tu pedido o resolver cualquier duda sobre tu encargo.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="white" className="w-9 h-9">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    bg: "bg-[#1877F2]",
    href: FACEBOOK_URL,
    titulo: "Facebook",
    handle: "@dulcesypasteleswina",
    descripcion: "Síguenos en Facebook para ver reseñas, fotos de clientes y nuestras promociones especiales.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="white" className="w-9 h-9">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.57a8.17 8.17 0 004.77 1.52V6.65a4.85 4.85 0 01-1-.04z" />
      </svg>
    ),
    bg: "bg-black",
    href: TIKTOK_URL,
    titulo: "TikTok",
    handle: "@dulcesypasteleswina",
    descripcion: "Mira nuestros videos de elaboración de tortas y postres artesanales.",
  },
];

const caracteristicas = [
  { icon: <Leaf  className="w-5 h-5" />, label: "Ingredientes de calidad"   },
  { icon: <Heart className="w-5 h-5" />, label: "Hechos artesanalmente"      },
  { icon: <Star  className="w-5 h-5" />, label: "Diseños personalizados"     },
  { icon: <Clock className="w-5 h-5" />, label: "Pedidos con anticipación"   },
  { icon: <Gift  className="w-5 h-5" />, label: "Para toda ocasión especial" },
];

function buildWhatsAppUrl(nombre: string, telefono: string, mensaje: string) {
  const texto = `Hola Wina! Soy ${nombre.trim()}${telefono.trim() ? ` (${telefono.trim()})` : ""}.\n\n${mensaje.trim()}`;
  return `${WHATSAPP_URL}?text=${encodeURIComponent(texto)}`;
}

export default function ContactosPage() {
  const [nombre,   setNombre]   = useState("");
  const [telefono, setTelefono] = useState("");
  const [mensaje,  setMensaje]  = useState("");

  const puedeEnviar = nombre.trim() && mensaje.trim();

  function handleEnviar(e: React.FormEvent) {
    e.preventDefault();
    window.open(buildWhatsAppUrl(nombre, telefono, mensaje), "_blank");
  }

  return (
    <main className="min-h-screen bg-crema">

      {/* ── 1. HEADER ── */}
      <NavBar />

      {/* ── 2. HERO ── */}
      <section className="bg-cafe overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 py-10 md:py-16 flex flex-col md:flex-row md:items-center md:gap-12">

          {/* Texto */}
          <div className="flex-1">
            <p className="font-script text-rosa text-xl md:text-2xl mb-1">¿Hablamos? ♡</p>
            <h2 className="font-display text-5xl md:text-7xl font-bold text-white leading-none mt-1">
              Contáctenos
            </h2>
            <p className="text-crema/70 text-sm md:text-base mt-3">
              Estamos aquí para ayudarte a planear tu dulce momento especial.
            </p>
          </div>

          {/* Decoración hero */}
          <div className="mt-8 md:mt-0 md:shrink-0">
            <div className="w-64 h-64 md:w-80 md:h-80 mx-auto rounded-full overflow-hidden border-4 border-rosa/30 bg-gradient-to-br from-[#3a1f0d] to-[#5a3018] flex items-center justify-center">
              <span className="text-8xl md:text-9xl drop-shadow-xl">💌</span>
            </div>
          </div>

        </div>
      </section>

      {/* ── 3. FORMULARIO ── */}
      <section className="bg-white">
        <div className="max-w-5xl mx-auto px-6 py-10 md:py-14">

          <h3 className="font-display text-2xl md:text-3xl font-bold text-cafe text-center mb-8">
            Envíanos un mensaje
          </h3>

          <div className="flex flex-col md:flex-row md:gap-12 md:items-start">

            {/* Formulario */}
            <form onSubmit={handleEnviar} className="flex-1 space-y-5">
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block font-medium">Tu nombre *</label>
                <input
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="María García"
                  className="w-full border border-gris-borde rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rosa"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block font-medium">Teléfono <span className="font-normal">(opcional)</span></label>
                <input
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="0991234567"
                  type="tel"
                  className="w-full border border-gris-borde rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rosa"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block font-medium">Mensaje *</label>
                <textarea
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  placeholder="Quiero consultar sobre una torta personalizada para..."
                  rows={5}
                  className="w-full border border-gris-borde rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rosa resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={!puedeEnviar}
                className="w-full bg-rosa text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50 active:bg-rosa-dark transition-colors"
              >
                <Send className="w-4 h-4" />
                Enviar por WhatsApp
              </button>
            </form>

            {/* Info lateral (desktop) */}
            <div className="mt-8 md:mt-0 md:w-64 shrink-0 space-y-5">
              <div className="bg-crema-alt rounded-2xl p-5">
                <p className="font-display font-bold text-cafe text-sm mb-1">Horario de atención</p>
                <p className="text-xs text-dark/65 leading-relaxed text-justify">
                  Lunes a sábado<br />
                  9:00 am – 6:00 pm<br />
                  <span className="text-gray-400">Domingos bajo pedido</span>
                </p>
              </div>
              <div className="bg-crema-alt rounded-2xl p-5">
                <p className="font-display font-bold text-cafe text-sm mb-1">Política de pedidos</p>
                <p className="text-xs text-dark/65 leading-relaxed text-justify">
                  Nuestros productos son elaborados exclusivamente para cada cliente. Una vez confirmado el pedido y emitida la nota de venta, no se aceptan devoluciones por cambios de opinión.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 4. REDES SOCIALES — mismo estilo de cards que /wina ── */}
      <section className="bg-crema-alt py-10">
        <div className="max-w-5xl mx-auto px-4">

          <h3 className="font-display text-2xl md:text-3xl font-bold text-cafe text-center mb-8">
            Encuéntranos en
          </h3>

          <div className="flex gap-5 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none
                          md:overflow-visible md:grid md:grid-cols-3 md:gap-6">
            {redesSociales.map((r) => (
              <a
                key={r.titulo}
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 snap-start w-44 md:w-auto bg-white rounded-2xl p-5 shadow-sm flex flex-col items-center text-center gap-3 active:scale-95 transition-transform"
              >
                <div className={`w-20 h-20 rounded-full ${r.bg} flex items-center justify-center overflow-hidden shrink-0`}>
                  {r.icon}
                </div>
                <div>
                  <p className="font-display font-bold text-cafe text-sm">{r.titulo}</p>
                  <p className="text-xs text-rosa font-medium mt-0.5">{r.handle}</p>
                  <p className="text-xs text-dark/60 leading-relaxed mt-2">{r.descripcion}</p>
                </div>
              </a>
            ))}
          </div>

        </div>
      </section>

      {/* ── 5. FOOTER — idéntico al de /wina ── */}
      <footer className="bg-crema border-t border-gris-borde">

        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {caracteristicas.map((c) => (
              <div key={c.label} className="flex flex-col items-center gap-2 w-24 text-center">
                <div className="w-10 h-10 rounded-full bg-white border border-gris-borde flex items-center justify-center text-rosa shadow-sm">
                  {c.icon}
                </div>
                <p className="text-xs text-dark/70 leading-tight font-medium">{c.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gris-borde py-5 px-6 flex flex-col items-center gap-3">
          <div className="flex items-center gap-5">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
               className="text-gray-400 hover:text-rosa transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer"
               className="text-gray-400 hover:text-rosa transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer"
               className="text-gray-400 hover:text-rosa transition-colors">
              <IconTikTok className="w-5 h-5" />
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
               className="text-gray-400 hover:text-rosa transition-colors">
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>
          <p className="text-xs text-gray-400 text-center">
            © {new Date().getFullYear()} Dulces y Pasteles Wina · Guayaquil, Ecuador
          </p>
        </div>

      </footer>

    </main>
  );
}
