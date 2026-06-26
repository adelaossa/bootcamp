# 8 — Filtros de excepcion

---

## El problema: manejo de errores repetitivo

Sin un filtro de excepcion, cada ruta maneja errores manualmente:

```typescript
@Get(":id")
async buscar(@Param("id") id: string) {
  const producto = await this.repo.findOne({ where: { id: +id } })
  if (!producto) {
    throw new HttpException("Producto no encontrado", HttpStatus.NOT_FOUND)
  }
  return producto
}
```

NestJS captura automaticamente las excepciones lanzadas y las convierte en respuestas HTTP apropiadas. Pero puedes personalizar como se ven esas respuestas.

---

## Excepciones HTTP integradas

NestJS incluye excepciones para los casos mas comunes:

```typescript
throw new BadRequestException("Datos invalidos")
// → 400 { statusCode: 400, message: "Datos invalidos" }

throw new UnauthorizedException("Token requerido")
// → 401

throw new ForbiddenException("No tienes permisos")
// → 403

throw new NotFoundException("Producto no encontrado")
// → 404 { statusCode: 404, message: "Producto no encontrado" }

throw new ConflictException("El email ya existe")
// → 409

throw new InternalServerErrorException("Error inesperado")
// → 500
```

---

## Filtro de excepcion global

Puedes personalizar TODAS las respuestas de error con un filtro global:

```typescript
// common/filtros/http-exception.filter.ts
import {
  ExceptionFilter, Catch, ArgumentsHost,
  HttpException, HttpStatus
} from "@nestjs/common"
import { Request, Response } from "express"

@Catch()  // Sin argumentos = atrapa TODAS las excepciones
export class HttpExceptionFilter implements ExceptionFilter {

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    // Determinar status y mensaje
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : "Error interno del servidor"

    // Respuesta estructurada consistente
    response.status(status).json({
      ok: false,
      statusCode: status,
      message,
      path: request.url,
      timestamp: new Date().toISOString()
    })
  }
}
```

### Activar el filtro global

```typescript
// main.ts
import { HttpExceptionFilter } from "./common/filtros/http-exception.filter"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))
  app.useGlobalFilters(new HttpExceptionFilter())  // ← filtro global

  await app.listen(3000)
}
```

Ahora TODOS los errores tienen una respuesta consistente:

```json
{
  "ok": false,
  "statusCode": 404,
  "message": "Producto con ID 99 no encontrado",
  "path": "/api/productos/99",
  "timestamp": "2024-06-15T14:30:00.000Z"
}
```

---

## Filtro por controlador o metodo

Tambien puedes aplicar filtros a nivel de controlador:

```typescript
@Controller("productos")
@UseFilters(HttpExceptionFilter)  // Solo para este controlador
export class ProductosController { ... }
```

O a nivel de metodo:

```typescript
@Get()
@UseFilters(HttpExceptionFilter)
listar() { ... }
```

---

## Buenas practicas

### 1. Siempre usa un filtro global

Una respuesta de error consistente (siempre el mismo formato) hace que el frontend sea mas facil de programar.

### 2. Lanza excepciones desde el service

```typescript
// Service: responsable de validar reglas de negocio
async findById(id: number): Promise<Producto> {
  const producto = await this.repo.findOne({ where: { id } })
  if (!producto) {
    throw new NotFoundException(`Producto ${id} no encontrado`)
  }
  return producto
}

// Controller: solo llama al service, no valida
@Get(":id")
async buscar(@Param("id", ParseIntPipe) id: number) {
  return this.productosService.findById(id)
}
```

### 3. No atrapes excepciones en el controller

```typescript
// ❌ Mal: atrapar y re-lanzar en el controller
@Get(":id")
async buscar(@Param("id") id: string) {
  try {
    return await this.service.findById(+id)
  } catch (error) {
    throw new NotFoundException(error.message)
  }
}

// ? Bien: el service lanza la excepcion, el controller la deja fluir
@Get(":id")
async buscar(@Param("id") id: string) {
  return this.service.findById(+id)  // si el service lanza, NestJS la captura
}
```
