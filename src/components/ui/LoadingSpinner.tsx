export default function LoadingSpinner({ texto = "Cargando..." }: { texto?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-10 h-10 border-4 border-gris-borde border-t-rosa rounded-full animate-spin" />
      <p className="text-sm text-gray-400">{texto}</p>
    </div>
  );
}
