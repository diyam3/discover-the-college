"use client";

import { cn } from "@/lib/utils";
import { RATING_OPTIONS, MAX_FEES_OPTIONS } from "@/constants";
import { getAllStates, getAllExams } from "@/lib/data";
import type { CollegeFilters, CollegeType, ExamType } from "@/types/college";

interface CollegeFiltersProps {
  filters: CollegeFilters;
  onChange: (filters: CollegeFilters) => void;
  onClear: () => void;
  activeCount: number;
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">{title}</p>
      {children}
    </div>
  );
}

function CheckItem({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2 py-1.5 cursor-pointer group select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-3.5 h-3.5 accent-blue-600 rounded"
      />
      <span
        className={cn(
          "text-sm transition-colors",
          checked ? "text-blue-600 font-medium" : "text-slate-600 group-hover:text-slate-900"
        )}
      >
        {label}
      </span>
    </label>
  );
}

export function CollegeFilters({ filters, onChange, onClear, activeCount }: CollegeFiltersProps) {
  const states = getAllStates();
  const exams = getAllExams();

  function toggleArray<T>(arr: T[], val: T): T[] {
    return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-800 text-sm">Filters</h3>
        {activeCount > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-blue-600 hover:underline font-medium"
          >
            Clear all ({activeCount})
          </button>
        )}
      </div>

      <FilterSection title="Ownership">
        {(["Government", "Private", "Deemed"] as CollegeType[]).map((t) => (
          <CheckItem
            key={t}
            label={t}
            checked={filters.type.includes(t)}
            onChange={() => onChange({ ...filters, type: toggleArray(filters.type, t) })}
          />
        ))}
      </FilterSection>

      <FilterSection title="Entrance Exam">
        {exams.map((e) => (
          <CheckItem
            key={e}
            label={e}
            checked={filters.exam.includes(e as ExamType)}
            onChange={() =>
              onChange({ ...filters, exam: toggleArray(filters.exam, e as ExamType) })
            }
          />
        ))}
      </FilterSection>

      <FilterSection title="State">
        <div className="max-h-40 overflow-y-auto pr-1 space-y-0.5">
          {states.map((s) => (
            <CheckItem
              key={s}
              label={s}
              checked={filters.state.includes(s)}
              onChange={() => onChange({ ...filters, state: toggleArray(filters.state, s) })}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Minimum Rating">
        {(RATING_OPTIONS as readonly number[]).map((r) => (
          <label key={r} className="flex items-center gap-2 py-1.5 cursor-pointer group select-none">
            <input
              type="radio"
              name="rating-filter"
              checked={filters.rating === r}
              onChange={() =>
                onChange({ ...filters, rating: filters.rating === r ? null : r })
              }
              className="w-3.5 h-3.5 accent-blue-600"
            />
            <span
              className={cn(
                "text-sm transition-colors",
                filters.rating === r
                  ? "text-blue-600 font-medium"
                  : "text-slate-600 group-hover:text-slate-900"
              )}
            >
              ★ {r}+
            </span>
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Max Annual Fees">
        {(MAX_FEES_OPTIONS as readonly { label: string; value: number }[]).map(({ label, value }) => (
          <label key={value} className="flex items-center gap-2 py-1.5 cursor-pointer group select-none">
            <input
              type="radio"
              name="fees-filter"
              checked={filters.maxFees === value}
              onChange={() =>
                onChange({ ...filters, maxFees: filters.maxFees === value ? null : value })
              }
              className="w-3.5 h-3.5 accent-blue-600"
            />
            <span
              className={cn(
                "text-sm transition-colors",
                filters.maxFees === value
                  ? "text-blue-600 font-medium"
                  : "text-slate-600 group-hover:text-slate-900"
              )}
            >
              {label}
            </span>
          </label>
        ))}
      </FilterSection>
    </div>
  );
}
