"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CompareStore } from "@/types/college";

const MAX_COMPARE = 3;

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      ids: [],
      add: (id: string) =>
        set((state) => {
          if (state.ids.includes(id)) return state;
          if (state.ids.length >= MAX_COMPARE) return state;
          return { ids: [...state.ids, id] };
        }),
      remove: (id: string) =>
        set((state) => ({ ids: state.ids.filter((c) => c !== id) })),
      clear: () => set({ ids: [] }),
      isAdded: (id: string) => get().ids.includes(id),
    }),
    { name: "college-compare" }
  )
);
