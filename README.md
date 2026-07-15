<div align="center">

# Krausen — Frontend

**Plataforma web de recetas de cerveza artesanal**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Recharts](https://img.shields.io/badge/Recharts-latest-orange)](https://recharts.org)

</div>

---

## ¿Qué es Krausen?

Krausen es el frontend de una plataforma comunitaria para compartir, descubrir y versionar recetas de cerveza artesanal. Diseñado con una paleta cálida inspirada en los tonos de la cerveza — ámbar, tostado, crema y malta.

---

## ✨ Funcionalidades

- 🏠 **Landing page** — presentación con logo y acceso directo a explorar recetas
- 🔐 **Autenticación** — registro, login, logout con JWT persistente
- 🔑 **Gestión de contraseña** — cambio de contraseña, recuperación por email con Resend
- 🍺 **Explorar recetas** — listado con buscador y filtros por estilo, alcohol, IBU, ingrediente y autor. Paginación con ellipsis
- 📄 **Detalle de receta** — ingredientes, pasos, datos técnicos, me gustas, comentarios, autor y fecha
- ✏️ **Crear y editar recetas** — formulario con dropdown de estilos, ingredientes predefinidos, pasos y subida de imagen
- 🔀 **Fork de recetas** — crea tu versión basada en otra receta con referencia al original
- 🌳 **Árbol de versiones** — visualización del árbol de forks generado por CTE recursiva
- ❤️ **Me gusta** — dar y quitar me gusta con contador en tiempo real
- 🏆 **Ranking** — top 10 mensual, anual y global con selector de período
- 💬 **Comentarios** — comentarios por receta con avatares Dicebear generados por username
- 🔔 **Notificaciones** — dropdown en navbar con badge de no leídas, me gustas y forks
- 🌡️ **Fermentación** — registro de temperaturas por slots con gráfica de líneas (Recharts)
- 👤 **Perfil público** — página de usuario con sus recetas y me gustas
- 📋 **Mis recetas** — tus recetas publicadas y las que te gustan en un solo sitio
- 🌍 **Multiidioma** — Español, English y Deutsch con selector en navbar y cookie persistente
- 🔒 **Protección de rutas** — las páginas privadas redirigen al login
- 💀 **Skeleton loading** — skeletons animados mientras cargan los datos
- 🔴 **Toasts de error** — notificaciones visuales cuando falla una petición

---

## 🛠️ Stack tecnológico

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

## 🎨 Sistema de diseño

Paleta inspirada en los tonos de la cerveza artesanal:

| Token | Color | Uso |
|-------|-------|-----|
| `crema` | #F7F0E4 | Fondos claros, tarjetas |
| `espuma` | #EDE4D3 | Fondo principal |
| `ambar` | #C8861B | Botones primarios, acentos |
| `ambar-oscuro` | #9A6612 | Texto sobre fondos claros |
| `tostado` | #5C3A21 | Texto secundario |
| `malta` | #33220F | Texto principal, títulos |
| `navbar` | #473221 | Barra de navegación |
| `linea` | #DDD3C2 | Bordes y separadores |

Tipografía: **Lora** (serif) para títulos — evoca etiquetas de cerveza artesanal. **Inter** (sans-serif) para cuerpo.

---

## 📁 Estructura del proyecto

```
app/
├── page.tsx                       # Landing page
├── layout.tsx                     # Layout con AuthProvider, LocaleProvider y Navbar
├── globals.css                    # Paleta de colores y estilos base
├── login/page.tsx
├── registro/page.tsx
├── recuperar-password/page.tsx
├── reset-password/page.tsx
├── perfil/page.tsx                # Perfil privado y cambio de contraseña
├── perfil/[username]/page.tsx     # Perfil público de usuario
├── recetas/page.tsx               # Explorar recetas con filtros
├── ranking/page.tsx               # Ranking mensual, anual y global
├── mis-recetas/page.tsx           # Mis recetas y favoritas
├── notificaciones/page.tsx        # Notificaciones
├── faq/page.tsx
├── aviso-legal/page.tsx
└── cervezas/
    ├── nueva/page.tsx
    └── [id]/
        ├── page.tsx               # Detalle de receta
        ├── editar/page.tsx
        └── arbol/page.tsx         # Árbol de versiones

components/
├── Navbar.tsx                     # Barra de navegación con selector de idioma
├── Footer.tsx
├── AppShell.tsx                   # Wrapper anti-flash de auth
├── Skeleton.tsx                   # Skeletons reutilizables (Grid, Detalle, Ranking)
├── Toast.tsx                      # Toast de errores con hook useToast
├── PasswordInput.tsx              # Input con ojito
├── Temperaturas.tsx               # Registro y gráfica de fermentación
├── ArbolForks.tsx                 # Árbol visual de versiones
└── Comentarios.tsx

context/
├── AuthContext.tsx                # Contexto global de autenticación
└── LocaleContext.tsx              # Contexto global de idioma

messages/
├── es.json
├── en.json
└── de.json

lib/
└── api.ts                         # Cliente Axios con JWT
```

---

## 📱 Páginas

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
| `/cervezas/{id}/arbol` | Árbol de versiones | Público |
| `/perfil/{username}` | Perfil público | Público |
| `/faq` | Preguntas frecuentes | Público |
| `/aviso-legal` | Aviso legal | Público |
| `/cervezas/nueva` | Crear receta | Autenticado |
| `/cervezas/{id}/editar` | Editar receta | Autor (sin forks) |
| `/mis-recetas` | Mis recetas y favoritas | Autenticado |
| `/perfil` | Perfil y cambio de contraseña | Autenticado |
| `/notificaciones` | Notificaciones | Autenticado |

---

## 🚀 Instalación y arranque

```bash
git clone https://github.com/ArocaDev/krausen-frontend
cd krausen-frontend
npm install
npm run dev
```

Disponible en `http://localhost:3000`

> Requiere el backend arrancado en `http://127.0.0.1:8000`

---

## 🔗 Repositorios del proyecto

| Componente | Repositorio |
|---|---|
| Backend | [krausen-backend](https://github.com/ArocaDev/krausen-backend) |
| Frontend (este repo) | [krausen-frontend](https://github.com/ArocaDev/krausen-frontend) |

---

## 👤 Autor

**Alejandro Rodríguez Calabuig**
[github.com/ArocaDev](https://github.com/ArocaDev) · [LinkedIn](https://www.linkedin.com/in/alejandro-rodriguez-calabuig-a871a1230)

---

## 📄 Licencia

Proyecto personal — no licenciado para uso comercial.
