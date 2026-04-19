"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, BookOpen, Loader2, ChevronDown } from "lucide-react";
import { SearchInput } from "@/components/SearchInput";
import { useSettings } from "@/providers/SettingsProvider";

import type { SearchResult } from "@/lib/types";
import clsx from "clsx";
import { searchVerses } from "@/lib/api";

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalAvailable, setTotalAvailable] = useState(0);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  const debouncedQuery = useDebounce(query, 320);
  const { settings } = useSettings();

  const runSearch = useCallback(
    async (
      q: string,
      newLimit: number = 10,
      newOffset: number = 0,
      append: boolean = false,
    ) => {
      if (q.trim().length < 2) {
        setResults([]);
        setSearched(false);
        setError(null);
        setTotalAvailable(0);
        return;
      }

      if (!append) setLoading(true);
      else setLoadingMore(true);

      setError(null);

      try {
        const { results: newResults, totalAvailable: total } =
          await searchVerses(q, newLimit, newOffset);
        setTotalAvailable(total);

        if (append) {
          setResults((prev) => [...prev, ...newResults]);
        } else {
          setResults(newResults);
        }
        setSearched(true);
      } catch (err) {
        console.error(err);
        setError(
          "Could not reach the backend. Make sure the API server is running.",
        );
        setResults([]);
      } finally {
        if (!append) setLoading(false);
        else setLoadingMore(false);
      }
    },
    [],
  );

  // Initial search when query changes
  useEffect(() => {
    setOffset(0);
    setLimit(10);
    runSearch(debouncedQuery, 10, 0, false);
  }, [debouncedQuery, runSearch]);

  const loadMore = () => {
    const newOffset = offset + limit;
    setOffset(newOffset);
    runSearch(debouncedQuery, limit, newOffset, true);
  };

  const hasMore = results.length < totalAvailable;

  const arabicClass =
    settings.arabicFont === "amiri" ? "arabic-amiri" : "arabic-scheherazade";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <div className="py-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Search size={18} style={{ color: "var(--gold)" }} />
          <h1
            className="font-cormorant font-semibold text-3xl"
            style={{ color: "var(--cream)" }}
          >
            Search the Quran
          </h1>
        </div>
        <p
          className="font-lora text-sm"
          style={{ color: "var(--cream-muted)" }}
        >
          Search across all 6,236 verses by English translation
        </p>
      </div>

      {/* ── Search box ──────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="e.g. patience, light, mercy, paradise…"
          autoFocus
        />
      </div>

      {/* ── Backend error ────────────────────────────────────────────────────── */}
      {error && (
        <div
          className="mb-6 px-4 py-3 rounded-xl text-sm font-lora text-center fade-in"
          style={{
            background: "rgba(220,60,60,0.08)",
            border: "1px solid rgba(220,60,60,0.25)",
            color: "#f87171",
          }}
        >
          ⚠ {error}
        </div>
      )}

      {/* ── Status line ─────────────────────────────────────────────────────── */}
      {searched && !loading && !error && (
        <p
          className="text-sm text-center mb-6 font-lora"
          style={{ color: "var(--cream-muted)" }}
        >
          {results.length === 0
            ? `No verses matched "${debouncedQuery}"`
            : `Showing ${results.length} of ${totalAvailable} verse${totalAvailable !== 1 ? "s" : ""} matched "${debouncedQuery}"`}
        </p>
      )}

      {/* ── Loading ─────────────────────────────────────────────────────────── */}
      {loading && (
        <div className="flex justify-center py-12">
          <Loader2
            size={28}
            className="animate-spin"
            style={{ color: "var(--gold)" }}
          />
        </div>
      )}

      {/* ── Empty / prompt ──────────────────────────────────────────────────── */}
      {!loading && !searched && !error && (
        <div className="flex flex-col items-center justify-center py-24 fade-in">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
            style={{
              background: "var(--gold-dim)",
              border: "1px solid var(--gold-border)",
            }}
          >
            <Search size={28} style={{ color: "var(--gold)" }} />
          </div>
          <p
            className="font-cormorant text-xl mb-1"
            style={{ color: "var(--cream)" }}
          >
            Start your search
          </p>
          <p className="text-sm" style={{ color: "var(--cream-muted)" }}>
            Type at least 2 characters to find matching verses
          </p>
          <div className="flex flex-wrap gap-2 mt-6 justify-center">
            {[
              "mercy",
              "patience",
              "light",
              "paradise",
              "guidance",
              "forgiveness",
            ].map((term) => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className="px-3 py-1.5 rounded-full text-sm font-lora transition-colors"
                style={{
                  background: "var(--gold-dim)",
                  border: "1px solid var(--gold-border)",
                  color: "var(--gold)",
                }}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── No results ──────────────────────────────────────────────────────── */}
      {!loading && searched && results.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-20 fade-in">
          <BookOpen
            size={36}
            style={{ color: "var(--cream-dim)" }}
            className="mb-4"
          />
          <p
            className="font-cormorant text-lg"
            style={{ color: "var(--cream-muted)" }}
          >
            No verses found
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--cream-dim)" }}>
            Try different keywords or check your spelling
          </p>
        </div>
      )}

      {/* ── Results list ────────────────────────────────────────────────────── */}
      {!loading && results.length > 0 && (
        <div className="space-y-3 stagger pb-10">
          {results.map((result, i) => (
            <SearchResultCard
              key={`${result.surah_id}-${result.verse_id}-${i}`}
              result={result}
              query={debouncedQuery}
              arabicClass={arabicClass}
              arabicFontSize={settings.arabicFontSize}
              translationFontSize={settings.translationFontSize}
            />
          ))}

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center pt-6">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="px-6 py-3 rounded-full font-lora text-sm transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
                style={{
                  background: "var(--gold-dim)",
                  border: "1px solid var(--gold-border)",
                  color: "var(--gold)",
                }}
              >
                {loadingMore ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <ChevronDown size={16} />
                    Load More ({totalAvailable - results.length} remaining)
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Individual search result ────────────────────────────────────────────── */
function SearchResultCard({
  result,
  query,
  arabicClass,
  arabicFontSize,
  translationFontSize,
}: {
  result: SearchResult;
  query: string;
  arabicClass: string;
  arabicFontSize: number;
  translationFontSize: number;
}) {
  const highlightedTranslation = highlightText(result.translation, query);

  return (
    <Link
      href={`/surah/${result.surah_id}#verse-${result.verse_id}`}
      className={clsx(
        "card group block no-underline p-5 transition-all hover:scale-[1.01]",
      )}
      style={{ textDecoration: "none" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-xs font-lora px-2.5 py-1 rounded-full"
            style={{
              background: "var(--gold-dim)",
              border: "1px solid var(--gold-border)",
              color: "var(--gold)",
            }}
          >
            {result.surah_transliteration} · {result.surah_id}:{result.verse_id}
          </span>
          <span
            className="text-xs font-lora"
            style={{ color: "var(--cream-dim)" }}
          >
            {result.surah_translation}
          </span>
        </div>
        <span
          className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: "var(--gold)" }}
          aria-hidden
        >
          View →
        </span>
      </div>
      <p
        className={clsx("text-right mb-3 leading-loose", arabicClass)}
        dir="rtl"
        lang="ar"
        style={{
          fontSize: Math.min(arabicFontSize, 28),
          color: "var(--cream)",
        }}
      >
        {result.text}
      </p>
      <div className="gold-line mb-3" />
      <p
        className="font-lora leading-relaxed"
        style={{ fontSize: translationFontSize, color: "var(--cream-muted)" }}
        dangerouslySetInnerHTML={{ __html: highlightedTranslation }}
      />
    </Link>
  );
}

function highlightText(text: string, query: string): string {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(
    new RegExp(`(${escaped})`, "gi"),
    '<mark style="background:rgba(201,165,53,0.28);color:var(--gold-light);border-radius:3px;padding:0 2px;">$1</mark>',
  );
}
