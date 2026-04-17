import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CatalogState {
  searchQuery: string;
  selectedCategory: string;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  resetFilters: () => void;
}

export const useCatalogStore = create<CatalogState>()(
  persist(
    (set) => ({
      searchQuery: '',
      selectedCategory: 'Todos',
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      resetFilters: () => set({ searchQuery: '', selectedCategory: 'Todos' }),
    }),
    {
      name: 'reviste-catalog-storage',
    }
  )
);
