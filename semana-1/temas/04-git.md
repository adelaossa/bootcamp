# 4 — Git: control de versiones

---

## ?Por que Git?

Imagina que estas escribiendo un trabajo en Word. Terminas con archivos como:

```
Trabajo final.docx
Trabajo final v2.docx
Trabajo final v2 corregido.docx
Trabajo final FINAL.docx
Trabajo final FINAL DE VERDAD.docx
```

Git resuelve esto. Te permite:

- Guardar versiones de tu codigo con mensajes descriptivos
- Volver a cualquier version anterior
- Trabajar en paralelo con otras personas sin pisarse
- Saber quien hizo cada cambio y por que

---

## Conceptos clave

```
Working Directory     Staging Area      Local Repo        Remote Repo
   (tu carpeta)      (git add)          (git commit)     (git push)
                                                         
  archivo.js  --->  archivo.js  --->  archivo.js  ---> GitHub/GitLab
                   (preparado)        (guardado)       (compartido)
```

| Comando | Que hace |
|---|---|
| `git init` | Inicializa un repositorio en la carpeta actual |
| `git clone <url>` | Descarga una copia de un repositorio remoto |
| `git status` | Muestra el estado actual: que cambios hay, que esta staged |
| `git add <archivo>` | Agrega cambios al staging area |
| `git add .` | Agrega todos los cambios de la carpeta actual |
| `git commit -m "mensaje"` | Guarda los cambios en el historial local |
| `git push` | Sube los commits locales al repositorio remoto (GitHub) |
| `git pull` | Descarga los cambios del remoto y los fusiona |
| `git log --oneline` | Muestra el historial de commits |
| `git diff` | Muestra exactamente que lineas cambiaron |

---

## Branches (ramas)

Las ramas permiten trabajar en features separadas sin afectar la rama principal.

```
main  ----o----o----o----o----
              \            /
feature-x      o----o----o
```

| Comando | Que hace |
|---|---|
| `git branch` | Lista las ramas locales |
| `git branch <nombre>` | Crea una nueva rama |
| `git switch <nombre>` | Cambia a otra rama |
| `git switch -c <nombre>` | Crea una rama y cambia a ella |
| `git merge <rama>` | Fusiona la rama indicada en la rama actual |
| `git branch -d <rama>` | Elimina una rama |

---

## Flujo de trabajo tipico

```bash
# 1. Actualizar la rama principal
git switch main
git pull

# 2. Crear rama para tu feature
git switch -c feature/agregar-login

# 3. Hacer cambios, committear varias veces
git add .
git commit -m "feat: agregar formulario de login"
git add .
git commit -m "feat: validar campos del login"

# 4. Subir la rama al remoto
git push -u origin feature/agregar-login

# 5. Abrir Pull Request en GitHub y esperar code review
# 6. Despues de aprobado, mergear a main
```

---

## Conflictos de merge

Un conflicto ocurre cuando dos personas modifican la misma linea de un archivo en ramas diferentes.

```javascript
// Conflicto tipico:
<<<<<<< HEAD
const nombre = "Carlos"
=======
const nombre = "Ana"
>>>>>>> feature/otro-cambio
```

**Pasos para resolver:**
1. Decidir cual version mantener (o combinar ambas)
2. Eliminar los marcadores (`<<<<<<<`, `=======`, `>>>>>>>`)
3. `git add` al archivo resuelto
4. `git commit` (sin mensaje, Git ya sugiere uno)

---

## Conventional Commits

```
tipo: descripcion corta en imperativo

[cuerpo opcional con mas detalle]
```

| Prefijo | Cuando usarlo |
|---|---|
| `feat:` | Nueva funcionalidad |
| `fix:` | Correccion de bug |
| `refactor:` | Cambio de codigo sin cambiar comportamiento |
| `docs:` | Cambios en documentacion |
| `style:` | Formato, espacios, punto y coma (no cambios de logica) |
| `test:` | Agregar o modificar tests |
| `chore:` | Tareas de mantenimiento, configuracion |

Ejemplos:
```
feat: agregar endpoint de registro de usuarios
fix: corregir validacion de email vacio
refactor: extraer logica de autenticacion a un servicio
```
