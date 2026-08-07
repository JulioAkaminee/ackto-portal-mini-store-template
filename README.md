# Ackto Portal: Mini Store Template

A store with a real content backend: **Next.js 16 + Payload CMS 3 + Postgres (Neon)**.

> **Experimental.** It needs a Neon database — Ackto connects one when you create
> the app from this template.

## What is here

```
src/
  app/
    (frontend)/          the storefront
      page.tsx             lists published products
      products/[slug]/     product detail
      styles.css           Tailwind 4 entry
    (payload)/           Payload's admin + REST/GraphQL API — Payload owns these
  collections/
    Users.ts  Media.ts  Products.ts
  migrations/            schema history; push is off
  payload.config.ts
  lib/format.ts
tools/                   the component tagger loader
```

## Running it

```bash
cp .env.example .env     # Ackto fills DATABASE_URL in for you
pnpm install
pnpm migrate             # apply the schema
pnpm dev                 # storefront at /, admin at /admin
```

The first visit to `/admin` asks you to create the first user.

## Schema changes go through migrations

`push` is off in `payload.config.ts`, so the database is never mutated behind
your back. After editing a collection:

```bash
pnpm migrate:create -- --skip-empty
pnpm migrate
```

Ackto's **Create migration** button runs exactly the first command.

## Money

Prices are integer cents (`priceInCents`), formatted only at the edge by
`formatPrice`. Floats accumulate rounding error the moment you sum a cart, so
the smallest unit is the integer of record.

## The component tagger

`tools/ackto-tagger-loader.mjs` stamps `data-ackto-id` and `data-ackto-name`
onto every JSX element **in development only**, which is how Ackto's preview
maps a clicked element back to its source. It is wired through
`turbopack.rules` in `next.config.ts` and lives in this repository rather than
in a published package.

## Notes

`AI_RULES.md` describes the conventions this template expects, and Ackto reads
it as part of the system prompt when working on an app created from here.
