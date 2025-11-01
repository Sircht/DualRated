import { create } from 'zustand';

export type SortOption = 'newest' | 'highest' | 'lowest';

type FilterState = {
  category: string | null;
  minimumRating: number | null;
  sort: SortOption;
};

type FilterActions = {
  setCategory: (category: string | null) => void;
  setMinimumRating: (rating: number | null) => void;
  setSort: (sort: SortOption) => void;
  reset: () => void;
};

const initialState: FilterState = {
  category: null,
  minimumRating: null,
  sort: 'newest'
};

export const useFilterStore = create<FilterState & FilterActions>((set) => ({
  ...initialState,
  setCategory: (category) => set({ category }),
  setMinimumRating: (minimumRating) => set({ minimumRating }),
  setSort: (sort) => set({ sort }),
  reset: () => set(initialState)
}));
