# tasks.md — Slice: Modernizar capa de servicios (lingua-frontend)

**Objetivo del slice:** la capa de servicios/infraestructura está en patrón legacy (BehaviorSubject, `any`, guard de clase) mientras los componentes ya son signal-first. Este slice alinea los cimientos con los componentes. NO añade features.

**Repo:** `lingua-frontend` (separado del backend).

**Regla de ejecución:** una tarea = un prompt a Claude Code = un review del diff = un commit. No encadenar tareas. Si una tarea no queda verde (build + app funcional), PARAR antes de seguir.

---

## T1 — [x] Crear interfaces de dominio en `src/app/models/`

**Por qué primero:** todas las demás tareas las consumen.

**Qué hacer:**
- Crear `src/app/models/` con las interfaces que hoy son `any`.
- Inferir los campos del código existente (`AuthService`, `ApiService`) y del schema de Prisma del backend si está accesible. Si algún campo no es deducible con certeza, marcarlo con un comentario `// TODO: confirmar` en vez de inventarlo.
- Interfaces mínimas esperadas: `User`, `AuthResponse` (`{ accessToken: string; user: User }`), `Vocabulary`, `Progress`, `Stats`.
- Un fichero por modelo (`user.model.ts`, etc.) o un `index.ts` que reexporte. A criterio de consistencia con lo que ya exista.

**Criterio de aceptación:**
- Los ficheros existen y exportan las interfaces.
- `npm run build` verde (las interfaces aún no se usan en ningún sitio, así que no debe romper nada).

---

## T2 — [x] Tipar y modernizar `AuthService` (BehaviorSubject → signal)

**Depende de:** T1.

**Qué hacer:**
- Sustituir `currentUserSubject: BehaviorSubject<any>` y `currentUser$` por un signal privado `_currentUser = signal<User | null>(...)` con su `asReadonly()` público.
- `isLoggedIn` pasa a `computed(() => this._currentUser() !== null)`.
- `getCurrentUser()` deja de devolver `.value`; los consumidores leerán el signal (se ajustan en T6).
- Tipar todas las firmas con los models de T1: `login`/`register` devuelven `Observable<AuthResponse>`, sin `any`.
- Migrar `constructor(private http: HttpClient)` a `private http = inject(HttpClient)`.
- Mantener la persistencia en localStorage tal cual (no es objeto de este slice).

**Criterio de aceptación:**
- Cero `any` en el fichero.
- `npm run build` verde.
- Login y register siguen funcionando en runtime (probar a mano).

---

## T3 — [x] Migrar `AuthGuard` a `CanActivateFn`

**Depende de:** T2 (delega en `AuthService`).

**Qué hacer:**
- Reescribir `shared/guards/auth.guard.ts` de clase `implements CanActivate` a función `CanActivateFn`.
- Que delegue en `AuthService.isLoggedIn()` en vez de leer `localStorage` directamente.
- Actualizar `app.routes.ts`: `canActivate: [AuthGuard]` → `canActivate: [authGuard]` (referencia a la función).

**Criterio de aceptación:**
- El guard es funcional, sin acceso directo a localStorage.
- Navegar a `/dashboard` sin sesión redirige a `/login`; con sesión entra. Probar ambos.
- `npm run build` verde.

---

## T4 — Tipar `ApiService` y eliminar endpoints de auth duplicados

**Depende de:** T1.

**Qué hacer:**
- Tipar todos los métodos con los models de T1 (`Observable<Vocabulary[]>`, `Observable<Stats>`, etc.). Cero `any`.
- Eliminar los métodos `login()` y `register()` de `ApiService` (duplican `AuthService` y no se usan).
- `inject(HttpClient)` en vez de constructor.
- `URLSearchParams` → `HttpParams` de Angular (consistencia con el stack; opcional si añade riesgo, marcar como sub-tarea si se prefiere).

**Criterio de aceptación:**
- Cero `any` en el fichero.
- No quedan `login`/`register` en `ApiService`.
- Dashboard y lista de vocabulario siguen cargando datos. Probar a mano.
- `npm run build` verde.

---

## T5 — [x] Borrar interceptor huérfano

**Independiente** (puede ir en cualquier momento).

**Qué hacer:**
- Borrar `src/app/shared/http.interceptor.ts`.
- Verificado previamente: la clase `HttpAuthInterceptor` solo aparece en su propia definición, nadie la importa. El interceptor activo es el funcional de `main.ts`.

**Criterio de aceptación:**
- El fichero ya no existe.
- `npm run build` verde y la app sigue añadiendo el Bearer token (interceptor de `main.ts` intacto). Probar una request autenticada.

---

## T6 — Ajustar componentes que consumían el BehaviorSubject

**Depende de:** T2.

**Qué hacer:**
- Localizar componentes que llamaban `authService.getCurrentUser()` o se suscribían a `currentUser$` (sospechoso principal: `HomeComponent`).
- Adaptarlos a leer el signal `currentUser()` de forma reactiva.
- Verificar que no quedan suscripciones manuales colgando.

**Criterio de aceptación:**
- Ningún componente usa `currentUser$` ni `.value`.
- El dashboard pinta nombre/stats correctamente tras login.
- `npm run build` verde.

---

## Cierre del slice

Cuando T1–T6 estén commiteadas y verdes:
- Actualizar `CONSTITUTION.md`: la sección de inconsistencias de frontend queda resuelta; promover las reglas a "aplicadas consistentemente" (signal-first también en servicios, guard funcional, dominio tipado).
- El slice de **backend** (JWT secret hardcodeado, `/users/:id` sin guard, stats duplicadas) es un `tasks.md` aparte en su propio repo.

## Pendientes fuera de este slice (no hacer ahora)
- ESLint 8 → 9 + flat config.
- `supertest` 6 → 7 (si aplica en front).
- Lazy loading de rutas (revisar cuando crezca).
- Decisión sobre stats duplicadas (es backend).
