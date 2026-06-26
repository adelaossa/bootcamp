# 4 — NestJS: introduccion

---

## ?Que es NestJS?

NestJS es un framework para construir aplicaciones del lado del servidor con Node.js. Usa TypeScript por defecto y esta fuertemente inspirado en **Angular** (mismos patrones, misma filosofia).

```
╔══════════════════════════════════════════╗
║              NESTJS                      ║
╠══════════════════════════════════════════╣
║  Construido sobre Express (o Fastify)    ║
║  Arquitectura modular (como Angular)     ║
║  Decoradores para todo                   ║
║  Inyeccion de dependencias integrada     ║
║  TypeScript-first                        ║
║  Soporte para: TypeORM, Prisma,          ║
║  Mongoose, GraphQL, WebSockets, gRPC... ║
╚══════════════════════════════════════════╝
```

### NestJS vs Express: ?que ganas?

| | Express (semana 1) | NestJS (semana 3) |
|---|---|---|
| **Estructura** | Tu la defines | Modular, predecible |
| **Validacion** | Manual en cada ruta | `class-validator` + DTOs |
| **Manejo de errores** | `try/catch` manual | Filtros de excepcion |
| **Base de datos** | `pg` crudo | TypeORM integrado |
| **Documentacion** | La escribes a mano | Swagger con decoradores |
| **Testing** | Configuras desde cero | Integrado con Jest |
| **Inyeccion de dependencias** | No tiene | Nativo |

---

## Instalacion y primer proyecto

```bash
# Instalar la CLI de NestJS globalmente
npm install -g @nestjs/cli

# Crear un proyecto nuevo
nest new mi-api

# Elegir npm como package manager
# La CLI crea toda la estructura
cd mi-api
npm run start:dev
```

Abre `http://localhost:3000`. Veras `{"message":"Hello World!"}`.

---

## Estructura generada por la CLI

```
mi-api/
├── src/
│   ├── main.ts                 ← punto de entrada, crea la app
│   ├── app.module.ts           ← modulo raiz
│   ├── app.controller.ts       ← controlador de ejemplo
│   ├── app.controller.spec.ts  ← test del controlador
│   ├── app.service.ts          ← provider de ejemplo
│   └── app.module.ts
├── test/
├── nest-cli.json               ← configuracion de la CLI
├── package.json
├── tsconfig.json
└── tsconfig.build.json
```

---

## El corazon de NestJS: el decorador

Los decoradores son el mecanismo principal de NestJS. Agregan **metadatos** a clases, metodos y parametros.

```typescript
@Controller("usuarios")   // ← Decorador de clase
export class UsuariosController {

  @Get()                   // ← Decorador de metodo
  listar(): string {
    return "Lista de usuarios"
  }

  @Get(":id")              // ← Decorador con parametro
  buscar(@Param("id") id: string): string {
    return `Usuario ${id}`
  }

  @Post()
  crear(@Body() datos: CrearUsuarioDto) {
    // NestJS automaticamente parsea el body de la request
    // y lo convierte a CrearUsuarioDto
  }
}
```

### ?Como funciona un decorador?

Un decorador es una funcion que recibe la clase/metodo/propiedad y le agrega metadata:

```typescript
// Version simplificada de como funciona @Get()
function Get(path?: string) {
  return function (target: any, propertyKey: string) {
    // Registra: "el metodo 'listar' responde a GET /usuarios"
    Reflect.defineMetadata("path", path || "/", target, propertyKey)
    Reflect.defineMetadata("method", "GET", target, propertyKey)
  }
}
```

> No necesitas implementar decoradores. Solo necesitas entender que NestJS los usa para saber QUE hacer con TU codigo. Esto es la "inversion de control".

---

## main.ts: el punto de entrada

```typescript
import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"

async function bootstrap() {
  // Crea la aplicacion a partir del modulo raiz
  const app = await NestFactory.create(AppModule)

  // Arranca el servidor
  await app.listen(3000)
  console.log("Servidor en http://localhost:3000")
}

bootstrap()
```

`NestFactory.create(AppModule)` es el momento en que NestJS:
1. Lee todos los decoradores de tus clases
2. Arma el arbol de dependencias
3. Configura el servidor HTTP (Express por defecto)
4. Conecta las rutas a los controladores

---

## app.module.ts: el modulo raiz

```typescript
import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"

@Module({
  imports: [],         // otros modulos que este modulo necesita
  controllers: [       // controladores de este modulo
    AppController
  ],
  providers: [         // servicios/providers de este modulo
    AppService
  ]
})
export class AppModule {}
```

El modulo raiz es como el `index.html` de tu app. NestJS empieza por aqui y sigue las dependencias.

---

## Flujo de una solicitud en NestJS

```
1. Llega GET /usuarios
   ↓
2. NestJS busca en los modulos → controladores → rutas
   Encuentra: UsuariosController.listar() tiene @Get()
   ↓
3. NestJS necesita una instancia de UsuariosController
   ↓
4. Revisa el constructor:
   constructor(private usuariosService: UsuariosService) {}
   "Necesito UsuariosService"
   ↓
5. Busca en providers quien provee UsuariosService
   Lo crea (o reusa uno existente)
   ↓
6. Crea UsuariosController inyectandole UsuariosService
   ↓
7. Llama a controller.listar()
   ↓
8. El resultado se convierte a JSON y se envia como respuesta
```

Todo esto es automatico. Tu solo declaras las clases y sus dependencias. NestJS hace el resto.

---

## Generar codigo con la CLI

NestJS tiene una CLI muy potente. En vez de crear archivos a mano:

```bash
# Generar un modulo completo (controller + service + module + entity + dto)
nest generate resource productos

# El asistente pregunta:
# ? What transport layer do you use?  REST API
# ? Would you like to generate CRUD entry points?  Yes

# Genera:
# src/productos/
#   ├── productos.module.ts
#   ├── productos.controller.ts
#   ├── productos.service.ts
#   ├── dto/create-producto.dto.ts
#   ├── dto/update-producto.dto.ts
#   └── entities/producto.entity.ts
# Y actualiza app.module.ts automaticamente

# Otros comandos utiles
nest generate module categorias       # solo el modulo
nest generate controller categorias   # solo el controlador
nest generate service categorias      # solo el service
```

> La CLI de NestJS es como tener un asistente que escribe el boilerplate por ti. Enfocate en la logica, no en crear archivos.
