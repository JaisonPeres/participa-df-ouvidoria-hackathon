# PWA Frontend

Progressive Web App built with React, Vite, and TypeScript.

## Features

- ⚡️ **Vite** - Lightning fast HMR
- ⚛️ **React 18** - Latest React features
- 📱 **PWA** - Progressive Web App with Service Worker
- 🎨 **Modern UI** - Clean and responsive design
- 📴 **Offline Support** - Works without internet connection
- 🔄 **Auto Updates** - Automatic service worker updates
- 🧪 **Vitest** - Fast unit testing
- 📝 **TypeScript** - Type safety

## Setup

1. Install dependencies from the root:
```bash
pnpm install
```

## Development

```bash
# Start dev server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build

# Preview production build
pnpm preview

# Lint code
pnpm lint
```

## PWA Features

The app includes:
- Service Worker with Workbox
- Offline caching strategy
- API response caching
- Install prompt for mobile devices
- Web App Manifest
- Auto-update notifications

## Build

The production build will generate:
- Optimized static assets
- Service worker (`sw.js`)
- Web app manifest
- PWA icons

Access the app at: http://localhost:3000
