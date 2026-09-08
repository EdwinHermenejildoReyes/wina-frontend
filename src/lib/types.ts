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

// ── Atributos de variantes ────────────────────────────────────────────────────

export interface Sabor   { id: number; nombre: string; }
export interface Relleno { id: number; nombre: string; }
export interface Porcion { id: number; cantidad: number; descripcion: string; }
export interface Estilo  { id: number; nombre: string; descripcion: string; }

export interface VarianteProducto {
  id: number;
  sku: string;
  sabor: number;
  sabor_nombre: string;
  relleno: number;
  relleno_nombre: string;
  porcion: number;
  porcion_cantidad: number;
  estilo: number;
  estilo_nombre: string;
  precio: string | null;
  precio_efectivo: string;
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
  tiene_variantes?: boolean;
  variantes?: VarianteProducto[];
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

// ── Extras ────────────────────────────────────────────────────────────────────

export interface ExtraWina {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  orden: number;
}

// ── Carrito ───────────────────────────────────────────────────────────────────

export interface CarritoItem {
  carritoKey: string;       // `${producto.id}-${variante?.id ?? 'base'}`
  producto: Producto;
  variante?: VarianteProducto;
  cantidad: number;
  personalizacion: string;
  extras: ExtraWina[];
}

// ── Pedidos ───────────────────────────────────────────────────────────────────

export type EstadoPedido =
  | "pendiente"
  | "en_preparacion"
  | "listo"
  | "retirado"
  | "cancelado";

export interface PedidoDetalle {
  id: number;
  producto: number;
  producto_nombre: string;
  variante: number | null;
  variante_label: string | null;
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
  fecha_entrega: string | null;
  fecha_pedido: string;
  detalles: PedidoDetalle[];
}

export interface PedidoCreatePayload {
  nombre_cliente: string;
  telefono_cliente?: string;
  notas?: string;
  detalles: {
    producto: number;
    variante?: number;
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
  puntos: number;
  historial: HistorialPuntos[];
}
