import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Thambuli, Saaru & Bajji',
  description: 'Amma\'s recipes — generations of home cooking from one Karnataka kitchen.',
  openGraph: {
    title: 'Thambuli, Saaru & Bajji',
    description: 'Amma\'s recipes — generations of home cooking from one Karnataka kitchen.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
