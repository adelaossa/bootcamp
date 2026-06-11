# Semana 2 — TypeScript + Bases de Datos

## Objetivos de la semana

Al finalizar esta semana los estudiantes podran:

- Escribir codigo TypeScript con tipos, interfaces, generics y enums
- Configurar un proyecto TypeScript desde cero (tsconfig.json, strict mode)
- Instalar PostgreSQL, crear bases de datos y tablas via SQL
- Escribir consultas SQL: SELECT, JOINs, GROUP BY, subconsultas
- Diseñar un esquema de base de datos normalizado
- Conectar TypeScript con PostgreSQL usando la libreria `pg` y ejecutar queries crudos

## Temas

| # | Tema | Archivo |
|---|---|---|
| 1 | TypeScript a fondo | [01-typescript-a-fondo.md](temas/01-typescript-a-fondo.md) |
| 2 | Configuracion de TypeScript | [02-tsconfig.md](temas/02-tsconfig.md) |
| 3 | PostgreSQL: instalacion y primeros pasos | [03-postgresql-intro.md](temas/03-postgresql-intro.md) |
| 4 | SQL: DDL | [04-sql-ddl.md](temas/04-sql-ddl.md) |
| 5 | SQL: DML y consultas basicas | [05-sql-dml.md](temas/05-sql-dml.md) |
| 6 | SQL: JOINs, GROUP BY y subconsultas | [06-sql-avanzado.md](temas/06-sql-avanzado.md) |
| 7 | Diseño de bases de datos | [07-diseno-bd.md](temas/07-diseno-bd.md) |
| 8 | TypeScript + PostgreSQL con `pg` | [08-ts-pg.md](temas/08-ts-pg.md) |
| 9 | Mini-proyecto: CLI CRUD con PostgreSQL | [09-mini-proyecto-ts-pg.md](temas/09-mini-proyecto-ts-pg.md) |

## Recursos complementarios

| Recurso | Enlace |
|---|---|
| TypeScript Handbook | https://www.typescriptlang.org/docs/handbook |
| PostgreSQL Tutorial | https://www.postgresqltutorial.com |
| node-postgres (pg) | https://node-postgres.com |
| DB Diagram (diseño visual) | https://dbdiagram.io |

## Comandos clave de la semana

```bash
# TypeScript
npm install -D typescript @types/node
npx tsc --init
npx tsc              # compilar
npx tsc --watch      # compilar en modo watch
node dist/index.js   # ejecutar JS compilado
npx tsx src/index.ts # ejecutar TS directamente (sin compilar)

# PostgreSQL (psql)
sudo -u postgres psql
\l                   # listar bases de datos
\c nombre_bd         # conectarse a una BD
\dt                  # listar tablas
\d nombre_tabla      # describir tabla
\q                   # salir
```

## Glosario

| Termino | Definicion |
|---|---|
| **TypeScript** | Superset tipado de JavaScript que compila a JS |
| **Interface** | Define la forma de un objeto en TypeScript |
| **Generic** | Tipo parametrizado que funciona con cualquier tipo |
| **tsconfig.json** | Archivo de configuracion del compilador de TypeScript |
| **DDL** | Data Definition Language: CREATE, ALTER, DROP |
| **DML** | Data Manipulation Language: SELECT, INSERT, UPDATE, DELETE |
| **PK (Primary Key)** | Identificador unico de cada fila en una tabla |
| **FK (Foreign Key)** | Columna que referencia la PK de otra tabla |
| **JOIN** | Operacion que combina filas de dos o mas tablas |
| **Normalizacion** | Tecnica para organizar datos y evitar redundancia |
| **pg** | Libreria de Node.js para conectarse a PostgreSQL |
