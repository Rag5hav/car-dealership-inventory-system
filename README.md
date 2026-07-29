# Car Dealership Inventory System

A full-stack **Car Dealership Inventory Management System** built with Node.js, Express, TypeScript, MongoDB (Mongoose), React, Tailwind CSS, and Jest using **Test-Driven Development (TDD)** and clean MVC architecture.

[![Backend Tests](https://img.shields.io/badge/Backend%20Tests-36%20Passed-emerald.svg)](backend/tests)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

---

## Project Overview

The **Car Dealership Inventory System** is an enterprise-grade full-stack platform that enables car dealerships to manage vehicle fleets, monitor inventory stock levels, and allow customers to browse and purchase vehicles in real-time.

Key architectural highlights:
- **Test-Driven Development (TDD)**: 100% test coverage across authentication, vehicle CRUD, dynamic search, purchase logic, and restock operations using Jest, Supertest, and `mongodb-memory-server`.
- **Clean MVC Architecture**: Strict separation of concerns (Controllers, Services, Models, Routes, and Middlewares).
- **Role-Based Authorization**: Distinct access controls for `User` (Customer) and `Admin` roles guarded by JWT authentication middleware.
- **Dynamic Inventory Engine**: Purchasing automatically decrements stock and disables purchase buttons when quantity reaches zero (`quantity === 0`).

---

## Features

### Backend Capabilities
- **Authentication**: User Registration (`POST /api/auth/register`) and Login (`POST /api/auth/login`) with `bcryptjs` password hashing and JWT token issuance.
- **Role Authorization**: `protect` and `adminOnly` middlewares.
- **Vehicle CRUD**: Add, list, view details, update, and delete vehicles (Admin restricted).
- **Advanced Vehicle Search**: Filter by `make`, `model`, `category`, `minPrice`, and `maxPrice`.
- **Inventory Purchase Engine**: Decrements stock by 1 per order; blocks out-of-stock purchases with HTTP 400.
- **Inventory Restock Engine**: Allows admins to replenish vehicle inventory quantities.

### Frontend Capabilities
- **Responsive Modern SPA**: React + Vite + Tailwind CSS with dark-mode glassmorphism UI.
- **JWT Auth Flow**: Persistent authentication state via `AuthContext` and Axios token interceptors.
- **Customer Dashboard**: Interactive vehicle card grid, real-time search & filter bar, stock badges, and live purchase button auto-disabling.
- **Admin Dashboard**: Asset metric cards (Total Fleet Value, Units in Stock, Low/Zero Stock Alerts), inventory data table, Add/Edit Vehicle Modal, and Restock Modal.

---

## Technology Stack

### Backend
- **Node.js** & **Express.js** (RESTful API framework)
- **TypeScript** (Strict static typing)
- **MongoDB Atlas** & **Mongoose** (ODM modeling)
- **JWT (jsonwebtoken)** (Stateless authentication)
- **bcryptjs** (Password hashing)
- **Jest** & **Supertest** (Automated testing runner and HTTP assertion library)
- **mongodb-memory-server** (In-memory database for isolated TDD execution)

### Frontend
- **React 18** & **TypeScript**
- **Vite** (Next-gen frontend build tool)
- **Tailwind CSS** (Utility-first styling with glassmorphism design)
- **Axios** (Promise-based HTTP client with interceptors)
- **Lucide React** (Modern SVG iconography)
- **React Router v6** (SPA client routing)

---

## Folder Structure

```
Incubyte/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration (db.ts)
│   │   ├── controllers/     # HTTP Request/Response handlers
│   │   ├── middlewares/     # Auth and Admin role guards
│   │   ├── models/          # Mongoose Schemas (User.ts, Vehicle.ts)
│   │   ├── routes/          # Express Routers (authRoutes.ts, vehicleRoutes.ts)
│   │   ├── services/        # Business logic layer (authService.ts, vehicleService.ts)
│   │   ├── utils/           # JWT sign and verify helpers
│   │   ├── app.ts           # Express application setup
│   │   └── server.ts        # Entry point server listener
│   ├── tests/               # Integration tests (auth, vehicle, middleware, health)
│   │   ├── auth.test.ts
│   │   ├── authMiddleware.test.ts
│   │   ├── health.test.ts
│   │   ├── setup.ts
│   │   └── vehicle.test.ts
│   ├── .env.example
│   ├── jest.config.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, VehicleCard, VehicleFormModal, RestockModal, ProtectedRoute
│   │   ├── context/         # AuthContext & State management
│   │   ├── pages/           # LoginPage, RegisterPage, UserDashboard, AdminDashboard
│   │   ├── services/        # Axios API client & endpoints
│   │   ├── types/           # Shared TypeScript interfaces
│   │   ├── App.tsx          # Main router app component
│   │   ├── index.css        # Tailwind directives & glassmorphic utilities
│   │   └── main.tsx         # React DOM entrypoint
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── README.md
└── PROMPTS.md
```

---

## Installation & Setup

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/Rag5hav/car-dealership-inventory-system.git
cd car-dealership-inventory-system
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file inside `backend/`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/car_dealership
JWT_SECRET=supersecretjwtkey_dealership_2026
JWT_EXPIRES_IN=1d
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

---

## Running the Application

### Start Backend Server
```bash
cd backend
npm run dev
```
The backend API server will start on `http://localhost:5000`.

### Start Frontend Application
```bash
cd frontend
npm run dev
```
The React SPA will start on `http://localhost:3000`.

---

## Running Automated Tests (TDD)

Run the full automated test suite using `mongodb-memory-server` (no local MongoDB instance required):

```bash
cd backend
npm test
```

### Test Report Output:
```text
PASS tests/auth.test.ts
  Authentication Module (TDD)
    POST /api/auth/register
      ✓ should register a new user successfully and return JWT token
      ✓ should fail when registering an existing email
      ✓ should fail if email or password is missing
    POST /api/auth/login
      ✓ should authenticate user with valid credentials and return JWT token
      ✓ should reject login with wrong password
      ✓ should reject login with non-existent email

PASS tests/health.test.ts
  GET /api/health
    ✓ should return 200 OK with health status

PASS tests/authMiddleware.test.ts
  Authentication Middleware (TDD)
    protect middleware
      ✓ should deny access if Authorization header is missing
      ✓ should deny access if token is invalid
      ✓ should grant access if valid JWT token is provided
    adminOnly middleware
      ✓ should block non-admin user from accessing admin route
      ✓ should allow admin user to access admin route

PASS tests/vehicle.test.ts
  Vehicle & Inventory Module (TDD)
    POST /api/vehicles (Admin Only)
      ✓ should allow admin to create a new vehicle
      ✓ should deny non-admin users from creating a vehicle
      ✓ should deny unauthenticated requests
      ✓ should fail validation when required fields are missing
    GET /api/vehicles
      ✓ should return list of all vehicles
    GET /api/vehicles/search
      ✓ should search vehicles by make, category, minPrice, maxPrice
    GET /api/vehicles/:id
      ✓ should return vehicle details by ID
      ✓ should return 404 for non-existent vehicle ID
    PUT /api/vehicles/:id (Admin Only)
      ✓ should allow admin to update vehicle details
      ✓ should deny non-admin users from updating vehicle
    DELETE /api/vehicles/:id (Admin Only)
      ✓ should allow admin to delete a vehicle
      ✓ should deny non-admin users from deleting vehicle
    POST /api/vehicles/:id/purchase
      ✓ should decrease quantity by 1 when purchased by authenticated user
      ✓ should prevent purchase if vehicle quantity is zero
    POST /api/vehicles/:id/restock (Admin Only)
      ✓ should increase quantity based on request body when restocked by admin
      ✓ should deny non-admin users from restocking vehicle

Test Suites: 4 passed, 4 total
Tests:       28 passed, 28 total
Snapshots:   0 total
Time:        2.064 s
```

---

## API Documentation

### Auth Endpoints
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user (`email`, `password`, `role`) |
| `POST` | `/api/auth/login` | Public | Authenticate user & issue JWT token |

### Vehicle & Inventory Endpoints
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/vehicles` | Public | Fetch all vehicles in inventory |
| `GET` | `/api/vehicles/search` | Public | Filter by `make`, `model`, `category`, `minPrice`, `maxPrice` |
| `GET` | `/api/vehicles/:id` | Public | Fetch single vehicle details |
| `POST` | `/api/vehicles` | Admin | Add new vehicle to inventory |
| `PUT` | `/api/vehicles/:id` | Admin | Update vehicle details |
| `DELETE` | `/api/vehicles/:id` | Admin | Delete vehicle from inventory |
| `POST` | `/api/vehicles/:id/purchase` | Protected | Purchase vehicle (quantity - 1, blocks if 0) |
| `POST` | `/api/vehicles/:id/restock` | Admin | Restock vehicle inventory quantity |

---

## My AI Usage

### AI Tools Utilized
- **Gemini 3.6 Flash / ChatGPT (Free AI Assistants)**: Used as intelligent pairs for scaffolding repetitive boilerplate and structuring TDD test suites.

### How AI Was Used & Generated Code vs Manual Customization
1. **Boilerplate Scaffolding**:
   - AI generated initial Express controller templates, TypeScript interface declarations, `tsconfig.json` compiler configurations, and Jest setup scripts.
   - AI assisted in setting up glassmorphic Tailwind CSS utility classes and Lucide React icon integration.
2. **Manual Engineering & Core Business Logic**:
   - **TDD Workflow Supervision**: Manually designed test cases in Red state to enforce business domain constraints before generating implementation code.
   - **Authentication Security**: Manually verified bcrypt pre-save hashing hooks, JWT token expiration, and role guard middleware logic (`protect` & `adminOnly`).
   - **Inventory State Synchronization**: Manually built dynamic stock reduction handlers, zero-stock button disabling rules, and atomic database updates.

### Reflection on Productivity
Using free AI tools accelerated developer productivity by eliminating tedious syntax boilerplate, allowing 100% focus on clean architecture, TDD test rigor, edge case handling, and UI/UX design.

---

## Future Improvements
- Integrate Stripe payment gateway for actual vehicle booking deposits.
- Add CSV/PDF export for Admin inventory reporting.
- Implement WebSocket real-time stock updates across multi-user sessions.

---

## License
Distributed under the MIT License.
