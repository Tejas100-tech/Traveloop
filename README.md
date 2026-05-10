# 🌍 Traveloop — India Travel Planning Platform

Traveloop is a full-stack travel planning platform focused on India. It helps users discover Indian cities, plan detailed trip itineraries, manage budgets, create packing lists, and interact with an AI-powered voice travel assistant — all in one beautiful, modern interface.

---

## ✨ Features

### 🗺️ City Explorer
- Browse **18+ famous Indian cities** with rich descriptions, photos, and popularity ratings
- View detailed **activity templates** for each city with real-time ₹ INR pricing
- Filter cities by region, budget, and popularity
- Add cities directly to your trip plans

### 📋 Trip Planner
- Create and manage multiple trips with start/end dates
- Add city stops to your itinerary with customizable activities
- Track trip budgets in Indian Rupees (₹)
- Share trips publicly via unique shareable links

### 🤖 AI Voice Travel Assistant
- **Voice input** — speak your travel questions using the built-in microphone
- **Text input** — type queries in the chat interface
- **Smart responses** — powered by OpenAI GPT-4o-mini with automatic local knowledge base fallback
- **UI navigation** — say "Show me Goa" and the assistant automatically opens the City Explorer
- **Trip planning** — say "Add Jaipur to my trip" and the assistant opens the Add to Trip dialog
- Covers budgets, best time to visit, transport, food, visas, safety, and more

### 🎒 Packing Lists
- Auto-generated packing suggestions based on your destinations
- Check off items as you pack

### 💰 Budget Tracker
- Per-trip budget overview with activity cost breakdowns
- All prices in Indian Rupees (₹)

### 🌐 Community & Reviews
- Share travel experiences and reviews
- Rate trips and destinations

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite, TailwindCSS, Wouter (routing), TanStack Query |
| **Backend** | Express 5, Node.js, TypeScript, esbuild |
| **Database** | MongoDB Atlas (via Mongoose) |
| **AI** | OpenAI GPT-4o-mini (with local fallback KB) |
| **Auth** | Custom email/password with scrypt hashing + cookie sessions |
| **Package Manager** | pnpm (workspace monorepo) |

---

## 📁 Project Structure

```
T/
├── artifacts/
│   ├── api-server/          # Express backend API
│   │   ├── src/
│   │   │   ├── routes/      # API route handlers
│   │   │   │   ├── auth.ts        # Registration, login, logout
│   │   │   │   ├── assistant.ts   # AI voice assistant endpoint
│   │   │   │   ├── cities.ts      # City explorer endpoints
│   │   │   │   ├── trips.ts       # Trip management
│   │   │   │   ├── stops.ts       # Trip stops/itinerary
│   │   │   │   ├── dashboard.ts   # Dashboard data
│   │   │   │   └── reviews.ts     # Community reviews
│   │   │   ├── middlewares/       # Auth middleware
│   │   │   └── lib/               # Auth helpers, logger
│   │   └── .env                   # Environment variables
│   │
│   └── traveloop/           # React frontend
│       ├── src/
│       │   ├── components/  # Reusable UI components
│       │   │   └── voice-assistant.tsx  # AI chatbot widget
│       │   ├── pages/       # Page components
│       │   │   ├── cities.tsx       # City Explorer
│       │   │   ├── login.tsx        # Login page
│       │   │   ├── register.tsx     # Registration page
│       │   │   ├── trip-detail.tsx   # Trip details
│       │   │   ├── trip-budget.tsx   # Budget tracker
│       │   │   └── trip-packing.tsx  # Packing lists
│       │   └── hooks/       # Custom React hooks
│       └── vite.config.ts   # Vite dev server config
│
├── lib/
│   └── db/src/index.ts      # Mongoose models & database connection
│
├── scripts/
│   └── src/
│       ├── seed-india.ts    # Seed 18 Indian cities + activities
│       └── fix-sessions.ts  # Fix MongoDB session indexes
│
└── package.json             # Root workspace config
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v20 or higher
- **pnpm** v10+ (`npm install -g pnpm`)
- **MongoDB Atlas** account (or local MongoDB)
- **OpenAI API Key** (optional — falls back to local knowledge base)

### 1. Install Dependencies

```bash
cd T
pnpm install
```

### 2. Configure Environment Variables

Edit the file `artifacts/api-server/.env`:

```env
NODE_ENV=development
PORT=8080
MONGO_URI="your_mongodb_connection_string"
SESSION_SECRET=your_session_secret
OPENAI_API_KEY="your_openai_api_key"    # Optional
CLOUDINARY_CLOUD_NAME="your_cloud_name"  # For image uploads
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

### 3. Seed the Database

Populate the database with 18 famous Indian cities and 150+ activities:

```bash
npx cross-env MONGO_URI="your_mongo_uri" pnpm --filter "@workspace/scripts" run seed-india
```

### 4. Build the Backend

```bash
pnpm --filter "@workspace/api-server" run build
```

### 5. Start the Backend Server

```bash
npx cross-env PORT=8080 pnpm --filter "@workspace/api-server" run start
```

The API server will start on `http://localhost:8080`.

### 6. Start the Frontend Dev Server

Open a **new terminal** and run:

```bash
pnpm --filter "@workspace/traveloop" run dev
```

The frontend will start on `http://localhost:22872` (or `http://localhost:5173`).

### 7. Open the App

Navigate to `http://localhost:22872` in your browser. Register a new account and start planning!

---

## 🔧 Common Commands

| Command | Description |
|---------|-------------|
| `pnpm install` | Install all dependencies |
| `pnpm --filter "@workspace/api-server" run build` | Build the backend |
| `npx cross-env PORT=8080 pnpm --filter "@workspace/api-server" run start` | Start backend |
| `pnpm --filter "@workspace/traveloop" run dev` | Start frontend dev server |
| `pnpm --filter "@workspace/scripts" run seed-india` | Seed cities & activities |

### Troubleshooting

**Port 8080 already in use:**
```powershell
# PowerShell — kill the process using port 8080
Stop-Process -Id (Get-NetTCPConnection -LocalPort 8080 -State Listen | Select-Object -ExpandProperty OwningProcess) -Force
```

**Session/Registration errors (MongoDB index issues):**
```bash
npx cross-env MONGO_URI="your_mongo_uri" pnpm --filter "@workspace/scripts" exec tsx ./src/fix-sessions.ts
```

---

## 🤖 AI Voice Assistant

The voice assistant is accessible via the floating orange bot icon (bottom-right corner). It supports:

- **Voice**: Click the 🎤 mic button and speak in English
- **Text**: Type in the input box and press Enter

### Example Commands

| What you say | What happens |
|-------------|-------------|
| "Tell me about Goa" | Returns Goa travel info with budget |
| "Show me Jaipur" | Navigates to City Explorer → Jaipur |
| "Add Delhi to my trip" | Opens the Add to Trip dialog for Delhi |
| "What's the best time to visit India?" | Returns seasonal travel advice |
| "How much does India cost?" | Returns daily budget estimates in ₹ |
| "Plan my trip" | Suggests popular routes and circuits |

> **Note:** The assistant tries OpenAI first. If the API key is missing or quota is exceeded, it automatically falls back to a built-in India travel knowledge base covering all 18 cities.

---

## 🏙️ Supported Cities

| City | Region | Highlights |
|------|--------|-----------|
| Delhi | Delhi | Red Fort, Qutub Minar, Chandni Chowk |
| Mumbai | Maharashtra | Gateway of India, Marine Drive, Bollywood |
| Agra | Uttar Pradesh | Taj Mahal, Agra Fort, Fatehpur Sikri |
| Jaipur | Rajasthan | Amber Fort, Hawa Mahal, City Palace |
| Goa | Goa | Beaches, Water Sports, Portuguese Churches |
| Kerala | Kerala | Backwaters, Tea Plantations, Ayurveda |
| Varanasi | Uttar Pradesh | Ganga Aarti, Ghats, Silk Weaving |
| Udaipur | Rajasthan | Lake Pichola, City Palace, Monsoon Palace |
| Amritsar | Punjab | Golden Temple, Wagah Border, Kulcha |
| Rishikesh | Uttarakhand | Rafting, Yoga, Bungee Jumping |
| Darjeeling | West Bengal | Tea Gardens, Toy Train, Kanchenjunga |
| Jaisalmer | Rajasthan | Desert Safari, Golden Fort, Sand Dunes |
| Jodhpur | Rajasthan | Mehrangarh Fort, Blue City, Bishnoi Village |
| Hyderabad | Telangana | Charminar, Biryani, Golconda Fort |
| Kolkata | West Bengal | Victoria Memorial, Howrah Bridge, Durga Puja |
| Mysuru | Karnataka | Mysore Palace, Sandalwood, Dasara Festival |
| Hampi | Karnataka | Vijayanagara Ruins, Stone Chariot, Boulder Hopping |
| Leh-Ladakh | Ladakh | Pangong Lake, Monasteries, Khardung La Pass |

---

## 📄 License

MIT

---

## 👨‍💻 Authors

Built with ❤️ for India travel enthusiasts.
