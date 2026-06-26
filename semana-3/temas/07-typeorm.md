# 7 — TypeORM + PostgreSQL

---

## Instalacion

```bash
npm install @nestjs/typeorm typeorm pg
```

---

## Configuracion en el modulo raiz

```typescript
// app.module.ts
import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ProductosModule } from "./productos/productos.module"
import { CategoriasModule } from "./categorias/categorias.module"

@Module({
  imports: [
    // Configurar TypeORM
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "estudiante",
      password: "pass123",
      database: "bootcamp",
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: true  // ← SOLO DESARROLLO. Crea/actualiza tablas automaticamente
    }),
    ProductosModule,
    CategoriasModule
  ]
})
export class AppModule {}
```

### ?Que hace `synchronize: true`?

En cada arranque, TypeORM compara tus entidades con las tablas de la BD:
- Si una entidad no tiene tabla → la crea
- Si una entidad tiene una columna nueva → la agrega

**Solo para desarrollo.** En produccion se usan migraciones (semana 4+).

---

## Definiendo entidades

Una entidad representa una tabla de la base de datos:

```typescript
// entities/categoria.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Producto } from "../../productos/entities/producto.entity"

@Entity("categorias")  // ← nombre de la tabla
export class Categoria {

  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  nombre: string

  @Column({ nullable: true })
  descripcion: string

  @OneToMany(() => Producto, (producto) => producto.categoria)
  productos: Producto[]
}
```

```typescript
// entities/producto.entity.ts
import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, CreateDateColumn
} from "typeorm"
import { Categoria } from "../../categorias/entities/categoria.entity"

@Entity("productos")
export class Producto {

  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 200 })
  nombre: string

  @Column("decimal", { precision: 10, scale: 2 })
  precio: number

  @Column({ default: 0 })
  stock: number

  @CreateDateColumn()
  creado_en: Date

  @ManyToOne(() => Categoria, (categoria) => categoria.productos, {
    nullable: true,
    onDelete: "SET NULL"
  })
  @JoinColumn({ name: "categoria_id" })
  categoria: Categoria

  @Column({ nullable: true })  // columna FK explicita
  categoria_id: number
}
```

### Decoradores de columna

| Decorador | Que hace |
|---|---|
| `@PrimaryGeneratedColumn()` | PK autoincremental (SERIAL) |
| `@Column()` | Columna normal (tipo inferido) |
| `@Column("decimal", { precision: 10, scale: 2 })` | NUMERIC(10, 2) |
| `@Column({ default: 0 })` | DEFAULT 0 |
| `@Column({ nullable: true })` | Permite NULL |
| `@Column({ unique: true })` | UNIQUE |
| `@Column({ length: 200 })` | VARCHAR(200) |
| `@CreateDateColumn()` | TIMESTAMP DEFAULT NOW() |
| `@UpdateDateColumn()` | TIMESTAMP que se actualiza solo |

### Decoradores de relacion

| Decorador | Relacion |
|---|---|
| `@OneToMany()` | 1:N (una categoria tiene muchos productos) |
| `@ManyToOne()` | N:1 (muchos productos pertenecen a una categoria) |
| `@OneToOne()` | 1:1 |
| `@ManyToMany()` | N:M (requiere `@JoinTable()`) |
| `@JoinColumn()` | Indica quien tiene la FK |

---

## Registrando entidades en el modulo

Cada modulo que usa TypeORM debe importar las entidades que necesita:

```typescript
// productos/productos.module.ts
import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Producto } from "./entities/producto.entity"
import { ProductosController } from "./productos.controller"
import { ProductosService } from "./productos.service"

@Module({
  imports: [TypeOrmModule.forFeature([Producto])],  // ← registra la entidad
  controllers: [ProductosController],
  providers: [ProductosService]
})
export class ProductosModule {}
```

`TypeOrmModule.forFeature([Producto])` hace que el repositorio de `Producto` este disponible para inyeccion en este modulo.

---

## Usando repositorios en el service

```typescript
// productos/productos.service.ts
import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Producto } from "./entities/producto.entity"
import { CrearProductoDto } from "./dto/crear-producto.dto"

@Injectable()
export class ProductosService {

  constructor(
    @InjectRepository(Producto)
    private readonly repo: Repository<Producto>  // ← inyecta el repositorio
  ) {}

  async findAll(): Promise<Producto[]> {
    return this.repo.find({
      relations: { categoria: true },  // JOIN automatico
      order: { nombre: "ASC" }
    })
  }

  async findById(id: number): Promise<Producto> {
    const producto = await this.repo.findOne({
      where: { id },
      relations: { categoria: true }
    })

    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`)
    }

    return producto
  }

  async create(dto: CrearProductoDto): Promise<Producto> {
    const producto = this.repo.create(dto)  // crea instancia (no guarda)
    return this.repo.save(producto)          // INSERT en la BD
  }

  async update(id: number, dto: ActualizarProductoDto): Promise<Producto> {
    const producto = await this.findById(id)  // verifica que existe
    Object.assign(producto, dto)              // actualiza propiedades
    return this.repo.save(producto)            // UPDATE en la BD
  }

  async remove(id: number): Promise<void> {
    const producto = await this.findById(id)
    await this.repo.remove(producto)  // DELETE en la BD
  }
}
```

### Metodos del repositorio

| Metodo | SQL equivalente |
|---|---|
| `repo.find({ where: { precio: MoreThan(50) } })` | `SELECT * FROM productos WHERE precio > 50` |
| `repo.findOne({ where: { id } })` | `SELECT * FROM productos WHERE id = 5 LIMIT 1` |
| `repo.save(entity)` | `INSERT` o `UPDATE` (depende si tiene id) |
| `repo.remove(entity)` | `DELETE` |
| `repo.count({ where: { activo: true } })` | `SELECT COUNT(*) FROM productos WHERE activo = true` |

### Operadores de busqueda

```typescript
import { MoreThan, LessThan, Between, Like, In, IsNull, Not } from "typeorm"

repo.find({ where: { precio: MoreThan(100) } })       // > 100
repo.find({ where: { precio: LessThan(50) } })         // < 50
repo.find({ where: { precio: Between(20, 50) } })     // BETWEEN 20 AND 50
repo.find({ where: { nombre: Like("%teclado%") } })   // LIKE '%teclado%'
repo.find({ where: { id: In([1, 3, 5]) } })           // IN (1, 3, 5)
repo.find({ where: { categoria: IsNull() } })          // IS NULL
repo.find({ where: { activo: Not(false) } })           // != false
```

---

## Ahora con capa de repositorio (opcional)

Puedes separar la logica de acceso a datos en un repositorio personalizado:

```typescript
// productos/productos.repository.ts
import { Injectable } from "@nestjs/common"
import { DataSource, Repository } from "typeorm"
import { Producto } from "./entities/producto.entity"

@Injectable()
export class ProductosRepository extends Repository<Producto> {
  constructor(private dataSource: DataSource) {
    super(Producto, dataSource.createEntityManager())
  }

  // Metodos personalizados
  async findByCategoria(categoriaId: number): Promise<Producto[]> {
    return this.find({
      where: { categoria_id: categoriaId },
      relations: { categoria: true }
    })
  }
}
```

> En este bootcamp usaremos el repositorio estandar de TypeORM inyectado directamente en el service. Es mas simple y suficiente para lo que necesitamos.
