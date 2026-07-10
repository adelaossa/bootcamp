export interface Categoria {
  id: number
  nombre: string
  descripcion?: string
}

export interface Producto {
  id: number
  nombre: string
  descripcion?: string
  precio: number
  stock: number
  activo: boolean
  categoria: Categoria | null
}

export interface CreateProductoDto {
  nombre: string
  precio: number
  stock: number
  categoriaId: number
}

export interface CreateCategoriaDto {
  nombre: string
  descripcion?: string
}
