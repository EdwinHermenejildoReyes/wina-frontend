"use client";

import { useState } from "react";
import { Instagram, MessageCircle, Send, Leaf, Heart, Star, Clock, Gift, Facebook } from "lucide-react";
import NavBar from "@/components/NavBar";

const WHATSAPP_NUMBER = "593XXXXXXXXX";
const INSTAGRAM_URL   = "https://www.instagram.com/dulcesypasteleswina";
const FACEBOOK_URL    = "#";

const redesSociales = [
  {
    emoji: "📸",
    href: INSTAGRAM_URL,
    titulo: "Instagram",
    handle: "@dulcesypasteleswina",
    descripcion: "Mira nuestras creaciones más recientes y síguenos para no perderte ningún lanzamiento.",
  },
  {
    emoji: "💬",
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
    titulo: "WhatsApp",
    handle: "Escríbenos directamente",
    descripcion: "La forma más rápida de hacer tu pedido o resolver cualquier duda sobre tu encargo.",
  },
  {
    emoji: "📘",
    href: FACEBOOK_URL,
    titulo: "Facebook",
    handle: "Dulces y Pasteles Wina",
    descripcion: "Síguenos en Facebook para ver reseñas, fotos de clientes y nuestras promociones especiales.",
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
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;
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
                <p className="text-xs text-dark/65 leading-relaxed">
                  Lunes a sábado<br />
                  9:00 am – 6:00 pm<br />
                  <span className="text-gray-400">Domingos bajo pedido</span>
                </p>
              </div>
              <div className="bg-crema-alt rounded-2xl p-5">
                <p className="font-display font-bold text-cafe text-sm mb-1">Política de pedidos</p>
                <p className="text-xs text-dark/65 leading-relaxed">
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
                <div className="w-20 h-20 rounded-full bg-crema-alt border-2 border-gris-borde flex items-center justify-center text-4xl overflow-hidden shrink-0">
                  {r.emoji}
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
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer"
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
