import type { CollegeFilters } from "@/types/college";

export const DEFAULT_FILTERS: CollegeFilters = {
  type: [],
  state: [],
  exam: [],
  stream: [],
  rating: null,
  maxFees: null,
};

export const SORT_OPTIONS = [
  { value: "ranking",   label: "NIRF Ranking"       },
  { value: "rating",    label: "Rating"              },
  { value: "placement", label: "Avg Package"         },
  { value: "fees_asc",  label: "Fees: Low → High"   },
  { value: "fees_desc", label: "Fees: High → Low"   },
] as const;

export const MAX_FEES_OPTIONS = [
  { label: "Under ₹1.5L", value: 150000 },
  { label: "Under ₹3L",   value: 300000 },
  { label: "Under ₹5L",   value: 500000 },
] as const;

export const RATING_OPTIONS = [4.5, 4.0, 3.5] as const;

export const PREDICTOR_EXAMS = ["JEE Advanced", "JEE Main", "BITSAT", "VITEEE"] as const;

export const CATEGORIES = ["General", "OBC", "SC", "ST", "EWS"] as const;

export const PER_PAGE = 6;

export const MAX_COMPARE = 3;

export const SITE_NAME = "CollegeMatch";

export const SITE_DESCRIPTION =
  "India's most trusted college discovery platform. Compare IITs, NITs & top private colleges. Make data-driven decisions.";
