'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { Settings, ArabicFont } from '@/lib/types'
import { DEFAULT_SETTINGS } from '@/lib/types'

interface SettingsContextValue {
  settings: Settings
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  setArabicFont: (font: ArabicFont) => void
  setArabicFontSize: (size: number) => void
  setTranslationFontSize: (size: number) => void
  resetSettings: () => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Hydrate from localStorage after mount
  useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem('quran-settings')
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<Settings>
        setSettings((prev) => ({ ...prev, ...parsed }))
      }
    } catch {
      // ignore malformed data
    }
  }, [])

  const save = useCallback((next: Settings) => {
    setSettings(next)
    try {
      localStorage.setItem('quran-settings', JSON.stringify(next))
    } catch {
      // ignore storage errors
    }
  }, [])

  const setArabicFont = useCallback(
    (font: ArabicFont) => save({ ...settings, arabicFont: font }),
    [settings, save]
  )
  const setArabicFontSize = useCallback(
    (size: number) => save({ ...settings, arabicFontSize: size }),
    [settings, save]
  )
  const setTranslationFontSize = useCallback(
    (size: number) => save({ ...settings, translationFontSize: size }),
    [settings, save]
  )
  const resetSettings = useCallback(() => {
    save(DEFAULT_SETTINGS)
  }, [save])

  // Prevent flash of default styles before hydration
  if (!mounted) {
    return (
      <SettingsContext.Provider
        value={{ settings: DEFAULT_SETTINGS, sidebarOpen: false, setSidebarOpen, setArabicFont, setArabicFontSize, setTranslationFontSize, resetSettings }}
      >
        {children}
      </SettingsContext.Provider>
    )
  }

  return (
    <SettingsContext.Provider
      value={{ settings, sidebarOpen, setSidebarOpen, setArabicFont, setArabicFontSize, setTranslationFontSize, resetSettings }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within <SettingsProvider>')
  return ctx
}
