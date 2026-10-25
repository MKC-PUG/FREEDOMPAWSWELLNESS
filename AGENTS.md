<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

### Project overview

Freedom Paws is a single Next.js 16.2.6 application (App Router, not a monorepo). It is a pet wellness app with three routes: `/` (dashboard), `/photobooth` (SuperBud Photo Booth), and `/mypets` (Tokenized Holistic Protocols). No database, no Docker, no external services required to run.

### Development commands

- **Package manager:** npm (lockfile: `package-lock.json`)
- **Dev server:** `npm run dev` (uses Turbopack by default; `npx next dev --webpack` for webpack mode)
- **Lint:** `npm run lint`
- **Build:** `npm run build`

### Known issues

- `app/page.tsx` has a pre-existing syntax error (duplicated function body outside of function scope, lines 35–60). This causes `npm run build` and `npm run lint` to fail. In Turbopack dev mode, the `/mypets` and `/photobooth` routes still compile and render correctly; only `/` (the home route) is broken.

### Environment variables

- `OPENAI_API_KEY` — optional, only needed for the `/api/analyze` AI image analysis endpoint. The rest of the app works without it.
