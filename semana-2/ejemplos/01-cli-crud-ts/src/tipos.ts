export interface Categoria {
  id: number
  nombre: string
}

export interface Producto {
  id: number
  nombre: string
  precio: number
  stock: number
  categoria_id: number | null
  creado_en: Date
}

export interface ProductoConCategoria extends Producto {
  categoria_nombre: string | null
}

export interface CrearProducto {
  nombre: string
  precio: number
  stock: number
  categoria_id: number | null
}

export interface ActualizarProducto {
  nombre?: string
  precio?: number
  stock?: number
  categoria_id?: number | null
}
