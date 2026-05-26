"use client";

import Link from "next/link";
import { useCompareStore } from "@/store/compare-store";
import { Badge } from "@/components/ui/Badge";
import type { College } from "@/types/college";

interface CollegeHeroProps {
  college: College;
}

export function CollegeHero({ college }: CollegeHeroProps) {
  const { isAdded, add, remove } = useCompareStore();
  const added = isAdded(college.id);

  return (
    <div className="relative h-72 sm:h-80 overflow-hidden">
      <img
        src={college.image}
        alt={college.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Back button */}
      <Link
        href="/colleges"
        className="absolute top-4 left-4 flex items-center gap-2 text-white/80 hover:text-white text-sm backdrop-blur-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all"
      >
        ← Back to Colleges
      </Link>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
        <div className="max-w-5xl mx-auto flex items-end justify-between gap-4">
          <div className="min-w-0">
            {/* Badges row */}
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="gold">#{college.ranking.nirf} NIRF</Badge>
              <Badge variant={college.type === "Government" ? "green" : "blue"}>{college.type}</Badge>
              {college.accreditation.map((a) => (
                <Badge key={a} variant="default" className="bg-white/20 text-white border-white/20">
                  {a}
                </Badge>
              ))}
            </div>

            {/* Name & location */}
            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {college.name}
            </h1>
            <p className="text-white/70 text-sm mt-1">
              📍 {college.location} · Est. {college.established} · {college.campusSize}
            </p>
          </div>

          {/* Right actions */}
          <div className="flex-shrink-0 flex flex-col items-end gap-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2.5 text-center min-w-[72px]">
              <p className="text-2xl font-black text-amber-400">{college.rating}</p>
              <p className="text-white/60 text-[10px] uppercase tracking-wide">Rating</p>
            </div>
            <button
              onClick={() => (added ? remove(college.id) : add(college.id))}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                added
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-slate-800 hover:bg-blue-50"
              }`}
            >
              {added ? "✓ In Compare" : "+ Compare"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
