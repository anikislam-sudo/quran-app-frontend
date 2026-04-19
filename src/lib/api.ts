// lib/api.ts

const BASE =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://quran-app-backend-svz2.onrender.com";

import type { Surah, SurahDetail, SearchResult } from "./types";

// ── Shared fetch helper ─────────────────────────────────────────
async function apiFetch<T>(path: string): Promise<T> {
  const url = `${BASE}${path}`;

  const res = await fetch(url, {
    next: { revalidate: 60 }, // ✅ IMPORTANT (fixes your issue)
  });

  if (!res.ok) {
    throw new Error(`API ${url} → ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

// ── API functions ───────────────────────────────────────────────

export async function fetchAllSurahs(): Promise<Surah[]> {
  return apiFetch<Surah[]>("/api/surahs");
}

export async function fetchSurah(id: number): Promise<SurahDetail> {
  return apiFetch<SurahDetail>(`/api/surah/${id}`);
}

export async function fetchAllSurahIds(): Promise<number[]> {
  const surahs = await fetchAllSurahs();
  return surahs.map((s) => s.id);
}

export async function searchVerses(
  query: string,
  limit = 10,
  offset = 0,
): Promise<{ results: SearchResult[]; totalAvailable: number }> {
  if (query.trim().length < 2) {
    return { results: [], totalAvailable: 0 };
  }

  const response = await apiFetch<{
    results: SearchResult[];
    totalAvailable: number;
  }>(
    `/api/search?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`,
  );

  return {
    results: response.results,
    totalAvailable: response.totalAvailable,
  };
}
