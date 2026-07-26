import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Real estate insights, buying guides, legal documents and lifestyle tips from OmShakthy Homes — top plot developers in Chennai.',
}

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 px-4 md:px-8 max-w-7xl mx-auto" style={{ backgroundColor: 'var(--paper)', color: 'var(--ink)' }}>
        <h1 className="text-4xl font-bold mb-8" style={{ fontFamily: 'var(--font-heading)', color: 'var(--brass)' }}>
          Blog
        </h1>
        <p style={{ color: 'var(--ink)' }}>
          Blog posts coming soon — powered by Sanity CMS.
        </p>
      </main>
      <Footer />
    </>
  )
}
