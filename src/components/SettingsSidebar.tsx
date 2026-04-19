'use client'

import { useEffect, useRef } from 'react'
import { X, RotateCcw, Type, ALargeSmall } from 'lucide-react'
import { useSettings } from '@/providers/SettingsProvider'
import type { ArabicFont } from '@/lib/types'
import clsx from 'clsx'

const ARABIC_FONTS: { value: ArabicFont; label: string; sample: string }[] = [
  { value: 'amiri',        label: 'Amiri',            sample: 'بِسْمِ اللَّهِ' },
  { value: 'scheherazade', label: 'Scheherazade New',  sample: 'بِسْمِ اللَّهِ' },
]

export function SettingsSidebar() {
  const { settings, sidebarOpen, setSidebarOpen, setArabicFont, setArabicFontSize, setTranslationFontSize, resetSettings } = useSettings()
  const panelRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    if (!sidebarOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setSidebarOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [sidebarOpen, setSidebarOpen])

  // Trap focus inside sidebar when open
  useEffect(() => {
    if (sidebarOpen) panelRef.current?.focus()
  }, [sidebarOpen])

  if (!sidebarOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 fade-in"
        style={{ background: 'rgba(2,6,14,0.7)', backdropFilter: 'blur(4px)' }}
        onClick={() => setSidebarOpen(false)}
        aria-hidden
      />

      {/* Panel */}
      <aside
        ref={panelRef}
        tabIndex={-1}
        className="fixed right-0 top-0 bottom-0 z-50 w-80 max-w-[92vw] sidebar-enter flex flex-col outline-none"
        style={{
          background: 'var(--surface)',
          borderLeft: '1px solid var(--gold-border)',
          boxShadow: '-16px 0 48px rgba(0,0,0,0.5)',
        }}
        role="dialog"
        aria-modal
        aria-label="Display settings"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid var(--gold-border)' }}
        >
          <div>
            <p className="font-cormorant font-semibold text-lg" style={{ color: 'var(--cream)' }}>
              Display Settings
            </p>
            <p className="text-xs" style={{ color: 'var(--cream-muted)' }}>
              Personalise your reading experience
            </p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg transition-colors"
            style={{ color: 'var(--cream-muted)' }}
            aria-label="Close settings"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-8">

          {/* ── Arabic Font Selection ─────────────────────────────────────── */}
          <section>
            <SectionLabel icon={<Type size={14} />} label="Arabic Font" />
            <div className="space-y-2.5 mt-3">
              {ARABIC_FONTS.map((font) => {
                const active = settings.arabicFont === font.value
                return (
                  <button
                    key={font.value}
                    onClick={() => setArabicFont(font.value)}
                    className={clsx(
                      'w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-left',
                      'card'
                    )}
                    style={
                      active
                        ? {
                            borderColor: 'var(--gold)',
                            background: 'var(--gold-dim)',
                            boxShadow: '0 0 0 1px var(--gold)',
                          }
                        : {}
                    }
                    aria-pressed={active}
                  >
                    <div>
                      <p className="text-xs font-medium mb-1" style={{ color: active ? 'var(--gold)' : 'var(--cream-muted)' }}>
                        {font.label}
                      </p>
                      <p
                        className={clsx(
                          'text-xl',
                          font.value === 'amiri' ? 'arabic-amiri' : 'arabic-scheherazade'
                        )}
                        dir="rtl"
                        style={{ color: 'var(--cream)' }}
                      >
                        {font.sample}
                      </p>
                    </div>
                    {active && (
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                        style={{ background: 'var(--gold)', color: 'var(--bg)' }}
                        aria-hidden
                      >
                        ✓
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </section>

          {/* ── Arabic Font Size ─────────────────────────────────────────────── */}
          <section>
            <SectionLabel icon={<ALargeSmall size={14} />} label="Arabic Font Size" />
            <div className="mt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs" style={{ color: 'var(--cream-muted)' }}>Size</span>
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded"
                  style={{ background: 'var(--gold-dim)', color: 'var(--gold)', border: '1px solid var(--gold-border)' }}
                >
                  {settings.arabicFontSize}px
                </span>
              </div>
              <input
                type="range"
                min={20}
                max={56}
                step={2}
                value={settings.arabicFontSize}
                onChange={(e) => setArabicFontSize(Number(e.target.value))}
                aria-label="Arabic font size"
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs" style={{ color: 'var(--cream-dim)', fontSize: '11px' }}>Small</span>
                <span className="text-xs" style={{ color: 'var(--cream-dim)', fontSize: '11px' }}>Large</span>
              </div>
              {/* Live preview */}
              <div
                className="mt-3 p-3 rounded-xl text-center"
                style={{ background: 'var(--surface-raised)', border: '1px solid var(--gold-border)' }}
              >
                <p
                  className={clsx(settings.arabicFont === 'amiri' ? 'arabic-amiri' : 'arabic-scheherazade')}
                  dir="rtl"
                  style={{ fontSize: settings.arabicFontSize, color: 'var(--cream)', lineHeight: 1.7 }}
                >
                  الْحَمْدُ لِلَّهِ
                </p>
              </div>
            </div>
          </section>

          {/* ── Translation Font Size ────────────────────────────────────────── */}
          <section>
            <SectionLabel icon={<ALargeSmall size={14} />} label="Translation Font Size" />
            <div className="mt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs" style={{ color: 'var(--cream-muted)' }}>Size</span>
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded"
                  style={{ background: 'var(--gold-dim)', color: 'var(--gold)', border: '1px solid var(--gold-border)' }}
                >
                  {settings.translationFontSize}px
                </span>
              </div>
              <input
                type="range"
                min={13}
                max={24}
                step={1}
                value={settings.translationFontSize}
                onChange={(e) => setTranslationFontSize(Number(e.target.value))}
                aria-label="Translation font size"
              />
              <div className="flex justify-between mt-1">
                <span style={{ color: 'var(--cream-dim)', fontSize: '11px' }}>Small</span>
                <span style={{ color: 'var(--cream-dim)', fontSize: '11px' }}>Large</span>
              </div>
              {/* Live preview */}
              <div
                className="mt-3 p-3 rounded-xl"
                style={{ background: 'var(--surface-raised)', border: '1px solid var(--gold-border)' }}
              >
                <p
                  style={{ fontSize: settings.translationFontSize, color: 'var(--cream-muted)', lineHeight: 1.65 }}
                >
                  In the name of Allah, the Entirely Merciful…
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-5 py-4" style={{ borderTop: '1px solid var(--gold-border)' }}>
          <button
            onClick={resetSettings}
            className="flex items-center gap-2 text-sm w-full justify-center py-2.5 rounded-xl transition-colors"
            style={{ color: 'var(--cream-muted)', border: '1px solid var(--gold-border)' }}
          >
            <RotateCcw size={13} />
            Reset to defaults
          </button>
        </div>
      </aside>
    </>
  )
}

function SectionLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span style={{ color: 'var(--gold)' }}>{icon}</span>
      <span className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--cream-muted)' }}>
        {label}
      </span>
    </div>
  )
}
