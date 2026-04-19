import Link from "next/link";
import type { Surah } from "@/lib/types";

interface SurahCardProps {
  surah: Surah;
}

export function SurahCard({ surah }: SurahCardProps) {
  return (
    <Link
      href={`/surah/${surah.id}/`}
      className="card group relative flex flex-col gap-3 p-4 sm:p-5 cursor-pointer no-underline block"
      aria-label={`Surah ${surah.id}: ${surah.transliteration}`}
    >
      {/* Top row: number + arabic name */}
      <div className="flex items-start justify-between gap-3">
        {/* Surah number – octagonal feel with clip-path */}
        <div
          className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg text-sm font-cormorant font-semibold"
          style={{
            background: "var(--gold-dim)",
            border: "1px solid var(--gold-border)",
            color: "var(--gold)",
          }}
        >
          {surah.id}
        </div>

        {/* Arabic name — right aligned */}
        <p
          className="arabic-amiri text-2xl leading-none text-right flex-1 mt-0.5"
          dir="rtl"
          style={{ color: "var(--cream)" }}
        >
          {surah.name}
        </p>
      </div>

      {/* Divider */}
      <div className="gold-line" />

      {/* English info */}
      <div className="flex items-end justify-between gap-2">
        <div>
          <p
            className="font-cormorant text-base font-semibold leading-tight"
            style={{ color: "var(--cream)" }}
          >
            {surah.transliteration}
          </p>
          <p
            className="text-xs mt-0.5 font-lora"
            style={{ color: "var(--cream-muted)" }}
          >
            {surah.translation}
          </p>
        </div>

        {/* Meta: type + verse count */}
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span
            className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{
              background: "var(--gold-dim)",
              border: "1px solid var(--gold-border)",
              color: "var(--gold)",
            }}
          >
            {surah.type}
          </span>
          <span className="text-xs font-lora" style={{ color: "var(--cream)" }}>
            {surah.total_verses} verses
          </span>
        </div>
      </div>

      {/* Hover arrow hint */}
      <span
        className="absolute right-4 bottom-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs"
        style={{ color: "var(--gold)" }}
        aria-hidden
      >
        →
      </span>
    </Link>
  );
}
