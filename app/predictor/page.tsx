"use client";

import { useState } from "react";
import Link from "next/link";
import { useCompareStore } from "@/store/compare-store";
import { ChanceBadge } from "@/components/ui/Badge";
import { predictColleges } from "@/lib/predictor";
import { getAllStates } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { PREDICTOR_EXAMS, CATEGORIES } from "@/constants";
import type { PredictorForm, PredictionResult } from "@/types/college";

// ── Step definitions ─────────────────────────────────────────
type Step = 1 | 2 | 3;

const STEP_LABELS: Record<Step, string> = {
  1: "Select Exam",
  2: "Enter Rank",
  3: "Your Profile",
};

function StepIndicator({ current }: { current: Step }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {([1, 2, 3] as Step[]).map((s) => (
        <div key={s} className="flex items-center gap-2 flex-1">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              current > s
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                : current === s
                ? "bg-blue-500 text-white ring-4 ring-blue-500/30 shadow-lg shadow-blue-500/30"
                : "bg-white/10 text-white/40"
            }`}
          >
            {current > s ? "✓" : s}
          </div>
          <span className={`text-xs hidden sm:inline transition-colors ${current === s ? "text-white font-medium" : "text-white/40"}`}>
            {STEP_LABELS[s]}
          </span>
          {s < 3 && (
            <div className={`flex-1 h-0.5 rounded-full transition-colors ${current > s ? "bg-emerald-500" : "bg-white/10"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Prediction card ──────────────────────────────────────────
function PredictionCard({
  result,
  rank,
}: {
  result: PredictionResult;
  rank: number;
}) {
  const { isAdded, add, remove } = useCompareStore();
  const added = isAdded(result.college.id);

  return (
    <Link href={`/colleges/${result.college.id}`} className="block group">
      <div className="bg-white/5 hover:bg-white/8 backdrop-blur-sm border border-white/10 hover:border-white/25 rounded-2xl p-4 transition-all duration-300">
        <div className="flex gap-3">
          <img
            src={result.college.image}
            alt={result.college.name}
            className="w-16 h-16 object-cover rounded-xl flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div>
                <p className="font-bold text-white text-sm group-hover:text-blue-300 transition-colors leading-snug">
                  {result.college.name}
                </p>
                <p className="text-slate-400 text-xs mt-0.5">📍 {result.college.location}</p>
              </div>
              <ChanceBadge chance={result.chance} />
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-400">
              <span>#{result.college.ranking.nirf} NIRF</span>
              <span>💰 {formatCurrency(result.college.fees.annual)}/yr</span>
              <span>📊 {formatCurrency(result.college.placement.avg)} avg pkg</span>
            </div>

            {/* Chance bar */}
            <div className="flex items-center gap-2 mt-2.5">
              <div className="flex-1 bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    result.chance >= 75
                      ? "bg-emerald-400"
                      : result.chance >= 45
                      ? "bg-amber-400"
                      : "bg-red-400"
                  }`}
                  style={{ width: `${result.chance}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-300 font-semibold flex-shrink-0">
                {result.chance}% match
              </span>
            </div>
          </div>
        </div>

        {/* Compare shortcut */}
        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
          <span className="text-xs text-slate-500">{result.cutoffNote}</span>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              added ? remove(result.college.id) : add(result.college.id);
            }}
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
              added
                ? "bg-blue-600 text-white"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            {added ? "✓ In Compare" : "+ Compare"}
          </button>
        </div>
      </div>
    </Link>
  );
}

// ── Main page ────────────────────────────────────────────────
export default function PredictorPage() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<PredictorForm>({
    exam: "",
    rank: "",
    category: "General",
    state: "",
  });
  const [results, setResults] = useState<PredictionResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [predicted, setPredicted] = useState(false);

  const states = getAllStates();

  const isStepValid = (s: Step): boolean => {
    if (s === 1) return form.exam !== "";
    if (s === 2) return form.rank !== "" && parseInt(form.rank) > 0;
    if (s === 3) return form.category !== "" && form.state !== "";
    return false;
  };

  const handlePredict = () => {
    setLoading(true);
    setTimeout(() => {
      const res = predictColleges(form);
      setResults(res);
      setLoading(false);
      setPredicted(true);
    }, 1800);
  };

  const handleReset = () => {
    setStep(1);
    setForm({ exam: "", rank: "", category: "General", state: "" });
    setResults([]);
    setPredicted(false);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950">
      {/* Background glows */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 40%, rgba(59,130,246,0.18) 0%, transparent 55%), radial-gradient(circle at 85% 60%, rgba(99,102,241,0.18) 0%, transparent 55%)",
        }}
      />

      <div className="relative max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-4">
            <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">AI-Powered</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">College Predictor</h1>
          <p className="text-slate-400 text-sm max-w-sm mx-auto">
            Get personalised college recommendations based on your entrance rank, category &amp; preferences.
          </p>
        </div>

        {/* Step indicator (visible only during form) */}
        {!predicted && !loading && <StepIndicator current={step} />}

        {/* ── Loading State ──────────────────────── */}
        {loading && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12 text-center">
            <div className="w-14 h-14 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-5" />
            <p className="text-white font-semibold text-lg mb-1">Analysing your profile…</p>
            <p className="text-slate-400 text-sm">
              Matching across {10}+ top colleges in India
            </p>
            <div className="flex justify-center gap-1.5 mt-4">
              {["Checking rank", "Applying category", "Analysing cutoffs"].map((t, i) => (
                <span key={t} className="text-xs text-blue-400 animate-pulse" style={{ animationDelay: `${i * 0.3}s` }}>
                  {t}…
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── Form Steps ─────────────────────────── */}
        {!loading && !predicted && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            {/* Step 1 — Exam */}
            {step === 1 && (
              <div>
                <h2 className="text-white font-bold text-lg mb-1">Select Your Exam</h2>
                <p className="text-slate-400 text-sm mb-5">Which entrance exam are you appearing for?</p>
                <div className="grid grid-cols-2 gap-3">
                  {PREDICTOR_EXAMS.map((exam) => (
                    <button
                      key={exam}
                      onClick={() => setForm((p) => ({ ...p, exam }))}
                      className={`p-4 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                        form.exam === exam
                          ? "bg-blue-500 border-blue-400 text-white shadow-lg shadow-blue-500/30"
                          : "border-white/10 text-white/70 hover:border-white/30 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {exam}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2 — Rank */}
            {step === 2 && (
              <div>
                <h2 className="text-white font-bold text-lg mb-1">Enter Your Rank</h2>
                <p className="text-slate-400 text-sm mb-5">
                  Your <span className="text-blue-400 font-medium">{form.exam}</span> rank or score
                </p>
                <input
                  type="number"
                  value={form.rank}
                  onChange={(e) => setForm((p) => ({ ...p, rank: e.target.value }))}
                  placeholder={form.exam === "BITSAT" ? "e.g. 320 (score)" : "e.g. 5000"}
                  min="1"
                  className="w-full bg-white/5 border border-white/15 hover:border-white/25 focus:border-blue-400 rounded-xl px-4 py-4 text-white placeholder-white/25 focus:outline-none text-xl font-mono transition-colors"
                  autoFocus
                />
                <p className="text-xs text-slate-500 mt-2">
                  {form.exam === "BITSAT" ? "Enter your BITSAT score (out of 450)" : "Enter your All India Rank (AIR)"}
                </p>
              </div>
            )}

            {/* Step 3 — Profile */}
            {step === 3 && (
              <div>
                <h2 className="text-white font-bold text-lg mb-1">Your Profile</h2>
                <p className="text-slate-400 text-sm mb-5">
                  Help us personalise predictions with category &amp; state preferences.
                </p>

                <div className="space-y-5">
                  {/* Category */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
                      Category
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setForm((p) => ({ ...p, category: cat }))}
                          className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                            form.category === cat
                              ? "bg-blue-500 border-blue-400 text-white shadow-lg shadow-blue-500/20"
                              : "border-white/10 text-white/70 hover:border-white/30 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Home state */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
                      Home State <span className="text-slate-500 font-normal normal-case">(for state quota benefits)</span>
                    </label>
                    <select
                      value={form.state}
                      onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))}
                      className="w-full bg-white/5 border border-white/15 hover:border-white/25 focus:border-blue-400 rounded-xl px-4 py-3 text-white focus:outline-none text-sm transition-colors appearance-none"
                    >
                      <option value="" className="bg-slate-900">Select your home state…</option>
                      {states.map((s) => (
                        <option key={s} value={s} className="bg-slate-900">{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex gap-3 mt-7">
              {step > 1 && (
                <button
                  onClick={() => setStep((s) => (s - 1) as Step)}
                  className="px-5 py-3 border border-white/15 text-white/70 hover:border-white/30 hover:text-white rounded-xl text-sm font-semibold transition-all"
                >
                  ← Back
                </button>
              )}

              {step < 3 ? (
                <button
                  onClick={() => setStep((s) => (s + 1) as Step)}
                  disabled={!isStepValid(step)}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                    isStepValid(step)
                      ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                      : "bg-white/5 text-white/25 cursor-not-allowed"
                  }`}
                >
                  Continue →
                </button>
              ) : (
                <button
                  onClick={handlePredict}
                  disabled={!isStepValid(3)}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                    isStepValid(3)
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/50"
                      : "bg-white/5 text-white/25 cursor-not-allowed"
                  }`}
                >
                  ✨ Predict My Colleges
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Results ────────────────────────────── */}
        {predicted && !loading && (
          <div>
            {/* Summary header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-white font-bold text-lg">Your Predictions</h2>
                <p className="text-slate-400 text-xs mt-0.5">
                  {form.exam} · Rank {parseInt(form.rank).toLocaleString()} · {form.category} · {form.state}
                </p>
              </div>
              <button
                onClick={handleReset}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors flex-shrink-0 ml-4"
              >
                ↩ Predict Again
              </button>
            </div>

            {/* Legend */}
            <div className="flex gap-3 mb-5 flex-wrap">
              {[
                { color: "bg-emerald-400", label: "75%+ Safe" },
                { color: "bg-amber-400",   label: "45–74% Target" },
                { color: "bg-red-400",     label: "<45% Dream" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
                  <span className="text-xs text-slate-400">{l.label}</span>
                </div>
              ))}
            </div>

            {/* Result cards */}
            {results.length > 0 ? (
              <div className="space-y-3">
                {results.map((r, i) => (
                  <PredictionCard key={`${r.college.id}-${i}`} result={r} rank={i + 1} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-3xl mb-3">🔍</p>
                <p className="text-white font-semibold mb-1">No predictions found</p>
                <p className="text-slate-400 text-sm">Try a different rank or exam.</p>
                <button
                  onClick={handleReset}
                  className="mt-4 text-sm text-blue-400 hover:underline"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Disclaimer */}
            <div className="mt-5 bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
              <p className="text-xs text-blue-300 leading-relaxed">
                💡 <strong>Disclaimer:</strong> Predictions are based on historical cutoff data and are indicative only. Actual cutoffs vary each year. Always verify through official counselling portals (JoSAA, CSAB, etc.).
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
