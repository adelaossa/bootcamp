import pool from "./db.js"
import { readFile } from "node:fs/promises"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))

export async function inicializarBD(): Promise<void> {
  const { rows } = await pool.query(
    `SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_name = 'mensajes'
    ) AS existe`
  )

  if (rows[0]?.existe) return

  console.log("Creando tablas y datos de ejemplo...")

  const schemaSQL = await readFile(join(__dirname, "..", "sql", "schema.sql"), "utf-8")
  await pool.query(schemaSQL)

  const seedSQL = await readFile(join(__dirname, "..", "sql", "seed.sql"), "utf-8")
  await pool.query(seedSQL)

  console.log("Base de datos inicializada.")
}
