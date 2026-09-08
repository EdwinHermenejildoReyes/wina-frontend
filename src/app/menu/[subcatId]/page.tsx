"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import api from "@/lib/api";
import type { Subcategoria } from "@/lib/types";
import ProductoCard from "@/components/menu/ProductoCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import CarritoFab from "@/components/CarritoFab";
import NavBar from "@/components/NavBar";

export default function SubcategoriaPage() {
  const { subcatId } = useParams();
  const router       = useRouter();
  const [sub, setSub]       = useState<Subcategoria | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/subcategorias/${subcatId}/`)
      .then((r) => setSub(r.data))
      .catch(() => router.replace("/menu"))
      .finally(() => setLoading(false));
  }, [subcatId, router]);

  if (loading) return <LoadingSpinner />;
  if (!sub)    return null;

  const disponibles = sub.productos.filter((p) => p.is_available);

  return (
    <main className="min-h-screen bg-crema pb-28">
      <NavBar />

      {/* ── Hero compacto con nombre de subcategoría ── */}
      <section className="bg-cafe px-6 py-7">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-crema/60 hover:text-crema text-sm mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Menú
          </button>
          <p className="font-script text-rosa text-base">Explora nuestra colección</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mt-0.5">
            {sub.nombre}
          </h1>
          <p className="text-crema/50 text-xs mt-2">
            {disponibles.length} {disponibles.length === 1 ? "producto disponible" : "productos disponibles"}
          </p>
        </div>
      </section>

      {/* ── Grid de productos ── */}
      <div className="max-w-2xl mx-auto px-4 mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
        {disponibles.map((p) => (
          <ProductoCard key={p.id} producto={p} />
        ))}
        {disponibles.length === 0 && (
          <div className="col-span-2 text-center py-16">
            <p className="text-4xl mb-3">🍰</p>
            <p className="font-display text-cafe font-bold text-base">Próximamente</p>
            <p className="text-sm text-gray-400 mt-1">No hay productos disponibles en esta colección.</p>
          </div>
        )}
      </div>

      <CarritoFab />
    </main>
  );
}
