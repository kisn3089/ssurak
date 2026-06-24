# AGENTS.md

This file provides guidance to coding agents (Claude Code, etc.) when working with code in this repository.

## Project Overview

Turborepo monorepo for a restaurant ordering system using pnpm workspaces.

**Apps:**

- `@spaceorder/order` - Customer-facing Next.js 15 app (port 3000)
- `@spaceorder/console` - Admin Next.js 15 app (port 3001)
- `@spaceorder/ssurak` - NestJS 11 backend API (port 8080)

**Shared Packages:**

- `@spaceorder/db` - Prisma schema, types, and client (MySQL) - **Single Source of Truth for database**
- `@spaceorder/api` - React Query hooks and axios HTTP client
- `@spaceorder/auth` - Zod schemas and JWT utilities (jwt-decode)
- `@spaceorder/ui` - Radix UI component library with Tailwind CSS v4
- `@spaceorder/lintconfig` - ESLint 9 FlatConfig
- `@spaceorder/tsconfig` - Shared TypeScript configs (base, nextjs, react-library)

## Commands

**Always use `pnpm`** (requires pnpm 9.0.0+, Node.js >=22)

```bash
# Development
pnpm dev                           # All apps (turbo)
pnpm dev:order                     # Customer app (turbo --filter=@spaceorder/order, 3000)
pnpm dev:console                   # Admin app (turbo --filter=@spaceorder/console, 3001)
pnpm dev:ssurak                    # Backend API (docker compose -f docker-compose.dev.yml up -d)

# Build & Quality
pnpm build                         # Build all (turbo)
pnpm build:order                   # Build customer app
pnpm build:console                 # Build admin app
pnpm build:ssurak                  # Build backend
pnpm check-types                   # Type check all
pnpm lint                          # Lint all
pnpm format                        # Prettier write across **/*.{ts,tsx,md}

# Database (from root)
pnpm prisma:generate               # Generate Prisma client
pnpm prisma:migrate                # Run dev migrations
pnpm prisma:deploy                 # Apply migrations (deploy)
pnpm prisma:studio                 # Open Prisma Studio
pnpm prisma:seed                   # Seed database
pnpm prisma:reset                  # Reset database

# Testing (ssurak only)
pnpm --filter=@spaceorder/ssurak test        # Run unit tests (jest)
pnpm --filter=@spaceorder/ssurak test:watch  # Watch mode
pnpm --filter=@spaceorder/ssurak test:cov    # Coverage report
pnpm --filter=@spaceorder/ssurak test:e2e    # E2E tests

# Filter syntax for specific packages
pnpm build --filter=@spaceorder/order
pnpm lint --filter=@spaceorder/ui
```

## Architecture

### Database (SSOT)

All database configuration lives in the root `.env` file. The `@spaceorder/db` package is the single source of truth:

```typescript
// Import types and client
import { PrismaClient } from "@spaceorder/db";
import type {
  Admin,
  Order,
  OrderStatus,
  Table,
  TableSession,
} from "@spaceorder/db";
```

**Models:** Admin, Owner, Store, Category, Table, Menu, Order, OrderItem, TableSession

**Enums:**

- `AdminRole` - SUPER, SUPPORT, VIEWER
- `OrderStatus` - PENDING, ACCEPTED, PREPARING, COMPLETED, CANCELLED
- `TableSessionStatus` - WAITING_ORDER, ACTIVE, PAYMENT_PENDING, CLOSED

**Key Design Patterns:**

- BigInt primary keys with cuid2 public IDs
- Soft delete for Menu (deletedAt)
- JSON fields for menu options and order item snapshots

Always run `pnpm prisma:generate` after schema changes.

### Backend (ssurak)

- CommonJS module system (not ESM)
- **Config:** `ConfigModule` loads from root `.env` (`envFilePath: '../../.env'`)
- **API Documentation:** Swagger UI at `/docs`
- **Module groups** (`apps/ssurak/src`):
  - `identity` - admin, me, owner
  - `stores` - stores, menu, table, session
  - `orders` - orders, order-item
  - `carts` - customer + owner cart controllers
  - `auth` - controllers, guards, strategies, services
  - `realtime` - Socket.IO gateway with Redis adapter (`@socket.io/redis-adapter`), order/cart event services, WS auth
  - `redis` - ioredis provider/module
  - `common`, `decorators`, `dto`, `utils`, `prisma`, `internal`, `docs`
- JWT access/refresh token auth with HTTP-only cookies
- Custom decorators: `@ZodValidation()`, plus `client`, `jwt`, `session`, and `cache` decorators
- Guards: LocalAuthGuard, JwtAuthGuard, JwtRefreshAuthGuard
- Realtime: `@nestjs/websockets` + `@nestjs/platform-socket.io` + `socket.io`, scaled across instances via Redis adapter
- BigInt serialization configured in `src/main.ts`

### Frontend Apps

- Next.js 15 with React 18.3, React Compiler enabled (`reactCompiler: true` in next.config)
- ESM module system (`"type": "module"`)
- Tailwind CSS v4 with PostCSS
- `console` has `transpilePackages: ["@spaceorder/ui"]`
- `console` uses `@tanstack/react-table` v8 for data tables, `@tanstack/react-query` v5 for server state, React Hook Form for forms, axios for HTTP

### Package Dependencies

```text
order → @spaceorder/ui
console → @spaceorder/api, @spaceorder/db, @spaceorder/ui, @spaceorder/auth
ssurak → @spaceorder/db, @spaceorder/api
@spaceorder/api → @spaceorder/db, @spaceorder/auth
```

## Git Hooks

**husky** is configured with a pre-push hook that runs `pnpm build` to ensure all packages build successfully before pushing.

## TypeScript Standards

**NEVER use type assertions (`as`)** to solve type errors. Use proper type design instead:

```typescript
// Bad
return data as T;

// Good - use generics with defaults, intersection types, or type narrowing
async getMenuById<T = PublicMenu>(...): Promise<PublicMenu & T> {
  return await prismaService.menu.findFirstOrThrow(...);
}
```

## Docker

Root `docker-compose.yml` defines all services for local development; `docker-compose.dev.yml` is used by `pnpm dev:ssurak`.

```bash
docker compose up -d              # Start all services
docker compose up -d mysql        # Start only MySQL
docker compose down               # Stop all services
docker compose logs -f ssurak     # View backend logs
```

**Services:**

- `mysql` - MySQL 8.0 database (port: `DB_PORT`, default 3306)
- `ssurak` - NestJS backend API (port: `SERVER_PORT`, default 8080)
- `console` - Admin Next.js app (port: 3001)
- `order` - Customer Next.js app (port: 3000)
- `prisma-studio` - Database GUI (port: 5555)
- Redis - used by the realtime Socket.IO adapter

## Environment Variables

Central config in root `.env` file (see `.env.example`):

**Database:**

- `DB_ROOT_PASSWORD` - MySQL root password
- `DB_PORT` - MySQL port (default: 3306)
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `DATABASE_URL` - Prisma connection string

**Server:**

- `SERVER_PORT` - Backend port (default: 8080)
- `SSURAK_URL` - Backend API URL for frontend apps

**JWT:**

- `JWT_ACCESS_TOKEN_SECRET`, `JWT_ACCESS_TOKEN_EXPIRATION_MS` (default: 1 hour)
- `JWT_REFRESH_TOKEN_SECRET`, `JWT_REFRESH_TOKEN_EXPIRATION_MS` (default: 7 days)
- `JWT_ISSUER` - Token issuer URL
- `JWT_AUDIENCE` - Token audience identifier

## Troubleshooting

| Issue                       | Solution                                                            |
| --------------------------- | ------------------------------------------------------------------- |
| Prisma Client not generated | `pnpm prisma:generate`                                              |
| Type imports not working    | Ensure `@spaceorder/db` is in `dependencies`, not `devDependencies` |
| Module resolution errors    | `pnpm install` at root                                              |
| Hot-reload not working      | Check nodemon is watching `src/` directory                          |
| Build fails on push         | husky pre-push hook runs `pnpm build` - fix build errors first      |
