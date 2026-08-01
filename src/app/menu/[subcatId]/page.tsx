"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import api from "@/lib/api";
import type { Subcategoria } from "@/lib/types";
import ProductoCard from "@/components/menu/ProductoCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import CarritoFab from "@/components/CarritoFab";

export default function SubcategoriaPage() {
  const { subcatId } = useParams();
  const router = useRouter();
  const [sub, setSub] = useState<Subcategoria | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/subcategorias/${subcatId}/`)
      .then((r) => setSub(r.data))
      .catch(() => router.replace("/menu"))
      .finally(() => setLoading(false));
  }, [subcatId, router]);

  if (loading) return <LoadingSpinner />;
  if (!sub) return null;

  const disponibles = sub.productos.filter((p) => p.is_available);

  return (
    <main className="min-h-screen bg-crema pb-28">
      {/* Header */}
      <div className="bg-white px-4 pt-6 pb-4 shadow-sm flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 -ml-2 rounded-xl active:bg-gris">
          <ArrowLeft className="w-5 h-5 text-dark" />
        </button>
        <div>
          <h1 className="font-bold text-dark">{sub.nombre}</h1>
          <p className="text-xs text-gray-400">{disponibles.length} productos</p>
        </div>
      </div>

      <div className="px-4 mt-4 grid grid-cols-2 gap-3">
        {disponibles.map((p) => (
          <ProductoCard key={p.id} producto={p} />
        ))}
        {disponibles.length === 0 && (
          <p className="col-span-2 text-center text-gray-400 py-12 text-sm">
            No hay productos disponibles en esta categoría.
          </p>
        )}
      </div>

      <CarritoFab />
    </main>
  );
}
