# ITAPP

ITAPP is a full‑stack application for managing IT equipment, employees and related workflows.
It consists of a React front end and an Express/Prisma back end that share a small set of
TypeScript utilities.

## File Uploads

The API supports uploading attachments for equipment with the following restrictions:

- **Documents:** only PDF files up to 5 MB.
- **Images:** only PNG or JPEG files up to 5 MB.

## Architecture

- **client/** – React + TypeScript + Vite front end.
- **server/** – Node.js/Express API with Prisma and PostgreSQL.
- **shared/** – shared TypeScript types used by both sides.

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
