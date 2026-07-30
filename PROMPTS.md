# Prompts Log - Car Dealership Inventory System

This document records the prompt history and user instructions used throughout the development of the Car Dealership Inventory System.

---

## Prompt 1: Initial System Requirement & Architecture Definition
**Prompt**:
> Act as a senior Full Stack Software Engineer, Solution Architect, QA Engineer, and Technical Mentor. Help me build a complete **Car Dealership Inventory System** step by step while following **Test-Driven Development (TDD)**, clean architecture, and modern software engineering best practices...

**Outcome**:
- Created initial system architecture design and `implementation_plan.md`.
- Set up project root structure, `.gitignore`, and `PROMPTS.md`.

---

## Prompt 2: Backend Authentication Module (TDD)
**Prompt**:
> Implement Authentication endpoints `POST /api/auth/register` and `POST /api/auth/login` following TDD (Red -> Green -> Refactor) with password hashing (bcrypt), JWT generation, and `protect` / `adminOnly` middleware.

**Outcome**:
- Created failing tests in `tests/auth.test.ts` and `tests/authMiddleware.test.ts` (RED).
- Implemented `User` model, `jwt` utility, `AuthService`, `authController`, `authRoutes`, and `authMiddleware` (GREEN).
- 12/12 unit and integration tests passing.

---

## Prompt 3: Vehicle & Inventory Module (TDD)
**Prompt**:
> Implement Vehicle CRUD endpoints (`POST /api/vehicles`, `GET /api/vehicles`, `GET /api/vehicles/search`, `PUT /api/vehicles/:id`, `DELETE /api/vehicles/:id`) and Inventory operations (`POST /api/vehicles/:id/purchase` and `POST /api/vehicles/:id/restock`) following TDD (Red -> Green -> Refactor).

**Outcome**:
- Created failing integration test suite `tests/vehicle.test.ts` covering CRUD, search filters, role access, zero-stock purchase rules, and restock (RED).
- Implemented `Vehicle` Mongoose model, `VehicleService`, `vehicleController`, and `vehicleRoutes` guarded by authentication and role middleware (GREEN).
- 28/28 total backend tests passing with 100% success rate.

---

## Prompt 4: Frontend SPA (React, TypeScript & Tailwind CSS)
**Prompt**:
> Build a modern responsive SPA using React, TypeScript, Tailwind CSS, Axios, and React Router. Create Login, Register, Customer Dashboard, and Admin Dashboard pages with live search, purchase zero-stock auto-disabling, restock modal, vehicle CRUD modals, and toast notifications.

**Outcome**:
- Created Vite React TypeScript frontend with Tailwind CSS and glassmorphism styling.
- Implemented `AuthContext`, Axios API client with automatic JWT token attachment.
- Created `LoginPage`, `RegisterPage`, `UserDashboard`, and `AdminDashboard`.

---

## Prompt 5: Admin Registration Security (ADMIN_SECRET_KEY Passcode)
**Prompt**:
> Secure Admin registration by requiring a secret passcode (`ADMIN_SECRET_KEY` in `.env`). Require `adminKey` in request body when selecting Admin role during registration; reject unauthorized attempts with 403 Forbidden.

**Outcome**:
- Added `ADMIN_SECRET_KEY` to `.env` and `.env.example`.
- Wrote failing TDD tests in `tests/auth.test.ts` (RED).
- Updated `AuthService.register`, `authController`, `AuthContext`, `authAPI.register`, and `RegisterPage.tsx` (GREEN).
- 38/38 backend tests passing cleanly.
