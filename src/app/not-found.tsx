import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <p
        className="arabic-amiri text-7xl mb-6"
        dir="rtl"
        style={{ color: 'var(--gold)', opacity: 0.4 }}
        aria-hidden
      >
        ٤٠٤
      </p>
      <h1 className="font-cormorant font-semibold text-3xl mb-2" style={{ color: 'var(--cream)' }}>
        Page Not Found
      </h1>
      <p className="font-lora text-sm mb-8" style={{ color: 'var(--cream-muted)' }}>
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="font-lora text-sm px-5 py-2.5 rounded-xl transition-colors"
        style={{
          background: 'var(--gold-dim)',
          border: '1px solid var(--gold-border)',
          color: 'var(--gold)',
        }}
      >
        ← Return to Surah List
      </Link>
    </div>
  )
}
