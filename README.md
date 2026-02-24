<div align="center">

# Savoria RMS

A full-stack, real-time Restaurant Management System built with Vanilla JS, Express, and MongoDB.

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

[Features](#features) · [Tech Stack](#tech-stack) · [Getting Started](#getting-started) · [Architecture](#architecture) · [API Reference](#api-reference) · [Contributing](#contributing)

</div>

---

## Features

### Role-Based Access

| Role | Access |
|------|--------|
| Admin | Full access — staff management, tables, menu, analytics, billing audit |
| Waiter | Dashboard, table assignment, menu ordering, reservations, checkout |
| Chef | Kitchen Display System (KDS) only |

### Waiter Dashboard

- Active tables panel showing every unpaid order across all status stages
- Colour-coded status indicators: Received, In Kitchen, Ready to Serve, Awaiting Payment
- Add items to any in-progress order; the system auto-detects the delta and sends a targeted note to the kitchen listing only the new items
- Direct Pay Bill action on served orders, routing straight to checkout
- Reservations panel with one-click creation and cancellation

### Kitchen Display System (KDS)

- Real-time ticket board for all active orders
- Live per-ticket stopwatch — turns amber after 10 minutes, red after 20 minutes
- Status pipeline: Start Cooking → Mark as Ready → Deliver to Table
- Kitchen notes rendered per ticket with extra-item annotations clearly separated

### Table Management

- Interactive floor map with FREE, RESERVED, and OCCUPIED states
- Clicking an occupied table opens an order summary modal (item list, totals, current status) before any navigation occurs
- Admin can add tables dynamically from the same view

### Menu and Ordering

- Category-filtered, searchable menu grid
- Inline quantity controls with a running total panel
- Context-aware button label — "Place Order" for new orders, "Send Additional Items" when appending to an existing ticket
- Per-order kitchen notes field

### Checkout and Billing

- Payment methods: Cash, Card, Digital Wallet
- Automatic 8% tax calculation
- Full billing audit trail accessible to Admin

### Analytics

- Revenue, cover count, and order-volume metrics
- Top-selling items, table turnover rate, average order value

### Live Auto-Refresh

- Dashboard, Kitchen, and Tables views poll the server every 20 seconds
- Re-renders only when the state snapshot has actually changed — no unnecessary flicker
- A small pulsing "Live" indicator in the topbar confirms the connection; it briefly changes to "Updated" when a change is detected

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Vanilla JS (ES modules), HTML5, CSS3 |
| Build Tool | Vite 6 |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose 9 |
| Dev Runner | Concurrently (API + Vite in one command) |

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- MongoDB running locally, or a MongoDB Atlas connection string
- Git

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/Agamya-123/Restaurant-Management-System-RMS-.git
cd Restaurant-Management-System-RMS-
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment**

```bash
cp .env.example .env
```

Open `.env` and set your MongoDB connection string:

```env
MONGO_URI=mongodb://localhost:27017/savoria_rms
```

**4. Start the application**

```bash
npm start
```

This starts the Express API server and the Vite dev server concurrently.

**5. Open in browser**

```
http://localhost:5173
```

### Default Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Waiter | `waiter1` | `waiter123` |
| Chef | `chef1` | `chef123` |

Seed data is loaded automatically on first run if the database is empty.

---

## Architecture

The project follows a layered architecture pattern separating domain logic from infrastructure and presentation concerns.

```
RMS/
├── index.html                          # Single-page app shell
├── main.js                             # App bootstrap, routing, event listeners
├── style.css                           # Global design tokens and component styles
├── server.js                           # Express API entry point
│
└── src/
    ├── config/                         # Database connection setup
    │
    ├── core/                           # Domain layer — no framework dependencies
    │   ├── domain/
    │   │   ├── model/                  # Order, Table, User, Reservation entities
    │   │   ├── enums/                  # OrderStatus, UserRole, TableStatus
    │   │   └── repository/             # Repository interfaces
    │   └── usecase/
    │       └── services/               # OrderService, TableService, UserService
    │
    ├── infrastructure/                 # Data layer — Mongoose schemas and repositories
    │   ├── db/schemas/
    │   └── persistence/
    │
    └── presentation/
        └── ui/
            └── Views.js                # All render functions
```

### Order Lifecycle

```
Free table selected
  → Create order          (status: RECEIVED)
  → Waiter builds order in menu view
  → Send to kitchen       (status: PREPARING, kitchen note attached)
      → Chef: Start Cooking
      → Chef: Mark as Ready   (status: READY)
          → Waiter delivers   (status: SERVED)
              → Dashboard shows Awaiting Payment
                  → Waiter clicks Pay Bill
                      → Checkout: select method, confirm
                          → Payment processed  (status: PAID, table freed)
```

---

## API Reference

Base URL: `http://localhost:3001/api/v1`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/login` | Authenticate a user |
| `GET` | `/state` | Full application state snapshot |
| `GET` | `/menu` | Retrieve all menu items |
| `POST` | `/menu` | Create a menu item (Admin) |
| `PUT` | `/menu/:id/toggle` | Toggle item availability |
| `GET` | `/tables` | Retrieve all tables |
| `POST` | `/tables` | Add a table (Admin) |
| `POST` | `/orders` | Create a new order |
| `PUT` | `/orders/:id/status` | Update order status |
| `PATCH` | `/orders/:id/note` | Set kitchen note on an order |
| `POST` | `/orders/:id/payment` | Process payment for an order |
| `GET` | `/bills` | Billing history (Admin) |
| `GET` | `/reservations` | Retrieve all reservations |
| `POST` | `/reservations` | Create a reservation |
| `DELETE` | `/reservations/:id` | Cancel a reservation |
| `GET` | `/users` | Retrieve all staff (Admin) |
| `POST` | `/users` | Create a staff member (Admin) |

---

## Contributing

Contributions are welcome. Please follow the steps below to keep the codebase consistent.

### Workflow

1. Fork the repository and clone your fork locally.

2. Create a descriptive branch:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```

3. Make your changes, keeping commits small and focused.

4. Commit using [Conventional Commits](https://www.conventionalcommits.org/):

   | Prefix | Purpose |
   |--------|---------|
   | `feat:` | New feature |
   | `fix:` | Bug fix |
   | `refactor:` | Code restructure with no behaviour change |
   | `style:` | UI or CSS changes only |
   | `docs:` | Documentation only |
   | `chore:` | Config, tooling, dependencies |

   Example:
   ```bash
   git commit -m "feat: add per-item ready checkbox to KDS tickets"
   ```

5. Push your branch and open a Pull Request. Describe what changed, why, and how to test it.

### Code Guidelines

- Use `const`/`let` exclusively — no `var`.
- Prefer `async/await` over `.then()` chains.
- All render functions in `Views.js` return an HTML string. Do not mutate the DOM directly inside render functions.
- All event listeners belong in `attachAllListeners()` in `main.js`.
- Use the `notify(message, type)` helper for all user-facing feedback messages.

### Good First Issues

- Hash passwords with `bcrypt` — currently stored as plain text.
- Persist the logged-in session in `localStorage` so a page refresh does not log the user out.
- Wire up the existing "Split Bill" placeholder in the checkout view.
- Build a printable receipt view using `window.print()`.
- Add sound notifications when an order status changes.
- Improve responsiveness for tablet and mobile screen sizes.

---

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.

---

## Author

**Agamya** — [@Agamya-123](https://github.com/Agamya-123)
