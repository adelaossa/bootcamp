# 5 — GitHub: colaboracion

---

## Issues

Los issues son el sistema de tickets de GitHub. Se usan para reportar bugs, proponer features o discutir ideas.

Un buen issue incluye:
- Titulo descriptivo
- Descripcion detallada del problema o feature
- Pasos para reproducir (si es un bug)
- Labels (bug, enhancement, help wanted)

---

## Pull Requests (PR)

Un PR es una solicitud para fusionar los cambios de una rama en otra. Es donde ocurre la **code review**.

Un buen PR incluye:
- Titulo descriptivo
- Descripcion de que cambia y por que
- Screenshots (si hay cambios visuales)
- Referencia al issue que resuelve (`Closes #42`)

---

## Code Review

La code review es cuando otro desarrollador revisa tu codigo antes de que se fusione. No es una evaluacion personal: es una forma de mantener la calidad del codigo, compartir conocimiento y detectar bugs temprano.

**Al revisar codigo preguntate:**
- ?El codigo es claro y facil de entender?
- ?Hay bugs o casos borde que no se esten manejando?
- ?Sigue las convenciones del proyecto?
- ?Hay tests para el nuevo codigo?
- ?Hay codigo duplicado que se podria refactorizar?

**Al recibir feedback:**
- No te lo tomes personal
- Pregunta si algo no te queda claro
- Los comentarios se marcan como resueltos cuando los atiendes

---

## Flujo completo GitHub

1. Crear un issue describiendo la tarea
2. Crear una rama desde `main`: `git switch -c feature/lo-que-sea`
3. Hacer commits pequenos y frecuentes
4. Subir la rama: `git push -u origin feature/lo-que-sea`
5. Abrir Pull Request en GitHub
6. Solicitar code review a un companero
7. Atender comentarios, hacer cambios, pushear de nuevo
8. Cuando este aprobado, mergear a `main`
9. Eliminar la rama
