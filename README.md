# G Workspace — Full Stack Project

A complete full-stack ecosystem with **E-commerce + E-Learning store**, **Admin Dashboard**, and a shared **Backend API**.

## 📁 Project Structure

```
g-workspace-final/
├── backend/              ← Node.js + Express API (Port 5000)
│   ├── server.js         ← Entry point
│   ├── db.js             ← JSON file-based database
│   ├── routes/           ← API routes (auth, products, orders, courses, etc.)
│   ├── middleware/        ← JWT auth middleware
│   └── data/             ← JSON data files (auto-created on first run)
│
├── ecommerce-website/    ← React + Vite (Port 5173)
│   ├── src/
│   │   ├── pages/        ← Home, Products, Courses, Checkout, Order Success
│   │   ├── components/   ← Navbar, CartDrawer, PaymentModal, ProductCard
│   │   └── context/      ← Auth, Cart, Toast state management
│   └── vite.config.js    ← Dev server config (proxies API to backend)
│
├── dashboard/            ← React (CRA) (Port 3000)
│   ├── src/
│   │   ├── App.js        ← Main app with sidebar navigation
│   │   ├── Sidebar.js    ← Navigation with live status badges
│   │   ├── InvoiceGenerated.js  ← Invoice management
│   │   ├── EmailNotified.js     ← Email logs
│   │   ├── StocksAvailability.js ← Stock management
│   │   └── TeamSpace.js  ← Team/user management
│   └── package.json
│
├── start-all.bat         ← One-click startup for all 3 servers
└── README.md             ← This file
```

## 🚀 Quick Start (3 Steps)

### Step 1: Install Dependencies
Open a terminal in each folder and run:
```bash
cd backend && npm install
cd ../ecommerce-website && npm install
cd ../dashboard && npm install
```

### Step 2: Start All Servers
Double-click `start-all.bat` or run in terminal:
```bash
start-all.bat
```

### Step 3: Open in Browser
| App | URL | Description |
|-----|-----|-------------|
| 🛍️ E-commerce Store | http://localhost:5173 | Shop products + buy courses |
| 📊 Dashboard | http://localhost:3000 | Admin panel for team, invoices, emails, stocks |
| ⚙️ Backend API | http://localhost:5000/api | REST API endpoints |

## 🔑 Key Features

### E-commerce + E-Learning Website
- User Sign Up / Sign In (JWT auth)
- Product catalog with categories & search
- **E-Learning courses with Add to Cart & Buy Now**
- **Razorpay-style payment popup** (card number, expiry, CVV, name)
- Invoice generation with card type & masked number
- Email confirmation records

### Admin Dashboard
- Team Space (auto-synced with backend users)
- Invoice Generated (with card type badges — Visa, Mastercard, Amex)
- Email Notified (with card payment details)
- Stocks Availability (real-time stock levels)
- Learning Hub (course management)
- Live stats & analytics

### Backend API
- JWT authentication
- JSON file-based database (no external DB needed)
- Auto-seeded sample products & courses
- Order processing with stock management
- Invoice & email generation

## 🧪 Test Cards (Simulated Payments)
| Card Number | Type |
|-------------|------|
| 4242 4242 4242 4242 | Visa |
| 5555 5555 5555 4444 | Mastercard |
| 3782 822463 10005 | Amex |

**Expiry:** Any future date (e.g., 12/28)  
**CVV:** Any 3-4 digits (e.g., 123)  
**Name:** Any name

## 📡 API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/signup | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/products | List all products |
| GET | /api/courses | List all courses |
| POST | /api/orders | Create order |
| POST | /api/orders/:id/confirm | Confirm payment |
| GET | /api/invoices | List invoices |
| GET | /api/emails | List email logs |
| GET | /api/stats | Dashboard analytics |

## 💻 Tech Stack
- **Frontend:** React, Vite, React Router
- **Backend:** Node.js, Express, JWT
- **Database:** JSON file-based (zero config)
- **Dashboard:** React (CRA)
