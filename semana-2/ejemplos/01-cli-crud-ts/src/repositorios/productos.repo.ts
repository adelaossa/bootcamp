import pool from "../db.js"
import type {
  Producto,
  ProductoConCategoria,
  CrearProducto,
  ActualizarProducto
} from "../tipos.js"

export async function findAll(): Promise<ProductoConCategoria[]> {
  const { rows } = await pool.query(
    `SELECT p.*, c.nombre AS categoria_nombre
     FROM productos p
     LEFT JOIN categorias c ON p.categoria_id = c.id
     ORDER BY p.nombre`
  )
  return rows
}

export async function findByCategoria(categoriaId: number): Promise<ProductoConCategoria[]> {
  const { rows } = await pool.query(
    `SELECT p.*, c.nombre AS categoria_nombre
     FROM productos p
     LEFT JOIN categorias c ON p.categoria_id = c.id
     WHERE p.categoria_id = $1
     ORDER BY p.nombre`,
    [categoriaId]
  )
  return rows
}

export async function findById(id: number): Promise<ProductoConCategoria | null> {
  const { rows } = await pool.query(
    `SELECT p.*, c.nombre AS categoria_nombre
     FROM productos p
     LEFT JOIN categorias c ON p.categoria_id = c.id
     WHERE p.id = $1`,
    [id]
  )
  return rows[0] ?? null
}

export async function create(data: CrearProducto): Promise<Producto> {
  const { rows } = await pool.query(
    `INSERT INTO productos (nombre, precio, stock, categoria_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [data.nombre, data.precio, data.stock, data.categoria_id]
  )
  return rows[0]
}

export async function update(id: number, data: ActualizarProducto): Promise<Producto | null> {
  const campos: string[] = []
  const valores: unknown[] = []
  let i = 1

  if (data.nombre !== undefined) {
    campos.push(`nombre = $${i++}`)
    valores.push(data.nombre)
  }
  if (data.precio !== undefined) {
    campos.push(`precio = $${i++}`)
    valores.push(data.precio)
  }
  if (data.stock !== undefined) {
    campos.push(`stock = $${i++}`)
    valores.push(data.stock)
  }
  if (data.categoria_id !== undefined) {
    campos.push(`categoria_id = $${i++}`)
    valores.push(data.categoria_id)
  }

  if (campos.length === 0) return null

  valores.push(id)
  const { rows } = await pool.query(
    `UPDATE productos SET ${campos.join(", ")} WHERE id = $${i} RETURNING *`,
    valores
  )
  return rows[0] ?? null
}

export async function remove(id: number): Promise<boolean> {
  const { rowCount } = await pool.query(
    "DELETE FROM productos WHERE id = $1",
    [id]
  )
  return (rowCount ?? 0) > 0
}
