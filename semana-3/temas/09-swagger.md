# 9 — Swagger / OpenAPI

---

## ?Que es Swagger?

Swagger (ahora llamado OpenAPI) es una herramienta que genera documentacion **interactiva** de tu API automaticamente a partir del codigo.

En vez de escribir un PDF con tus endpoints, Swagger te da una pagina web donde puedes:
- Ver todos los endpoints disponibles
- Leer que parametros requiere cada uno
- **Probar** los endpoints desde el navegador (como Thunder Client)
- Ver los esquemas de request/response

---

## Instalacion

```bash
npm install @nestjs/swagger
```

---

## Configuracion en main.ts

```typescript
import { NestFactory } from "@nestjs/core"
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"
import { AppModule } from "./app.module"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle("API de Productos")
    .setDescription("API REST para gestionar productos y categorias")
    .setVersion("1.0")
    .addTag("productos")
    .addTag("categorias")
    .build()

  const document = SwaggerModule.createDocument(app, config)

  // Swagger UI en /api/docs
  SwaggerModule.setup("api/docs", app, document)

  // Pipes y filtros...
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

  await app.listen(3000)
}
```

Abre `http://localhost:3000/api/docs`. Veras la UI de Swagger con tus endpoints documentados.

---

## Decoradores de Swagger

### Para controladores

```typescript
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger"

@ApiTags("productos")  // ← agrupa bajo esta etiqueta en la UI
@Controller("productos")
export class ProductosController {

  @Get()
  @ApiOperation({ summary: "Listar todos los productos" })
  @ApiResponse({ status: 200, description: "Lista de productos" })
  findAll() { ... }

  @Get(":id")
  @ApiOperation({ summary: "Buscar producto por ID" })
  @ApiResponse({ status: 200, description: "Producto encontrado" })
  @ApiResponse({ status: 404, description: "Producto no encontrado" })
  findById(@Param("id") id: string) { ... }

  @Post()
  @ApiOperation({ summary: "Crear un nuevo producto" })
  @ApiResponse({ status: 201, description: "Producto creado" })
  @ApiResponse({ status: 400, description: "Datos invalidos" })
  create(@Body() dto: CrearProductoDto) { ... }
}
```

### Para DTOs

```typescript
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class CrearProductoDto {

  @ApiProperty({
    example: "Teclado mecanico",
    description: "Nombre del producto"
  })
  @IsString()
  nombre: string

  @ApiProperty({
    example: 89.99,
    description: "Precio en dolares"
  })
  @IsNumber()
  precio: number

  @ApiPropertyOptional({
    example: 50,
    description: "Cantidad en inventario",
    default: 0
  })
  @IsOptional()
  stock?: number

  @ApiPropertyOptional({
    example: 1,
    description: "ID de la categoria"
  })
  @IsOptional()
  categoria_id?: number
}
```

| Decorador | Que hace |
|---|---|
| `@ApiProperty({ example: ... })` | Documenta campo obligatorio con ejemplo |
| `@ApiPropertyOptional({ ... })` | Documenta campo opcional |
| `@ApiTags("nombre")` | Agrupa endpoints bajo una etiqueta |
| `@ApiOperation({ summary: "..." })` | Describe que hace el endpoint |
| `@ApiResponse({ status: 200 })` | Documenta posible respuesta |
| `@ApiBody({ type: DtoClass })` | Documenta el body esperado |
| `@ApiQuery({ name: "..." })` | Documenta query params |
| `@ApiParam({ name: "..." })` | Documenta path params |

---

## Resultado: Swagger UI

En `http://localhost:3000/api/docs` veras:

```
┌─────────────────────────────────────────────┐
│  API de Productos                  v1.0      │
│  API REST para gestionar productos           │
├─────────────────────────────────────────────┤
│                                             │
│  productos                                  │
│  ┌─────────────────────────────────────┐    │
│  │ GET  /productos       Listar todos  │    │
│  │ POST /productos       Crear nuevo   │    │
│  │ GET  /productos/{id}  Buscar por ID │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  categorias                                 │
│  ┌─────────────────────────────────────┐    │
│  │ GET  /categorias      Listar todas  │    │
│  └─────────────────────────────────────┘    │
│                                             │
└─────────────────────────────────────────────┘
```

Al hacer click en un endpoint, se expande mostrando:
- Parametros requeridos
- Ejemplo de body
- Posibles respuestas
- Boton "Try it out" para ejecutar la solicitud ahi mismo

---

## Ventajas de Swagger

1. **Frontend y backend se ponen de acuerdo**: el frontend ve exactamente que espera la API
2. **Documentacion viva**: si cambias el codigo, la documentacion se actualiza sola
3. **Pruebas rapidas**: no necesitas Thunder Client ni curl
4. **Onboarding**: un dev nuevo abre `/api/docs` y entiende la API en minutos
