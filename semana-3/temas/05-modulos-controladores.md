# 5 — Modulos, controladores y providers

---

## Los 3 pilares de NestJS

Toda aplicacion NestJS se construye con 3 bloques fundamentales:

```
┌─────────────────────────────────────────────┐
│                  MODULO                      │
│  Agrupa controladores y providers            │
│  relacionados. Define un contexto.           │
│                                              │
│  ┌──────────────┐   ┌──────────────────┐    │
│  │ CONTROLADOR   │   │    PROVIDER       │    │
│  │ Maneja HTTP   │──>│  Logica de        │    │
│  │ (rutas)       │   │  negocio          │    │
│  └──────────────┘   └──────────────────┘    │
└─────────────────────────────────────────────┘
```

---

## Modulo (`@Module`)

Un modulo es una clase con el decorador `@Module()`. Agrupa toda la funcionalidad relacionada.

```typescript
// productos.module.ts
import { Module } from "@nestjs/common"
import { ProductosController } from "./productos.controller"
import { ProductosService } from "./productos.service"

@Module({
  controllers: [ProductosController],
  providers: [ProductosService]
})
export class ProductosModule {}
```

**Analogia**: un modulo es como un **departamento** en una empresa. El departamento de Ventas tiene sus propios empleados (providers) y su propia recepcion (controller). No necesita saber como funciona el departamento de Contabilidad.

---

## Controlador (`@Controller`)

El controlador es la **puerta de entrada** de las solicitudes HTTP. Solo se encarga de:
- Recibir la request
- Llamar al servicio correspondiente
- Devolver la respuesta

```typescript
import { Controller, Get, Post, Body, Param } from "@nestjs/common"
import { ProductosService } from "./productos.service"
import { CrearProductoDto } from "./dto/crear-producto.dto"

@Controller("productos")  // ← todas las rutas empiezan con /productos
export class ProductosController {

  // Inyeccion de dependencias: NestJS crea ProductosService y lo pasa aqui
  constructor(private readonly productosService: ProductosService) {}

  @Get()                          // GET /productos
  listar() {
    return this.productosService.findAll()
  }

  @Get(":id")                     // GET /productos/5
  buscar(@Param("id") id: string) {
    return this.productosService.findById(+id)
  }

  @Post()                         // POST /productos
  crear(@Body() dto: CrearProductoDto) {
    return this.productosService.create(dto)
  }
}
```

### Decoradores de ruta

| Decorador | URL resultante (si el controlador es `@Controller("productos")`) |
|---|---|
| `@Get()` | `GET /productos` |
| `@Get(":id")` | `GET /productos/:id` |
| `@Post()` | `POST /productos` |
| `@Put(":id")` | `PUT /productos/:id` |
| `@Patch(":id")` | `PATCH /productos/:id` |
| `@Delete(":id")` | `DELETE /productos/:id` |

### Decoradores de parametro

```typescript
@Get(":id")
buscar(
  @Param("id") id: string,           // req.params.id
  @Query("categoria") cat?: string,  // req.query.categoria
  @Body() datos: CrearDto,           // req.body
  @Headers("authorization") auth: string // req.headers.authorization
) {}
```

### Codigos de estado

```typescript
@Post()
@HttpCode(201)  // Por defecto POST retorna 201, GET retorna 200
crear(@Body() dto: CrearProductoDto) {
  return this.productosService.create(dto)
}
```

---

## Provider / Service (`@Injectable`)

El provider contiene la **logica de negocio**. El controlador no deberia saber COMO se obtienen los datos, solo QUE datos necesita.

```typescript
import { Injectable } from "@nestjs/common"

@Injectable()  // ← permite que sea inyectado en controladores y otros providers
export class ProductosService {

  private productos = []  // Ejemplo: array en memoria

  findAll() {
    return this.productos
  }

  findById(id: number) {
    const producto = this.productos.find(p => p.id === id)
    if (!producto) {
      throw new Error("Producto no encontrado")
    }
    return producto
  }

  create(dto: CrearProductoDto) {
    const nuevo = { id: Date.now(), ...dto }
    this.productos.push(nuevo)
    return nuevo
  }
}
```

> En la practica, el service usara TypeORM para consultar la base de datos. Lo veremos en el tema 7.

---

## Inyeccion de dependencias (DI)

La inyeccion de dependencias es probablemente el concepto MAS importante de NestJS.

### Sin DI (lo que hacias en Express)

```typescript
// Tu creas las dependencias manualmente
const service = new ProductosService()
const controller = new ProductosController(service)
```

Esto funciona con 2 clases. ?Con 50? ?Cuando un servicio depende de otro servicio que depende de otro? Se vuelve un caos.

### Con DI (NestJS)

```typescript
// Tu solo declaras LO QUE necesitas
@Controller("productos")
class ProductosController {
  constructor(
    private readonly productosService: ProductosService
  ) {}
  // "Necesito un ProductosService. No me importa como se crea."
}

// NestJS:
// 1. Ve que el constructor pide ProductosService
// 2. Busca quien provee ProductosService (@Injectable)
// 3. Lo crea (o reusa uno existente)
// 4. Se lo pasa al constructor del controller
```

**Analogia**: en un restaurante, el mesero (controller) no va a la cocina a cocinar. Le pide al chef (service). El chef usa ingredientes que le provee el almacen (otro service). Nadie crea sus propias herramientas. El restaurante (NestJS) se las provee.

### Tres reglas de DI en NestJS

1. **`@Injectable()`** — marca una clase como "inyectable" (puede ser provista a otros)
2. **`providers: [...]`** en el modulo — registra la clase en el contenedor de DI
3. **`constructor(private servicio: Servicio)`** — pide una dependencia

---

## Organizacion por dominio

Cada recurso de tu API vive en su propia carpeta:

```
src/
├── app.module.ts
├── main.ts
├── productos/
│   ├── productos.module.ts
│   ├── productos.controller.ts
│   ├── productos.service.ts
│   ├── dto/
│   │   ├── crear-producto.dto.ts
│   │   └── actualizar-producto.dto.ts
│   └── entities/
│       └── producto.entity.ts
├── categorias/
│   ├── categorias.module.ts
│   ├── categorias.controller.ts
│   ├── categorias.service.ts
│   └── entities/
│       └── categoria.entity.ts
└── common/
    └── filtros/
        └── http-exception.filter.ts
```

El modulo raiz (`app.module.ts`) importa los modulos de cada dominio:

```typescript
@Module({
  imports: [
    ProductosModule,
    CategoriasModule
  ]
})
export class AppModule {}
```
