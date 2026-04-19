export interface Surah {
  id: number
  name: string
  transliteration: string
  translation: string
  type: 'meccan' | 'medinan'
  total_verses: number
}

export interface Verse {
  id: number
  text: string
  translation: string
  transliteration?: string
}

export interface SurahDetail extends Surah {
  verses: Verse[]
}

export interface SearchResult {
  surah_id: number
  surah_name: string
  surah_transliteration: string
  surah_translation: string
  verse_id: number
  text: string
  translation: string
  transliteration?: string
}

export type ArabicFont = 'amiri' | 'scheherazade'

export interface Settings {
  arabicFont: ArabicFont
  arabicFontSize: number       // 20–56 px
  translationFontSize: number  // 13–24 px
}

export const DEFAULT_SETTINGS: Settings = {
  arabicFont: 'amiri',
  arabicFontSize: 30,
  translationFontSize: 16,
}
