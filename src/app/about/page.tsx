import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'OmShakthy Agencies (Madras) Private Limited — incorporated in 1991 to consolidate land for future projects. Over 30 years of trust in Chennai real estate.',
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 px-4 md:px-8 max-w-7xl mx-auto" style={{ backgroundColor: 'var(--paper)', color: 'var(--ink)' }}>
        <h1 className="text-4xl font-bold mb-8" style={{ fontFamily: 'var(--font-heading)', color: 'var(--brass)' }}>
          About Us
        </h1>
        <p className="leading-relaxed max-w-3xl" style={{ color: 'var(--ink)' }}>
          OmShakthy Agencies (Madras) Private Limited was incorporated in 1991 with the purpose
          to consolidate land for future projects including Industries, Special Economic Zones,
          and residential spaces around prime locations in Chennai. With over 30 years of experience,
          we have served more than 20,000 families and aggregated over 5,000 acres.
        </p>
      </main>
      <Footer />
    </>
  )
}
