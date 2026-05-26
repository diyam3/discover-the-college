# CollegeMatch — College Discovery Platform

A production-grade frontend MVP for Indian engineering college discovery, built with Next.js 14 App Router, TypeScript, TailwindCSS and Zustand.

---

## Tech Stack

| Layer       | Technology                                |
|-------------|-------------------------------------------|
| Framework   | Next.js 14 (App Router)                   |
| Language    | TypeScript (strict mode)                  |
| Styling     | TailwindCSS 3 + custom utilities          |
| State       | Zustand (with `persist` middleware)       |
| Icons       | Emoji-based (swap for Lucide if needed)   |
| Deployment  | Vercel                                    |

---

## Features

### 1. College Listing + Advanced Search (`/colleges`)
- Instant debounced search (280ms)
- Multi-filter sidebar: ownership, exam, state, rating, fees cap
- Active filter chips with individual remove
- Grid/list view toggle
- Sort by NIRF rank, rating, avg package, fees
- Skeleton loaders & empty state
- URL-synced search query (`?q=...`)
- Mobile filter drawer
- Load-more pagination

### 2. College Detail Page (`/colleges/[id]`)
- Full-bleed hero banner with college image
- Tabbed navigation: Overview · Courses & Fees · Placements · Reviews · Gallery
- Searchable & sortable courses table
- Package breakdown bar chart
- Star rating breakdown (5→1 distribution)
- Sticky quick-facts sidebar (fees, package, rank, campus size)
- Add to Compare shortcut

### 3. Compare Colleges (`/compare`)
- Global compare state via Zustand (persisted to localStorage)
- Floating compare bar (fixed bottom) with quick-remove
- Side-by-side metric table with 🏆 best-value highlights
- Auto-generated insights: Best Placements · Most Affordable · Top Ranked
- Visual package bar chart
- Up to 3 colleges simultaneously

### 4. Predictor Tool (`/predictor`)
- 3-step form: Exam → Rank → Profile (category + state)
- Animated step indicator with completion states
- Category rank relaxation model (OBC/SC/ST bonuses)
- Home-state quota bonus logic
- Animated loading screen with micro labels
- Safe / Target / Dream classification (75% / 45% thresholds)
- Add-to-compare shortcut on each prediction card
- Disclaimer note

---

## Folder Architecture

```
college-discovery/
├── app/
│   ├── layout.tsx              # Root layout (Navbar + CompareBar)
│   ├── globals.css             # Tailwind directives + custom utilities
│   ├── page.tsx                # Homepage (hero, stats, featured colleges)
│   ├── colleges/
│   │   ├── page.tsx            # College listing + search + filters
│   │   └── [id]/
│   │       └── page.tsx        # College detail (tabs, sidebar)
│   ├── compare/
│   │   └── page.tsx            # Compare page (CompareTable)
│   └── predictor/
│       └── page.tsx            # Predictor tool (3-step form + results)
│
├── components/
│   ├── college/
│   │   ├── CollegeCard.tsx     # Grid & list card variants
│   │   ├── CollegeFilters.tsx  # Filter panel (sidebar + drawer)
│   │   ├── CollegeHero.tsx     # Detail page hero banner
│   │   └── CompareTable.tsx    # Full compare table with insights
│   ├── ui/
│   │   ├── Badge.tsx           # Badge + ChanceBadge
│   │   ├── StarRating.tsx      # Star rating display
│   │   ├── SkeletonCard.tsx    # Grid & list skeleton loaders
│   │   └── ThemeToggle.tsx     # Dark/light mode toggle
│   └── layout/
│       ├── Navbar.tsx          # Sticky navbar + mobile tab bar
│       └── CompareBar.tsx      # Floating bottom compare bar
│
├── lib/
│   ├── data.ts                 # Mock college dataset (10 colleges)
│   ├── utils.ts                # formatCurrency, filterAndSort, cn, etc.
│   └── predictor.ts            # Rank → college prediction logic
│
├── store/
│   └── compare-store.ts        # Zustand compare store (persisted)
│
├── hooks/
│   ├── useDebounce.ts          # Debounce hook
│   └── useAnimatedCounter.ts   # Intersection-triggered counter animation
│
├── constants/
│   └── index.ts                # Sort options, filter options, site config
│
└── types/
    └── college.ts              # All TypeScript interfaces & types
```

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
open http://localhost:3000
```

## Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Or connect your GitHub repo to Vercel dashboard for automatic deployments.

---

## Extending the Platform

### Add more colleges
Edit `lib/data.ts` — each college follows the `College` interface defined in `types/college.ts`.

### Connect a real API
Replace `COLLEGES` import in page files with a TanStack Query `useQuery` call:
```ts
const { data: colleges } = useQuery({
  queryKey: ["colleges"],
  queryFn: () => fetch("/api/colleges").then(r => r.json()),
});
```

### Add authentication
Install NextAuth.js and wrap the layout with `SessionProvider`.

### Add real reviews
Replace mock `reviews` array with a Supabase/PlanetScale query.
