import pool from "../db.js"
import type { Categoria } from "../tipos.js"

export async function findAll(): Promise<Categoria[]> {
  const { rows } = await pool.query(
    "SELECT * FROM categorias ORDER BY nombre"
  )
  return rows
}

export async function findById(id: number): Promise<Categoria | null> {
  const { rows } = await pool.query(
    "SELECT * FROM categorias WHERE id = $1",
    [id]
  )
  return rows[0] ?? null
}
