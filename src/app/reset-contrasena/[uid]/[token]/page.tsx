"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";

export default function ResetContrasenaPage() {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const router = useRouter();

  const [password,        setPassword]        = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading,         setLoading]         = useState(false);

  const coinciden  = password === passwordConfirm;
  const suficiente = password.length >= 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !coinciden || !suficiente) return;
    setLoading(true);
    try {
      await api.post("/auth/users/reset_password_confirm/", {
        uid,
        token,
        new_password:    password,
        re_new_password: passwordConfirm,
      });
      toast.success("Contraseña actualizada correctamente");
      router.push("/login");
    } catch (err: unknown) {
      const data = (err as { response?: { data?: Record<string, string[]> } })?.response?.data;
      if (data?.token || data?.uid) {
        toast.error("El enlace expiró o ya fue usado. Solicita uno nuevo.");
      } else if (data?.new_password) {
        toast.error(data.new_password[0]);
      } else {
        toast.error("No se pudo restablecer la contraseña. Intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full border border-gris-borde rounded-2xl px-4 py-3 text-sm bg-crema-alt focus:outline-none focus:ring-2 focus:ring-cafe placeholder:text-gray-400";
  const labelCls = "text-xs font-semibold text-dark/50 uppercase tracking-wide mb-1.5 block";

  return (
    <main className="min-h-screen bg-crema">

      {/* ── Hero ── */}
      <section className="bg-cafe px-6 pt-8 pb-12">
        <button
          onClick={() => router.push("/login")}
          className="flex items-center gap-1.5 text-crema/60 hover:text-crema text-sm mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Iniciar sesión
        </button>
        <p className="font-script text-rosa text-lg">Ya casi terminas ♡</p>
        <h1 className="font-display text-4xl font-bold text-white leading-tight mt-0.5">
          Nueva contraseña
        </h1>
      </section>

      <div className="max-w-sm mx-auto px-4 -mt-5">
        <div className="bg-white rounded-3xl px-6 py-6 shadow-sm border border-gris-borde">
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className={labelCls}>Nueva contraseña</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
                className={`${inputCls} ${password && !suficiente ? "border-red-300 focus:ring-red-400" : ""}`}
              />
              {password && !suficiente && (
                <p className="text-xs text-red-500 mt-1">Mínimo 8 caracteres</p>
              )}
            </div>

            <div>
              <label className={labelCls}>Confirmar contraseña</label>
              <input
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                type="password"
                placeholder="Repite la contraseña"
                autoComplete="new-password"
                className={`${inputCls} ${passwordConfirm && !coinciden ? "border-red-300 focus:ring-red-400" : ""}`}
              />
              {passwordConfirm && !coinciden && (
                <p className="text-xs text-red-500 mt-1">Las contraseñas no coinciden</p>
              )}
              {passwordConfirm && coinciden && password && (
                <p className="text-xs text-green-600 mt-1">✓ Las contraseñas coinciden</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !password || !passwordConfirm || !coinciden || !suficiente}
              className="w-full bg-cafe text-white font-semibold py-4 rounded-2xl disabled:opacity-40 active:opacity-80 transition-opacity"
            >
              {loading ? "Guardando..." : "Guardar contraseña"}
            </button>
          </form>
        </div>
      </div>

    </main>
  );
}
