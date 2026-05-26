import { CompareTable } from "@/components/college/CompareTable";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Colleges",
  description: "Compare IITs, NITs, and top private colleges side by side. Fees, placements, rankings, and more.",
};

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Page hero */}
      <div className="bg-gradient-to-br from-violet-700 via-indigo-800 to-blue-900 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-1">Compare Colleges</h1>
          <p className="text-violet-200 text-sm">
            Side-by-side comparison — fees, placements, rankings &amp; more
          </p>
        </div>
      </div>

      <CompareTable />
    </div>
  );
}
