"use client";

import Link from "next/link";
import { useCompareStore } from "@/store/compare-store";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";
import { COLLEGES } from "@/lib/data";
import type { College } from "@/types/college";

type MetricRow = {
  label: string;
  getValue: (c: College) => number | string;
  format: (v: number | string) => string;
  bestFn?: (vals: (number | string)[]) => number | string;
  type: "number" | "string";
};

const METRICS: MetricRow[] = [
  {
    label: "NIRF Ranking",
    getValue: (c) => c.ranking.nirf,
    format: (v) => `#${v}`,
    bestFn: (vals) => Math.min(...(vals as number[])),
    type: "number",
  },
  {
    label: "Rating",
    getValue: (c) => c.rating,
    format: (v) => `★ ${v}`,
    bestFn: (vals) => Math.max(...(vals as number[])),
    type: "number",
  },
  {
    label: "Annual Fees",
    getValue: (c) => c.fees.annual,
    format: (v) => formatCurrency(v as number),
    bestFn: (vals) => Math.min(...(vals as number[])),
    type: "number",
  },
  {
    label: "Avg Package",
    getValue: (c) => c.placement.avg,
    format: (v) => formatCurrency(v as number),
    bestFn: (vals) => Math.max(...(vals as number[])),
    type: "number",
  },
  {
    label: "Highest Package",
    getValue: (c) => c.placement.highest,
    format: (v) => formatCurrency(v as number),
    bestFn: (vals) => Math.max(...(vals as number[])),
    type: "number",
  },
  {
    label: "Placement Rate",
    getValue: (c) => c.placement.rate,
    format: (v) => `${v}%`,
    bestFn: (vals) => Math.max(...(vals as number[])),
    type: "number",
  },
  {
    label: "Campus Size",
    getValue: (c) => c.campusSize,
    format: (v) => String(v),
    type: "string",
  },
  {
    label: "Established",
    getValue: (c) => c.established,
    format: (v) => String(v),
    bestFn: (vals) => Math.min(...(vals as number[])),
    type: "number",
  },
];

function InsightBar({ colleges }: { colleges: College[] }) {
  if (colleges.length < 2) return null;

  const bestPlacement = colleges.reduce((a, b) =>
    a.placement.avg > b.placement.avg ? a : b
  );
  const mostAffordable = colleges.reduce((a, b) =>
    a.fees.annual < b.fees.annual ? a : b
  );
  const topRanked = colleges.reduce((a, b) =>
    a.ranking.nirf < b.ranking.nirf ? a : b
  );

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-4 mb-6">
      <h3 className="font-bold text-slate-800 text-sm mb-3">🔍 Quick Insights</h3>
      <div className="grid sm:grid-cols-3 gap-3">
        {[
          {
            label: "Best Placements",
            name: bestPlacement.shortName,
            sub: `${formatCurrency(bestPlacement.placement.avg)} avg`,
            color: "text-emerald-600",
          },
          {
            label: "Most Affordable",
            name: mostAffordable.shortName,
            sub: `${formatCurrency(mostAffordable.fees.annual)}/yr`,
            color: "text-blue-600",
          },
          {
            label: "Top Ranked",
            name: topRanked.shortName,
            sub: `NIRF #${topRanked.ranking.nirf}`,
            color: "text-violet-600",
          },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-xl p-3">
            <p className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold mb-0.5">
              {item.label}
            </p>
            <p className={`font-bold text-sm ${item.color}`}>{item.name}</p>
            <p className="text-xs text-slate-500">{item.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CompareTable() {
  const { ids, remove, clear } = useCompareStore();
  const colleges = ids.map((id) => COLLEGES.find((c) => c.id === id)).filter(Boolean) as College[];

  if (colleges.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <p className="text-6xl mb-4">⚖️</p>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">No Colleges Selected</h2>
        <p className="text-slate-500 text-sm mb-6 max-w-xs">
          Add up to 3 colleges from the listing page to compare them side by side.
        </p>
        <Link
          href="/colleges"
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          Browse Colleges
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Compare Colleges</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {colleges.length} of 3 colleges selected
          </p>
        </div>
        <button
          onClick={clear}
          className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
        >
          Clear All
        </button>
      </div>

      <InsightBar colleges={colleges} />

      {/* Scrollable table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-100">
        <table className="w-full min-w-[600px] bg-white">
          {/* College Headers */}
          <thead>
            <tr className="border-b border-slate-100">
              <th className="w-44 p-4 text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Metric
                </span>
              </th>
              {colleges.map((c) => (
                <th key={c.id} className="p-4 text-left min-w-[180px]">
                  <div className="relative">
                    {/* Remove button */}
                    <button
                      onClick={() => remove(c.id)}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-slate-100 hover:bg-red-100 hover:text-red-500 rounded-full flex items-center justify-center text-xs text-slate-400 transition-colors"
                      aria-label={`Remove ${c.name}`}
                    >
                      ✕
                    </button>
                    {/* Image */}
                    <div className="w-full h-28 rounded-xl overflow-hidden mb-3">
                      <img
                        src={c.image}
                        alt={c.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="font-bold text-slate-800 text-sm leading-snug">{c.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">📍 {c.location}</p>
                    <Link
                      href={`/colleges/${c.id}`}
                      className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                    >
                      View Details →
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Metric rows */}
          <tbody>
            {METRICS.map((metric) => {
              const vals = colleges.map((c) => metric.getValue(c));
              const bestVal = metric.bestFn ? metric.bestFn(vals) : null;

              return (
                <tr key={metric.label} className="border-b border-slate-50 last:border-none hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold text-slate-500">{metric.label}</span>
                  </td>
                  {colleges.map((c, i) => {
                    const val = vals[i];
                    const isBest = bestVal !== null && val === bestVal;
                    return (
                      <td key={c.id} className="px-4 py-3">
                        <div
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all ${
                            isBest
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-50 text-slate-700"
                          }`}
                        >
                          {metric.format(val)}
                          {isBest && <span className="text-xs">🏆</span>}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}

            {/* Exams */}
            <tr className="border-b border-slate-50 hover:bg-slate-50/50">
              <td className="px-4 py-3">
                <span className="text-xs font-semibold text-slate-500">Exams Accepted</span>
              </td>
              {colleges.map((c) => (
                <td key={c.id} className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {c.exams.map((e) => (
                      <Badge key={e} variant="blue">{e}</Badge>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* Accreditation */}
            <tr className="border-b border-slate-50 hover:bg-slate-50/50">
              <td className="px-4 py-3">
                <span className="text-xs font-semibold text-slate-500">Accreditation</span>
              </td>
              {colleges.map((c) => (
                <td key={c.id} className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {c.accreditation.map((a) => (
                      <Badge key={a} variant="violet">{a}</Badge>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* Top Recruiters */}
            <tr className="hover:bg-slate-50/50">
              <td className="px-4 py-3">
                <span className="text-xs font-semibold text-slate-500">Top Recruiters</span>
              </td>
              {colleges.map((c) => (
                <td key={c.id} className="px-4 py-3">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {c.topRecruiters.slice(0, 4).join(" · ")}
                  </p>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Visual Package Bar */}
      <div className="mt-6 bg-white rounded-2xl border border-slate-100 p-5">
        <h3 className="font-bold text-slate-800 text-sm mb-4">Average Package Comparison</h3>
        <div className="space-y-3">
          {colleges.map((c) => {
            const maxPkg = Math.max(...colleges.map((x) => x.placement.avg));
            const pct = Math.round((c.placement.avg / maxPkg) * 100);
            return (
              <div key={c.id}>
                <div className="flex justify-between items-center text-sm mb-1.5">
                  <span className="font-semibold text-slate-700">{c.shortName}</span>
                  <span className="text-emerald-600 font-bold">{formatCurrency(c.placement.avg)}</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-1000"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
