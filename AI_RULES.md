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
