"use client";

import { useRef, useCallback, type ChangeEvent } from "react";
import { Search, X } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search by translation…",
  autoFocus = false,
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    [onChange],
  );

  const handleClear = useCallback(() => {
    onChange("");
    inputRef.current?.focus();
  }, [onChange]);

  return (
    <div className="relative w-full">
      {/* Search icon */}
      <span
        className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: "var(--cream-muted)" }}
        aria-hidden
      >
        <Search size={18} />
      </span>

      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        autoComplete="off"
        spellCheck={false}
        className="w-full pl-11 pr-10 py-3.5 rounded-xl font-lora text-sm outline-none transition-all duration-200"
        style={{
          background: "var(--surface-raised)",
          border: "1px solid var(--gold-border)",
          color: "var(--cream)",
          caretColor: "var(--gold)",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--gold)";
          e.currentTarget.style.boxShadow = "0 0 0 2px var(--gold-dim)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "var(--gold-border)";
          e.currentTarget.style.boxShadow = "none";
        }}
        aria-label="Search the Quran"
      />

      {/* Clear button */}
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors"
          style={{ color: "var(--cream-muted)" }}
          aria-label="Clear search"
          type="button"
        ></button>
      )}
    </div>
  );
}
