"use client";

import { AyahCard } from "@/components/AyahCard";
import type { Verse } from "@/lib/types";

interface AyatPageClientProps {
  verses: Verse[];
  surahId: number;
}

export function AyatPageClient({ verses }: AyatPageClientProps) {
  return (
    <div className="space-y-4 stagger pb-8">
      {verses?.map((verse) => (
        <AyahCard key={verse.id} verse={verse} surahId={0} />
      ))}
    </div>
  );
}
