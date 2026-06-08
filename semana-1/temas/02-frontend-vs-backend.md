# 2 — Frontend vs Backend

---

```
+-----------------------------------------------------+
|                    FRONTEND                          |
|  Lo que el usuario ve e interactua                  |
|                                                     |
|  [HTML]   estructura de la pagina                   |
|  [CSS]    estilos, colores, layout                  |
|  [JS]     interactividad, peticiones al backend     |
|                                                     |
|  Se ejecuta en el navegador del usuario             |
+-----------------------------------------------------+
          |
          |  HTTP / JSON
          |
+-----------------------------------------------------+
|                    BACKEND                           |
|  Logica de negocio, datos, autenticacion            |
|                                                     |
|  [API REST]   endpoints que el frontend consume     |
|  [Base de datos]   donde se guarda la informacion   |
|  [Autenticacion]   login, registro, permisos        |
|                                                     |
|  Se ejecuta en un servidor (maquina remota)         |
+-----------------------------------------------------+
```

## Comparacion

| Frontend | Backend |
|---|---|
| Se enfoca en la experiencia de usuario | Se enfoca en la logica y los datos |
| HTML, CSS, JavaScript/TypeScript | NestJS, Node.js, Python, Java, etc. |
| React, Angular, Vue | PostgreSQL, MySQL, MongoDB |
| Corre en el navegador | Corre en un servidor |
| No accede directo a la BD | Maneja la BD y expone datos via API |

## ?Por que separar frontend y backend?

1. **Especializacion**: cada parte se enfoca en lo suyo
2. **Reutilizacion**: un mismo backend puede servir a una app web, una app movil y una app de escritorio
3. **Escalabilidad**: puedes escalar cada parte por separado
4. **Equipos separados**: el equipo de frontend y el de backend pueden trabajar en paralelo
