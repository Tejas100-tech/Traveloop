# 🌍 LocalDiscover India

A **Local Tourism & Travel Discovery Platform** that helps travellers discover and plan visits to lesser-known local destinations. Find hidden gems, compare hosts and guides, book experiences, and access real-time alerts — even offline.

---

## ✨ Core Features

### 🗺️ Interactive Map Display
- Explore destinations visually with a pin-based map interface
- Filter by type: Adventure, Heritage, Nature, Beach, Spiritual, Offbeat, Trekking
- Click pins for quick details and navigation

### 🧭 Route & Time Calculator
- Calculate travel times and costs between destinations
- Compare transport options: car, train, bus, plane
- Popular route suggestions with pre-filled data

### 📊 Live Status Simulator
- Real-time weather conditions at each destination
- Safety scores and advisories
- Crowd level estimates
- Connectivity status for remote areas
- Active alerts for weather, road, and wildlife

### 🔔 Notification Engine
- Weather alerts and safety advisories
- Crowd level updates
- Local event notifications
- Customizable notification preferences

### 🏠 Listing & Registration Module
- Local hosts register homestays
- Local guides register tour services
- Verified badges for trusted providers
- Contact and messaging features

### 📴 Offline / Low Bandwidth Mode
- Save destinations for offline access
- Cached map tiles and destination info
- Storage usage tracking
- Sync when connectivity returns

### ⭐ Rating & Review System
- Verified traveller reviews
- Filter by rating and category (Destination, Homestay, Guide)
- Star ratings and detailed reviews
- Write and manage your own reviews

### 📍 Location Tagging
- Tag destinations by interest: Adventure, Spiritual, Heritage, Nature, Beach, Food, Offbeat, Trekking
- Multi-tag filtering for precise discovery
- Save destinations for future trips

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite, TailwindCSS, Wouter (routing), TanStack Query |
| **Backend** | Express 5, Node.js, TypeScript, esbuild |
| **Database** | MongoDB Atlas (via Mongoose) |
| **AI** | OpenAI GPT-4o-mini (optional, with local fallback KB) |
| **Auth** | Custom email/password with scrypt hashing + cookie sessions |
| **Package Manager** | pnpm (workspace monorepo) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v20 or higher
- pnpm v10+
- MongoDB Atlas (or local MongoDB)

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Configure Environment

Add these keys in **Settings → Environment** (or a root `.env`, which the API server
loads automatically):

```env
MONGO_URI="your_mongodb_connection_string"
SESSION_SECRET=your_session_secret

# Optional — enables the live Google Map (Maps JavaScript API).
# Without it the Interactive Map falls back to an accurate plotted view.
GOOGLE_MAPS_API_KEY="your_browser_key"

# Optional — avatar uploads on the profile page.
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

`GOOGLE_MAPS_API_KEY` is a **browser** key: enable *Maps JavaScript API* and
restrict the key to your HTTP referrers. The API server serves it at runtime via
`GET /api/config`, so rotating it needs no frontend rebuild.

### 3. Build & Start
```bash
pnpm run dev            # API (:8080) + frontend (:22872) together
pnpm run typecheck      # full typecheck across all packages
```

---

## 📁 Project Structure

```
├── artifacts/
│   ├── api-server/          # Express backend API
│   │   └── src/routes/      # health, config, auth, reviews, users
│   └── traveloop/           # React frontend
│       └── src/
│           ├── pages/       # All feature pages
│           │   ├── dashboard.tsx         # Main dashboard
│           │   ├── destinations.tsx      # Destination explorer with tagging
│           │   ├── interactive-map.tsx   # Interactive map display
│           │   ├── route-calculator.tsx  # Route & time calculator
│           │   ├── live-status.tsx       # Live status simulator
│           │   ├── listings.tsx          # Host & guide listings
│           │   ├── reviews.tsx           # Rating & review system
│           │   ├── notifications.tsx     # Notification engine
│           │   ├── offline-mode.tsx      # Offline mode management
│           │   └── landing.tsx           # Public landing page
│           ├── data/
│           │   ├── places.ts             # 55 destinations + live-status derivation
│           │   └── place-photos.ts       # Real photo + attribution per place
│           └── components/               # Shared UI components
│               └── place-image.tsx       # Photo with lazy load & stock fallback
├── lib/                     # Shared libraries
└── scripts/                 # Seed & utility scripts
```

---

## 🖼 Destination imagery

Every destination card shows a **real photograph of that place**, not stock
scenery. The catalogue in `src/data/place-photos.ts` maps each `Place.id` to a
Wikimedia Commons file plus its author and licence, and `PlaceImage` requests it
at the width that is actually rendered via Commons' `Special:FilePath` endpoint.

Commons licences (mostly CC BY-SA) require attribution, so the destination
detail view prints the credit line from `photoCredit(id)`. If a photo ever fails
to load, `PlaceImage` silently falls back to the place's generic stock image —
which is what travellers on poor connections will see anyway.

---

## 🔧 Common Commands

| Command | Description |
|---------|-------------|
| `pnpm install` | Install all dependencies |
| `pnpm run typecheck` | Full typecheck |
| `pnpm --filter "@workspace/traveloop" run dev` | Start frontend dev server |
| `pnpm --filter "@workspace/api-server" run build` | Build backend |

---

## 📄 License

MIT
