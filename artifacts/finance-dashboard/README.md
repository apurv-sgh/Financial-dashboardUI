# FinTrack — Finance Dashboard

A clean, modern, interactive personal finance dashboard built with **React 18 + Vite** and **Tailwind CSS v4**.

---

## Setup Instructions

### Prerequisites
- [Node.js 20+](https://nodejs.org/)
- [pnpm](https://pnpm.io/) — install with `npm install -g pnpm`

### Installation

```bash
# Clone the repo and install dependencies from the workspace root
pnpm install
```

### Run in Development

```bash
# From the workspace root
pnpm --filter @workspace/finance-dashboard run dev
```

The dashboard will be available at `http://localhost:<PORT>` (port assigned by the environment).

### Build for Production

```bash
pnpm --filter @workspace/finance-dashboard run build
```

Output goes to `artifacts/finance-dashboard/dist/public`.

### Type Check

```bash
pnpm --filter @workspace/finance-dashboard run typecheck
```

---

## Project Overview

FinTrack is a fully frontend-only finance dashboard that requires no backend. All data is static mock data persisted via **localStorage**, making the app portable and instantly usable.

### Architecture

```
artifacts/finance-dashboard/
├── src/
│   ├── App.tsx                    # Root app, routing, page transition animation
│   ├── index.css                  # Global styles, theme tokens, utility classes
│   ├── context/
│   │   └── AppContext.tsx         # Global state: role, theme, transactions, filters
│   ├── data/
│   │   └── mockData.ts            # 53 mock transactions + computed helpers
│   ├── hooks/
│   │   └── useCountUp.ts          # Animated number counter hook
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx        # Collapsible sidebar with animated nav
│   │   │   └── TopBar.tsx         # Sticky header with role toggle and theme
│   │   ├── SummaryCard.tsx        # Gradient stat cards with count-up animation
│   │   ├── RoleToggle.tsx         # Animated Admin / Viewer switcher
│   │   └── TransactionModal.tsx   # Form modal for add/edit transactions
│   └── pages/
│       ├── Overview.tsx           # Dashboard home: charts, summary, recent txns
│       ├── Transactions.tsx       # Full table with filters, sort, CRUD
│       ├── Insights.tsx           # Metric cards, bar chart, observations
│       └── not-found.tsx          # 404 fallback
```

### State Management

All state lives in a single **React Context** (`AppContext.tsx`):

| State | Description |
|-------|-------------|
| `role` | `"admin"` or `"viewer"` — controls UI capabilities |
| `theme` | `"light"` or `"dark"` — synced to `document.documentElement` |
| `transactions` | Array of all transactions, persisted to localStorage |
| `filterType` | `"all"` / `"income"` / `"expense"` filter |
| `filterCategory` | Active category filter |
| `searchQuery` | Live search string |
| `sortField` / `sortDirection` | Column sort state |

All state is persisted via `localStorage` so your data survives page refreshes.

---

## Feature Breakdown

### 1. Dashboard Overview (`/`)
- **Three gradient summary cards** — Total Balance, Income, Expenses — each with animated count-up numbers on load
- **Monthly Area Chart** — income vs. expenses trend across Jan–Apr 2026 using Recharts
- **Category Donut Chart** — spending split by category with animated legend bars
- **Recent Transactions feed** — last 6 transactions with slide-in animation, category, merchant, date

### 2. Transactions (`/transactions`)
- **53 realistic mock transactions** spanning January–April 2026
- **Live search** across description, category, and merchant
- **Filter panel** (animated expand/collapse) — type (income/expense) and category filters
- **Sortable columns** — Date, Description, Amount with direction indicators
- **Pagination** — 10 rows per page
- **CSV export** of the currently filtered and sorted data
- **Admin-only CRUD** — Add, Edit, Delete with inline confirmation (edit/delete controls appear on row hover)

### 3. Insights (`/insights`)
- **4 metric cards** — Top spending category, savings rate, expense delta vs. prior month, income delta
- **Monthly comparison bar chart** — income, expenses, savings side by side per month
- **Spending breakdown** — animated horizontal progress bars per category
- **Observations panel** — 4 auto-generated smart tips based on actual data (check/alert icons)

### 4. Role-Based UI
Switch between **Viewer** and **Admin** using the animated toggle in the top bar:

| Feature | Viewer | Admin |
|---------|--------|-------|
| View all data | Yes | Yes |
| Add transactions | No | Yes |
| Edit transactions | No | Yes |
| Delete transactions | No | Yes |

Role selection persists across page refreshes via localStorage.

### 5. Dark Mode
- Full dark/light theme toggle in sidebar and top bar
- Smooth icon animation on toggle (rotate + fade)
- Theme persists via localStorage

### 6. Animations & Interactions
- **Page transitions** — fade + slide on route change (Framer Motion `AnimatePresence`)
- **Staggered card entrances** — summary cards and lists animate in sequentially
- **Animated count-up** — summary values animate from 0 to final value on page load
- **Sidebar collapse** — smooth width transition with animated label show/hide
- **Active nav indicator** — animated sliding pill using Framer Motion `layoutId`
- **Hover lift** — summary cards lift on hover
- **Animated filter panel** — height + opacity transition on open/close
- **Row hover** — transaction rows reveal action buttons on hover
- **Progress bars** — animated width fill on Insights breakdown

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 |
| Build tool | Vite 7 |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Routing | Wouter |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| Components | Radix UI / shadcn/ui |
| Icons | Lucide React |
| Dates | date-fns |
| Persistence | localStorage |

---

## Optional Enhancements Implemented

- Dark mode with localStorage persistence
- Data persistence via localStorage (transactions survive refresh)
- CSV export of filtered transactions
- Framer Motion animations throughout
- Animated number counters
- Role-based UI simulation (Admin / Viewer)
