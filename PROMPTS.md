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
