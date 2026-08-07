import config from '@/payload.config'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'

import { formatPrice } from '@/lib/format'

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayload({ config: await config })

  const { docs } = await payload.find({
    collection: 'products',
    where: {
      // Both conditions matter: without the status check an unpublished
      // product stays reachable by guessing its slug.
      and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }],
    },
    limit: 1,
    depth: 1,
  })

  const product = docs[0]
  if (!product) notFound()

  const image = typeof product.image === 'object' ? product.image : null

  return (
    <article>
      <Link className="text-sm text-gray-600 underline underline-offset-4" href="/">
        ← Back
      </Link>

      <div className="mt-6 grid gap-8 sm:grid-cols-2">
        {image?.url ? (
          <Image
            alt={image.alt ?? product.title}
            className="w-full rounded-lg object-cover"
            height={image.height ?? 640}
            src={image.url}
            width={image.width ?? 640}
          />
        ) : (
          <div className="aspect-square w-full rounded-lg bg-gray-100" />
        )}

        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{product.title}</h1>
          <p className="mt-2 text-xl">{formatPrice(product.priceInCents)}</p>

          {product.description ? (
            <p className="mt-6 whitespace-pre-line text-gray-700">{product.description}</p>
          ) : null}

          <p className="mt-6 text-sm text-gray-500">
            {product.stock && product.stock > 0
              ? `${product.stock} in stock`
              : 'Out of stock'}
          </p>
        </div>
      </div>
    </article>
  )
}
