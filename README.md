# Krausen — Frontend

> Plataforma web de recetas de cerveza artesanal | Craft beer recipe web platform

---

## 🇪🇸 Español

**Krausen** es el frontend de una plataforma comunitaria para compartir, descubrir y versionar recetas de cerveza artesanal. Diseñado con una paleta cálida inspirada en los tonos de la cerveza — ámbar, tostado, crema y malta.

---

### ✨ Funcionalidades

- 🏠 **Landing page** — presentación limpia con logo y acceso directo a explorar recetas
- 🔐 **Autenticación** — registro, login, cierre de sesión con JWT persistente
- 🔑 **Gestión de contraseña** — cambio de contraseña, recuperación por email con Resend
- 🍺 **Explorar recetas** — listado con buscador por nombre y filtros por estilo, alcohol, IBU, ingrediente y autor
- 📄 **Detalle de receta** — ingredientes, pasos, datos técnicos con labels, me gustas, comentarios, autor y fecha
- ✏️ **Crear y editar recetas** — formulario con dropdown de estilos, ingredientes predefinidos, pasos y subida de imagen
- 🔀 **Fork de recetas** — crea tu versión basada en otra receta, con referencia al original
- 🌳 **Árbol de versiones** — visualización del árbol de forks con la receta original y todas las derivadas
- ❤️ **Me gusta** — dar y quitar me gusta con contador en tiempo real
- 🏆 **Ranking** — top 10 mensual, anual y global con selector de período
- 💬 **Comentarios** — comentarios por receta con avatares Dicebear generados por username
- 🔔 **Notificaciones** — dropdown en navbar con badge de no leídas, me gustas y forks
- 🌡️ **Fermentación** — registro de temperaturas por slots configurables con gráfica de líneas (Recharts)
- 👤 **Perfil público** — página de usuario con sus recetas y me gustas
- 📋 **Mis recetas** — tus recetas publicadas y las que te gustan en un solo sitio
- 🌍 **Multiidioma** — interfaz disponible en Español, English y Deutsch con selector en navbar
- 🔒 **Protección de rutas** — las páginas que requieren autenticación redirigen al login

---

### 🛠️ Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 15 (App Router) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS 4 |
| HTTP | Axios |
| Gráficas | Recharts |
| i18n | next-intl |
| Tipografía | Lora (títulos) + Inter (cuerpo) |
| Despliegue | Vercel (pendiente) |

---

### 🎨 Sistema de diseño

Paleta inspirada en los tonos de la cerveza artesanal:

| Token | Color | Uso |
|-------|-------|-----|
| `crema` | #F7F0E4 | Fondos claros, tarjetas |
| `espuma` | #EDE4D3 | Fondo principal |
| `ambar` | #C8861B | Botones primarios, acentos |
| `ambar-claro` | #E0A33C | Hover, detalles |
| `ambar-oscuro` | #9A6612 | Texto sobre fondos claros |
| `tostado` | #5C3A21 | Texto secundario |
| `malta` | #33220F | Texto principal, títulos |
| `carbon` | #1F1610 | Hover oscuro |
| `navbar` | #473221 | Barra de navegación |
| `linea` | #DDD3C2 | Bordes y separadores |

Tipografía: **Lora** (serif) para títulos — evoca etiquetas de cerveza artesanal. **Inter** (sans-serif) para cuerpo — limpia y legible.

---

### 📁 Estructura del proyecto

```
app/
├── page.tsx                       # Landing page
├── layout.tsx                     # Layout con AuthProvider, LocaleProvider y Navbar
├── globals.css                    # Paleta de colores y estilos base
├── login/page.tsx                 # Página de login
├── registro/page.tsx              # Página de registro
├── recuperar-password/page.tsx    # Recuperación de contraseña
├── reset-password/page.tsx        # Restablecer contraseña
├── perfil/page.tsx                # Perfil y cambio de contraseña
├── perfil/[username]/page.tsx     # Perfil público de usuario
├── recetas/page.tsx               # Explorar recetas con filtros
├── ranking/page.tsx               # Ranking mensual, anual y global
├── mis-recetas/page.tsx           # Mis recetas y favoritas
├── notificaciones/page.tsx        # Notificaciones (móvil)
├── faq/page.tsx                   # Preguntas frecuentes
├── aviso-legal/page.tsx           # Aviso legal
└── cervezas/
    ├── nueva/page.tsx             # Crear receta
    └── [id]/
        ├── page.tsx               # Detalle de receta
        └── editar/page.tsx        # Editar receta

components/
├── Navbar.tsx                # Barra de navegación con selector de idioma
├── Footer.tsx                # Pie de página
├── PasswordInput.tsx         # Input de contraseña con ojito
├── Temperaturas.tsx          # Registro y gráfica de fermentación
├── ArbolForks.tsx            # Árbol visual de versiones
├── AppShell.tsx              # Wrapper que oculta UI hasta resolver auth
└── Comentarios.tsx           # Sección de comentarios

context/
├── AuthContext.tsx            # Contexto global de autenticación
└── LocaleContext.tsx          # Contexto global de idioma

messages/
├── es.json                   # Traducciones en español
├── en.json                   # Traducciones en inglés
└── de.json                   # Traducciones en alemán

lib/
└── api.ts                    # Cliente Axios configurado con JWT
```

---

### 📱 Páginas

| Ruta | Descripción | Acceso |
|------|-------------|--------|
| `/` | Landing page | Público |
| `/login` | Iniciar sesión | Público |
| `/registro` | Crear cuenta | Público |
| `/recuperar-password` | Recuperar contraseña | Público |
| `/reset-password` | Restablecer contraseña | Público |
| `/recetas` | Explorar recetas con filtros | Público |
| `/ranking` | Ranking mensual, anual y global | Público |
| `/cervezas/{id}` | Detalle de receta | Público |
| `/perfil/{username}` | Perfil público de usuario | Público |
| `/faq` | Preguntas frecuentes | Público |
| `/aviso-legal` | Aviso legal | Público |
| `/cervezas/nueva` | Crear receta | Autenticado |
| `/cervezas/{id}/editar` | Editar receta | Autor (sin forks) |
| `/mis-recetas` | Mis recetas y favoritas | Autenticado |
| `/perfil` | Perfil y cambio de contraseña | Autenticado |
| `/notificaciones` | Notificaciones | Autenticado |

---

### 🚀 Instalación y arranque

```bash
# Clonar el repositorio
git clone https://github.com/ArocaDev/krausen-frontend
cd krausen-frontend

# Instalar dependencias
npm install

# Arrancar en desarrollo
npm run dev
```

Disponible en `http://localhost:3000`

> Requiere el backend arrancado en `http://127.0.0.1:8000`

---

### 🔗 Repositorios del proyecto

| Componente | Repositorio |
|---|---|
| Backend | [krausen-backend](https://github.com/ArocaDev/krausen-backend) |
| Frontend (este repo) | [krausen-frontend](https://github.com/ArocaDev/krausen-frontend) |

---

## 🌐 English

**Krausen** is the frontend for a community platform to share, discover and version craft beer recipes. Designed with a warm colour palette inspired by beer tones — amber, toasted, cream and malt.

---

### ✨ Features

- 🏠 **Landing page** — clean presentation with logo and direct access to explore recipes
- 🔐 **Authentication** — registration, login, logout with persistent JWT
- 🔑 **Password management** — password change, email recovery with Resend
- 🍺 **Explore recipes** — listing with search by name and filters by style, ABV, IBU, ingredient and author
- 📄 **Recipe detail** — ingredients, brewing steps, technical data with labels, likes, comments, author and date
- ✏️ **Create and edit recipes** — form with style dropdown, predefined ingredients, steps and image upload
- 🔀 **Recipe forking** — create your version based on another recipe, with reference to the original
- 🌳 **Version tree** — visual fork tree showing the original recipe and all derived versions
- ❤️ **Likes** — give and remove likes with real-time counter
- 🏆 **Ranking** — top 10 monthly, yearly and all-time with period selector
- 💬 **Comments** — comments per recipe with Dicebear avatars generated by username
- 🔔 **Notifications** — navbar dropdown with unread badge, likes and forks
- 🌡️ **Fermentation** — temperature logging by configurable slots with line chart (Recharts)
- 👤 **Public profile** — user page with their recipes and likes
- 📋 **My recipes** — your published recipes and liked ones in one place
- 🌍 **Multilanguage** — interface available in Spanish, English and German with navbar selector
- 🔒 **Route protection** — pages requiring authentication redirect to login

---

### 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| HTTP | Axios |
| Charts | Recharts |
| i18n | next-intl |
| Typography | Lora (headings) + Inter (body) |
| Deployment | Vercel (pending) |

---

### 🚀 Getting Started

```bash
git clone https://github.com/ArocaDev/krausen-frontend
cd krausen-frontend
npm install
npm run dev
```

Available at `http://localhost:3000`

> Requires backend running at `http://127.0.0.1:8000`

---

## 👤 Autores / Authors

**Alejandro Rodríguez Calabuig** — [github.com/ArocaDev](https://github.com/ArocaDev)

---

## 📄 Licencia / License

Proyecto personal en desarrollo.
Personal project under development.
