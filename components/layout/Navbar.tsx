"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCompareStore } from "@/store/compare-store";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/constants";

const NAV_LINKS = [
  { href: "/",          label: "Home"     },
  { href: "/colleges",  label: "Colleges" },
  { href: "/compare",   label: "Compare"  },
  { href: "/predictor", label: "Predictor"},
];

export function Navbar() {
  const pathname = usePathname();
  const { ids } = useCompareStore();

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-blue-300 transition-shadow">
            <span className="text-white text-xs font-black">CM</span>
          </div>
          <span className="font-black text-slate-800 dark:text-white text-sm tracking-tight">
            {SITE_NAME}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex items-center gap-0.5" aria-label="Main navigation">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            const isCompare = link.href === "/compare";
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
                    : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                )}
              >
                {link.label}
                {isCompare && ids.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {ids.length}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/predictor"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm shadow-blue-200"
          >
            ✨ Predict My College
          </Link>
        </div>
      </div>

      {/* Mobile tab bar */}
      <nav className="sm:hidden flex border-t border-slate-100 dark:border-slate-800 overflow-x-auto" aria-label="Mobile navigation">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;
          const isCompare = link.href === "/compare";
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative flex-1 min-w-0 py-2.5 px-3 text-xs font-medium whitespace-nowrap text-center transition-colors",
                isActive
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-slate-500 dark:text-slate-400"
              )}
            >
              {link.label}
              {isCompare && ids.length > 0 && (
                <span className="ml-1 inline-flex w-4 h-4 bg-blue-600 text-white text-[9px] font-bold rounded-full items-center justify-center">
                  {ids.length}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
