// ============================================================
// CORE TYPES — College Discovery Platform
// ============================================================

export type CollegeType = "Government" | "Private" | "Deemed" | "Autonomous";
export type NirfCategory = "IIT" | "NIT" | "IIIT" | "State" | "Deemed" | "Private";
export type Stream =
  | "Engineering"
  | "Technology"
  | "Science"
  | "Management"
  | "Medical"
  | "Design"
  | "Pharmacy";
export type ExamType =
  | "JEE Advanced"
  | "JEE Main"
  | "BITSAT"
  | "VITEEE"
  | "SRMJEEE"
  | "COMEDK"
  | "MHT-CET"
  | "MET"
  | "KCET"
  | "NEET";
export type Category = "General" | "OBC" | "SC" | "ST" | "EWS";
export type PredictorExam = "JEE Advanced" | "JEE Main" | "BITSAT" | "VITEEE";

// ── College ──────────────────────────────────────────────────

export interface CollegeFees {
  min: number;
  max: number;
  annual: number;
}

export interface CollegePlacement {
  avg: number;
  highest: number;
  rate: number;
  median?: number;
}

export interface CollegeRanking {
  nirf: number;
  qs?: number | null;
  times?: number | null;
}

export interface CourseRow {
  name: string;
  duration: string;
  fees: number;
  seats: number;
  cutoff: string;
}

export interface CollegeReview {
  author: string;
  batch: string;
  rating: number;
  text: string;
  course: string;
}

export interface College {
  id: string;
  name: string;
  shortName: string;
  location: string;
  state: string;
  type: CollegeType;
  streams: Stream[];
  exams: ExamType[];
  ranking: CollegeRanking;
  rating: number;
  totalRating: number;
  fees: CollegeFees;
  placement: CollegePlacement;
  campusSize: string;
  established: number;
  accreditation: string[];
  facilities: string[];
  topRecruiters: string[];
  image: string;
  gallery: string[];
  description: string;
  highlights: string[];
  courses: CourseRow[];
  reviews: CollegeReview[];
  tags: string[];
  nirfCategory: NirfCategory;
}

// ── Filters ──────────────────────────────────────────────────

export type SortKey =
  | "ranking"
  | "rating"
  | "fees_asc"
  | "fees_desc"
  | "placement";

export interface CollegeFilters {
  type: CollegeType[];
  state: string[];
  exam: ExamType[];
  stream: Stream[];
  rating: number | null;
  maxFees: number | null;
}

// ── Predictor ────────────────────────────────────────────────

export interface PredictorForm {
  exam: PredictorExam | "";
  rank: string;
  category: Category;
  state: string;
}

export interface PredictionResult {
  college: College;
  chance: number;
  label: "Safe" | "Target" | "Dream";
  cutoffNote: string;
}

// ── Compare Store ────────────────────────────────────────────

export interface CompareStore {
  ids: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  isAdded: (id: string) => boolean;
}

// ── UI Helpers ───────────────────────────────────────────────

export type BadgeVariant =
  | "default"
  | "blue"
  | "green"
  | "amber"
  | "red"
  | "violet"
  | "gold"
  | "outline";

export type ViewMode = "grid" | "list";
