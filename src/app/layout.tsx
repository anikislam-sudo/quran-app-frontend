import type { Metadata } from 'next'
import './globals.css'
import { SettingsProvider } from '@/providers/SettingsProvider'
import { Header } from '@/components/Header'
import { SettingsSidebar } from '@/components/SettingsSidebar'

export const metadata: Metadata = {
  title: { default: 'Al-Quran', template: '%s · Al-Quran' },
  description: 'Read and explore the Holy Quran — Arabic text with English translation (Sahih International)',
  keywords: ['Quran', 'القرآن', 'Islam', 'Arabic', 'Translation', 'Surah', 'Ayah'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Amiri + Cormorant Garamond + Lora + Scheherazade New in one request */}
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cormorant+Garamond:wght@300;400;500;600;700&family=Lora:wght@400;500;600;700&family=Scheherazade+New:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-dvh geo-pattern">
        <SettingsProvider>
          <Header />
          <SettingsSidebar />
          <main className="pt-16 pb-20">{children}</main>
        </SettingsProvider>
      </body>
    </html>
  )
}
