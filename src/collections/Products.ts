import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'price', 'status'],
  },
  access: {
    // The storefront reads products without a session, so read is public.
    // Everything else stays behind the admin's authentication.
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'The URL segment for this product: /products/<slug>.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      // Stored in cents. Floating point money accumulates rounding error the
      // moment you sum a cart, so the smallest unit is the integer of record
      // and formatting happens at the edge.
      name: 'priceInCents',
      label: 'Price (in cents)',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'R$ 49,90 is 4990.',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'stock',
      type: 'number',
      defaultValue: 0,
      min: 0,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      required: true,
      index: true,
    },
  ],
}
