import { getOrganizationSchema } from '@/lib/schema-org'
import HomeClient from '@/components/ui/HomeClient'

export default function Home() {
  const jsonLd = getOrganizationSchema()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient />
    </>
  )
}
