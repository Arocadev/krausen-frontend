# Krausen — Frontend

> Plataforma web de recetas de cerveza artesanal | Craft beer recipe web platform

---

## 🇪🇸 Español

**Krausen** es el frontend de una plataforma comunitaria para compartir, descubrir y versionar recetas de cerveza artesanal. Diseñado con una paleta cálida inspirada en los tonos de la cerveza — ámbar, tostado, crema y malta.

---

### ✨ Funcionalidades

- 🏠 **Landing page** — presentación limpia con acceso directo a registro o explorar recetas
- 🔐 **Autenticación** — registro, login, cierre de sesión con JWT persistente
- 🔑 **Gestión de contraseña** — cambio de contraseña con validación y ojito para ver/ocultar
- 🍺 **Explorar recetas** — listado con buscador por nombre y filtros por estilo, alcohol e IBU
- 📄 **Detalle de receta** — ingredientes, pasos de elaboración, me gustas, autor y fecha
- ✏️ **Crear y editar recetas** — formulario con dropdown de estilos, ingredientes predefinidos y pasos
- 🔀 **Fork de recetas** — crea tu versión basada en otra receta, con referencia al original
- 🌳 **Árbol de versiones** — visualización del árbol de forks con la receta original y todas las derivadas
- ❤️ **Me gusta** — dar y quitar me gusta con corazón animado y contador
- 🏆 **Ranking mensual** — top 10 recetas más gustadas del mes con posiciones destacadas
- 🌡️ **Fermentación** — registro de temperaturas por slots configurables con gráfica de líneas (Recharts)
- 👤 **Perfil** — datos del usuario y cambio de contraseña
- 📋 **Mis recetas** — tus recetas publicadas y las que te gustan en un solo sitio
- 🔒 **Protección de rutas** — las páginas que requieren autenticación redirigen al login

---

### 🛠️ Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16 (App Router) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS 4 |
| HTTP | Axios |
| Gráficas | Recharts |
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
├── page.tsx                  # Landing page
├── layout.tsx                # Layout con AuthProvider y Navbar
├── globals.css               # Paleta de colores y estilos base
├── login/page.tsx            # Página de login
├── registro/page.tsx         # Página de registro
├── perfil/page.tsx           # Perfil y cambio de contraseña
├── recetas/page.tsx          # Explorar recetas con filtros
├── ranking/page.tsx          # Ranking mensual
├── mis-recetas/page.tsx      # Mis recetas y favoritas
└── cervezas/
    ├── nueva/page.tsx        # Crear receta
    └── [id]/
        ├── page.tsx          # Detalle de receta
        └── editar/page.tsx   # Editar receta

components/
├── Navbar.tsx                # Barra de navegación
├── PasswordInput.tsx         # Input de contraseña con ojito
├── Temperaturas.tsx          # Registro y gráfica de fermentación
└── ArbolForks.tsx            # Árbol visual de versiones

context/
└── AuthContext.tsx            # Contexto global de autenticación

lib/
└── api.ts                     # Cliente Axios configurado con JWT
```

---

### 📱 Páginas

| Ruta | Descripción | Acceso |
|------|-------------|--------|
| `/` | Landing page | Público |
| `/login` | Iniciar sesión | Público |
| `/registro` | Crear cuenta | Público |
| `/recetas` | Explorar recetas con filtros | Público |
| `/ranking` | Ranking mensual por likes | Público |
| `/cervezas/{id}` | Detalle de receta | Público |
| `/cervezas/nueva` | Crear receta | Autenticado |
| `/cervezas/{id}/editar` | Editar receta | Autor (sin forks) |
| `/mis-recetas` | Mis recetas y favoritas | Autenticado |
| `/perfil` | Perfil y cambio de contraseña | Autenticado |

---

### 🚀 Instalación y arranque

```bash
# Clonar el repositorio
git clone https://github.com/krausen-beer/krausen-frontend
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
| Backend | [krausen-backend](https://github.com/krausen-beer/krausen-backend) |
| Frontend (este repo) | [krausen-frontend](https://github.com/krausen-beer/krausen-frontend) |
| Bot de Telegram | [audio-to-trello-bot](https://github.com/krausen-beer/audio-to-trello-bot) |

---

## 🌐 English

**Krausen** is the frontend for a community platform to share, discover and version craft beer recipes. Designed with a warm colour palette inspired by beer tones — amber, toasted, cream and malt.

---

### ✨ Features

- 🏠 **Landing page** — clean presentation with direct access to registration or recipe browsing
- 🔐 **Authentication** — registration, login, logout with persistent JWT
- 🔑 **Password management** — password change with validation and show/hide toggle
- 🍺 **Explore recipes** — listing with search by name and filters by style, ABV and IBU
- 📄 **Recipe detail** — ingredients, brewing steps, likes, author and date
- ✏️ **Create and edit recipes** — form with style dropdown, predefined ingredients and steps
- 🔀 **Recipe forking** — create your version based on another recipe, with reference to the original
- 🌳 **Version tree** — visual fork tree showing the original recipe and all derived versions
- ❤️ **Likes** — give and remove likes with animated heart and counter
- 🏆 **Monthly ranking** — top 10 most liked recipes with highlighted positions
- 🌡️ **Fermentation** — temperature logging by configurable slots with line chart (Recharts)
- 👤 **Profile** — user data and password change
- 📋 **My recipes** — your published recipes and liked ones in one place
- 🔒 **Route protection** — pages requiring authentication redirect to login

---

### 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| HTTP | Axios |
| Charts | Recharts |
| Typography | Lora (headings) + Inter (body) |
| Deployment | Vercel (pending) |

---

### 🚀 Getting Started

```bash
git clone https://github.com/krausen-beer/krausen-frontend
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
