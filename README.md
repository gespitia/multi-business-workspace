# Multi-Business Workspace

A focused front-end reference implementation for a multi-business product: one owner can switch between businesses while the application keeps tenant context explicit.

## Architecture
UI / App Shell -> Tenant Context -> Business Module -> Backend Core boundary -> Tenant-aware Repository -> PostgreSQL RLS boundary.

The repository models the backend and database boundaries instead of pretending the browser is enforcing production isolation.

## Why this is a project
It contains executable domain/application code, a tenant-aware repository boundary, tests, architecture documentation and a deployable demo.

## Run
npm install
npm run dev

## Test
npm test

## Important limitation
This is a browser-first reference implementation. PostgreSQL RLS is represented as an architectural boundary; no production database is connected.

See docs/architecture.md and the ADRs.