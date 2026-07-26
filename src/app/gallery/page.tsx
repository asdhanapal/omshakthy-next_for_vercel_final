import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Photo and video gallery of OmShakthy Homes projects across Chennai.',
}

export default function GalleryPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 px-4 md:px-8 max-w-7xl mx-auto" style={{ backgroundColor: 'var(--paper)', color: 'var(--ink)' }}>
        <h1 className="text-4xl font-bold mb-8" style={{ fontFamily: 'var(--font-heading)', color: 'var(--brass)' }}>
          Gallery
        </h1>
        <p style={{ color: 'var(--ink)' }}>
          Gallery — images and videos coming soon via CMS.
        </p>
      </main>
      <Footer />
    </>
  )
}
