# ITAPP

**ITAPP** is a comprehensive IT Asset Management system designed to streamline IT operations within organizations. It provides a centralized platform for managing IT equipment inventory, employee onboarding, equipment assignments, and tracking the complete lifecycle of IT assets from acquisition to retirement.

## What Does ITAPP Do?

ITAPP helps IT departments and organizations:

- **Track IT Assets**: Maintain a complete inventory of all IT equipment including laptops, desktops, monitors, peripherals, and other devices with detailed specifications (CPU, RAM, storage, OS, serial numbers, warranty dates)
- **Manage Employees**: Keep track of employee information, job roles, contact details, and their assigned equipment
- **Equipment Lifecycle Management**: Handle equipment assignments, returns, replacements, and track equipment status (functional, defective, in repair)
- **Generate Official Documents**: Automatically create "Procese Verbale" (official handover documents) for equipment transfers, assignments, and returns with digital signatures
- **Employee Onboarding**: Streamline the onboarding process with department-specific checklists, license assignments, and equipment provisioning
- **Purchase Requests**: Manage equipment procurement requests with status tracking (pending, ordered, delivered)
- **Reporting & Analytics**: Generate comprehensive reports with PDF/CSV/JSON exports, visualize equipment distribution, track warranty expirations, and monitor department-level metrics
- **Real-time Updates**: WebSocket-based notifications for equipment changes and system updates
- **Session Management**: Track user sessions with detailed device information, geolocation, and security monitoring
- **Search & Discovery**: Advanced search functionality across equipment and employee data
- **Multi-language Support**: Built-in internationalization (i18n) support

## Technologies Used

### Frontend

- **React 18** - Modern UI library with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **React Router v7** - Client-side routing with code splitting
- **TanStack Query (React Query)** - Server state management and caching
- **Axios** - HTTP client for API communication
- **Socket.IO Client** - Real-time WebSocket communication
- **Tailwind CSS** - Utility-first CSS framework with custom theming
- **Radix UI** - Accessible component primitives (Dialog, Dropdown, Select, Tabs, Toast)
- **shadcn/ui** - Component library built on Radix UI
- **Lucide React** - Icon library
- **Chart.js** with **react-chartjs-2** and **Recharts** - Data visualization
- **i18next** - Internationalization framework
- **React Day Picker** - Date selection component
- **QR Code React** - QR code generation
- **React Signature Canvas** - Digital signature capture
- **Vitest** - Unit testing framework
- **React Testing Library** - Component testing utilities
- **PWA Support** - Progressive Web App capabilities with Vite Plugin PWA

### Backend

- **Node.js** with **Express 4** - Web application framework
- **TypeScript** - Type-safe server-side development
- **Prisma 6** - Next-generation ORM for database access
- **PostgreSQL** - Primary relational database
- **JSON Web Tokens (JWT)** - Authentication and authorization
- **bcrypt** - Password hashing
- **Socket.IO** - Real-time bidirectional communication
- **Puppeteer** - Headless Chrome for PDF generation
- **Handlebars** - PDF template rendering
- **Multer** - File upload handling
- **Winston** - Logging infrastructure
- **Helmet** - Security middleware for HTTP headers
- **CORS** - Cross-Origin Resource Sharing configuration
- **Express Rate Limit** - API rate limiting
- **Compression** - Response compression middleware
- **Joi** and **Zod** - Request validation schemas
- **XLSX** - Excel file import/export
- **geoip-lite** - IP geolocation for session tracking
- **ua-parser-js** - User agent parsing for device detection
- **Jest** - Testing framework with Supertest for API testing
- **ts-node-dev** - Development server with hot reload

### Development Tools

- **Prettier** - Code formatting with Tailwind CSS plugin
- **ESLint** - TypeScript/React linting
- **Git** - Version control
- **Cloudflare Tunnel** - Secure staging deployment infrastructure

## File Uploads

The API supports uploading attachments for equipment with the following restrictions:

- **Documents:** only PDF files up to 5 MB.
- **Images:** only PNG or JPEG files up to 5 MB.

## Architecture

ITAPP follows a modern full-stack architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  React SPA (Vite) - TypeScript - TailwindCSS - Socket.IO   │
│        Pages → Features → Components → Services             │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST + WebSocket
┌────────────────────────┴────────────────────────────────────┐
│                        Server Layer                          │
│   Express API - TypeScript - Middleware - WebSocket Server  │
│     Routes → Controllers → Services → Validators            │
└────────────────────────┬────────────────────────────────────┘
                         │ Prisma ORM
┌────────────────────────┴────────────────────────────────────┐
│                      Database Layer                          │
│              PostgreSQL - Relational Data Model              │
└─────────────────────────────────────────────────────────────┘
```

### Project Structure

- **`client/`** – React frontend application
  - `src/pages/` - Top-level page components (Dashboard, Login, Profile, Search)
  - `src/features/` - Feature modules (equipment, employees, events, onboarding, purchase requests)
  - `src/components/` - Reusable UI components (shadcn/ui components)
  - `src/layouts/` - Application layout components
  - `src/services/` - API client services
  - `src/hooks/` - Custom React hooks
  - `src/context/` - React context providers (Auth, Theme)
  - `src/i18n/` - Internationalization configuration and translations
  - `src/utils/` - Utility functions

- **`server/`** – Node.js/Express backend
  - `src/routes/` - API route definitions
  - `src/controllers/` - Request handlers and business logic
  - `src/services/` - Reusable business logic and data access
  - `src/middlewares/` - Express middleware (auth, error handling, validation)
  - `src/validators/` - Request validation schemas (Joi/Zod)
  - `src/lib/` - Core utilities (logger, PDF renderer, WebSocket)
  - `src/types/` - TypeScript type definitions
  - `src/utils/` - Helper functions
  - `prisma/` - Database schema and migrations
  - `tests/` - Jest test suites

- **`shared/`** – Shared TypeScript types between client and server

### Key Architectural Patterns

**Feature-Based Organization**: The client follows a feature-based folder structure where related components, hooks, and services are co-located, improving maintainability and discoverability.

**Layered Architecture**: The server implements a clear separation between routes, controllers, and services, following the principle of single responsibility.

**Type Safety**: Both client and server are written in TypeScript with shared types, ensuring end-to-end type safety across the API boundary.

**Real-time Communication**: WebSocket integration enables instant updates across connected clients when equipment or employee data changes.

**Secure by Default**: Multiple security layers including JWT authentication, HTTP security headers (Helmet), CORS configuration, rate limiting, and secure session management.

**API-First Design**: RESTful API design with consistent patterns, proper HTTP status codes, and comprehensive error handling.

## Best Practices Implemented

### Code Organization

- **Feature modules** - Related code grouped by feature/domain
- **Consistent naming** - Clear, descriptive names following TypeScript/React conventions
- **Component composition** - Small, reusable components with single responsibilities
- **Custom hooks** - Reusable stateful logic extracted into custom hooks
- **Type definitions** - Comprehensive TypeScript types for all entities and API contracts

### Security

- **Password hashing** - bcrypt for secure password storage
- **JWT authentication** - Secure token-based authentication with HTTP-only cookies
- **Input validation** - Joi/Zod schemas for all API inputs
- **SQL injection protection** - Prisma ORM parameterized queries
- **XSS prevention** - React's built-in XSS protection
- **CSRF protection** - SameSite cookie attributes
- **Security headers** - Helmet middleware for HTTP security headers
- **Rate limiting** - Protection against brute force attacks
- **Session tracking** - Detailed session management with device fingerprinting

### Performance

- **Code splitting** - React.lazy() for route-based code splitting
- **Data caching** - TanStack Query for intelligent client-side caching
- **Response compression** - gzip compression for API responses
- **Database indexing** - Strategic indexes on frequently queried fields
- **Connection pooling** - Prisma connection pool management
- **Pagination** - Efficient data fetching for large datasets

### Developer Experience

- **Hot reload** - Fast development iteration with ts-node-dev and Vite HMR
- **Type safety** - End-to-end TypeScript coverage
- **Code formatting** - Automatic formatting with Prettier
- **Linting** - ESLint for code quality enforcement
- **Testing** - Jest and Vitest for unit and integration tests
- **Environment configuration** - Separate .env files for different environments

### Data Management

- **ORM-based access** - Prisma for type-safe database operations
- **Migration system** - Version-controlled database schema changes
- **Seed data** - Scripts for development and staging data population
- **Soft deletes** - Where appropriate, preserve data integrity
- **Audit trails** - Track changes to critical entities (EquipmentChange model)

## Setup

### Prerequisites

- Node.js and npm
- PostgreSQL instance for the server
- System dependencies required by Chromium if you plan to use PDF exports (see the
  [Puppeteer troubleshooting guide](https://pptr.dev/troubleshooting) for the list of
  packages on your platform)

### Client

```bash
cd client
cp .env.example .env   # update VITE_API_URL if needed
npm install
npm run dev
```

### Server

```bash
cd server
cp .env.example .env   # set DATABASE_URL, JWT_SECRET, etc.
npm install
npm run dev
```

### Environment configuration

The project keeps environment variables close to the code that consumes them:

- `client/.env` – values read by Vite at build/dev time (prefixed with `VITE_`).
- `server/.env` – runtime configuration for the Express API.
- `shared/` does not require additional variables.

Copy the provided `.env.example` files whenever you set up a new environment and
adjust only the variables that differ from local development.

#### Local development (localhost)

1. `cd client && cp .env.example .env`
2. `cd server && cp .env.example .env`
3. Ensure the following key values are present (the examples below are already
   baked into the default `.env` files):

   ```ini
   # client/.env
   VITE_API_URL=http://localhost:8080/api

   # server/.env
   NODE_ENV=development
   FRONTEND_ROOT=http://localhost:5173
   CORS_ORIGIN=http://localhost:5173,http://localhost:3000
   AUTH_DISABLED=false
   ```

The server uses these values to accept requests from the local Vite dev server
and to redirect development login flows back to the client.

#### Staging / production

When publishing the stack, update the same files with public hostnames:

- `client/.env` → point `VITE_API_URL` to the deployed API (including `/api`).
- `server/.env` → set `NODE_ENV=production` (or `staging`), configure
  `FRONTEND_ROOT`/`CORS_ORIGIN` with the deployed front-end origin, provide
  strong secrets (`JWT_SECRET`, optional `TEST_LOGIN_SECRET`), and switch the
  database URL to the managed instance.

Keep `AUTH_DISABLED=false` in production. Only enable the automated login flow
(`AUTH_DISABLED=true`) on ephemeral staging environments that are protected by
other means (e.g. Cloudflare Access).

### PDF Exports

The reports API uses a singleton Puppeteer browser that is started during server
initialisation. Ensure Chromium can be launched in your environment (either via the
bundled binary or by pointing `PUPPETEER_EXECUTABLE_PATH` to a system installation).
If the browser cannot start, PDF requests will automatically fall back to JSON
responses so CSV/JSON exports remain operational.

The API defaults to <http://localhost:8080> and the client to <http://localhost:3000>.

### Formatting

Run `npm run format` from the repository root to format all files with Prettier.

## Staging via Cloudflare Tunnel

Staging deployments rely on a Cloudflare Tunnel that publishes
`api-staging.<domeniu>.com` for the API and `app-staging.<domeniu>.com` for the
client. The `/test-login` endpoint remains gated behind
`NODE_ENV=staging`/`AUTH_DISABLED=true` and issues a `token` cookie marked as
`HttpOnly`, `Secure`, `SameSite=None` with a 10 minute TTL before redirecting to
`FRONTEND_ROOT`.

### Environment preparation

1. Copy the `.env.example` files and provide staging values:

   ```bash
   cd server
   cp .env.example .env
   # Minimum staging configuration
   NODE_ENV=staging
   FRONTEND_ROOT=https://app-staging.<domeniu>.com
   CORS_ORIGIN=https://app-staging.<domeniu>.com
   TEST_LOGIN_SECRET=$(openssl rand -hex 16)
   npm install
   ```

2. Seed the dedicated tester account (password defaults to `staging-login` or
   the value provided in `STAGING_TESTER_PASSWORD`):

   ```bash
   npm run seed:staging-tester
   ```

### Cloudflare Tunnel configuration

Update `cloudflared/config.yml` with your tunnel ID and credentials file. The
default mapping publishes both staging hostnames:

```yaml
tunnel: <YOUR_TUNNEL_ID>
credentials-file: /home/user/.cloudflared/<YOUR_TUNNEL_ID>.json

ingress:
  - hostname: api-staging.<domeniu>.com
    service: http://localhost:8080
  - hostname: app-staging.<domeniu>.com
    service: http://localhost:3000
  - service: http_status:404
```

### DNS records

Create two CNAME records in Cloudflare DNS:

- `api-staging` → `<YOUR_TUNNEL_ID>.cfargotunnel.com`
- `app-staging` → `<YOUR_TUNNEL_ID>.cfargotunnel.com`

Both entries must be proxied (orange cloud enabled) so Cloudflare terminates
TLS and attaches the correct host headers.

### Running the stack

1. Start the API in staging mode:

```bash
   cd server
   NODE_ENV=staging npm run dev
   ```

2. Build and serve the client pointing at the staging API:

```bash
   cd client
   npm install
   VITE_API_URL=https://api-staging.<domeniu>.com/api npm run build
   npm run preview -- --host 0.0.0.0 --port 3000
   ```

3. Launch the tunnel:

```bash
   cd cloudflared
   cloudflared tunnel run
   ```

### Verifying the staging login bypass

With the tunnel active, confirm the flow with `curl` while persisting the
session cookie:

```bash
curl -i \
  -X POST https://api-staging.<domeniu>.com/test-login \
  -H "Content-Type: application/json" \
  -d '{"token":"'$TEST_LOGIN_SECRET'","userEmail":"tester@local.test"}' \
  --cookie-jar staging.cookies \
  -L

curl -i \
  https://api-staging.<domeniu>.com/api/auth/me \
  --cookie staging.cookies
```

The first command receives the `302` redirect to `FRONTEND_ROOT` while storing
the JWT in `staging.cookies`. The second command reuses the cookie to confirm
that `/api/auth/me` recognises the staged tester session.