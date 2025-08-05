# Client

This directory contains the React front end for ITAPP. It communicates with the
Express API in `../server`.

## Environment Variables

Create a `.env` file based on `.env.example` and configure the following:

- `VITE_API_URL` (**required**): Base URL of the backend API. During development the
  app falls back to `/api` if this variable is not defined.
- `VITE_SOCKET_URL` (optional): WebSocket server URL. Defaults to `VITE_API_URL`
  when not provided.

## Setup

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

See the [project README](../README.md) for an overview and additional details.
```
