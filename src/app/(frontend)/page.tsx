import config from '@/payload.config'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import { formatPrice } from '@/lib/format'

/**
 * Rendered per request, not at build time.
 *
 * Two reasons, and either one is enough. A prerendered storefront freezes the
 * catalogue into the build: publish a product in the admin and nobody sees it
 * until the next deploy. And prerendering makes `next build` open a database
 * connection, so the build fails outright wherever DATABASE_URL is not
 * reachable — CI, a fresh clone, any environment that builds before it has a
 * database.
 */
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payload = await getPayload({ config: await config })

  const { docs: products } = await payload.find({
    collection: 'products',
    where: { status: { equals: 'published' } },
    sort: 'title',
    limit: 24,
    depth: 1,
  })

  return (
    <div>
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">Portal Mini Store</h1>
        <p className="mt-2 text-muted-foreground">
          Products come from Payload. Add them in{' '}
          <Link
            className="text-primary underline underline-offset-4"
            href="/admin"
          >
            the admin
          </Link>{' '}
          and publish one to see it here.
        </p>
      </header>

      {products.length === 0 ? (
        <p className="rounded-ackto border border-dashed border-border p-10 text-center text-muted-foreground">
          No published products yet.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const image = typeof product.image === 'object' ? product.image : null

            return (
              <li
                key={product.id}
                className="overflow-hidden rounded-ackto border border-border bg-card transition-colors duration-200 ease-ackto-out hover:border-primary motion-reduce:transition-none"
              >
                <Link href={`/products/${product.slug}`}>
                  {image?.url ? (
                    <Image
                      alt={image.alt ?? product.title}
                      className="h-48 w-full object-cover"
                      height={image.height ?? 384}
                      src={image.url}
                      width={image.width ?? 512}
                    />
                  ) : (
                    <div className="h-48 w-full bg-muted" />
                  )}
                  <div className="p-4">
                    <h2 className="font-medium text-card-foreground">{product.title}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatPrice(product.priceInCents)}
                    </p>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
