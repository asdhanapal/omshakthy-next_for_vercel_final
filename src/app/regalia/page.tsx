import type { Metadata } from 'next'
import RegaliaContent from '@/components/ui/RegaliaContent'
import Header from '@/components/layout/Header'

export const metadata: Metadata = {
  title: 'OmShakthy Regalia — Luxury Gated Community in Avadi',
  description:
    'OmShakthy Regalia is a premium RERA-registered gated community in Avadi, Chennai. DTCP approved plots with clear title. RERA ID TN/1/Layout/2490/2025.',
  openGraph: {
    title: 'OmShakthy Regalia — Luxury Gated Community',
    description: 'Premium gated community in Avadi, Chennai. RERA registered, DTCP approved.',
  },
}

export default function RegaliaPage() {
  return (
    <>
      <Header />
      <RegaliaContent />
    </>
  )
}
