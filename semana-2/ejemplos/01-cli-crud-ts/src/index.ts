import * as productosRepo from "./repositorios/productos.repo.js"
import * as categoriasRepo from "./repositorios/categorias.repo.js"
import { inicializarBD } from "./init.js"

const args = process.argv.slice(2)
const comando = args[0]

if (!comando) {
  mostrarAyuda()
  process.exit(0)
}

async function main() {
  await inicializarBD()

  switch (comando) {
    case "listar":
      await listar(args.slice(1))
      break

    case "buscar":
      await buscar(args.slice(1))
      break

    case "crear":
      await crear(args.slice(1))
      break

    case "actualizar":
      await actualizar(args.slice(1))
      break

    case "eliminar":
      await eliminar(args.slice(1))
      break

    case "categorias":
      await listarCategorias()
      break

    default:
      console.error(`Comando desconocido: ${comando}`)
      mostrarAyuda()
      process.exit(1)
  }

  process.exit(0)
}

// ─── Comandos ───

async function listar(subargs: string[]) {
  const categoriaId = parseFlag(subargs, "--categoria")

  let productos
  if (categoriaId) {
    productos = await productosRepo.findByCategoria(Number(categoriaId))
    console.log(`Productos de la categoria ${categoriaId}:`)
  } else {
    productos = await productosRepo.findAll()
    console.log("Todos los productos:")
  }

  if (productos.length === 0) {
    console.log("  (sin resultados)")
    return
  }

  console.log("")
  productos.forEach(p => {
    const cat = p.categoria_nombre ?? "Sin categoria"
    console.log(`  [${p.id}] ${p.nombre} — $${p.precio} | Stock: ${p.stock} | ${cat}`)
  })
  console.log(`\n  Total: ${productos.length} producto(s)`)
}

async function buscar(subargs: string[]) {
  const id = Number(subargs[0])
  if (!id) {
    console.error("Uso: npx tsx src/index.ts buscar <id>")
    process.exit(1)
  }

  const p = await productosRepo.findById(id)
  if (!p) {
    console.log(`Producto con id ${id} no encontrado`)
    return
  }

  console.log("")
  console.log(`  ID:       ${p.id}`)
  console.log(`  Nombre:   ${p.nombre}`)
  console.log(`  Precio:   $${p.precio}`)
  console.log(`  Stock:    ${p.stock}`)
  console.log(`  Categoria: ${p.categoria_nombre ?? "Sin categoria"}`)
  console.log(`  Creado:   ${p.creado_en}`)
}

async function crear(subargs: string[]) {
  const nombre = parseFlag(subargs, "--nombre")
  const precio = parseFlag(subargs, "--precio")
  const stock = parseFlag(subargs, "--stock")
  const categoriaId = parseFlag(subargs, "--categoria")

  if (!nombre || !precio) {
    console.error("Uso: npx tsx src/index.ts crear --nombre <texto> --precio <numero> [--stock <numero>] [--categoria <id>]")
    process.exit(1)
  }

  const producto = await productosRepo.create({
    nombre,
    precio: Number(precio),
    stock: Number(stock ?? 0),
    categoria_id: categoriaId ? Number(categoriaId) : null
  })

  console.log(`Producto creado: [${producto.id}] ${producto.nombre}`)
}

async function actualizar(subargs: string[]) {
  const id = Number(subargs[0])
  if (!id) {
    console.error("Uso: npx tsx src/index.ts actualizar <id> [--nombre <texto>] [--precio <numero>] [--stock <numero>] [--categoria <id>]")
    process.exit(1)
  }

  const data: Record<string, number | string | null> = {}
  const nombre = parseFlag(subargs, "--nombre")
  const precio = parseFlag(subargs, "--precio")
  const stock = parseFlag(subargs, "--stock")
  const categoriaId = parseFlag(subargs, "--categoria")

  if (nombre !== null) data.nombre = nombre
  if (precio !== null) data.precio = Number(precio)
  if (stock !== null) data.stock = Number(stock)
  if (categoriaId !== null) data.categoria_id = categoriaId ? Number(categoriaId) : null

  if (Object.keys(data).length === 0) {
    console.error("Debes especificar al menos un campo para actualizar")
    process.exit(1)
  }

  const producto = await productosRepo.update(id, data)
  if (!producto) {
    console.log(`Producto con id ${id} no encontrado`)
    return
  }

  console.log(`Producto actualizado: [${producto.id}] ${producto.nombre}`)
}

async function eliminar(subargs: string[]) {
  const id = Number(subargs[0])
  if (!id) {
    console.error("Uso: npx tsx src/index.ts eliminar <id>")
    process.exit(1)
  }

  const ok = await productosRepo.remove(id)
  if (ok) {
    console.log(`Producto ${id} eliminado`)
  } else {
    console.log(`Producto con id ${id} no encontrado`)
  }
}

async function listarCategorias() {
  const categorias = await categoriasRepo.findAll()
  console.log("Categorias:")
  categorias.forEach(c => console.log(`  [${c.id}] ${c.nombre}`))
}

// ─── Helpers ───

function parseFlag(args: string[], flag: string): string | null {
  const index = args.indexOf(flag)
  if (index === -1) return null
  return args[index + 1] ?? null
}

function mostrarAyuda() {
  console.log(`
╔══════════════════════════════════════╗
║   CLI CRUD — Productos + Categorias ║
╠══════════════════════════════════════╣
║                                      ║
║  Comandos:                           ║
║                                      ║
║  listar                             ║
║    --categoria <id>  (opcional)     ║
║                                      ║
║  buscar <id>                        ║
║                                      ║
║  crear                              ║
║    --nombre <texto>                 ║
║    --precio <numero>                ║
║    --stock <numero>     (opcional)  ║
║    --categoria <id>     (opcional)  ║
║                                      ║
║  actualizar <id>                    ║
║    --nombre <texto>     (opcional)  ║
║    --precio <numero>    (opcional)  ║
║    --stock <numero>     (opcional)  ║
║    --categoria <id>     (opcional)  ║
║                                      ║
║  eliminar <id>                      ║
║                                      ║
║  categorias                         ║
║                                      ║
║  Ejemplos (dev):                     ║
║    npm run dev -- listar             ║
║    npm run dev -- listar --categoria 1║
║    npm run dev -- crear              ║
║      --nombre "Mouse" --precio 29.99 ║
║    npm run dev -- buscar 1           ║
║                                      ║
║  Ejemplos (produccion):              ║
║    npm run build                     ║
║    npm start -- listar               ║
║    npm start -- buscar 1             ║
╚══════════════════════════════════════╝
`)
}

main().catch((err) => {
  console.error("Error:", err.message)
  process.exit(1)
})
