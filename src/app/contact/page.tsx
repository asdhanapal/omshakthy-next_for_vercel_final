import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with OmShakthy Homes. Visit our office at Ekkaduthangal, Chennai or call +91 44 4030 3040 for site visits and inquiries.',
}

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 px-4 md:px-8 max-w-7xl mx-auto" style={{ backgroundColor: 'var(--paper)', color: 'var(--ink)' }}>
        <h1 className="text-4xl font-bold mb-8" style={{ fontFamily: 'var(--font-heading)', color: 'var(--brass)' }}>
          Contact Us
        </h1>
        <div className="max-w-2xl space-y-4">
          <p style={{ color: 'var(--ink)' }}>
            <strong>OmShakthy Agencies (Madras) Private Ltd.</strong><br />
            OmShakthy Tower — 1N1, Jawaharlal Nehru Salai,<br />
            Ekkaduthangal, Chennai 600 032
          </p>
          <p>
            <a href="tel:04440303040" style={{ color: 'var(--brass)' }}>044 40303040</a>
            {' · '}
            <a href="mailto:marketing@omshakthy.net" style={{ color: 'var(--brass)' }}>marketing@omshakthy.net</a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
