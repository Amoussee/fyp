This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Node.js Version Requirement

This project requires Node.js version 20.9.0 or higher. If you are using NVM (Node Version Manager), you can easily install and switch to the appropriate version using the following commands:

```
nvm install 20.9.0
nvm use 20.9.0
```

Please ensure that you are running the correct version before starting the development server or building the project.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

# Project Structure & Architecture

This project uses **Next.js App Router** with a folder structure designed to support **role-based access control** and a **future migration to AWS Cognito** with minimal refactoring.

The key idea is to **separate routing, authentication boundaries, and feature code clearly**, while keeping UI and business logic reusable.

---

## `src/` Overview

```txt
src/
├── app/          # Next.js routing layer (App Router)
├── components/   # Reusable UI components
├── hooks/        # Custom React hooks
├── lib/          # Shared utilities / helpers
├── screens/      # Page-level UI components (non-routing)
├── services/     # API / business logic layer
└── types/        # Shared TypeScript types
```

---

## `src/app/` – Routing & Access Control (App Router)

The `app/` folder defines **URL routes, layouts, and access boundaries**.
This layer is intentionally kept thin — it wires routes together and delegates UI to components/screens.

### Route Groups: `(public)` vs `(authed)`

This project uses **route groups**, which:

- Do **not** appear in the URL
- Allow different layouts and auth rules per group

### `(public)` – Pre-login pages

```txt
src/app/(public)/
├── login/
│   └── page.tsx
├── carbon-simulator/
│   └── page.tsx
└── unauthorized/
    └── page.tsx
```

**Purpose**

- Pages accessible **without authentication**
- Examples: login, marketing pages, simulators, error states

**Notes**

- No AppBar is rendered here
- Middleware allows unauthenticated access

---

### `(authed)` – Post-login pages

```txt
src/app/(authed)/
├── layout.tsx
├── parents/
│   ├── page.tsx
│   └── onboarding/
│       └── page.tsx
└── staff/
    └── page.tsx
```

**Purpose**

- Pages that require the user to be logged in
- AppBar and other authenticated UI are applied via `(authed)/layout.tsx`

**Role-based access**

- `/parents/*` → parents only
- `/staff/*` → staff only
- Enforced centrally via `middleware.ts`

---

### Feature-based subfolders

Each subfolder under `(authed)` or `(public)` represents a **feature area** of the application.

Examples:

- `parents/onboarding` → parent onboarding flow
- `staff` → staff-only dashboards or admin tools
- `carbon-simulator` → standalone public feature

This allows:

- Clear ownership of features
- Easy extension as the app grows
- Clean mapping between URLs and features

---

## `src/app/api/` – Mock Authentication Layer (Temporary)

```txt
src/app/api/
├── dev-login/
│   └── route.ts
├── dev-logout/
│   └── route.ts
└── health/
    └── route.ts
```

### Current purpose

- Provides a **mock login/logout API**
- Sets a lightweight session cookie (e.g. email + role)
- Enables development of:
  - Role-based routing
  - Middleware enforcement
  - Authenticated layouts

### Future: AWS Cognito integration

This folder is intentionally designed to be **temporary**.

When AWS Cognito is introduced:

- `dev-login` / `dev-logout` will be removed
- Authentication will be handled by:
  - Cognito Hosted UI or SDK
  - JWT/session cookies issued by Cognito

- Middleware logic remains mostly unchanged
  - Only the session parsing/verification changes

This minimizes churn and avoids restructuring routes later.

---

## `src/app/layout.tsx` – Global Root Layout

```txt
src/app/layout.tsx
```

**Responsibilities**

- Global fonts
- Global styles (`globals.css`)
- App-wide providers (MUI Theme, context providers)

**Important**

- Does **not** render AppBar
- Auth-specific UI lives in `(authed)/layout.tsx`

---

## `components/` – Reusable UI Components

```txt
src/components/
├── appbar.tsx
├── ui/
└── ...
```

- Stateless or minimally stateful UI pieces
- Used across multiple routes and features
- Not tied to routing logic

---

## `screens/` – Page-Level UI (Non-routing)

```txt
src/screens/
├── LoginPage.tsx
└── ...
```

**Purpose**

- Contains full-page UI components
- Imported by `app/**/page.tsx` route files

This separation:

- Keeps routing files minimal
- Avoids coupling UI to Next.js conventions
- Makes future refactors easier

---

## `services/` – Business Logic & API Layer

```txt
src/services/
├── auth/
└── ...
```

- Handles API calls, auth helpers, domain logic
- Cognito SDK integration will live here in future
- Keeps UI components clean and declarative

---

## `types/` – Shared Type Definitions

```txt
src/types/
```

- Central place for shared interfaces and enums
- Includes auth/session/role types
- Helps keep middleware, services, and UI consistent

---

## Why this structure works well with AWS Cognito

- Auth boundaries are **route-based**, not component-based
- Middleware already enforces roles centrally
- UI doesn’t depend on how auth is implemented
- Replacing mock auth with Cognito is mostly a **drop-in change**

This allows the team to:

- Develop features now
- Add real authentication later
- Avoid large-scale refactors
