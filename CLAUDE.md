# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comandos principales

```bash
npm run dev       # Servidor de desarrollo en http://localhost:3000
npm run build     # tsc -b && vite build (genera dist/)
npm run lint      # ESLint sobre todo el proyecto
npm run preview   # Previsualiza la build de producción
```

No hay suite de tests en este proyecto.

## Despliegue

La app se despliega en **Cloudflare Pages** vía Wrangler. El routing SPA está manejado por `wrangler.jsonc` (`not_found_handling: "single-page-application"`), no se usa `_redirects`.

## Arquitectura

R2Drive es una **SPA sin backend** para gestionar archivos en Cloudflare R2 (S3-compatible). Usa el AWS SDK v3 directamente desde el browser para comunicarse con R2.

### Flujo de autenticación y composición

```
App.tsx
 ├── AuthProvider       → Credenciales R2 en memoria (nunca persistidas)
 ├── R2Provider         → Instancia servicios cuando hay credenciales válidas
 └── UIProvider         → Estado de toasts y navegación (currentPath)
       ↓
    AppContent
     ├── CredentialsModal  (sin autenticar)
     └── Header + FileBrowser (autenticado)
```

### Capa de servicios (`src/services/`)

| Archivo | Clase / Export | Responsabilidad |
|---------|---------------|-----------------|
| `r2Client.ts` | `createR2Client`, `testConnection` | Crea S3Client apuntando a R2, valida credenciales |
| `fileOperations.ts` | `R2FileOperations` | CRUD de archivos y carpetas (list, upload, delete, move, copy) |
| `multipartUpload.ts` | `MultipartUploader` | Uploads con progreso; usa multipart para archivos > 5MB |
| `urlGenerator.ts` | `URLGenerator` | URLs presignadas de descarga (TTL: 1 hora) |

### Hooks (`src/hooks/`)

- **`useFileOperations`** — wrapper con estado sobre `R2FileOperations`
- **`useUpload`** — gestiona `Map<id, UploadTask>` con progreso por archivo
- **`useToast`** — crea/descarta notificaciones en `UIContext`

### Path aliases (Vite + TypeScript)

`@` → `src/`, `@components`, `@hooks`, `@services`, `@types`, `@utils`, `@context`, `@styles`

## Convenciones importantes

- **Credenciales solo en memoria**: `AuthContext` guarda `R2Credentials` en estado React. Nunca usar `localStorage`, `sessionStorage` ni cookies para credenciales.
- **Carpetas como blobs vacíos**: Las carpetas en R2 son objetos con key terminada en `/` y cuerpo vacío.
- **Multipart threshold**: `FILE_LIMITS.maxSingleUploadSize = 5MB` en `src/utils/constants.ts`. Archivos mayores usan `@aws-sdk/lib-storage`.
- **Tema oscuro fijo**: Colores definidos en `tailwind.config.js` (background `#0a0a0a`, surface `#151515`, accent `#3b82f6`). No hay modo claro.
- **Componentes CSS base**: `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-danger`, `.input-base`, `.card` definidos en `src/styles/globals.css`. Usarlos en lugar de clases Tailwind ad-hoc.

## CORS

Para que el browser pueda comunicarse con R2 es necesario configurar CORS en el bucket. Ver `cors.json` en la raíz como referencia.
