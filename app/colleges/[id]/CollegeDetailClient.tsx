"use client";

import { useState } from "react";
import { CollegeHero } from "@/components/college/CollegeHero";
import { Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import { formatCurrency } from "@/lib/utils";
import type { College } from "@/types/college";

type Tab = "overview" | "courses" | "placements" | "reviews" | "gallery";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview",   label: "Overview"      },
  { id: "courses",    label: "Courses & Fees"},
  { id: "placements", label: "Placements"    },
  { id: "reviews",    label: "Reviews"       },
  { id: "gallery",    label: "Gallery"       },
];

export function CollegeDetailClient({ college }: { college: College }) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [courseSearch, setCourseSearch] = useState("");

  const filteredCourses = college.courses.filter((c) =>
    c.name.toLowerCase().includes(courseSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-28">
      <CollegeHero college={college} />

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* ── Main Content ─────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Tab nav */}
            <div className="flex gap-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-1 mb-6 overflow-x-auto shadow-sm">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ── OVERVIEW ──────────────────────────── */}
            {activeTab === "overview" && (
              <div className="space-y-4">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5">
                  <h2 className="font-bold text-slate-800 dark:text-white mb-3 text-base">About {college.name}</h2>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{college.description}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                    {college.highlights.map((h) => (
                      <div key={h} className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 text-center">
                        <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 leading-snug">{h}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5">
                  <h2 className="font-bold text-slate-800 dark:text-white mb-3 text-base">Campus Facilities</h2>
                  <div className="flex flex-wrap gap-2">
                    {college.facilities.map((f) => (
                      <span key={f} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-300">
                        ✓ {f}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5">
                  <h2 className="font-bold text-slate-800 dark:text-white mb-3 text-base">Top Recruiting Companies</h2>
                  <div className="flex flex-wrap gap-2">
                    {college.topRecruiters.map((r) => (
                      <div key={r} className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                          {r[0]}
                        </div>
                        {r}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── COURSES ───────────────────────────── */}
            {activeTab === "courses" && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5">
                <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                  <h2 className="font-bold text-slate-800 dark:text-white text-base">Courses & Fees</h2>
                  <input
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                    placeholder="Search course…"
                    className="text-sm border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-400 w-full sm:w-auto"
                  />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[560px]">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800">
                        {["Course Name", "Duration", "Annual Fees", "Seats", "Cutoff"].map((h) => (
                          <th key={h} className="text-left py-2.5 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCourses.map((course, i) => (
                        <tr key={i} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors">
                          <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-100">{course.name}</td>
                          <td className="py-3 px-3 text-slate-500 dark:text-slate-400">{course.duration}</td>
                          <td className="py-3 px-3 font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(course.fees)}</td>
                          <td className="py-3 px-3 text-slate-500 dark:text-slate-400">{course.seats}</td>
                          <td className="py-3 px-3"><Badge variant="blue">{course.cutoff}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredCourses.length === 0 && (
                    <p className="text-center text-slate-400 py-10">No courses match your search.</p>
                  )}
                </div>
              </div>
            )}

            {/* ── PLACEMENTS ────────────────────────── */}
            {activeTab === "placements" && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Placement Rate", value: `${college.placement.rate}%`, color: "text-emerald-600" },
                    { label: "Average Package", value: formatCurrency(college.placement.avg), color: "text-blue-600" },
                    { label: "Highest Package", value: formatCurrency(college.placement.highest), color: "text-violet-600" },
                  ].map((s) => (
                    <div key={s.label} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 text-center">
                      <p className={`text-xl sm:text-2xl font-black ${s.color}`}>{s.value}</p>
                      <p className="text-[10px] sm:text-xs text-slate-400 mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5">
                  <h2 className="font-bold text-slate-800 dark:text-white mb-4 text-base">Package Breakdown</h2>
                  {[
                    { label: "Average Package", val: college.placement.avg, color: "#3b82f6" },
                    { label: "Median Package", val: college.placement.median ?? Math.round(college.placement.avg * 0.85), color: "#8b5cf6" },
                    { label: "Highest Package", val: college.placement.highest, color: "#10b981" },
                  ].map((item) => (
                    <div key={item.label} className="mb-3">
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-slate-600 dark:text-slate-300">{item.label}</span>
                        <span className="font-bold text-slate-800 dark:text-white">{formatCurrency(item.val)}</span>
                      </div>
                      <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${Math.round((item.val / college.placement.highest) * 100)}%`, backgroundColor: item.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5">
                  <h2 className="font-bold text-slate-800 dark:text-white mb-3 text-base">Top Recruiters</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {college.topRecruiters.map((r) => (
                      <div key={r} className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {r[0]}
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{r}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── REVIEWS ───────────────────────────── */}
            {activeTab === "reviews" && (
              <div className="space-y-4">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5">
                  <div className="flex items-center gap-6">
                    <div className="text-center flex-shrink-0">
                      <p className="text-5xl font-black text-slate-800 dark:text-white">{college.rating}</p>
                      <p className="text-amber-400 text-xl mt-0.5">{"★".repeat(Math.round(college.rating))}</p>
                      <p className="text-xs text-slate-400 mt-1">{college.totalRating.toLocaleString()} reviews</p>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const pct = star === 5 ? 60 : star === 4 ? 25 : star === 3 ? 10 : star === 2 ? 3 : 2;
                        return (
                          <div key={star} className="flex items-center gap-2">
                            <span className="text-xs w-5 text-slate-400 flex-shrink-0">{star}★</span>
                            <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-amber-400 h-full rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-[10px] text-slate-400 w-6">{pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {college.reviews.map((review, i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {review.author[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-white text-sm">{review.author}</p>
                          <p className="text-xs text-slate-400">{review.course} · Batch of {review.batch}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg flex-shrink-0">
                        <span className="text-amber-400 text-sm">★</span>
                        <span className="text-sm font-bold text-slate-800 dark:text-white">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{review.text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* ── GALLERY ───────────────────────────── */}
            {activeTab === "gallery" && (
              <div>
                {[college.image, ...college.gallery].length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[college.image, ...college.gallery].map((img, i) => (
                      <img key={i} src={img} alt={`${college.name} campus ${i + 1}`} className="w-full h-56 object-cover rounded-2xl" />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="text-slate-400">No gallery images available.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Sticky Sidebar ───────────────────────── */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-20 space-y-3">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4">
                <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-3">Quick Facts</h3>
                <div className="space-y-2.5">
                  {[
                    { label: "NIRF Rank",     value: `#${college.ranking.nirf}` },
                    { label: "Annual Fees",    value: formatCurrency(college.fees.annual) },
                    { label: "Avg Package",    value: formatCurrency(college.placement.avg) },
                    { label: "Placement Rate", value: `${college.placement.rate}%` },
                    { label: "Campus Size",    value: college.campusSize },
                    { label: "Established",    value: String(college.established) },
                    { label: "Type",           value: college.type },
                  ].map((f) => (
                    <div key={f.label} className="flex justify-between items-center py-1.5 border-b border-slate-50 dark:border-slate-800 last:border-none">
                      <span className="text-[11px] text-slate-400">{f.label}</span>
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 text-right max-w-[90px] leading-snug">{f.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4">
                <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-2">Exams Accepted</h3>
                <div className="flex flex-wrap gap-1.5">
                  {college.exams.map((e) => <Badge key={e} variant="blue">{e}</Badge>)}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4">
                <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-2">Accreditation</h3>
                <div className="flex flex-wrap gap-1.5">
                  {college.accreditation.map((a) => <Badge key={a} variant="violet">{a}</Badge>)}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 text-center">
                <StarRating rating={college.rating} totalRating={college.totalRating} size="md" className="justify-center" />
                <p className="text-xs text-slate-400 mt-1">Overall Rating</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
