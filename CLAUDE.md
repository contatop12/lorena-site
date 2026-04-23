# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev            # Next.js dev server (hot reload, no Cloudflare runtime)
pnpm build          # Production build via opennextjs-cloudflare (for deploy)
pnpm build:next     # Next.js build only (faster, skips Cloudflare packaging)
pnpm preview        # Build + run locally inside the Cloudflare Workers runtime
pnpm deploy         # Build + deploy to Cloudflare Workers
pnpm lint           # ESLint
pnpm cf:typegen     # Regenerate cloudflare-env.d.ts from wrangler.jsonc bindings
```

There are no tests in this project.

## Architecture

**Stack**: Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui · Cloudflare Workers (via `@opennextjs/cloudflare`)

**Pages** (both are `"use client"` components — no RSC logic):
- `app/page.tsx` — main landing page
- `app/problemas-com-voo/page.tsx` — secondary landing page, structurally near-identical to the main page

**API**:
- `app/api/webhook/lead/route.ts` — thin relay that proxies lead payloads to an external CRM webhook, adding a `Bearer` token. Both `WEBHOOK_URL` and `WEBHOOK_TOKEN` env vars must be set; the token has no fallback and causes a 500 if missing.

**Lead capture flow**:
1. User fills the modal form (name + WhatsApp).
2. `window.trackLeadHighQuality` is called — fires a `Lead` event through `window.MetaTracker` (Meta CAPI, loaded from `track.lcoadv.com.br/trackerjs`). Returns an `event_id`.
3. Browser opens WhatsApp (`wa.me/5561996327789`).
4. The same `event_id` is fire-and-forgotten to `/api/webhook/lead` for CRM ingestion and CAPI deduplication. Errors are silently swallowed so they never interrupt the user flow.

**Styling**:
- Tailwind CSS v4 — config lives entirely in `app/globals.css` (no `tailwind.config.*` file).
- Brand palette: gold `#C5A059` / `#D4AF37`, graphite `#1A1A1A` / `#2D2D2D`. Defined as CSS custom properties and `@theme` tokens.
- Fonts: **Playfair Display** (`font-serif`) for headings, **Inter** (`font-sans`) for body.
- shadcn/ui components are in `components/ui/` (new-york style, lucide icons).

**Deployment**: Cloudflare Workers. `wrangler.jsonc` defines the worker name (`lorena-site`). Environment variables for production are set as Wrangler secrets. For local Cloudflare preview (`pnpm preview`), create a `.dev.vars` file (see `.dev.vars.example`).

**Note**: `next.config.mjs` sets `typescript.ignoreBuildErrors: true`, so TypeScript errors won't block builds.
