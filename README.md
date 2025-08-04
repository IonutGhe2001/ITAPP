# ITAPP

ITAPP is a full‑stack application for managing IT equipment, employees and related workflows.
It consists of a React front end and an Express/Prisma back end that share a small set of
TypeScript utilities.

## Architecture

- **client/** – React + TypeScript + Vite front end.
- **server/** – Node.js/Express API with Prisma and PostgreSQL.
- **shared/** – shared TypeScript types used by both sides.

## Setup

### Prerequisites

- Node.js and npm
- PostgreSQL instance for the server

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

The API defaults to <http://localhost:5000> and the client to <http://localhost:5173>.

### Formatting

Run `npm run format` from the repository root to format all files with Prettier.