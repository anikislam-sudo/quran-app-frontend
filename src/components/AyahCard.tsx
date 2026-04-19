'use client'

import { useSettings } from '@/providers/SettingsProvider'
import type { Verse } from '@/lib/types'
import clsx from 'clsx'

interface AyahCardProps {
  verse: Verse
  surahId: number
  highlight?: string  // word to highlight in translation (for search)
}

export function AyahCard({ verse, highlight }: AyahCardProps) {
  const { settings } = useSettings()

  const arabicClass = settings.arabicFont === 'amiri' ? 'arabic-amiri' : 'arabic-scheherazade'

  // Highlight search term in translation
  const translationContent = highlight
    ? highlightText(verse.translation, highlight)
    : verse.translation

  return (
    <article
      className="card relative"
      style={{ padding: '1.5rem 1.25rem' }}
      id={`verse-${verse.id}`}
    >
      {/* Verse number badge — top left */}
      <div className="flex items-center justify-between mb-4">
        <span className="verse-num">{verse.id}</span>

        {/* Reference */}
        <span className="text-xs font-lora" style={{ color: 'var(--cream-dim)' }}>
          Verse {verse.id}
        </span>
      </div>

      {/* Arabic text */}
      <p
        className={clsx('text-right leading-loose', arabicClass)}
        dir="rtl"
        lang="ar"
        style={{
          fontSize: settings.arabicFontSize,
          color: 'var(--cream)',
          marginBottom: '1.25rem',
        }}
      >
        {verse.text}
      </p>

      {/* Separator */}
      <div className="gold-line mb-4" />

      {/* Translation */}
      <p
        className="font-lora leading-relaxed"
        style={{
          fontSize: settings.translationFontSize,
          color: 'var(--cream-muted)',
        }}
        dangerouslySetInnerHTML={highlight ? { __html: translationContent as string } : undefined}
      >
        {!highlight ? translationContent : undefined}
      </p>

      {/* Transliteration (if available) */}
      {verse.transliteration && (
        <p
          className="mt-2 italic font-lora text-xs"
          style={{ color: 'var(--cream-dim)' }}
        >
          {verse.transliteration}
        </p>
      )}
    </article>
  )
}

/** Wrap matched substrings with a <mark> span */
function highlightText(text: string, query: string): string {
  if (!query.trim()) return text
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return text.replace(
    new RegExp(`(${escaped})`, 'gi'),
    '<mark style="background:rgba(201,165,53,0.28);color:var(--gold-light);border-radius:3px;padding:0 2px;">$1</mark>'
  )
}
