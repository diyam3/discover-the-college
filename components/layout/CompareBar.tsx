"use client";

import Link from "next/link";
import { useCompareStore } from "@/store/compare-store";
import { COLLEGES } from "@/lib/data";

export function CompareBar() {
  const { ids, remove } = useCompareStore();
  const colleges = ids.map((id) => COLLEGES.find((c) => c.id === id)).filter(Boolean);

  if (ids.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 px-4 pointer-events-none">
      <div className="max-w-2xl mx-auto pointer-events-auto">
        <div className="bg-slate-900/95 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl p-3 flex items-center gap-3">
          {/* College pills */}
          <div className="flex gap-2 flex-1 min-w-0 overflow-x-auto">
            {colleges.map((c) => (
              <div
                key={c!.id}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 rounded-xl px-2.5 py-1.5 flex-shrink-0 transition-colors"
              >
                <img
                  src={c!.image}
                  alt={c!.shortName}
                  className="w-5 h-5 rounded-md object-cover flex-shrink-0"
                />
                <span className="text-white text-xs font-medium">{c!.shortName}</span>
                <button
                  onClick={() => remove(c!.id)}
                  aria-label={`Remove ${c!.name}`}
                  className="text-white/40 hover:text-white text-xs ml-0.5 transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
            {ids.length < 3 && (
              <Link
                href="/colleges"
                className="flex items-center justify-center w-24 border border-dashed border-white/20 hover:border-white/40 rounded-xl text-white/30 hover:text-white/60 text-xs flex-shrink-0 transition-colors"
              >
                + Add More
              </Link>
            )}
          </div>

          {/* CTA */}
          <Link
            href="/compare"
            className="flex-shrink-0 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors shadow-lg shadow-blue-900/50"
          >
            Compare ({ids.length})
          </Link>
        </div>
      </div>
    </div>
  );
}
