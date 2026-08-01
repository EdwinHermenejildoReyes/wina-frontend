"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function RegistroPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    telefono: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password || !form.email.trim()) return;
    setLoading(true);
    try {
      await api.post("/auth/users/", {
        username: form.username.trim(),
        email: form.email.trim(),
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        telefono: form.telefono.trim(),
        password: form.password,
      });
      await login(form.username.trim(), form.password);
      toast.success("¡Cuenta creada! Bienvenida a Wina");
      router.push("/menu");
    } catch (err: unknown) {
      const data = (err as { response?: { data?: Record<string, string[]> } })?.response?.data;
      if (data?.username) toast.error("Ese nombre de usuario ya existe");
      else if (data?.email) toast.error("Ese correo ya está registrado");
      else if (data?.password) toast.error(data.password[0]);
      else toast.error("No se pudo crear la cuenta. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-crema flex flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-rosa">Wina</h1>
          <p className="text-sm text-gray-400 mt-1">Crea tu cuenta para acumular puntos</p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h2 className="font-bold text-dark text-lg mb-5">Crear cuenta</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Nombre</label>
                <input
                  value={form.first_name}
                  onChange={set("first_name")}
                  placeholder="Ana"
                  className="w-full border border-gris-borde rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rosa"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Apellido</label>
                <input
                  value={form.last_name}
                  onChange={set("last_name")}
                  placeholder="García"
                  className="w-full border border-gris-borde rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rosa"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Usuario *</label>
              <input
                value={form.username}
                onChange={set("username")}
                placeholder="anagarcia"
                autoComplete="username"
                className="w-full border border-gris-borde rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rosa"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Correo *</label>
              <input
                value={form.email}
                onChange={set("email")}
                type="email"
                placeholder="ana@correo.com"
                autoComplete="email"
                className="w-full border border-gris-borde rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rosa"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Teléfono (opcional)</label>
              <input
                value={form.telefono}
                onChange={set("telefono")}
                type="tel"
                placeholder="0999 999 999"
                className="w-full border border-gris-borde rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rosa"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Contraseña *</label>
              <input
                value={form.password}
                onChange={set("password")}
                type="password"
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
                className="w-full border border-gris-borde rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rosa"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !form.username.trim() || !form.password || !form.email.trim()}
              className="w-full bg-rosa text-white font-bold py-3 rounded-2xl mt-2 disabled:opacity-60 transition-colors active:bg-rosa-dark"
            >
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-400 mt-5">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-rosa font-semibold">
            Inicia sesión
          </Link>
        </p>
      </div>
    </main>
  );
}
