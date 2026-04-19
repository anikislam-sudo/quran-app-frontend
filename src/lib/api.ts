const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

import type { Surah, SurahDetail, SearchResult } from "./types";

// ── Shared fetch helper ────────────────────────────────────────────────────────
async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    cache: "no-store",
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API ${url} → ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

// ── API functions ────────────────────────────────────────────────

/** Fetch all 114 surahs (metadata only, no verses). */
export async function fetchAllSurahs(): Promise<Surah[]> {
  const data = await apiFetch<Surah[]>("/api/surahs");
  return data;
}

/** Fetch a single surah with all its verses. */
export async function fetchSurah(id: number): Promise<SurahDetail> {
  const data = await apiFetch<SurahDetail>(`/api/surah/${id}`);
  return data;
}

/** Fetch all surah IDs (used by generateStaticParams). */
export async function fetchAllSurahIds(): Promise<number[]> {
  const surahs = await fetchAllSurahs();
  return surahs.map((s) => s.id);
}

/** Search verses by translation with pagination support. */
export async function searchVerses(
  query: string,
  limit = 10,
  offset = 0,
): Promise<{ results: SearchResult[]; totalAvailable: number }> {
  if (query.trim().length < 2) return { results: [], totalAvailable: 0 };

  const response = await apiFetch<{
    results: SearchResult[];
    total: number;
    totalAvailable: number;
    query: string;
    limit: number;
    offset: number;
  }>(
    `/api/search?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`,
  );

  return { results: response.results, totalAvailable: response.totalAvailable };
}
