"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function RegistroPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({
    username:         "",
    email:            "",
    first_name:       "",
    last_name:        "",
    telefono:         "",
    password:         "",
    password_confirm: "",
  });
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password || !form.email.trim()) return;
    if (form.password !== form.password_confirm) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    if (form.password.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/users/", {
        username:   form.username.trim(),
        email:      form.email.trim(),
        first_name: form.first_name.trim(),
        last_name:  form.last_name.trim(),
        telefono:   form.telefono.trim(),
        password:   form.password,
      });
      await login(form.username.trim(), form.password);
      toast.success("¡Cuenta creada! Bienvenida a Wina");
      router.push("/menu");
    } catch (err: unknown) {
      const data = (err as { response?: { data?: Record<string, string[]> } })?.response?.data;
      if (data?.username)  toast.error("Ese nombre de usuario ya existe");
      else if (data?.email)    toast.error("Ese correo ya está registrado");
      else if (data?.password) toast.error(data.password[0]);
      else toast.error("No se pudo crear la cuenta. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full border border-gris-borde rounded-2xl px-4 py-3 text-sm bg-crema-alt focus:outline-none focus:ring-2 focus:ring-cafe placeholder:text-gray-400";
  const labelCls = "text-xs font-semibold text-dark/50 uppercase tracking-wide mb-1.5 block";

  return (
    <main className="min-h-screen bg-crema pb-10">

      {/* ── Hero ── */}
      <section className="bg-cafe px-6 pt-8 pb-12">
        <button
          onClick={() => router.push("/login")}
          className="flex items-center gap-1.5 text-crema/60 hover:text-crema text-sm mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Iniciar sesión
        </button>
        <p className="font-script text-rosa text-lg">Únete a nuestra comunidad ♡</p>
        <h1 className="font-display text-4xl font-bold text-white leading-tight mt-0.5">
          Crear cuenta
        </h1>
        <p className="text-crema/50 text-xs mt-2">Acumula puntos con cada pedido</p>
      </section>

      {/* ── Formulario ── */}
      <div className="max-w-sm mx-auto px-4 -mt-5">
        <div className="bg-white rounded-3xl px-6 py-6 shadow-sm border border-gris-borde">

          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Nombre</label>
                <input value={form.first_name} onChange={set("first_name")} placeholder="Ana"    className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Apellido</label>
                <input value={form.last_name}  onChange={set("last_name")}  placeholder="García" className={inputCls} />
              </div>
            </div>

            <div>
              <label className={labelCls}>Usuario *</label>
              <input
                value={form.username}
                onChange={set("username")}
                placeholder="anagarcia"
                autoComplete="username"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Correo *</label>
              <input
                value={form.email}
                onChange={set("email")}
                type="email"
                placeholder="ana@correo.com"
                autoComplete="email"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>
                Teléfono <span className="normal-case font-normal">(opcional)</span>
              </label>
              <input
                value={form.telefono}
                onChange={set("telefono")}
                type="tel"
                placeholder="0999 999 999"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Contraseña *</label>
              <input
                value={form.password}
                onChange={set("password")}
                type="password"
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Confirmar contraseña *</label>
              <input
                value={form.password_confirm}
                onChange={set("password_confirm")}
                type="password"
                placeholder="Repite la contraseña"
                autoComplete="new-password"
                className={`${inputCls} ${form.password_confirm && form.password !== form.password_confirm ? "border-red-300 focus:ring-red-400" : ""}`}
              />
              {form.password_confirm && form.password !== form.password_confirm && (
                <p className="text-xs text-red-500 mt-1">Las contraseñas no coinciden</p>
              )}
              {form.password_confirm && form.password === form.password_confirm && form.password && (
                <p className="text-xs text-green-600 mt-1">✓ Las contraseñas coinciden</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !form.username.trim() || !form.password || !form.email.trim() || form.password !== form.password_confirm}
              className="w-full bg-cafe text-white font-semibold py-4 rounded-2xl mt-1 disabled:opacity-40 active:opacity-80 transition-opacity"
            >
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-400 mt-5">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-cafe font-semibold">
            Inicia sesión
          </Link>
        </p>
      </div>

    </main>
  );
}
