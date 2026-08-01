"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user || user.tipo_usuario !== "admin") {
      router.replace("/menu");
    }
  }, [user, loading, router]);

  if (loading) return <LoadingSpinner texto="Verificando acceso..." />;
  if (!user || user.tipo_usuario !== "admin") return null;

  return <>{children}</>;
}
