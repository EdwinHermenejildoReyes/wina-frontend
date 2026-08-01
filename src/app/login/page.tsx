"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
    <main className="min-h-screen bg-crema flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-rosa">Wina</h1>
          <p className="text-sm text-gray-400 mt-1">Dulces y Pasteles</p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h2 className="font-bold text-dark text-lg mb-5">Iniciar sesión</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Usuario o correo</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="tu_usuario"
                autoComplete="username"
                className="w-full border border-gris-borde rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rosa"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Contraseña</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full border border-gris-borde rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rosa"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !username.trim() || !password}
              className="w-full bg-rosa text-white font-bold py-3 rounded-2xl mt-2 disabled:opacity-60 transition-colors active:bg-rosa-dark"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-400 mt-5">
          ¿No tienes cuenta?{" "}
          <Link href="/registro" className="text-rosa font-semibold">
            Regístrate
          </Link>
        </p>
        <p className="text-center mt-3">
          <Link href="/menu" className="text-sm text-gray-400 underline">
            Continuar sin cuenta
          </Link>
        </p>
      </div>
    </main>
  );
}
