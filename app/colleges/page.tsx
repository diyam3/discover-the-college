"use client";

import { useState, useMemo, useCallback, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { CollegeCard } from "@/components/college/CollegeCard";
import { CollegeFilters } from "@/components/college/CollegeFilters";
import { SkeletonCard, SkeletonList } from "@/components/ui/SkeletonCard";
import { COLLEGES } from "@/lib/data";
import { filterAndSortColleges, countActiveFilters } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { DEFAULT_FILTERS, SORT_OPTIONS, PER_PAGE } from "@/constants";
import type { CollegeFilters as FiltersType, SortKey, ViewMode } from "@/types/college";

function CollegesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [filters, setFilters] = useState<FiltersType>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortKey>("ranking");
  const [view, setView] = useState<ViewMode>("grid");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const debouncedSearch = useDebounce(search, 280);

  // Sync URL with search query
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearch) params.set("q", debouncedSearch);
    else params.delete("q");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Simulate async loading feel
  useEffect(() => {
    setLoading(true);
    setPage(1);
    const t = setTimeout(() => setLoading(false), 320);
    return () => clearTimeout(t);
  }, [debouncedSearch, filters, sort]);

  const filtered = useMemo(
    () => filterAndSortColleges(COLLEGES, debouncedSearch, filters, sort),
    [debouncedSearch, filters, sort]
  );

  const paginated = filtered.slice(0, page * PER_PAGE);
  const hasMore = paginated.length < filtered.length;
  const activeCount = countActiveFilters(filters);

  const handleClearAll = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSearch("");
    setPage(1);
  }, []);

  // Typed chip removal
  type ArrayKey = "type" | "state" | "exam" | "stream";
  type ScalarKey = "rating" | "maxFees";

  const removeArrayChip = (key: ArrayKey, val: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: (prev[key] as string[]).filter((v) => v !== val),
    }));
  };

  const removeScalarChip = (key: ScalarKey) => {
    setFilters((prev) => ({ ...prev, [key]: null }));
  };

  // Build chips for display
  const chips: { remove: () => void; label: string; key: string }[] = [
    ...filters.type.map((v) => ({ key: `type-${v}`, label: v, remove: () => removeArrayChip("type", v) })),
    ...filters.state.map((v) => ({ key: `state-${v}`, label: v, remove: () => removeArrayChip("state", v) })),
    ...filters.exam.map((v) => ({ key: `exam-${v}`, label: v, remove: () => removeArrayChip("exam", v) })),
    ...filters.stream.map((v) => ({ key: `stream-${v}`, label: v, remove: () => removeArrayChip("stream", v) })),
    ...(filters.rating !== null
      ? [{ key: "rating", label: `★ ${filters.rating}+`, remove: () => removeScalarChip("rating") }]
      : []),
    ...(filters.maxFees !== null
      ? [{ key: "maxFees", label: `Under ₹${filters.maxFees / 100000}L`, remove: () => removeScalarChip("maxFees") }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Page header */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-1">Explore Colleges</h1>
          <p className="text-blue-200 text-sm mb-6">
            Discover from {COLLEGES.length}+ top engineering colleges across India
          </p>
          <div className="flex gap-2 max-w-2xl">
            <div className="flex-1 relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-300 pointer-events-none">🔍</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search college, city, or stream…"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 text-white placeholder-blue-300 border border-white/20 focus:outline-none focus:border-white/50 backdrop-blur-sm text-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 pb-24">
        {/* Active filter chips */}
        {chips.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {chips.map((chip) => (
              <button
                key={chip.key}
                onClick={chip.remove}
                className="flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              >
                {chip.label} <span className="ml-0.5">✕</span>
              </button>
            ))}
            <button
              onClick={handleClearAll}
              className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-xs hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              Clear All ({chips.length})
            </button>
          </div>
        )}

        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-52 flex-shrink-0">
            <div className="sticky top-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 shadow-sm">
              <CollegeFilters
                filters={filters}
                onChange={(f) => { setFilters(f); setPage(1); }}
                onClear={handleClearAll}
                activeCount={activeCount}
              />
            </div>
          </aside>

          {/* Main area */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowMobileFilter(true)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-blue-300 transition-colors"
                >
                  ⚙️ Filters
                  {activeCount > 0 && (
                    <span className="w-4 h-4 bg-blue-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {activeCount}
                    </span>
                  )}
                </button>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{filtered.length}</span> colleges
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="text-sm border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-400"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>

                <div className="flex bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                  {(["grid", "list"] as ViewMode[]).map((v) => (
                    <button
                      key={v}
                      onClick={() => setView(v)}
                      aria-label={`${v} view`}
                      className={`px-3 py-2 text-sm transition-colors ${
                        view === v
                          ? "bg-blue-600 text-white"
                          : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                      }`}
                    >
                      {v === "grid" ? "⊞" : "☰"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* College grid/list */}
            {loading ? (
              <div className={`grid gap-4 ${view === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
                {Array.from({ length: PER_PAGE }).map((_, i) =>
                  view === "grid" ? <SkeletonCard key={i} /> : <SkeletonList key={i} />
                )}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                <p className="text-5xl mb-3">🔍</p>
                <p className="font-bold text-slate-700 dark:text-slate-200 mb-1">No colleges found</p>
                <p className="text-sm text-slate-400 mb-4 text-center max-w-xs">
                  Try adjusting your search query or removing some filters.
                </p>
                <button onClick={handleClearAll} className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className={`grid gap-4 ${view === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
                  {paginated.map((c) => (
                    <CollegeCard key={c.id} college={c} view={view} />
                  ))}
                </div>
                {hasMore && (
                  <div className="text-center mt-8">
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
                    >
                      Load More ({filtered.length - paginated.length} remaining)
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowMobileFilter(false)} />
          <div className="relative ml-auto w-72 max-w-full bg-white dark:bg-slate-900 h-full overflow-y-auto p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 dark:text-white">Filters</h3>
              <button onClick={() => setShowMobileFilter(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-xl">✕</button>
            </div>
            <CollegeFilters
              filters={filters}
              onChange={(f) => { setFilters(f); setPage(1); }}
              onClear={handleClearAll}
              activeCount={activeCount}
            />
            <button
              onClick={() => setShowMobileFilter(false)}
              className="w-full mt-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors"
            >
              Show {filtered.length} Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CollegesPage() {
  return (
    <Suspense>
      <CollegesContent />
    </Suspense>
  );
}
