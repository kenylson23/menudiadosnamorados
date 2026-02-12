# replit.md

## Overview

Las Tortillas is a restaurant digital menu application built for a Portuguese/Angolan restaurant. It provides a public-facing elegant Valentine's Day themed menu page and an admin interface for managing menu content. The app displays menu sections (Entrada, Prato Principal, Sobremesa) with items and prices in Kwanza (KZ), offers QR code generation for sharing the menu URL, and integrates WhatsApp links for reservations. The UI uses a romantic creme and red color palette with custom fonts (Fraunces serif + Manrope sans-serif).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend (React SPA)
- **Framework**: React 18 with TypeScript, bundled by Vite
- **Routing**: Wouter (lightweight client-side router) with three routes:
  - `/` — Public menu page (customer-facing)
  - `/admin` — Admin dashboard for managing menu sections, items, and metadata
  - `/pages` — Sitemap/navigation page
- **State Management**: TanStack React Query for server state (fetch, cache, mutations)
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives with Tailwind CSS
- **Styling**: Tailwind CSS with CSS custom properties for theming, custom romantic color palette
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`, `@assets/` maps to `attached_assets/`
- **QR Code**: `qrcode.react` library for generating shareable QR codes pointing to the site URL

### Backend (Express API)
- **Runtime**: Node.js with Express 5, written in TypeScript (executed via tsx)
- **API Structure**: RESTful endpoints under `/api/` prefix
  - `GET /api/public/menu` — Returns full menu (meta + sections + items) for public display
  - Admin endpoints for CRUD on menu meta, sections, and items
- **Route Definitions**: Shared route contracts in `shared/routes.ts` with Zod schemas for request/response validation
- **Storage Layer**: `IStorage` interface in `server/storage.ts` with `DatabaseStorage` implementation, enabling potential swap of storage backends
- **Auto-seeding**: On first run, if no menu sections exist, the server seeds default menu data (Entrada, Prato Principal, Sobremesa sections with sample items)

### Shared Code (`shared/`)
- **Schema**: `shared/schema.ts` defines all database tables and Zod validation schemas using Drizzle ORM + drizzle-zod
- **Routes**: `shared/routes.ts` defines API contract types and Zod response schemas shared between client and server

### Database
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL (required via `DATABASE_URL` environment variable)
- **Tables**:
  - `users` — Basic user table (legacy template, UUID primary key)
  - `menu_sections` — Menu categories (name, sort order, active flag)
  - `menu_items` — Individual dishes (name, description, price in KZ, section reference with cascade delete, sort order, active flag)
  - `menu_meta` — Single-row restaurant configuration (restaurant name, menu title, footer note, WhatsApp numbers, couple dinner prices)
- **Migrations**: Use `drizzle-kit push` (`npm run db:push`) to sync schema to database

### Build System
- **Development**: `tsx server/index.ts` with Vite dev server middleware (HMR via `/vite-hmr`)
- **Production Build**: Custom `script/build.ts` that runs Vite build for client and esbuild for server, outputting to `dist/`
- **Server in Production**: Serves static files from `dist/public/` with SPA fallback to `index.html`

### Key Design Decisions
1. **Shared Zod schemas**: Both client and server validate data against the same schemas, ensuring type safety across the stack
2. **Storage interface pattern**: The `IStorage` interface abstracts database access, making it testable and swappable
3. **No authentication**: The admin page is currently unprotected (no auth mechanism implemented)
4. **Single-row meta pattern**: Restaurant configuration uses a single-row table with upsert semantics
5. **Cascade deletes**: Deleting a menu section automatically removes all its items

## External Dependencies

- **PostgreSQL**: Primary database, connected via `DATABASE_URL` environment variable using `pg` (node-postgres) pool
- **Session Store**: `connect-pg-simple` is available for PostgreSQL-backed sessions (dependency present but not prominently used yet)
- **Google Fonts**: Fraunces and Manrope loaded via Google Fonts CDN in the CSS; DM Sans, Fira Code, Geist Mono loaded in `index.html`
- **WhatsApp Integration**: Deep links to WhatsApp (`wa.me`) for restaurant reservations using configured phone numbers
- **QR Code Generation**: Client-side QR code rendering via `qrcode.react` (canvas-based, downloadable as PNG)
- **Replit Plugins**: `@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-cartographer`, and `@replit/vite-plugin-dev-banner` for development on Replit