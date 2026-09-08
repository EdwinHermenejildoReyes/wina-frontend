"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";

export default function RecuperarContrasenaPage() {
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await api.post("/auth/users/reset_password/", { email: email.trim() });
      setEnviado(true);
    } catch {
      // Djoser siempre responde 204 aunque el correo no exista (seguridad)
      setEnviado(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-crema">

      {/* ── Hero ── */}
      <section className="bg-cafe px-6 pt-8 pb-12">
        <Link
          href="/login"
          className="flex items-center gap-1.5 text-crema/60 hover:text-crema text-sm mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Iniciar sesión
        </Link>
        <p className="font-script text-rosa text-lg">No te preocupes ♡</p>
        <h1 className="font-display text-4xl font-bold text-white leading-tight mt-0.5">
          Recuperar contraseña
        </h1>
      </section>

      <div className="max-w-sm mx-auto px-4 -mt-5">

        {enviado ? (
          /* ── Estado: correo enviado ── */
          <div className="bg-white rounded-3xl px-6 py-8 shadow-sm border border-gris-borde text-center">
            <div className="w-16 h-16 rounded-full bg-crema-alt border border-gris-borde flex items-center justify-center mx-auto mb-4">
              <Mail className="w-7 h-7 text-cafe" />
            </div>
            <h2 className="font-display font-bold text-cafe text-lg mb-2">
              Revisa tu correo
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Si el correo <span className="font-semibold text-dark">{email}</span> está registrado,
              recibirás un enlace para restablecer tu contraseña en los próximos minutos.
            </p>
            <p className="text-xs text-gray-400 mt-3">Revisa también la carpeta de spam.</p>
            <Link
              href="/login"
              className="mt-6 inline-block bg-cafe text-white font-semibold px-8 py-3 rounded-2xl active:opacity-80 transition-opacity text-sm"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        ) : (
          /* ── Formulario ── */
          <div className="bg-white rounded-3xl px-6 py-6 shadow-sm border border-gris-borde">
            <p className="text-sm text-gray-500 mb-5 leading-relaxed">
              Ingresa tu correo electrónico y te enviaremos un enlace para crear una nueva contraseña.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-dark/50 uppercase tracking-wide mb-1.5 block">
                  Correo electrónico
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="tu@correo.com"
                  autoComplete="email"
                  className="w-full border border-gris-borde rounded-2xl px-4 py-3 text-sm bg-crema-alt focus:outline-none focus:ring-2 focus:ring-cafe placeholder:text-gray-400"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full bg-cafe text-white font-semibold py-4 rounded-2xl disabled:opacity-40 active:opacity-80 transition-opacity"
              >
                {loading ? "Enviando..." : "Enviar enlace"}
              </button>
            </form>
          </div>
        )}

      </div>
    </main>
  );
}
