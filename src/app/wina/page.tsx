import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Star, Heart, Award, Sparkles, Leaf, Clock, Gift, Instagram, Facebook } from "lucide-react";
import NavBar from "@/components/NavBar";

export const metadata = { title: "Wina — Nuestra Historia" };

const WHATSAPP_NUMBER = "593XXXXXXXXX";
const INSTAGRAM_URL   = "https://www.instagram.com/dulcesypasteleswina";
const FACEBOOK_URL    = "#";

const cards = [
  {
    emoji: "🧁",
    titulo: "Misión",
    texto: "Ofrecer tortas y postres artesanales de especialidad, diseñados con dedicación, que creen momentos de felicidad e inspiren buena suerte.",
  },
  {
    emoji: "✨",
    titulo: "Visión",
    texto: "Construir una marca de repostería reconocida por ofrecer productos de calidad excepcional que creen momentos memorables.",
  },
  {
    emoji: "❤️",
    titulo: "¿Por qué elegirnos?",
    texto: "Creamos experiencias memorables. Cuidamos cada detalle para transformar tus momentos especiales en recuerdos inolvidables.",
  },
  {
    emoji: "🎂",
    titulo: "Hechos con amor",
    texto: "Cada pieza sale de nuestras manos con ingredientes de primera calidad y técnicas perfeccionadas durante años de dedicación.",
  },
];

const caracteristicas = [
  { icon: <Leaf  className="w-5 h-5" />, label: "Ingredientes de calidad"   },
  { icon: <Heart className="w-5 h-5" />, label: "Hechos artesanalmente"      },
  { icon: <Star  className="w-5 h-5" />, label: "Diseños personalizados"     },
  { icon: <Clock className="w-5 h-5" />, label: "Pedidos con anticipación"   },
  { icon: <Gift  className="w-5 h-5" />, label: "Para toda ocasión especial" },
];

export default function WinaPage() {
  return (
    <main className="min-h-screen bg-crema">

      {/* ── 1. HEADER ── */}
      <NavBar />

      {/* ── 2. HERO ── */}
      <section className="bg-cafe overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 py-10 md:py-16 flex flex-col md:flex-row md:items-center md:gap-12">

          {/* Texto */}
          <div className="flex-1">
            <p className="font-script text-rosa text-xl md:text-2xl mb-1">Hechos con amor ♡</p>
            <h2 className="font-display text-5xl md:text-7xl font-bold text-white leading-none mt-1">
              Dulces y<br />Pasteles
            </h2>
            <p className="text-crema/70 text-sm md:text-base mt-3">
              Repostería artesanal en Guayaquil desde 2017
            </p>
          </div>

          {/* Logo Wina */}
          <div className="mt-8 md:mt-0 md:shrink-0">
            <div className="w-64 h-64 md:w-80 md:h-80 mx-auto rounded-full overflow-hidden">
              <Image
                src="/logo-wina.jpg"
                alt="Logo Wina Dulces y Pasteles"
                width={320}
                height={320}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>

        </div>
      </section>

      {/* ── 3. NUESTRA HISTORIA ── */}
      <section className="bg-white">
        <div className="max-w-5xl mx-auto px-6 py-10 md:py-14">

          <h3 className="font-display text-2xl md:text-3xl font-bold text-cafe text-center mb-8">
            Nuestra Historia
          </h3>

          <div className="flex flex-col md:flex-row md:items-start md:gap-12">

            {/* Texto */}
            <p className="flex-1 text-sm md:text-base text-dark/75 leading-relaxed">
              Dulces y Pasteles Wina nació en 2017, en un momento de cambio. Después de quedarme sin
              trabajo, encontré en la repostería una oportunidad para salir adelante. Todo comenzó con
              el deseo de sorprender a mis hijos en sus cumpleaños con tortas temáticas hechas con
              amor. Empecé aprendiendo a preparar cupcakes y, poco a poco, descubrí una pasión que me
              impulsó a seguir estudiando, tomando cursos y perfeccionando cada técnica. Con el tiempo
              llegaron las tortas personalizadas, el fondant, el frosting, nuevos sabores, rellenos y
              una gran variedad de dulces. Lo que comenzó como una necesidad se transformó en un sueño.
              Hoy, cada pastel, cupcake, galleta y detalle representa horas de dedicación, aprendizaje
              y amor por nuestro trabajo.
            </p>

            <div className="mt-6 md:mt-0 md:shrink-0 md:w-72 w-full aspect-[4/3] rounded-2xl overflow-hidden bg-crema-alt relative">
              <Image src="/historia-wina.jpg" alt="Nuestra historia — Wina Dulces y Pasteles" fill className="object-contain" />
            </div>

          </div>
        </div>
      </section>

      {/* ── 4. CARDS — Misión · Visión · ¿Por qué? · Hecho con amor ── */}
      <section className="bg-crema-alt py-10">
        <div className="max-w-5xl mx-auto px-4">

          {/* Mobile: scroll horizontal / Desktop: 4 columnas fijas */}
          <div className="flex gap-5 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none
                          md:overflow-visible md:grid md:grid-cols-4 md:gap-6">
            {cards.map((c) => (
              <div
                key={c.titulo}
                className="shrink-0 snap-start w-44 md:w-auto bg-white rounded-2xl p-5 shadow-sm flex flex-col items-center text-center gap-3"
              >
                {/* Imagen circular — Reemplazar por <Image> con foto real del producto */}
                <div className="w-20 h-20 rounded-full bg-crema-alt border-2 border-gris-borde flex items-center justify-center text-4xl overflow-hidden shrink-0">
                  {c.emoji}
                </div>
                <p className="font-display font-bold text-cafe text-sm">{c.titulo}</p>
                <p className="text-xs text-dark/60 leading-relaxed">{c.texto}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 5. FOOTER — características + social + copyright ── */}
      <footer className="bg-crema border-t border-gris-borde">

        {/* Características */}
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

        {/* Social + copyright */}
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
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-rosa transition-colors"
            >
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
