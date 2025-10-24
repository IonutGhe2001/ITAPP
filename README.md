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

### PDF Exports

The reports API uses a singleton Puppeteer browser that is started during server
initialisation. Ensure Chromium can be launched in your environment (either via the
bundled binary or by pointing `PUPPETEER_EXECUTABLE_PATH` to a system installation).
If the browser cannot start, PDF requests will automatically fall back to JSON
responses so CSV/JSON exports remain operational.

The API defaults to <http://localhost:8080> and the client to <http://localhost:3000>.

### Formatting

Run `npm run format` from the repository root to format all files with Prettier.

## Staging test login and tunnels

### Local staging bypass

The `/test-login` endpoint is only available when `NODE_ENV=staging` or when the
`AUTH_DISABLED` flag is enabled. For local automated checks you can bypass
authentication by starting the API with the flag set:

```bash
cd server
AUTH_DISABLED=true npm run dev
```

The endpoint issues a short-lived JWT cookie for `tester@local.test` and then
redirects to the URL defined in `FRONTEND_ROOT` (default
`http://localhost:3000`). The cookie is marked `HttpOnly; Secure; SameSite=None`
and expires after 10 minutes.

### Generating a test secret

When running against a shared staging environment keep `AUTH_DISABLED=false`
and provision a short secret for `TEST_LOGIN_SECRET`. A simple way to generate
one is:

```bash
openssl rand -hex 16
```

### Exercising the endpoint

You can trigger the bypass manually with `curl`. The example below assumes the
API is running on <http://localhost:8080> and that `AUTH_DISABLED=true` (omit the
`token` field or replace it with `TEST_LOGIN_SECRET` when authentication is
enabled):

```bash
curl -i \
  -X POST http://localhost:8080/test-login \
  -H "Content-Type: application/json" \
  -d '{"userEmail":"tester@local.test"}' \
  -c cookies.txt \
  -L
```

The `-c cookies.txt` flag persists the issued cookie so that it can be reused by
automated tools.

## Exposing the stack for staging tunnels

### Cloudflare Tunnel

The repository includes `cloudflared/config.yml` with a sample mapping for the
API (port 8080) and the web app (port 3000). Update the tunnel ID, credentials
path and hostnames, then run `cloudflared tunnel run`.

### ngrok

As an alternative, expose the services with ngrok:

```bash
ngrok http 8080 --host-header="localhost:8080"
ngrok http 3000 --host-header="localhost:3000"
```

Both commands enable HTTPS endpoints that are compatible with the CORS
configuration used by `/test-login`.