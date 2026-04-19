"use client";

import { useState, useMemo } from "react";
import type { Surah } from "@/lib/types";
import { SurahCard } from "@/components/SurahCard";
import { SearchInput } from "@/components/SearchInput";
import { BookOpen } from "lucide-react";

interface SurahListClientProps {
  surahs: Surah[];
}

export function SurahListClient({ surahs }: SurahListClientProps) {
  console.log(surahs);
  const [filter, setFilter] = useState("");

  const filtered = useMemo(() => {
    const q = filter.toLowerCase().trim();
    if (!q) return surahs;
    return surahs?.filter(
      (s) =>
        s.transliteration.toLowerCase().includes(q) ||
        s.translation.toLowerCase().includes(q) ||
        s.name.includes(q) ||
        String(s.id) === q,
    );
  }, [surahs, filter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      {/* ── Page hero ───────────────────────────────────────────────────────── */}
      <div className="relative py-12 sm:py-16 text-center overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(201,165,53,0.07) 0%, transparent 70%)",
          }}
        />

        {/* Ornamental top line */}
        <div
          className="flex items-center justify-center gap-3 mb-5"
          aria-hidden
        >
          <div
            className="h-px flex-1 max-w-24"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--gold-border))",
            }}
          />
          <span style={{ color: "var(--gold)", fontSize: "1.2rem" }}>☽</span>
          <div
            className="h-px flex-1 max-w-24"
            style={{
              background:
                "linear-gradient(90deg, var(--gold-border), transparent)",
            }}
          />
        </div>

        <p
          className="arabic-amiri text-4xl sm:text-5xl mb-4"
          dir="rtl"
          style={{ color: "var(--gold-light)", lineHeight: 1.6 }}
        >
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>

        <h1
          className="font-cormorant font-semibold text-3xl sm:text-4xl mb-2"
          style={{ color: "var(--cream)" }}
        >
          The Holy Quran
        </h1>
        <p
          className="font-lora text-sm"
          style={{ color: "var(--cream-muted)" }}
        >
          114 Surahs · Sahih International Translation
        </p>

        {/* Ornamental bottom line */}
        <div
          className="flex items-center justify-center gap-3 mt-6"
          aria-hidden
        >
          <div
            className="h-px flex-1 max-w-36"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--gold-border))",
            }}
          />
          <span
            style={{
              color: "var(--gold-border)",
              fontSize: "0.65rem",
              letterSpacing: "0.3em",
            }}
          >
            ✦ ✦ ✦
          </span>
          <div
            className="h-px flex-1 max-w-36"
            style={{
              background:
                "linear-gradient(90deg, var(--gold-border), transparent)",
            }}
          />
        </div>
      </div>

      {/* ── Filter bar ──────────────────────────────────────────────────────── */}
      <div className="max-w-xl mx-auto mb-8">
        <SearchInput
          value={filter}
          onChange={setFilter}
          placeholder="Filter by surah name, number, or meaning…"
        />
        {filter && (
          <p
            className="text-center text-sm mt-3 font-lora"
            style={{ color: "var(--cream-muted)" }}
          >
            {filtered?.length === 0
              ? "No surahs matched your search."
              : `${filtered?.length} surah${filtered?.length !== 1 ? "s" : ""} found`}
          </p>
        )}
      </div>

      {/* ── Surah grid ──────────────────────────────────────────────────────── */}
      {filtered?.length > 0 ? (
        <div
          key={
            filter
          } /* re-mount grid to re-trigger stagger animation on filter change */
          className="stagger grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-8"
        >
          {filtered?.map((surah) => (
            <SurahCard key={surah.id} surah={surah} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 fade-in">
          <BookOpen
            size={40}
            style={{ color: "var(--cream-dim)" }}
            className="mb-4"
          />
          <p
            className="font-cormorant text-lg"
            style={{ color: "var(--cream-muted)" }}
          >
            No surahs found
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--cream-dim)" }}>
            Try a different name or number
          </p>
        </div>
      )}
    </div>
  );
}
