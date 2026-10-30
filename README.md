# Eventia · entorno didáctico de auditoría

Frontend Vite + JavaScript y API REST Express. Datos ficticios almacenados en memoria; no hay base de datos. Al reiniciar el servidor, se restauran los datos iniciales.

## Requisitos

Node.js 20 o superior y npm.

## Instalación y arranque

Desde esta carpeta:

```bash
npm install
npm --prefix server install
npm --prefix client install
npm run dev
```

O bien `npm run install:all` y después `npm run dev`.

- Frontend: http://localhost:5173
- API: http://localhost:3000/api

Cuentas: `ana@eventia.local` / `usuario123`; `luis@eventia.local` / `usuario456`; `admin@eventia.local` / `admin123`.

**Aviso:** aplicación intencionadamente vulnerable para prácticas locales autorizadas. No desplegar en Internet ni usar datos reales. Contiene fallos didácticos de autorización, validación, configuración y renderizado. No implementa una base de datos ni SQL real.
