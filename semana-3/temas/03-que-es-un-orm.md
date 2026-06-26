# 3 — ?Que es un ORM?

---

## El problema: SQL crudo en aplicaciones grandes

En la semana 2 escribiste queries SQL directamente en tu codigo TypeScript:

```typescript
// Repositorio con pg (SQL crudo)
async function findById(id: number): Promise<Producto | null> {
  const { rows } = await pool.query(
    "SELECT * FROM productos WHERE id = $1",
    [id]
  )
  return rows[0] ?? null
}
```

Esto funciona muy bien para proyectos pequenos. Pero en aplicaciones grandes, aparecen problemas:

### Problema 1: SQL es string, no codigo

```typescript
// El compilador NO puede verificar este SQL
await pool.query("SELCET * FROM prodcutos WHERE id = $1", [id])
//                 ^^^^^^         ^^^^^^^^
//                 Typo en SQL.    Typo en tabla.
//                 Error en RUNTIME, no en compilacion.
```

### Problema 2: Mapeo manual de filas a objetos

```typescript
const { rows } = await pool.query("SELECT * FROM productos WHERE id = $1", [id])
const producto = rows[0]

// ?Que propiedades tiene 'producto'? TS no lo sabe.
// Tienes que definir interfaces manualmente y confiar en que coincidan
```

### Problema 3: Relaciones

```typescript
// Con SQL crudo, para traer un producto CON su categoria:
const { rows } = await pool.query(`
  SELECT p.*, c.nombre as categoria_nombre
  FROM productos p
  JOIN categorias c ON p.categoria_id = c.id
  WHERE p.id = $1
`, [id])

// Tienes que escribir el JOIN a mano CADA VEZ
// Si hay 5 relaciones, el SQL se vuelve enorme
```

### Problema 4: Migraciones

Cuando cambias el esquema (agregas una columna, creas una tabla), tienes que:
1. Escribir el `ALTER TABLE` a mano
2. Ejecutarlo en tu BD local
3. Acordarte de ejecutarlo en produccion
4. Si trabajas en equipo, coordinar quien ejecuta que

---

## Que hace un ORM

ORM significa **Object-Relational Mapping** (Mapeo Objeto-Relacional). Traduce automaticamente entre:

```
═══ Mundo de objetos (TypeScript) ═══        ═══ Mundo relacional (SQL) ═══

class Producto {                              CREATE TABLE productos (
  id: number                                    id SERIAL PRIMARY KEY,
  nombre: string                   ────>        nombre VARCHAR(200),
  precio: number                                precio NUMERIC(10,2),
  categoria: Categoria                          categoria_id INTEGER
}                                             )

producto.nombre = "Mouse"         ────>  UPDATE productos SET nombre = 'Mouse'
producto.categoria.nombre         ────>  JOIN categorias ON ...

repo.find({ where: { precio:      ────>  SELECT * FROM productos
  MoreThan(50) } })                       WHERE precio > 50
```

---

## TypeORM: el ORM que usaremos

TypeORM es el ORM mas popular para TypeScript. Veamos como se compara con `pg`:

```typescript
// ═══ Con pg (SQL crudo) ═══

async function findById(id: number) {
  const { rows } = await pool.query(
    "SELECT * FROM productos WHERE id = $1",
    [id]
  )
  return rows[0] ?? null
}

// ═══ Con TypeORM ═══

// 1. Defines la entidad UNA vez
@Entity("productos")
class Producto {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  nombre: string

  @Column("decimal", { precision: 10, scale: 2 })
  precio: number

  @ManyToOne(() => Categoria)
  categoria: Categoria
}

// 2. El repositorio ya tiene metodos tipados
const producto = await productoRepo.findOne({
  where: { id: 5 },
  relations: { categoria: true }  // JOIN automatico!
})

// producto es de tipo Producto | null
// producto?.categoria es de tipo Categoria
// Autocompletado en TODO el camino
```

---

## Ventajas de usar un ORM

### 1. Tipado fuerte

```typescript
const producto = await repo.findOne({ where: { id: 1 } })
console.log(producto.nombre)    // ? TypeScript sabe que existe
console.log(producto.descuento) // ❌ Error de compilacion: no existe
```

### 2. Relaciones automaticas

```typescript
// Sin ORM: JOIN manual cada vez
// Con TypeORM:
const producto = await repo.findOne({
  where: { id: 1 },
  relations: { categoria: true }
})
// producto.categoria ya viene con los datos de la categoria
```

### 3. Metodos de repositorio

```typescript
// find, findOne, save, update, delete, count...
const activos = await repo.find({ where: { activo: true } })
const total = await repo.count({ where: { categoria: { id: 3 } } })

// Sin escribir UNA linea de SQL
```

### 4. Query Builder (para queries complejas)

```typescript
const productos = await repo
  .createQueryBuilder("p")
  .leftJoinAndSelect("p.categoria", "c")
  .where("p.precio > :precio", { precio: 50 })
  .andWhere("c.nombre = :cat", { cat: "Electronica" })
  .orderBy("p.nombre", "ASC")
  .getMany()
```

### 5. Active Record vs Data Mapper

TypeORM soporta ambos patrones:

```typescript
// Active Record: la entidad se salva a si misma
const producto = new Producto()
producto.nombre = "Teclado"
producto.precio = 89.99
await producto.save()

// Data Mapper: el repositorio maneja la entidad
const producto = repo.create({ nombre: "Teclado", precio: 89.99 })
await repo.save(producto)
```

NestJS recomienda el patron **Data Mapper** (repositorio).

---

## Desventajas de un ORM

### 1. El problema N+1

```typescript
// Esto ejecuta 1 query para productos + N queries para categorias
const productos = await repo.find()
for (const p of productos) {
  console.log(p.categoria.nombre) // Cada acceso dispara otra query
}

// Solucion: usar 'relations' para cargar todo en una query
const productos = await repo.find({ relations: { categoria: true } })
```

### 2. Queries ineficientes

A veces el ORM genera SQL no optimo. Para queries complejas, puedes necesitar SQL crudo:

```typescript
// TypeORM te permite escapar al SQL crudo cuando lo necesitas
const result = await repo.query(
  "SELECT * FROM productos WHERE precio > (SELECT AVG(precio) FROM productos)"
)
```

### 3. Curva de aprendizaje

Hay que aprender los decoradores, la configuracion, los patrones del ORM. Es una capa mas de abstraccion.

### 4. No es magico

El ORM no te exime de entender SQL. Sigues necesitando saber que es un JOIN, un indice, una transaccion. El ORM solo te da una API mas comoda para trabajar con ellos.

---

## ?Cuando usar ORM y cuando usar SQL crudo?

| Usa ORM cuando... | Usa SQL crudo cuando... |
|---|---|
| CRUD simple y repetitivo | Queries muy complejas con varios JOINs y subconsultas |
| Muchas relaciones entre entidades | Reportes y analisis de datos |
| El equipo no es experto en SQL | Necesitas maximo rendimiento |
| Necesitas migraciones versionadas | Estas haciendo un script puntual |
| Quieres tipado fuerte en toda la app | Estas prototipando rapido |

---

## TypeORM vs pg: comparativa de codigo real

```typescript
// ═══ pg (semana 2) ═══
async findAll(): Promise<ProductoConCategoria[]> {
  const { rows } = await pool.query(`
    SELECT p.*, c.nombre as categoria_nombre
    FROM productos p
    LEFT JOIN categorias c ON p.categoria_id = c.id
    ORDER BY p.nombre
  `)
  return rows
}

async create(data: CrearProducto): Promise<Producto> {
  const { rows } = await pool.query(
    `INSERT INTO productos (nombre, precio, stock, categoria_id)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [data.nombre, data.precio, data.stock, data.categoria_id]
  )
  return rows[0]
}

// ═══ TypeORM (semana 3) ═══
async findAll(): Promise<Producto[]> {
  return this.repo.find({
    relations: { categoria: true },
    order: { nombre: "ASC" }
  })
}

async create(dto: CrearProductoDto): Promise<Producto> {
  const producto = this.repo.create(dto)
  return this.repo.save(producto)
}
```

> En la semana 2 aprendiste SQL crudo para entender QUE pasa. En la semana 3 usas TypeORM para ser mas productivo sabiendo QUE hay debajo.
