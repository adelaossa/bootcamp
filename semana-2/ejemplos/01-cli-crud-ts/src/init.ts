import pool from "./db.js"
import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const __dirname = dirname(fileURLToPath(import.meta.url))

export async function inicializarBD(): Promise<void> {
  // Verificar si las tablas ya existen
  const { rows } = await pool.query(
    `SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_name = 'productos'
    ) AS existe`
  )

  if (rows[0]?.existe) {
    return  // Ya esta inicializada
  }

  console.log("Creando tablas y datos de ejemplo...")

  // Ejecutar schema.sql
  const schemaSQL = await readFile(join(__dirname, "..", "sql", "schema.sql"), "utf-8")
  await pool.query(schemaSQL)

  // Ejecutar seed.sql
  const seedSQL = await readFile(join(__dirname, "..", "sql", "seed.sql"), "utf-8")
  await pool.query(seedSQL)

  console.log("Base de datos inicializada.")
}
