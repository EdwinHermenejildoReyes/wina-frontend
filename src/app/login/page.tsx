"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;
    setLoading(true);
    try {
      await login(username.trim(), password);
      toast.success("¡Bienvenida de vuelta!");
      router.push("/menu");
    } catch {
      toast.error("Usuario o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-crema">

      {/* ── Hero ── */}
      <section className="bg-cafe px-6 pt-8 pb-12">
        <button
          onClick={() => router.push("/menu")}
          className="flex items-center gap-1.5 text-crema/60 hover:text-crema text-sm mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Menú
        </button>
        <p className="font-script text-rosa text-lg">Bienvenida de vuelta ♡</p>
        <h1 className="font-display text-4xl font-bold text-white leading-tight mt-0.5">
          Iniciar sesión
        </h1>
      </section>

      {/* ── Formulario ── */}
      <div className="max-w-sm mx-auto px-4 -mt-5">
        <div className="bg-white rounded-3xl px-6 py-6 shadow-sm border border-gris-borde">

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-dark/50 uppercase tracking-wide mb-1.5 block">
                Usuario o correo
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="tu_usuario"
                autoComplete="username"
                className="w-full border border-gris-borde rounded-2xl px-4 py-3 text-sm bg-crema-alt focus:outline-none focus:ring-2 focus:ring-cafe placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-dark/50 uppercase tracking-wide mb-1.5 block">
                Contraseña
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full border border-gris-borde rounded-2xl px-4 py-3 text-sm bg-crema-alt focus:outline-none focus:ring-2 focus:ring-cafe placeholder:text-gray-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !username.trim() || !password}
              className="w-full bg-cafe text-white font-semibold py-4 rounded-2xl mt-1 disabled:opacity-40 active:opacity-80 transition-opacity"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>

            <div className="text-center pt-1">
              <Link href="/recuperar-contrasena" className="text-xs text-gray-400 underline underline-offset-2">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </form>
        </div>

        <div className="mt-5 space-y-3 text-center">
          <p className="text-sm text-gray-400">
            ¿No tienes cuenta?{" "}
            <Link href="/registro" className="text-cafe font-semibold">
              Regístrate
            </Link>
          </p>
          <Link href="/menu" className="block text-sm text-gray-400 underline underline-offset-2">
            Continuar sin cuenta
          </Link>
        </div>
      </div>

    </main>
  );
}
