# Tech Stack

- You are building a Next.js application using the App Router, with Payload CMS on Postgres (Neon).
- Use TypeScript.
- Two route groups, and they do not mix:
  - `src/app/(frontend)/` — the storefront the public sees. `page.tsx` is the default page.
  - `src/app/(payload)/` — Payload's admin and REST/GraphQL API. Do NOT hand-edit these files; Payload owns them.
- UPDATE `src/app/(frontend)/page.tsx` to include the new components. OTHERWISE, the user can NOT see any components!
- Server Components are the default. Add "use client" as the FIRST line of a file only when it needs state, effects, or event handlers.
- Tailwind CSS 4: always use Tailwind for styling. There is no `tailwind.config` — the entry is `@import 'tailwindcss'` in `src/app/(frontend)/styles.css`.
- shadcn/ui is NOT pre-installed in this template.
- Use next/link for navigation and next/image for images.

## Data

- Collections live in `src/collections/` and are registered in `src/payload.config.ts`. Adding a field means editing the collection, nothing else.
- Read data in Server Components with the local API — no HTTP round trip:

```ts
import config from '@/payload.config'
import { getPayload } from 'payload'

const payload = await getPayload({ config: await config })
const { docs } = await payload.find({ collection: 'products', limit: 10 })
```

- `payload-types.ts` is generated. After changing a collection run `npm run generate:types`; never edit that file by hand.
- Money is stored as integer cents (`priceInCents`). Format it at the edge with `formatPrice` from `src/lib/format.ts`. Never store money as a float — summing a cart accumulates rounding error.

## Migrations

- The database schema is managed by migration files in `src/migrations/`, and `push` is off in `payload.config.ts`.
- After changing a collection, create a migration: Ackto's "Create migration" button runs `npm run migrate:create -- --skip-empty`. Apply with `npm run migrate`.
- NEVER hand-write SQL migration files. NEVER change the schema by connecting to the database directly.

## Secrets

- `DATABASE_URL` and `PAYLOAD_SECRET` live in `.env` only. They are server-only.
- NEVER reference `process.env.DATABASE_URL` from a Client Component or from any file that reaches the browser bundle. It grants full read/write access to the database.
- Public products are readable without a session because the `products` collection sets `read: () => true`. Any collection holding private data must NOT do that.

## Design System — Ackto

This project ships the Ackto palette. Keep it: it is what makes a generated app
look like it came from Ackto instead of from a default shadcn install.

- **Never write a hex value, and never use Tailwind's stock colour classes**
  (`bg-gray-100`, `text-slate-600`, `bg-white`, `text-black`). Every colour has
  a semantic token. Use `bg-background`, `text-foreground`,
  `text-muted-foreground`, `bg-card`, `bg-muted`, `bg-primary`,
  `text-primary-foreground`, `border-border`.
- The tokens live in `src/app/(frontend)/styles.css`. This project is on
  Tailwind v4: utility names are mapped in the `@theme inline` block, and the
  actual colours are re-declared per theme in `:root` / `.dark` / the
  `prefers-color-scheme` block. To add a colour, add the custom property to all
  three theme blocks and map it once inside `@theme inline` — do not inline it
  in a component, and do not put the literal colour in `@theme` (it would
  freeze at its light value).
- Brand colours: Sapphire Sky `#266DD3` is the primary accent (already
  `--primary`), Charcoal Blue `#344055` is ink, Thistle `#CFB3CD` is a soft
  accent and never a second primary button. `brand-*` classes
  (`bg-brand-sapphire`, `text-brand-thistle`) exist for when the brand appears
  AS the brand; use the semantic tokens for everything else. The storefront is
  the SHOP's identity, not Ackto's — do not put the Ackto mark in its header.
- Radius: `rounded-ackto` (14px) is the house corner. Use it for cards, media
  and panels instead of arbitrary pixel values.
- Motion: `ease-ackto-out` at 180ms is the house transition. Always let
  reduced-motion users out (`motion-reduce:transition-none`).
- Contrast is not optional: body text must clear 4.5:1 against its background,
  and borders on inputs and focus rings must clear 3:1. The tokens already do;
  keep it that way if you introduce a new pairing.
- Avoid gradient backgrounds, glassmorphism and decorative blur. The house style
  is calm and precise: flat brand surfaces, real hierarchy, restrained motion.
