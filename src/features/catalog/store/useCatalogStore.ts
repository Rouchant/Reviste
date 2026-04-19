import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, HeroSlide } from '../types';
import mockData from '../../../data/mockData.json';

interface CatalogState {
  searchQuery: string;
  selectedCategory: string;
  categories: string[];
  products: Product[];
  heroSlides: HeroSlide[];
  isLoading: boolean;
  error: string | null;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  resetFilters: () => void;
  fetchCatalog: () => Promise<void>;
}

export const useCatalogStore = create<CatalogState>()(
  persist(
    (set) => ({
      searchQuery: '',
      selectedCategory: 'Todos',
      categories: ['Todos'],
      products: [],
      heroSlides: [],
      isLoading: false,
      error: null,
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      resetFilters: () => set({ searchQuery: '', selectedCategory: 'Todos' }),
      fetchCatalog: async () => {
        set({ isLoading: true, error: null });
        try {
          const [catRes, prodRes, heroRes] = await Promise.all([
            fetch('/api/catalog/categories'),
            fetch('/api/catalog/products'),
            fetch('/api/catalog/hero-slides')
          ]);

          if (catRes.ok && prodRes.ok && heroRes.ok) {
            const categories = await catRes.json();
            const products = await prodRes.json();
            const heroSlides = await heroRes.json();

            set({ 
              categories: ['Todos', ...categories], 
              products, 
              heroSlides, 
              isLoading: false 
            });
          } else {
            throw new Error('API not available');
          }
        } catch (error) {
          console.warn('API fetch failed, falling back to mock data:', error);
          // Fallback to local mock data
          set({ 
            categories: ['Todos', ...mockData.categories],
            products: mockData.featuredOffers.concat(mockData.newArrivals) as Product[],
            heroSlides: mockData.heroSlides as HeroSlide[],
            isLoading: false 
          });
        }
      },
    }),
    {
      name: 'reviste-catalog-storage',
      // We only want to persist the filters, not the whole catalog data
      partialize: (state) => ({ 
        searchQuery: state.searchQuery, 
        selectedCategory: state.selectedCategory 
      }),
    }
  )
);
