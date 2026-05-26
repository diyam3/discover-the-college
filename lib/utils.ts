import { clsx, type ClassValue } from "clsx";
import type { College, CollegeFilters, SortKey } from "@/types/college";

// ── Class merging ─────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// ── Currency formatting ───────────────────────────────────────
export function formatCurrency(amount: number): string {
  if (amount >= 10_000_000) return `₹${(amount / 10_000_000).toFixed(1)}Cr`;
  if (amount >= 100_000)    return `₹${(amount / 100_000).toFixed(1)}L`;
  if (amount >= 1_000)      return `₹${(amount / 1_000).toFixed(0)}K`;
  return `₹${amount}`;
}

// ── Number formatting ─────────────────────────────────────────
export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

// ── Filter + Sort colleges ────────────────────────────────────
export function filterAndSortColleges(
  colleges: College[],
  query: string,
  filters: CollegeFilters,
  sort: SortKey
): College[] {
  let list = colleges.filter((c) => {
    if (query) {
      const q = query.toLowerCase();
      const searchable = [c.name, c.shortName, c.location, c.state, ...c.tags, ...c.streams]
        .join(" ")
        .toLowerCase();
      if (!searchable.includes(q)) return false;
    }
    if (filters.type.length && !filters.type.includes(c.type)) return false;
    if (filters.state.length && !filters.state.includes(c.state)) return false;
    if (filters.exam.length && !c.exams.some((e) => (filters.exam as string[]).includes(e))) return false;
    if (filters.stream.length && !c.streams.some((s) => (filters.stream as string[]).includes(s))) return false;
    if (filters.rating !== null && c.rating < filters.rating) return false;
    if (filters.maxFees !== null && c.fees.annual > filters.maxFees) return false;
    return true;
  });

  list.sort((a, b) => {
    switch (sort) {
      case "ranking":   return a.ranking.nirf - b.ranking.nirf;
      case "rating":    return b.rating - a.rating;
      case "fees_asc":  return a.fees.annual - b.fees.annual;
      case "fees_desc": return b.fees.annual - a.fees.annual;
      case "placement": return b.placement.avg - a.placement.avg;
      default:          return 0;
    }
  });

  return list;
}

// ── Active filter count ───────────────────────────────────────
export function countActiveFilters(filters: CollegeFilters): number {
  return (
    filters.type.length +
    filters.state.length +
    filters.exam.length +
    filters.stream.length +
    (filters.rating !== null ? 1 : 0) +
    (filters.maxFees !== null ? 1 : 0)
  );
}

// ── Truncate text ─────────────────────────────────────────────
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

// ── Chance label ──────────────────────────────────────────────
export function chanceLabel(chance: number): "Safe" | "Target" | "Dream" {
  if (chance >= 75) return "Safe";
  if (chance >= 45) return "Target";
  return "Dream";
}
