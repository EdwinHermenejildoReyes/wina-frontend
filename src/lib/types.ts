// ── Auth ──────────────────────────────────────────────────────────────────────

export interface Usuario {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  tipo_usuario: "admin" | "cliente";
  telefono: string | null;
  foto_perfil: string | null;
  puntos: number;
}

// ── Catálogo ──────────────────────────────────────────────────────────────────

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: string;
  imagen: string | null;
  is_available: boolean;
  is_featured: boolean;
  permite_personalizacion: boolean;
  orden: number;
  subcategoria: number;
}

export interface Subcategoria {
  id: number;
  nombre: string;
  descripcion: string | null;
  imagen: string | null;
  orden: number;
  productos: Producto[];
}

export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string | null;
  imagen: string | null;
  orden: number;
  subcategorias: Subcategoria[];
}

// ── Carrito ───────────────────────────────────────────────────────────────────

export interface CarritoItem {
  producto: Producto;
  cantidad: number;
  personalizacion: string;
}

// ── Pedidos ───────────────────────────────────────────────────────────────────

export type EstadoPedido =
  | "pendiente"
  | "confirmado"
  | "en_preparacion"
  | "listo"
  | "retirado"
  | "cancelado";

export interface PedidoDetalle {
  id: number;
  producto: number;
  producto_nombre: string;
  cantidad: number;
  precio_unitario: string;
  personalizacion: string;
  subtotal: string;
}

export interface Pedido {
  id: number;
  numero_pedido: string;
  cliente: number | null;
  nombre_cliente: string;
  telefono_cliente: string;
  estado: EstadoPedido;
  total: string;
  notas: string;
  fecha_pedido: string;
  detalles: PedidoDetalle[];
}

export interface PedidoCreatePayload {
  nombre_cliente: string;
  telefono_cliente?: string;
  notas?: string;
  detalles: {
    producto: number;
    cantidad: number;
    personalizacion?: string;
  }[];
}

// ── Puntos ────────────────────────────────────────────────────────────────────

export type TipoPuntos = "compra" | "canje" | "bono_bienvenida" | "ajuste";

export interface HistorialPuntos {
  id: number;
  tipo: TipoPuntos;
  puntos: number;
  descripcion: string;
  pedido: number | null;
  created_at: string;
}

export interface MiHistorialResponse {
  puntos_actuales: number;
  historial: HistorialPuntos[];
}
