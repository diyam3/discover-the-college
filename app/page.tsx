"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CollegeCard } from "@/components/college/CollegeCard";
import { COLLEGES, STATS, TRENDING_COLLEGES } from "@/lib/data";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
import { formatNumber } from "@/lib/utils";
import { SITE_NAME } from "@/constants";

// ── Animated stat counter ────────────────────────────────────
function StatCounter({ target, label, suffix = "" }: { target: number; label: string; suffix?: string }) {
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const value = useAnimatedCounter(target, 2000, started);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setStarted(true); observer.disconnect(); }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="text-center">
      <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
        {formatNumber(value)}{suffix}
      </p>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">{label}</p>
    </div>
  );
}

// ── Hero search bar ──────────────────────────────────────────
function HeroSearch() {
  const [query, setQuery] = useState("");
  return (
    <form
      action="/colleges"
      method="get"
      className="flex gap-2 max-w-xl w-full mx-auto"
    >
      <div className="flex-1 relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">🔍</span>
        <input
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search college, city, or stream…"
          className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/10 text-white placeholder-blue-200/70 border border-white/20 focus:outline-none focus:border-white/50 backdrop-blur-sm text-sm"
          autoComplete="off"
        />
      </div>
      <button
        type="submit"
        className="px-5 py-3.5 bg-blue-500 hover:bg-blue-400 text-white rounded-2xl font-semibold text-sm transition-colors shadow-lg shadow-blue-900/30"
      >
        Search
      </button>
    </form>
  );
}

// ── Quick Action Card ────────────────────────────────────────
function ActionCard({
  icon, title, description, href, cta,
}: {
  icon: string; title: string; description: string; href: string; cta: string;
}) {
  return (
    <Link
      href={href}
      className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-lg transition-all duration-300 p-5 flex flex-col"
    >
      <span className="text-3xl mb-3">{icon}</span>
      <h3 className="font-bold text-slate-800 dark:text-white mb-1 group-hover:text-blue-600 transition-colors text-sm">
        {title}
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 flex-1 mb-3">{description}</p>
      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform inline-block">
        {cta} →
      </span>
    </Link>
  );
}

// ── Page ─────────────────────────────────────────────────────
export default function HomePage() {
  const featuredColleges = TRENDING_COLLEGES.map((id) =>
    COLLEGES.find((c) => c.id === id)
  ).filter(Boolean) as typeof COLLEGES;

  return (
    <div className="min-h-screen">
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 pt-16 pb-28 px-4 overflow-hidden">
        {/* Background glows */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(59,130,246,0.25) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(99,102,241,0.2) 0%, transparent 60%)",
          }}
        />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
            <span className="text-blue-300 text-xs font-semibold uppercase tracking-wide">
              India's Most Trusted College Discovery Platform
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-4">
            Discover Your{" "}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Perfect
            </span>
            <br />College Match
          </h1>
          <p className="text-slate-300 text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            Compare IITs, NITs &amp; top private colleges. Make data-driven decisions for your engineering career.
          </p>

          <HeroSearch />

          {/* Trending pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <span className="text-slate-400 text-xs self-center">Trending:</span>
            {["IIT Bombay", "NIT Trichy", "BITS Pilani", "IIIT Delhi", "DTU"].map((t) => (
              <Link
                key={t}
                href={`/colleges?q=${encodeURIComponent(t)}`}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full text-slate-300 text-xs transition-all"
              >
                {t}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────── */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 py-8 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          <StatCounter target={STATS.colleges} label="Colleges Listed" suffix="+" />
          <StatCounter target={Math.round(STATS.students / 1000)} label="Students Helped" suffix="K+" />
          <StatCounter target={Math.round(STATS.reviews / 100000)} label="Reviews (×100K)" suffix="M+" />
          <StatCounter target={97} label="Avg Placement Rate" suffix="%" />
        </div>
      </section>

      {/* ── Quick Actions ───────────────────────────────────── */}
      <section className="py-14 px-4 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Everything You Need
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Powerful tools to make the right decision
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ActionCard icon="🏛️" title="Explore Colleges" description="Search & filter 1,200+ colleges with advanced filters" href="/colleges" cta="Browse Now" />
            <ActionCard icon="⚖️" title="Compare Colleges" description="Side-by-side comparison of up to 3 colleges" href="/compare" cta="Start Comparing" />
            <ActionCard icon="🎯" title="Predict Chances" description="AI-powered admission predictor based on your rank" href="/predictor" cta="Try Predictor" />
            <ActionCard icon="📊" title="NIRF Rankings" description="Official NIRF, QS & Times rankings data" href="/colleges?sort=ranking" cta="View Rankings" />
          </div>
        </div>
      </section>

      {/* ── Featured Colleges ───────────────────────────────── */}
      <section className="py-14 px-4 bg-white dark:bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Featured Colleges
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                Top-ranked engineering institutions in India
              </p>
            </div>
            <Link
              href="/colleges"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-semibold flex-shrink-0"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredColleges.map((c) => (
              <CollegeCard key={c.id} college={c} />
            ))}
          </div>
        </div>
      </section>

      {/* ── College Categories ──────────────────────────────── */}
      <section className="py-14 px-4 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "IITs",     icon: "🏆", desc: "Indian Institutes of Technology", filter: "IIT" },
              { label: "NITs",     icon: "🎓", desc: "National Institutes of Technology", filter: "NIT" },
              { label: "IIITs",    icon: "💻", desc: "Institutes of IT", filter: "IIIT" },
              { label: "Private",  icon: "🏫", desc: "Top Private Universities", filter: "Private" },
            ].map((cat) => (
              <Link
                key={cat.label}
                href={`/colleges?q=${cat.filter}`}
                className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-md p-5 text-center transition-all duration-300"
              >
                <span className="text-3xl">{cat.icon}</span>
                <p className="font-bold text-slate-800 dark:text-white mt-2 group-hover:text-blue-600 transition-colors text-sm">
                  {cat.label}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────── */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Ready to Find Your College?
          </h2>
          <p className="text-blue-200 text-sm mb-7 max-w-md mx-auto">
            Join 850,000+ students who made smarter college decisions with {SITE_NAME}.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/predictor"
              className="px-6 py-3 bg-white text-blue-700 rounded-xl font-bold hover:shadow-xl transition-all text-sm"
            >
              ✨ Try Predictor Tool
            </Link>
            <Link
              href="/colleges"
              className="px-6 py-3 bg-blue-500/40 hover:bg-blue-500/60 text-white rounded-xl font-bold transition-all text-sm border border-white/20"
            >
              🏛️ Explore Colleges
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-md flex items-center justify-center">
              <span className="text-white text-[10px] font-black">CM</span>
            </div>
            <span className="font-bold text-white text-sm">{SITE_NAME}</span>
          </div>
          <p className="text-xs text-center">
            Data sourced from NIRF, official college websites &amp; verified student reviews.
          </p>
          <p className="text-xs">© {new Date().getFullYear()} {SITE_NAME}</p>
        </div>
      </footer>
    </div>
  );
}
