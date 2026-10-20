# 🎵 Floppy

Reproductor de música web construido con **React 19 + TypeScript + Vite**. Permite buscar canciones, explorar los álbumes más populares, ver el detalle de cada álbum y la ficha de cada artista, y escuchar las previsualizaciones de las pistas con un reproductor persistente (escritorio y móvil).

Los datos se obtienen de APIs públicas:

| Fuente | Uso |
| --- | --- |
| [iTunes Search API](https://performance-partners.apple.com/search-api) | Búsqueda de canciones, top álbumes (RSS), pistas de un álbum, álbumes por artista y previews de audio |
| [TheAudioDB](https://www.theaudiodb.com/) | Biografía e imágenes del artista |
| [Deezer API](https://developers.deezer.com/api) (JSONP) | Imagen y posición del artista en tendencias |

---

## ✨ Funcionalidades

- 🔍 Búsqueda de canciones en tiempo real.
- 💿 Feed de top álbumes y vista de detalle de álbum con su lista de pistas.
- 🎤 Página de artista con biografía, imagen y discografía.
- ▶️ Reproductor con play/pausa, siguiente/anterior, barra de progreso, volumen, mute y modo aleatorio (shuffle).
- 📱 Layouts adaptados a escritorio (sidebar) y móvil (bottom nav + player bar).
- 🐳 Entornos de desarrollo y producción con Docker + Nginx (proxy a iTunes y cabeceras de seguridad/CSP).

## 🧱 Stack

- **UI:** React 19, React Router 7, Tailwind CSS 4, lucide-react
- **Estado:** Redux Toolkit + React Redux
- **Tooling:** Vite 8, TypeScript 6, Oxlint
- **Infra:** Docker, Nginx

## 📁 Estructura

```
src/
├── components/
│   ├── layout/        # Layouts (Main, Dashboard, SideNav, BottomNav…)
│   └── ui/            # Componentes de UI (PlayerBar, SearchBar, AlbumCard…)
├── hooks/             # Hooks tipados de Redux, useFetch, useAudioSync, useArtistBio
├── modules/           # Módulos por dominio
│   ├── player/        # Home, slice del reproductor y servicio de iTunes
│   ├── album/         # Vista de detalle de álbum
│   ├── singer/        # Vista de artista, slice y servicios (TheAudioDB / Deezer)
│   └── library/       # Biblioteca
├── routes/            # Router principal
├── store/             # Configuración del store de Redux
├── types/             # Tipos compartidos (track, album, searchOptions)
└── utils/             # config, logger, cn (clsx + tailwind-merge)
```

### Rutas

| Ruta | Vista |
| --- | --- |
| `/` | Home (búsqueda y top álbumes) |
| `/library` | Biblioteca |
| `/album/:collectionId` | Detalle de álbum |
| `/singer/:singerName` | Ficha de artista |

### Alias de importación

Configurados en `vite.config.ts`: `@`, `@components`, `@modules`, `@hooks`, `@store`, `@types`, `@utils`, `@services`, `@assets`.

## 🚀 Puesta en marcha

### Requisitos

- Node.js 20+
- npm o pnpm
- Docker y Docker Compose (opcional, recomendado)

### Variables de entorno

Crea un archivo `.env` (o `.env.development`) en la raíz:

```env
VITE_API_URL=
VITE_ENABLE_MOCKS=false
```

### Desarrollo con Docker (recomendado)

Las peticiones a iTunes pasan por el proxy de Nginx en `/api-itunes/`, por lo que en desarrollo se recomienda levantar el entorno con Docker:

```bash
docker compose -f docker-compose.dev.yml up
```

La app queda disponible en **http://localhost** (Nginx en el puerto 80 hace de proxy al servidor de Vite con HMR).

### Desarrollo local sin Docker

```bash
npm install
npm run dev
```

> ⚠️ Sin Nginx, las llamadas a `/api-itunes/*` no se resolverán; necesitarás configurar un proxy equivalente.

### Producción

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Construye la app y la sirve con Nginx en **http://localhost:3012**, incluyendo el proxy a iTunes y cabeceras de seguridad (HSTS, CSP, X-Frame-Options, etc.).

## 📜 Scripts

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo de Vite |
| `npm run build` | Type-check (`tsc -b`) y build de producción en `dist/` |
| `npm run preview` | Previsualiza el build de producción |
| `npm run lint` | Linter con Oxlint |

## 👤 Autor

**Yandry Villagomez** — [@RafaelVillagomezDev](https://github.com/RafaelVillagomezDev)
