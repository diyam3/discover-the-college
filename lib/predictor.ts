import { COLLEGES } from "@/lib/data";
import type { PredictorForm, PredictionResult } from "@/types/college";
import { chanceLabel } from "@/lib/utils";

type RankRange = {
  minRank: number;
  maxRank: number;
  collegeIds: string[];
  baseChance: number;
};

const PREDICTOR_MAP: Record<string, RankRange[]> = {
  "JEE Advanced": [
    { minRank: 1,    maxRank: 500,   collegeIds: ["iit-madras", "iit-bombay", "iit-delhi"],          baseChance: 92 },
    { minRank: 501,  maxRank: 2000,  collegeIds: ["iit-bombay", "iit-delhi", "iit-madras"],           baseChance: 62 },
    { minRank: 2001, maxRank: 5000,  collegeIds: ["iit-delhi", "bits-pilani", "iit-madras"],          baseChance: 40 },
    { minRank: 5001, maxRank: 15000, collegeIds: ["bits-pilani", "nit-trichy", "iiit-delhi"],         baseChance: 70 },
  ],
  "JEE Main": [
    { minRank: 1,     maxRank: 5000,   collegeIds: ["nit-trichy", "dtu", "iiit-delhi"],               baseChance: 85 },
    { minRank: 5001,  maxRank: 15000,  collegeIds: ["dtu", "nit-trichy", "nsut"],                     baseChance: 65 },
    { minRank: 15001, maxRank: 40000,  collegeIds: ["nsut", "iiit-delhi", "vit-vellore"],             baseChance: 55 },
    { minRank: 40001, maxRank: 200000, collegeIds: ["vit-vellore", "manipal", "dtu"],                 baseChance: 75 },
  ],
  "BITSAT": [
    { minRank: 1,   maxRank: 100,  collegeIds: ["bits-pilani"],                                       baseChance: 97 },
    { minRank: 101, maxRank: 300,  collegeIds: ["bits-pilani", "vit-vellore"],                        baseChance: 68 },
    { minRank: 301, maxRank: 600,  collegeIds: ["vit-vellore", "manipal"],                            baseChance: 82 },
  ],
  "VITEEE": [
    { minRank: 1,     maxRank: 3000,  collegeIds: ["vit-vellore"],                                    baseChance: 97 },
    { minRank: 3001,  maxRank: 12000, collegeIds: ["vit-vellore", "manipal"],                         baseChance: 80 },
    { minRank: 12001, maxRank: 50000, collegeIds: ["manipal", "vit-vellore"],                         baseChance: 60 },
  ],
};

const CATEGORY_BONUS: Record<string, number> = {
  General: 0,
  EWS:     6,
  OBC:     10,
  SC:      18,
  ST:      22,
};

const STATE_BONUS = 6;

function buildCutoffNote(exam: string, rank: number, category: string): string {
  return `${exam} rank ${rank.toLocaleString()} · ${category} category`;
}

export function predictColleges(form: PredictorForm): PredictionResult[] {
  if (!form.exam || !form.rank) return [];

  const rank = parseInt(form.rank, 10);
  if (isNaN(rank) || rank <= 0) return [];

  const ranges = PREDICTOR_MAP[form.exam] ?? [];
  const categoryBonus = CATEGORY_BONUS[form.category] ?? 0;

  const adjustedRank = rank - rank * (categoryBonus / 100);
  const matchingRange =
    ranges.find((r) => adjustedRank >= r.minRank && adjustedRank <= r.maxRank) ??
    ranges[ranges.length - 1];

  if (!matchingRange) return [];

  const uniqueIds = [...new Set(matchingRange.collegeIds)];
  const results: PredictionResult[] = uniqueIds
    .map((id) => {
      const college = COLLEGES.find((c) => c.id === id);
      if (!college) return null;

      const stateBonus = form.state && college.state === form.state ? STATE_BONUS : 0;
      const chance = Math.min(99, Math.round(matchingRange.baseChance + categoryBonus * 0.5 + stateBonus));

      const result: PredictionResult = {
        college,
        chance,
        label: chanceLabel(chance),
        cutoffNote: buildCutoffNote(form.exam, rank, form.category),
      };
      return result;
    })
    .filter((r): r is PredictionResult => r !== null);

  results.sort((a, b) => b.chance - a.chance);
  return results;
}
