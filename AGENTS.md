# AGENTS.md

## Cursor Cloud specific instructions

### Product overview

**11diez** is a single Next.js 16 + TypeScript frontend app (not a monorepo). The home page lives at `src/app/page.tsx`. There is no backend, database, Docker, or required environment variables on `main`.

### Services

| Service | Required | Start command | URL |
|---------|----------|---------------|-----|
| Next.js dev server | Yes | `npm run dev` | http://localhost:3000 |

### Standard commands

See `README.md` and `package.json` scripts:

- **Install deps:** `npm install`
- **Dev server:** `npm run dev`
- **Lint:** `npm run lint`
- **Build:** `npm run build`
- **Production server:** `npm run build` then `npm start`

### Notes for cloud agents

- **Node.js:** Requires Node.js 20+ (Node 22 works). Use **npm** (`package-lock.json` is present).
- **No test suite:** There is no Jest/Vitest/Playwright config on `main`; lint + build + manual browser check are the verification steps.
- **No secrets:** No `.env` files or `process.env` usage in source on `main`.
- **Dev server:** Run `npm run dev` in a tmux session if you need a long-lived process; it binds to port 3000 by default.
- **Remote branch:** `origin/cursor/configure-contentful-mcp-7236` adds Cursor MCP config for Contentful only; it does not affect app runtime on `main`.
