# LocalDiscover

A Local Tourism & Travel Discovery Platform helping travellers discover and plan visits to lesser-known local destinations in India.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/traveloop run dev` — run the frontend (port 22872)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- Required env: `MONGO_URI` — MongoDB connection string
- Required env: `SESSION_SECRET` — session signing secret
- Optional env: `GOOGLE_MAPS_API_KEY` — browser key for the live map *and* real route times; enable Maps JavaScript API + Routes API (`GET /api/config` serves it; without it the map falls back to a plotted view and routes are straight-line estimates)
- Optional env: `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` — profile avatar uploads

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Wouter routing + TanStack Query + Tailwind + shadcn/ui
- API: Express 5 (artifacts/api-server)
- Auth: Replit Auth (OIDC/PKCE) via `@workspace/replit-auth-web`
- DB: MongoDB (Mongoose)
- Validation: Zod

## Where things live

- `artifacts/traveloop/src/pages/` — React pages for all features
- `artifacts/api-server/src/routes/` — Express route handlers
- `lib/db/src/index.ts` — Mongoose models & database connection
- `artifacts/traveloop/src/data/places.ts` — the 55-destination catalogue every feature reads from
- `artifacts/traveloop/src/data/place-photos.ts` — real Wikimedia Commons photo per place, with attribution

## Features

- Interactive Map Display — Explore destinations visually with pin-based map
- Route & Time Calculator — Plan travel times between destinations
- Live Status Simulator — Weather, safety, crowd, and connectivity info
- Notification Engine — Alerts for weather, safety, events, crowds
- Listing & Registration — Hosts and guides register services
- Offline/Low Bandwidth Mode — Save destinations for offline access
- Rating & Review System — Verified reviews for destinations, hosts, guides
- Location Tagging — Tag and filter destinations by interest type
