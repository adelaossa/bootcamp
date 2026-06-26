# Semana 3 — Backend NestJS: Fundamentos

## Objetivos de la semana

Al finalizar esta semana los estudiantes podran:

- Explicar que es un framework, como se diferencia de una libreria y que problemas resuelve
- Entender la arquitectura en capas de una aplicacion moderna
- Explicar que es un ORM, como funciona y cuando conviene usarlo
- Crear un proyecto NestJS desde cero con su CLI
- Construir una API REST con modulos, controladores, providers y DTOs
- Integrar TypeORM con PostgreSQL usando `synchronize`
- Validar datos de entrada con `class-validator`
- Documentar la API con Swagger/OpenAPI

## Temas

| # | Tema | Archivo |
|---|---|---|
| 1 | ?Que es un framework? | [01-que-es-un-framework.md](temas/01-que-es-un-framework.md) |
| 2 | Arquitectura en capas modernas | [02-arquitectura-en-capas.md](temas/02-arquitectura-en-capas.md) |
| 3 | ?Que es un ORM? | [03-que-es-un-orm.md](temas/03-que-es-un-orm.md) |
| 4 | NestJS: introduccion | [04-nestjs-intro.md](temas/04-nestjs-intro.md) |
| 5 | Modulos, controladores y providers | [05-modulos-controladores.md](temas/05-modulos-controladores.md) |
| 6 | Pipes: validacion y DTOs | [06-pipes-dtos.md](temas/06-pipes-dtos.md) |
| 7 | TypeORM + PostgreSQL | [07-typeorm.md](temas/07-typeorm.md) |
| 8 | Filtros de excepcion | [08-filtros-excepcion.md](temas/08-filtros-excepcion.md) |
| 9 | Swagger / OpenAPI | [09-swagger.md](temas/09-swagger.md) |
| 10 | Mini-proyecto 3: API con NestJS | [10-mini-proyecto-nestjs.md](temas/10-mini-proyecto-nestjs.md) |

## Recursos complementarios

| Recurso | Enlace |
|---|---|
| NestJS Docs | https://docs.nestjs.com |
| TypeORM Docs | https://typeorm.io |
| class-validator | https://github.com/typestack/class-validator |
| Swagger NestJS | https://docs.nestjs.com/openapi/introduction |

## Glosario

| Termino | Definicion |
|---|---|
| **Framework** | Conjunto de herramientas y reglas que estructuran el desarrollo. Inversion de control: el framework llama a tu codigo |
| **Libreria** | Codigo reutilizable que tu invocas cuando lo necesitas. Tu controlas el flujo |
| **ORM** | Object-Relational Mapping: tecnica que mapea tablas de BD a objetos/clases en el codigo |
| **Decorador** | Funcion especial en TypeScript que agrega metadata a clases, metodos o propiedades (`@Algo`) |
| **Modulo** | En NestJS, clase que agrupa controladores y providers relacionados (`@Module`) |
| **Controller** | En NestJS, clase que maneja las solicitudes HTTP entrantes (`@Controller`) |
| **Provider** | En NestJS, clase inyectable que contiene la logica de negocio (`@Injectable`) |
| **DTO** | Data Transfer Object: objeto que define la forma de los datos que viajan entre capas |
| **Entity** | En TypeORM, clase que representa una tabla de la base de datos (`@Entity`) |
| **Repository** | En TypeORM, clase que proporciona metodos para consultar y manipular una entidad |
| **Swagger** | Herramienta que genera documentacion interactiva de APIs REST |
| **synchronize** | Opcion de TypeORM que sincroniza automaticamente las entidades con las tablas (solo desarrollo) |
