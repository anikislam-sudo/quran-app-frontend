import type { Metadata } from 'next'
import { fetchAllSurahs } from '@/lib/api'
import { SurahListClient } from './SurahListClient'

export const metadata: Metadata = {
  title: 'Surah List',
  description: 'Browse all 114 surahs of the Holy Quran with Arabic and English names',
}

// Runs at build time — fetches from the Hono backend
export default async function HomePage() {
  const surahs = await fetchAllSurahs()
  return <SurahListClient surahs={surahs} />
}
