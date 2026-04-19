// app/search/search-client.tsx
"use client";

import { useState, useEffect } from "react";
import { searchVerses } from "@/lib/api";
import type { SearchResult } from "@/lib/types";

const LIMIT = 10;

export default function SearchClient({
  initialQuery = "",
  initialPage = 1,
}: {
  initialQuery?: string;
  initialPage?: number;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [page, setPage] = useState(initialPage);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [totalAvailable, setTotalAvailable] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query.length >= 2) {
      const offset = (page - 1) * LIMIT;
      setLoading(true);
      setError(null);

      searchVerses(query, LIMIT, offset)
        .then(({ results, totalAvailable }) => {
          setResults(results);
          setTotalAvailable(totalAvailable);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    } else {
      setResults([]);
      setTotalAvailable(0);
    }
  }, [query, page]);

  const totalPages = Math.ceil(totalAvailable / LIMIT);
  const hasQuery = query.length >= 2;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newQuery = (formData.get("q") as string)?.trim() || "";
    setQuery(newQuery);
    setPage(1);
  };

  if (error) {
    return (
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 1rem" }}>
        <div
          style={{
            color: "red",
            padding: "1rem",
            border: "1px solid red",
            borderRadius: 8,
          }}
        >
          Error: {error}
        </div>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 1rem" }}>
      {/* Search Form */}
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", gap: 8, marginBottom: "1.5rem" }}
      >
        <input
          name="q"
          defaultValue={initialQuery}
          placeholder="Search verses…"
          autoComplete="off"
          style={{
            flex: 1,
            padding: "0.5rem 0.75rem",
            fontSize: 16,
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "0.5rem 1.25rem",
            borderRadius: 8,
            border: "none",
            background: "#1a56db",
            color: "#fff",
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </form>

      {/* Results Area */}
      {hasQuery && (
        <>
          {loading && (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <div>Searching...</div>
            </div>
          )}

          {!loading && (
            <>
              <p style={{ color: "#666", marginBottom: "1rem", fontSize: 14 }}>
                {totalAvailable === 0
                  ? `No results for "${query}"`
                  : `${totalAvailable.toLocaleString()} result${totalAvailable !== 1 ? "s" : ""} for "${query}" — page ${page} of ${totalPages}`}
              </p>

              <ol
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                {results.map((r) => (
                  <li
                    key={`${r.surah_id}-${r.verse_id}`}
                    style={{
                      padding: "1rem 1.25rem",
                      borderRadius: 10,
                      border: "1px solid #e5e7eb",
                      background: "#fafafa",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#1a56db",
                        marginBottom: 4,
                      }}
                    >
                      {r.surah_name} ({r.surah_transliteration}) — {r.surah_id}:
                      {r.verse_id}
                    </div>
                    {r.text && (
                      <p
                        style={{
                          fontFamily: "serif",
                          fontSize: 20,
                          textAlign: "right",
                          lineHeight: 1.8,
                          marginBottom: 8,
                          direction: "rtl",
                        }}
                      >
                        {r.text}
                      </p>
                    )}
                    <p
                      style={{
                        fontSize: 15,
                        color: "#374151",
                        lineHeight: 1.6,
                      }}
                    >
                      {r.translation}
                    </p>
                    {r.transliteration && (
                      <p
                        style={{
                          fontSize: 13,
                          color: "#6b7280",
                          fontStyle: "italic",
                          marginTop: 4,
                        }}
                      >
                        {r.transliteration}
                      </p>
                    )}
                  </li>
                ))}
              </ol>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <nav
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 12,
                    marginTop: "2rem",
                  }}
                >
                  <button
                    onClick={() => setPage((p) => p - 1)}
                    disabled={page === 1}
                    style={{
                      padding: "0.35rem 0.75rem",
                      borderRadius: 6,
                      border: "1px solid #d1d5db",
                      background: page === 1 ? "#f3f4f6" : "white",
                      color: page === 1 ? "#9ca3af" : "#1a56db",
                      cursor: page === 1 ? "default" : "pointer",
                    }}
                  >
                    ← Prev
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const start = Math.max(
                      1,
                      Math.min(page - 2, totalPages - 4),
                    );
                    const p = start + i;
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        style={{
                          padding: "0.35rem 0.75rem",
                          borderRadius: 6,
                          border: "1px solid #d1d5db",
                          background: p === page ? "#1a56db" : "white",
                          color: p === page ? "white" : "#1a56db",
                          fontWeight: p === page ? 600 : "normal",
                          cursor: "pointer",
                        }}
                      >
                        {p}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page === totalPages}
                    style={{
                      padding: "0.35rem 0.75rem",
                      borderRadius: 6,
                      border: "1px solid #d1d5db",
                      background: page === totalPages ? "#f3f4f6" : "white",
                      color: page === totalPages ? "#9ca3af" : "#1a56db",
                      cursor: page === totalPages ? "default" : "pointer",
                    }}
                  >
                    Next →
                  </button>
                </nav>
              )}
            </>
          )}
        </>
      )}

      {!hasQuery && (
        <div style={{ textAlign: "center", padding: "3rem", color: "#666" }}>
          <p>Enter at least 2 characters to search the Quran</p>
        </div>
      )}
    </main>
  );
}
