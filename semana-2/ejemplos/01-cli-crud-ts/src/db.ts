import { Pool } from "pg"

const pool = new Pool({
  user: "estudiante",
  password: "pass123",
  host: "localhost",
  port: 5432,
  database: "bootcamp"
})

pool.on("error", (err) => {
  console.error("Error inesperado en el pool de PostgreSQL:", err)
  process.exit(-1)
})

export default pool
