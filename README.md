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

The API defaults to <http://localhost:5000> and the client to <http://localhost:5173>.

### Formatting

Run `npm run format` from the repository root to format all files with Prettier.