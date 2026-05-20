# Deployment Guide: contentSEO en Vercel

## Pre-requisitos

- Repositorio en GitHub
- Cuenta de Vercel conectada a GitHub
- Supabase project (para la base de datos)
- Stripe account (para subscripciones)
- Groq API key (para generación de contenido)

---

## 1. Configurar Base de Datos en Supabase (CRÍTICO)

### 1.1 Obtener la URL del Pooler

1. Ir a Supabase Dashboard > tu project > Settings > Database > Connection Pooling
2. Copiar la **Transaction pooler URL** (puerto 6543)
3. Cambiar `[YOUR_PASSWORD]` con tu contraseña de Supabase
4. **Esta será tu `DATABASE_URL` en Vercel**

Ejemplo:
```
postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:6543/postgres
```

### 1.2 Obtener la URL Directa (opcional, para migrations)

1. En Settings > Database > Connection string, copiar la URL del **direct connection** (puerto 5432)
2. **Esta será tu `DIRECT_URL` en Vercel**

Ejemplo:
```
postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

---

## 2. Configurar Stripe

### 2.1 Crear los Productos y Precios

1. Ir a Stripe Dashboard > Products
2. **Crear 3 productos:**
   - **Starter:** $49/mes, 20 artículos
   - **Pro:** $149/mes, 80 artículos
   - **Agency:** $399/mes, 250 artículos

3. **Para cada producto, crear un "Price":**
   - Tipo: **Recurring** (Monthly)
   - Billing period: **Monthly**
   - Copiar el **Price ID** (empieza con `price_`)

### 2.2 Configurar el Webhook

1. Ir a Stripe Dashboard > Webhooks
2. Crear un nuevo webhook:
   - URL: `https://tu-dominio.vercel.app/api/stripe/webhook`
   - Eventos: Seleccionar los siguientes:
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
3. Copiar el **Webhook Secret** (empieza con `whsec_`)

### 2.3 Obtener las API Keys

1. Ir a Stripe Dashboard > API keys
2. Copiar:
   - **Secret Key** (empieza con `sk_live_` o `sk_test_`)
   - **Webhook Secret** (del paso anterior)

---

## 3. Añadir Variables de Entorno en Vercel

1. Ir a Vercel > tu proyecto > Settings > Environment Variables
2. Añadir las siguientes variables:

| Variable | Valor | Ejemplo |
|---|---|---|
| `DATABASE_URL` | Supabase pooler URL | `postgresql://...@db.xxxxx.supabase.co:6543/...` |
| `DIRECT_URL` | Supabase direct URL | `postgresql://...@db.xxxxx.supabase.co:5432/...` |
| `JWT_SECRET` | String random ≥32 chars | `your_long_random_secret_min_32_characters` |
| `NEXT_PUBLIC_APP_URL` | Tu dominio de Vercel | `https://contentseo.vercel.app` |
| `GROQ_API_KEY` | Tu API key de Groq | `gsk_xxxxx` |
| `STRIPE_SECRET_KEY` | Tu secret key de Stripe | `sk_live_xxxxx` |
| `STRIPE_WEBHOOK_SECRET` | Tu webhook secret | `whsec_xxxxx` |
| `STRIPE_PRICE_STARTER_ID` | Price ID del plan Starter | `price_1xxxxx` |
| `STRIPE_PRICE_PRO_ID` | Price ID del plan Pro | `price_1xxxxx` |
| `STRIPE_PRICE_AGENCY_ID` | Price ID del plan Agency | `price_1xxxxx` |

---

## 4. Desplegar

1. En Vercel, el deploy es automático cuando haces push a GitHub
2. **Verificar que el build éxito:**
   - Vercel > Deployments > última deploy > Logs
   - Debe compilar sin errores

3. **Probar en la rama de preview:**
   - Hacer un pequeño cambio, hacer push a una rama de feature
   - Vercel crea una preview URL automáticamente
   - Probar login, registro, checkout en la preview antes de mergear a main

---

## 5. Verificación Post-Deploy

### 5.1 Verificar que el Login Funciona

1. Ir a `https://tu-dominio.vercel.app/register`
2. Crear una cuenta de prueba
3. Verificar que la cookie `token` se setea (DevTools > Application > Cookies)
4. Verificar que el redirect a `/dashboard` funciona

### 5.2 Verificar que Stripe Funciona

1. Ir a `https://tu-dominio.vercel.app/dashboard` (loguéate primero)
2. Click en "Cambiar a este plan" en cualquier plan
3. Debería redirigir a checkout de Stripe
4. **En test mode:** usar tarjeta `4242 4242 4242 4242` con fecha futura y CVC cualquiera

### 5.3 Verificar que el SEO Funciona

1. Usar `curl -A Googlebot https://tu-dominio.vercel.app` para simular un crawler
2. Verificar que devuelve HTML renderizado (no solo scripts)
3. Usar [https://validator.schema.org](https://validator.schema.org) para validar JSON-LD
4. Enviar el sitemap a Google Search Console

---

## 6. FAQ de Deployment

### ¿Por qué uso una pooling URL en Vercel?

Vercel ejecuta cada request en una instancia "serverless" aislada. Sin pooling, se agotan rápidamente las conexiones a Postgres. El pooler (Supabase Transaction Pooler) reutiliza conexiones para ti.

### ¿Qué es `DIRECT_URL`?

`DIRECT_URL` es una conexión directa a Postgres (sin pooling) que Prisma usa para migrations. Las migrations necesitan transacciones de larga duración que el pooler no soporta.

### ¿Cómo resetear la base de datos en Vercel?

No hay forma segura de hacer "migrations en vivo" sin downtime. Mejor práctica:
1. Crear un branch de feature con el cambio de schema
2. Hacer deploy en preview (con su propia DB)
3. Probar en preview
4. Mergear a main cuando esté listo

### ¿Cómo debuggear errores de Stripe?

1. Ir a Stripe Dashboard > Logs
2. Ver qué eventos llegaron y qué errores hubo
3. En Vercel > Deployments > Logs, buscar "stripe" para ver logs de backend

### Tengo "too many connections"

Significa que tu `DATABASE_URL` no es un pooler URL, sino una conexión directa. Ir a Supabase > Settings > Database > Connection Pooling y copiar la **pooler URL** (puerto 6543).

---

## 7. Monitoreo en Producción

- **Uptime:** usa Pingdom o Uptime Robot
- **Errores:** configura Sentry o similar en Vercel
- **Logs:** Vercel > Analytics > Logs
- **Stripe events:** Stripe Dashboard > Webhooks > Event Logs

---

## 8. Checklist Pre-Launch

- [ ] Login y registro funcionan en Vercel
- [ ] Stripe checkout funciona con tarjeta de prueba
- [ ] Database pooling está configurado
- [ ] JWT_SECRET es un string random seguro
- [ ] SEO: schema.org valida el JSON-LD
- [ ] Favicon y og-image están en `/public`
- [ ] sitemap.xml se genera (https://tu-dominio.vercel.app/sitemap.xml)
- [ ] robots.txt se sirve (https://tu-dominio.vercel.app/robots.txt)
- [ ] Todas las env vars están en Vercel (no en `.env`)
