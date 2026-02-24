<div align="center">

# 🍽️ Savoria RMS

**A full-stack, real-time Restaurant Management System built with Vanilla JS, Express, and MongoDB.**

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [Architecture](#-architecture) · [API Reference](#-api-reference) · [Contributing](#-contributing)

</div>

---

## ✨ Features

### 🎭 Role-Based Access Control
| Role | Access |
|------|--------|
| **Admin** | Full access — staff, tables, menu, analytics, billing audit |
| **Waiter** | Dashboard, tables, menu ordering, reservations, checkout |
| **Chef** | Kitchen Display System (KDS) only |

### 🧑‍💼 Waiter Dashboard
- **Live Active Tables** panel — shows every table with an unpaid order (RECEIVED → PREPARING → READY → SERVED)
- Colour-coded status badges: 📋 Received · 🔥 In Kitchen · ✓ Ready to Serve · 💳 Awaiting Payment
- **Add Items** to any in-progress order; system auto-detects the delta and prepends `🆕 EXTRA ITEMS ONLY: …` to the kitchen note
- **Pay Bill** CTA on SERVED orders goes straight to checkout
- Reservations panel with one-click RSVP creation and cancellation

### 👨‍🍳 Kitchen Display System (KDS)
- Real-time ticket board for all active orders
- **Live stopwatch** per ticket — white → 🟡 amber (10 min) → 🔴 red (20 min)
- Status pipeline: **Start Cooking** → **Mark as Ready** → **Deliver to Table**
- Kitchen notes with clear extra-item annotations

### 🪑 Table Management
- Interactive floor map with FREE / RESERVED / OCCUPIED states
- Clicking an **OCCUPIED** table shows a glass-morphism order summary modal (items, totals, status) before any action
- Admin can add new tables dynamically

### 📋 Menu & Ordering
- Category-filtered, searchable menu grid
- Inline quantity controls with running total
- Context-aware "Place Order" / "Send Additional Items" button depending on order state
- Kitchen notes textarea per order

### 💳 Checkout & Billing
- Cash / Card / Digital Wallet payment methods
- Automatic tax calculation (8%)
- Billing audit trail for Admin

### 📊 Analytics (Admin)
- Revenue, covers, and order-count metrics
- Popular items, table turnover, average order value

### 🔄 Live Auto-Refresh
- Dashboard, Kitchen, and Tables views poll every **20 s**
- Only re-renders when the state snapshot actually changes — zero unnecessary flicker
- Pulsing **● Live** badge in the topbar; flashes amber on detected change

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Vanilla JS (ES modules), HTML5, CSS3 |
| **Build Tool** | Vite 6 |
| **Backend** | Node.js + Express 5 |
| **Database** | MongoDB + Mongoose 9 |
| **Dev Runner** | Concurrently (API + Vite in one command) |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 18
- **MongoDB** running locally (or a MongoDB Atlas URI)
- **Git**

### 1 · Clone the repo
```bash
git clone https://github.com/Agamya-123/Restaurant-Management-System-RMS-.git
cd Restaurant-Management-System-RMS-
```

### 2 · Install dependencies
```bash
npm install
```

### 3 · Configure environment
```bash
cp .env.example .env
```
Edit `.env` and set your MongoDB connection string:
```env
MONGO_URI=mongodb://localhost:27017/savoria_rms
```

### 4 · Start the app
```bash
npm start
```
This runs **both** the Express API (default port `3001`) and the Vite dev server (`http://localhost:5173`) concurrently.

### 5 · Open in browser
```
http://localhost:5173
```

### Default Credentials
| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Waiter | `waiter1` | `waiter123` |
| Chef | `chef1` | `chef123` |

> Seed data is auto-loaded on first run if the database is empty.

---

## 🏗️ Architecture

The project follows a **Clean Architecture / Layered Architecture** pattern:

```
RMS/
├── index.html              # SPA shell
├── main.js                 # App bootstrap, routing, event listeners
├── style.css               # Global design tokens & component styles
├── server.js               # Express API server entry point
│
└── src/
    ├── config/             # Database connection (Mongoose)
    │
    ├── core/               # Domain layer (business logic — no framework deps)
    │   ├── domain/
    │   │   ├── model/      # Order, Table, User, Reservation entities
    │   │   ├── enums/      # OrderStatus, UserRole, TableStatus
    │   │   └── repository/ # Repository interfaces
    │   └── usecase/
    │       └── services/   # OrderService, TableService, UserService …
    │
    ├── infrastructure/     # Data layer (Mongoose schemas + repo implementations)
    │   ├── database/
    │   │   └── schemas/    # Mongoose schemas
    │   └── repositories/   # Concrete Mongoose repository implementations
    │
    └── presentation/
        └── ui/
            └── Views.js    # All HTML render functions (renderDashboard, renderKitchen …)
```

### Order Lifecycle
```
FREE table clicked
    → POST /orders          (status: RECEIVED)
    → Menu view
    → PUT /orders/:id/status (PREPARING) + kitchen note
        → Chef KDS: Start Cooking
        → Chef KDS: Mark as Ready  (READY)
            → Waiter delivers: mark-served (SERVED)
                → Dashboard: 💳 Awaiting Payment
                    → Pay Bill → POST /orders/:id/payment (PAID)
                        → Table freed
```

---

## 📡 API Reference

Base URL: `http://localhost:3001/api/v1`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/login` | Authenticate user |
| `GET` | `/state` | Full app state snapshot (orders, tables, menu, users) |
| `GET` | `/menu` | All menu items |
| `POST` | `/menu` | Create menu item (Admin) |
| `PUT` | `/menu/:id/toggle` | Toggle item availability |
| `GET` | `/tables` | All tables |
| `POST` | `/tables` | Add a table (Admin) |
| `POST` | `/orders` | Create new order |
| `PUT` | `/orders/:id/status` | Update order status |
| `PATCH` | `/orders/:id/note` | Add kitchen note |
| `POST` | `/orders/:id/payment` | Process payment |
| `GET` | `/bills` | Billing history (Admin) |
| `GET` | `/reservations` | All reservations |
| `POST` | `/reservations` | Create reservation |
| `DELETE` | `/reservations/:id` | Cancel reservation |
| `GET` | `/users` | All staff (Admin) |
| `POST` | `/users` | Create staff member (Admin) |

---

## 🤝 Contributing

Contributions are what make open-source great. Any improvements are **warmly welcome**!

### How to Contribute

1. **Fork** the repository
   ```bash
   # Click the Fork button on GitHub, then:
   git clone https://github.com/<your-username>/Restaurant-Management-System-RMS-.git
   cd Restaurant-Management-System-RMS-
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or for bug fixes:
   git checkout -b fix/issue-description
   ```

3. **Make your changes**
   - Follow the existing code style (no external CSS frameworks, keep logic in `main.js`, rendering in `Views.js`)
   - Keep commits atomic and descriptive

4. **Commit with a clear message**
   ```bash
   git add .
   git commit -m "feat: add per-item ready checkbox on KDS"
   ```
   We use [Conventional Commits](https://www.conventionalcommits.org/) loosely:
   | Prefix | Use |
   |--------|-----|
   | `feat:` | New feature |
   | `fix:` | Bug fix |
   | `refactor:` | Code restructure, no behaviour change |
   | `style:` | UI/CSS changes only |
   | `docs:` | Documentation changes |
   | `chore:` | Config, tooling, dependencies |

5. **Push and open a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then open a PR on GitHub — fill in the description template explaining **what**, **why**, and **how to test**.

### Good First Issues
Looking for a place to start? Here are some ideas:
- 🔒 **Hash passwords** with `bcrypt` — currently stored as plain text
- 💾 **Session persistence** — restore logged-in user from `localStorage` on refresh
- 🔔 **Sound notifications** — chime when order status changes
- ✂️ **Split Bill** — wire up the existing placeholder button
- 🖨️ **Print Receipt** — styled printable view with `window.print()`
- 📱 **Responsive layout** — adapt the sidebar and grid for tablet/mobile

### Code Style Guidelines
- Use `const`/`let`, never `var`
- Prefer `async/await` over raw `.then()` chains
- All render functions return an HTML string — no direct DOM mutation in `Views.js`
- Event listeners always go in `attachAllListeners()` in `main.js`
- Use the existing `notify(msg, type)` helper for all user-facing feedback

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

## 👤 Author

**Agamya** — [@Agamya-123](https://github.com/Agamya-123)

> If you find this project useful, consider giving it a ⭐ on GitHub — it helps a lot!

