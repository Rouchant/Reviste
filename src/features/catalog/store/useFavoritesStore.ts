import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
  itemIds: number[];
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      itemIds: [],
      toggleFavorite: (id) => {
        const current = get().itemIds;
        const exists = current.includes(id);
        if (exists) {
          set({ itemIds: current.filter((itemId) => itemId !== id) });
        } else {
          set({ itemIds: [...current, id] });
        }
      },
      isFavorite: (id) => get().itemIds.includes(id),
      clearFavorites: () => set({ itemIds: [] }),
    }),
    {
      name: 'reviste-favorites-storage',
    }
  )
);
