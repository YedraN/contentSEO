# contentSEO — Documentación para Claude Code

## Proyecto
SaaS B2B para agencias de marketing. Genera artículos SEO optimizados con IA (2.000+ palabras) en múltiples idiomas. Los usuarios pueden descargarse los artículos en .md/.html/.docx o enviarlos directamente a WordPress.

**Stack:** Next.js 14, React 18, TypeScript, Prisma, PostgreSQL, Groq API

**Estado:** MVP con generador, histórico, editor inline, y planes de créditos.

---

## Arquitectura

### Dashboard (`src/app/(dashboard)/`)
- **layout.tsx** — Sidebar con nav activa, auth guard
- **page.tsx** — Stats y resumen (vacío en MVP)
- **generator/page.tsx** — Formulario de generación + preview en vivo
- **history/page.tsx** — Tabla de artículos con búsqueda, paginación, descarga inline
- **settings/page.tsx** — Perfil, preferencias (idioma/tono defaults), seguridad
- **credits/page.tsx** — Planes de créditos con Stripe

### API Routes
- `POST /api/generate/article` — Genera artículos con Groq
- `GET /api/articles/list` — Lista artículos con ?search= ?page= ?limit=
- `GET /api/articles/download/[id]` — Descarga en .md/.html/.docx
- `PATCH /api/articles/[id]` — Actualiza título + contenido
- `GET /api/credits/check` — Devuelve créditos del usuario
- `POST /api/stripe/checkout` — Session para planes

### Componentes
- **GeneratorForm.tsx** — Formulario interactivo (empresa, keywords, idioma, tono, cantidad)
- **ArticlePreview.tsx** — Mostrador con editor inline y descargas
- **UI/** — Button, Input, Card (reutilizables)

### Librerías
- **lib/auth.ts** — JWT + bcrypt + gestión de créditos
- **lib/claude.ts** — Integración con Groq para generación
- **lib/prompts.ts** — Plantillas de prompts SEO + opciones de idioma/tono
- **lib/exports.ts** — Conversión a .md/.html/.docx

---

## Procedimiento: Plugin WordPress para Publicar Artículos

### Objetivo
Permitir que los usuarios publiquen artículos generados **directamente en su WordPress** con un clic, sin descargar ni copiar-pegar.

### Arquitectura General

#### 1. **Autenticación WordPress**
- El usuario proporciona en **Settings** las credenciales de su WordPress:
  - URL del sitio (ej: `https://misite.com`)
  - Username o email
  - Contraseña o API token (preferible token XML-RPC o REST API)
- Guardamos encriptadas en la tabla `User` (nuevos campos: `wordpressUrl`, `wordpressAuth`)
- En **Settings**, nueva sección "Integración WordPress" para conectar/desconectar

#### 2. **Publicación desde ArticlePreview**
- Botón "Publicar en WordPress" aparece si el usuario tiene credenciales guardadas
- Al hacer clic: abre modal/drawer con opciones:
  - Título del artículo
  - Estado (draft / publicado)
  - Categorías (cargadas del WordPress automáticamente)
  - Etiquetas personalizadas
  - Imagen destacada (opcional: generar o subir)
- Al confirmar: `POST /api/articles/[id]/publish-to-wordpress`

#### 3. **API Backend: POST `/api/articles/[id]/publish-to-wordpress`**

```typescript
// src/app/api/articles/[id]/publish-to-wordpress/route.ts

// 1. Autenticar usuario
// 2. Verificar que tiene credenciales de WordPress guardadas
// 3. Conectar a WordPress REST API (o XML-RPC si es legacy)
// 4. Crear post con:
//    - title (desde article.title)
//    - content (artículo en HTML, limpio)
//    - status (draft | publish)
//    - categories (array IDs)
//    - tags (array)
// 5. Subir featured image si aplica
// 6. Guardar en BD: nuevo campo en Article → wordpressPostId
// 7. Responder con URL del post publicado
```

#### 4. **Tabla de Base de Datos**
Agregar campos a `User`:
```prisma
model User {
  // ... campos existentes ...
  wordpressUrl         String?
  wordpressUsername    String?         // cifrado
  wordpressPassword    String?         // cifrado
  wordpressConnected   Boolean @default(false)
  
  // ... relaciones ...
}
```

Agregar campos a `Article`:
```prisma
model Article {
  // ... campos existentes ...
  wordpressPostId      Int?            // ID del post en WordPress
  wordpressPostUrl     String?         // URL del post publicado
  publishedToWp        Boolean @default(false)
  publishedToWpAt      DateTime?
}
```

#### 5. **Flujo Completo**

**Fase 1: Conexión (Settings)**
```
Usuario → Settings → "Integración WordPress" 
→ Input URL + credenciales 
→ Test connection (GET /wp-json/wp/v2/posts para validar)
→ Si OK: guardar encriptado, mostrar "✓ Conectado"
→ Si error: mostrar error específico (auth, URL inválida, etc)
```

**Fase 2: Publicación (ArticlePreview)**
```
Usuario → ve artículo generado 
→ Si WordPress conectado: muestra botón "Publicar en WordPress"
→ Clic → modal de opciones
→ Rellena: estado, categorías, tags
→ Clic "Publicar"
→ Spinner... 3-5 segundos
→ Success toast con link al post en WordPress
→ ArticlePreview muestra "✓ Publicado en WordPress" con fecha
```

#### 6. **Seguridad**

- **Encriptación de credenciales:** usar `crypto` (Node.js built-in) o librería como `bcryptjs` para encriptar antes de guardar en BD
- **Validación de entrada:** sanitizar title, content, tags
- **Rate limiting:** máx 10 publicaciones/minuto por usuario (evitar spam)
- **CORS:** solo aceptar requests desde el dominio de contentSEO
- **Verificación de ownership:** comprobar que el article pertenece al usuario antes de publicar

#### 7. **Manejo de Errores**

```
Posibles errores:
- "WordPress no está accesible" (timeout/404 en /wp-json)
- "Credenciales inválidas" (401 al intentar auth)
- "Contenido vacío o título faltante" (validación)
- "Límite de publicaciones alcanzado" (rate limit)
- "Error subiendo imagen" (si se intenta featured image)

Cada uno debe devolver toast claro en FE con solución.
```

#### 8. **Opciones Avanzadas (fase 2+)**

- Mapeo automático de categorías contentSEO → categorías WordPress
- Insertar automáticamente nombre de empresa en el post
- Watermark o crédito al pie del artículo
- Scheduling: publicar en fecha/hora específica
- Webhook: WordPress notifica a contentSEO cuando el post es editado

---

## Implementación

### Orden de Desarrollo

1. **Agregar campos a Prisma schema** → migrate
2. **Encripción/decripción de credenciales** → `lib/encryption.ts`
3. **Settings UI** → nueva sección "Integración WordPress" con test connection
4. **API `/api/wordpress/test-connection`** → valida credenciales
5. **API `/api/articles/[id]/publish-to-wordpress`** → lógica principal
6. **Modal de publicación** en ArticlePreview
7. **Tests** e integración end-to-end

### Dependencias
```json
{
  "wordpress-api": "^1.0.0",  // librería para REST API
  "dotenv": "^16.0.0"         // ya está
}
```

---

@AGENTS.md
