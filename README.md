# Soko Shambani

**A calm command centre for agricultural trade — Somali &amp; Kenyan, farmer-first, await-driven.**

Soko Shambani is a full-stack marketplace that connects farmers and buyers in a shared workspace. Listings, orders, and conversations exist in one place, with every state change recorded, every status visible, and every action adjacent to its context.

> Live: [https://soko-shambani.vercel.app](https://soko-shambani.vercel.app)

---

## What is included

| Feature | Detail |
|---|---|
| Auth | Farmer / buyer role, HMAC-SHA256 JWT, 7-day token, bcrypt password hashing |
| Market board | Public searchable catalogue: text search, category, location, sort by price / stock |
| Order workflow | `pending → confirmed → completed / cancelled` with idempotent status patch |
| Messaging | Threaded conversations: message list + reply body, real-time send |
| Dashboard | Role-aware workspace: mine stats, order ledger, conversation pane, listing management |
| Data | Local deterministic JSON store, queue-serialised writes |
| Tests | 4 Node.js integration tests (all passing) |
| Deployment | Vercel — static frontend + serverless API at `/api` |

---

## Project structure

```text
New folder/
├── backend/
│   ├── config/
│   │   ├── store.js        // JSON file store + mutation queue
│   │   ├── seedData.js     // Demo data (users, products, orders, messages)
│   │   └── token.js        // HMAC-SHA256 JWT create / verify (no jsonwebtoken dep)
│   ├── controllers/         // Request handlers
│   ├── middleware/          // requireAuth + 404 / error handler
│   ├── models/              // Validation, normalisation, sanitisation
│   ├── routes/              // Express route registration
│   ├── tests/
│   │   └── api.test.js      // Integration tests (4/4 pass)
│   └── server.js            // App factory + listen
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/      // Surf, Appframe, AuthDialog, StatusChip, StatTile,
│   │   │                   // LedgerRow, PageIntro, ActionRail, EmptyState
│   │   ├── context/         // AuthContext — cross-route auth state
│   │   ├── pages/           // Home, Marketplace, Dashboard
│   │   ├── services/        // api.js, formatters.js
│   │   ├── styles/          // theme.js — design tokens, MUI overrides
│   │   ├── App.js
│   │   └── index.js
│   └── build/               // Production build output
├── README.md               // This file
└── marketplace.json        // Runtime data store (auto-created)
```

---

## Install

```powershell
# backend — terminal 1
cd "New folder/backend"
npm install
npm start

# frontend — terminal 2
cd "New folder/frontend"
npm install
npm start
```

Optional backend env: copy `backend/.env.example` to `backend/.env`.

After the backend starts (port 5000) and the frontend dev server starts (port 3000), open [http://localhost:3000](http://localhost:3000).

---

## Verify

```powershell
# Run backend integration tests
cd "New folder/backend"
npm test

# Build frontend for production
cd "New folder/frontend"
npm run build
```

Expected output: **4 / 4 tests pass**, frontend build completes with errors: 0.

---

## Demo accounts

| Role   | Email                   | Password |
|---|---|---|
| Buyer  | `njeri@buyer.demo`     | `demo123` |
| Farmer | `amina@mkulima.demo`   | `demo123` |

---

## Design overview

**Theme: "Field Truth"**

> Every row on the market board is a record in a shared agricultural ledger. Trust comes from precision, not decoration.

- **Palette**: warm paper (`#FAF9F6`) — forest green accent (`#2E6B41`) — near-ink text (`#13110F`)
- **Typography**: Iowan Old Style serif (display) + Aptos sans (body) — editorial, not decorative
- **Component tokens**: one spacing grid (8 px base), one radius (6 px default), one shadow weight (xs / sm / md / lg)
- **Layout**: single column on mobile; 2-column dashboard (order ledger left, context rail right); edge-to-edge grid on desktop
- **Motion**: 120–360 ms cubic-bezier only for page enter, dialog, and state-change transitions; `prefers-reduced-motion` respected throughout

See `theme.js` for the full token table.

---

## Local Vercel build

```powershell
cd "New folder/frontend"
npm run build
# → produces build/  (static files)
```

Deploy to Vercel by connecting the GitHub repository. The Vercel serverless function must live at `api/index.js`. The static `frontend/build` folder is the output directory.

> Note: on Vercel, runtime writes go to `/tmp/marketplace.json`. The data survives per-request within the same instance but is not resilient across cold starts. Add a managed database for production persistence.

---

## Backend API summary

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `GET` | `/` | Any | API status |
| `GET` | `/api/health` | Any | Health check + data file init |
| `POST` | `/api/auth/register` | Any | Register farmer / buyer |
| `POST` | `/api/auth/login` | Any | Sign in, returns JWT |
| `GET` | `/api/auth/me` | Any | Token re-verification |
| `GET` | `/api/products/meta` | Any | Category + unit enums |
| `GET` | `/api/products` | Any | Search catalogue |
| `POST` | `/api/products` | Farmer | Create listing |
| `PUT` | `/api/products/:id` | Farmer | Update own listing |
| `DELETE` | `/api/products/:id` | Farmer | Delete own listing |
| `GET` | `/api/orders` | Any | List orders (filtered by role) |
| `POST` | `/api/orders` | Buyer | Place order |
| `PATCH` | `/api/orders/:id/status` | Any | Patch order status |
| `GET` | `/api/messages/conversations` | Any | List conversations |
| `GET` | `/api/messages/conversations/:id` | Any | Messages in thread |
| `POST` | `/api/messages` | Any | Send message |
| `GET` | `/api/dashboard` | Any | Stats + recent activity |
