import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchAllSurahIds, fetchSurah } from "@/lib/api";
import { AyatPageClient } from "./AyatPageClient";

interface PageProps {
  params: { id: string };
}

/* ── SSG: pre-render all 114 surah pages at build time ───────────────────── */
export async function generateStaticParams() {
  const ids = await fetchAllSurahIds();
  return ids.map((id) => ({ id: String(id) }));
}

/* ── Dynamic metadata per surah ──────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const id = parseInt(params.id, 10);
  if (isNaN(id) || id < 1 || id > 114) return { title: "Not Found" };
  try {
    const surah = await fetchSurah(id);
    return {
      title: `${surah.transliteration} — Surah ${surah.id}`,
      description: `Read Surah ${surah.transliteration} (${surah.translation}) — ${surah.total_verses} verses in Arabic with Sahih International English translation.`,
    };
  } catch {
    return { title: "Not Found" };
  }
}

export default async function SurahPage({ params }: PageProps) {
  const id = parseInt(params.id, 10);
  if (isNaN(id) || id < 1 || id > 114) notFound();

  let surah;
  try {
    surah = await fetchSurah(id);
  } catch {
    notFound();
  }

  // Surah 9 (At-Tawbah) does NOT begin with Bismillah
  const showBismillah = surah.id !== 9;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      {/* ── Back nav ──────────────────────────────────────────────────────── */}
      <div className="pt-6 pb-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-lora transition-colors"
          style={{ color: "var(--cream-muted)" }}
        >
          <span aria-hidden>←</span> All Surahs
        </Link>
      </div>

      {/* ── Surah Header ────────────────────────────────────────────────────── */}
      <header
        className="relative rounded-2xl overflow-hidden mt-4 mb-8 px-6 py-10 text-center"
        style={{
          background:
            "linear-gradient(135deg, var(--surface-raised) 0%, var(--surface) 100%)",
          border: "1px solid var(--gold-border)",
          boxShadow: "inset 0 1px 0 var(--gold-border)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(201,165,53,0.06) 0%, transparent 70%)",
          }}
        />
        <div className="relative">
          <div className="flex justify-center mb-4">
            <span
              className="font-cormorant text-sm font-medium px-4 py-1 rounded-full"
              style={{
                background: "var(--gold-dim)",
                border: "1px solid var(--gold-border)",
                color: "var(--gold)",
              }}
            >
              Surah {surah.id}
            </span>
          </div>
          <p
            className="arabic-amiri text-5xl sm:text-6xl mb-4"
            dir="rtl"
            lang="ar"
            style={{ color: "var(--cream)", lineHeight: 1.5 }}
          >
            {surah.name}
          </p>
          <h1
            className="font-cormorant font-bold text-2xl sm:text-3xl mb-1"
            style={{ color: "var(--cream)" }}
          >
            {surah.transliteration}
          </h1>
          <p
            className="font-lora text-sm mb-4"
            style={{ color: "var(--cream-muted)" }}
          >
            {surah.translation}
          </p>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <MetaPill label={surah.total_verses + " Verses"} />
            <MetaPill label={surah.type === "meccan" ? "Meccan" : "Medinan"} />
          </div>
        </div>
      </header>

      {/* ── Bismillah ───────────────────────────────────────────────────────── */}
      {showBismillah && (
        <div className="bismillah-container mb-6">
          <p
            className="arabic-amiri text-3xl sm:text-4xl"
            dir="rtl"
            lang="ar"
            style={{ color: "var(--gold-light)", lineHeight: 1.8 }}
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        </div>
      )}

      {/* ── Verses ─────────────────────────────────────────────────────────── */}
      <AyatPageClient verses={surah.verses} surahId={surah.id} />

      {/* ── Surah navigation ─────────────────────────────────────────────── */}
      <nav
        className="flex items-center justify-between mt-12 mb-8 pt-6"
        style={{ borderTop: "1px solid var(--gold-border)" }}
        aria-label="Surah navigation"
      >
        {surah.id > 1 ? (
          <Link
            href={`/surah/${surah.id - 1}/`}
            className="flex items-center gap-2 text-sm font-lora transition-colors"
            style={{ color: "var(--cream-muted)" }}
          >
            <span style={{ color: "var(--gold)" }}>←</span>
            <span>Surah {surah.id - 1}</span>
          </Link>
        ) : (
          <div />
        )}
        {surah.id < 114 ? (
          <Link
            href={`/surah/${surah.id + 1}/`}
            className="flex items-center gap-2 text-sm font-lora transition-colors"
            style={{ color: "var(--cream-muted)" }}
          >
            <span>Surah {surah.id + 1}</span>
            <span style={{ color: "var(--gold)" }}>→</span>
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </div>
  );
}

function MetaPill({ label }: { label: string }) {
  return (
    <span
      className="text-xs font-lora uppercase tracking-wider px-3 py-1 rounded-full"
      style={{
        background: "var(--gold-dim)",
        border: "1px solid var(--gold-border)",
        color: "var(--cream-muted)",
      }}
    >
      {label}
    </span>
  );
}
