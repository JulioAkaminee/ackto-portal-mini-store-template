import React from 'react'
import './styles.css'

export const metadata = {
  description: 'A mini store built with Payload and Neon.',
  title: 'Portal Mini Store',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased">
        <main className="mx-auto max-w-5xl px-6 py-12">{children}</main>
      </body>
    </html>
  )
}
