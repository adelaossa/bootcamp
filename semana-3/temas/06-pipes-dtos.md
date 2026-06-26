# 6 — Pipes: validacion y DTOs

---

## ?Que es un DTO?

DTO significa **Data Transfer Object**. Es un objeto que define la forma y validacion de los datos que viajan entre el cliente y el servidor.

```
[Cliente] ── JSON ──> [DTO (validacion)] ──> [Controller] ──> [Service]
                       Si no cumple: 400 Bad Request
```

```typescript
// crear-producto.dto.ts
export class CrearProductoDto {
  nombre: string
  precio: number
  stock: number
  categoria_id: number
}
```

La diferencia entre una interface y un DTO: las interfaces no existen en runtime (se borran al compilar). Los DTOs son **clases** que existen en runtime, por lo que podemos agregarles validaciones con decoradores.

---

## class-validator

NestJS se integra con la libreria `class-validator` para validar DTOs automaticamente.

```bash
npm install class-validator class-transformer
```

```typescript
import { IsString, IsNumber, IsPositive, IsOptional, MinLength, MaxLength } from "class-validator"

export class CrearProductoDto {

  @IsString({ message: "El nombre debe ser texto" })
  @MinLength(3, { message: "El nombre debe tener al menos 3 caracteres" })
  @MaxLength(200, { message: "El nombre no puede exceder 200 caracteres" })
  nombre: string

  @IsNumber({}, { message: "El precio debe ser un numero" })
  @IsPositive({ message: "El precio debe ser positivo" })
  precio: number

  @IsOptional()
  @IsNumber({}, { message: "El stock debe ser un numero" })
  stock?: number

  @IsOptional()
  @IsNumber({}, { message: "El ID de categoria debe ser un numero" })
  categoria_id?: number
}
```

### Decoradores mas usados

| Decorador | Valida que... |
|---|---|
| `@IsString()` | Sea string |
| `@IsNumber()` | Sea numero |
| `@IsBoolean()` | Sea booleano |
| `@IsEmail()` | Sea formato email valido |
| `@IsUrl()` | Sea URL valida |
| `@IsPositive()` | Numero > 0 |
| `@IsOptional()` | El campo puede faltar |
| `@MinLength(n)` | String tenga al menos n caracteres |
| `@MaxLength(n)` | String tenga maximo n caracteres |
| `@Min(n)` | Numero >= n |
| `@Max(n)` | Numero <= n |
| `@IsEnum(Clase)` | Sea uno de los valores del enum |
| `@IsNotEmpty()` | No sea vacio (`""`, `null`, `undefined`) |
| `@IsArray()` | Sea array |
| `@Matches(/regex/)` | Coincida con expresion regular |

---

## DTO para actualizacion parcial

Para PATCH (actualizacion parcial), todos los campos deben ser opcionales:

```typescript
import { PartialType } from "@nestjs/mapped-types"
import { CrearProductoDto } from "./crear-producto.dto"

export class ActualizarProductoDto extends PartialType(CrearProductoDto) {}
// Todas las propiedades de CrearProductoDto ahora son opcionales
```

`PartialType` es un utility de NestJS que toma un DTO y hace todas sus propiedades opcionales. Usalo siempre para DTOs de actualizacion.

---

## Pipes

Un **pipe** en NestJS transforma o valida los datos antes de que lleguen al controlador.

```
[Request] ──> [Pipe] ──> [Controller]
              Valida/transforma
              Si falla: 400
```

### ValidationPipe

El pipe mas importante. Valida los DTOs automaticamente usando `class-validator`:

```typescript
// main.ts
import { ValidationPipe } from "@nestjs/common"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Activar validacion global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // Elimina propiedades no definidas en el DTO
      forbidNonWhitelisted: true, // Rechaza propiedades no definidas (400)
      transform: true         // Transforma string a numero, etc. automaticamente
    })
  )

  await app.listen(3000)
}
```

### ?Que pasa cuando falla la validacion?

```bash
POST /productos
{ "nombre": 123, "precio": -10 }

# Respuesta:
400 Bad Request
{
  "statusCode": 400,
  "message": [
    "El nombre debe ser texto",
    "El precio debe ser positivo"
  ],
  "error": "Bad Request"
}
```

Automatico. Sin escribir `if (!nombre) { res.status(400)... }` en cada ruta.

### Otros pipes utiles

```typescript
// ParseIntPipe: convierte string a numero
@Get(":id")
buscar(@Param("id", ParseIntPipe) id: number) {
  // id es number garantizado. Si no es numero → 400 automatico
}

// ParseUUIDPipe: valida que sea UUID
@Get(":uuid")
buscar(@Param("uuid", ParseUUIDPipe) uuid: string) {}

// DefaultValuePipe: valor por defecto
@Get()
listar(@Query("pagina", new DefaultValuePipe(1)) pagina: number) {
  // Si no se envia ?pagina=X, pagina = 1
}
```

---

## Flujo completo de validacion

```
1. Cliente envia POST /productos
   Body: { "nombre": "Teclado", "precio": 89.99, "color": "negro" }

2. ValidationPipe intercepta
   → whitelist: true → elimina "color" (no esta en el DTO)
   → forbidNonWhitelisted: true → 400 si hay propiedades no permitidas
   → transform: true → convierte tipos si es necesario

3. Valida contra CrearProductoDto
   → nombre: string ? OK
   → precio: number positivo ? OK

4. El controller recibe el DTO ya validado y limpio
   crear(@Body() dto: CrearProductoDto) {
     // dto.nombre = "Teclado" (string)
     // dto.precio = 89.99 (number)
     // dto.color NO existe
   }
```
