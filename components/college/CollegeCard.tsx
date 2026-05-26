"use client";

import Link from "next/link";
import { useCompareStore } from "@/store/compare-store";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";
import type { College, ViewMode } from "@/types/college";

interface CollegeCardProps {
  college: College;
  view?: ViewMode;
}

export function CollegeCard({ college, view = "grid" }: CollegeCardProps) {
  const { isAdded, add, remove } = useCompareStore();
  const added = isAdded(college.id);

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    added ? remove(college.id) : add(college.id);
  };

  if (view === "list") {
    return (
      <Link href={`/colleges/${college.id}`} className="group block">
        <div className="bg-white rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 p-4 flex gap-4">
          <div className="w-32 h-24 flex-shrink-0 rounded-xl overflow-hidden">
            <img
              src={college.image}
              alt={college.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-sm leading-snug">
                  {college.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">📍 {college.location}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <span className="text-amber-400 text-xs">★</span>
                <span className="text-xs font-bold text-slate-800">{college.rating.toFixed(1)}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <Badge variant="gold">#{college.ranking.nirf} NIRF</Badge>
              <Badge variant="green">{college.placement.rate}% Placed</Badge>
              <Badge variant={college.type === "Government" ? "blue" : "violet"}>{college.type}</Badge>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex gap-4 text-xs text-slate-500">
                <span>💰 {formatCurrency(college.fees.annual)}/yr</span>
                <span className="hidden sm:inline">
                  📊 Avg: <span className="text-emerald-600 font-semibold">{formatCurrency(college.placement.avg)}</span>
                </span>
              </div>
              <button
                onClick={handleCompare}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                  added ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                {added ? "✓ Added" : "+ Compare"}
              </button>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/colleges/${college.id}`} className="group block h-full">
      <div className="bg-white rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div className="relative h-44 overflow-hidden flex-shrink-0">
          <img
            src={college.image}
            alt={college.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute top-3 left-3">
            <Badge variant="gold">#{college.ranking.nirf} NIRF</Badge>
          </div>
          <div className="absolute top-3 right-3">
            <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${college.type === "Government" ? "bg-emerald-500" : "bg-blue-500"} text-white`}>
              {college.type}
            </span>
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <div>
              <h3 className="font-bold text-white text-sm leading-tight">{college.name}</h3>
              <p className="text-white/75 text-xs mt-0.5">📍 {college.location}</p>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-amber-400 text-xs">★</span>
              <span className="text-white text-xs font-bold">{college.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {college.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="blue">{tag}</Badge>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-slate-50 rounded-xl p-2.5">
              <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">Annual Fees</p>
              <p className="font-bold text-slate-800 text-sm mt-0.5">{formatCurrency(college.fees.annual)}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-2.5">
              <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">Avg Package</p>
              <p className="font-bold text-emerald-600 text-sm mt-0.5">{formatCurrency(college.placement.avg)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-full rounded-full"
                style={{ width: `${college.placement.rate}%` }}
              />
            </div>
            <span className="text-xs font-medium text-slate-500 flex-shrink-0">{college.placement.rate}% placed</span>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {college.topRecruiters.slice(0, 3).map((r) => (
              <span key={r} className="text-[10px] bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-slate-500">{r}</span>
            ))}
            {college.topRecruiters.length > 3 && (
              <span className="text-[10px] text-slate-400 self-center">+{college.topRecruiters.length - 3}</span>
            )}
          </div>

          <button
            onClick={handleCompare}
            className={`mt-auto w-full py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              added ? "bg-blue-600 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            {added ? "✓ Added to Compare" : "+ Add to Compare"}
          </button>
        </div>
      </div>
    </Link>
  );
}
