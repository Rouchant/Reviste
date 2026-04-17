import { useMemo } from 'react';
import mockData from '../../../data/mockData.json';
import { Product } from '../types';
import { useCatalogStore } from '../store/useCatalogStore';

export const useCatalog = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory 
  } = useCatalogStore();

  const categories = useMemo(() => ['Todos', ...mockData.categories], []);

  const featuredOffers = useMemo(() => 
    mockData.featuredOffers as Product[], 
    []
  );

  const newArrivals = useMemo(() => 
    mockData.newArrivals as Product[], 
    []
  );

  const heroSlides = useMemo(() => 
    mockData.heroSlides, 
    []
  );

  // Helper to get all products combining featured and new arrivals
  const allProducts = useMemo(() => 
    ([...featuredOffers, ...newArrivals]),
    [featuredOffers, newArrivals]
  );

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    featuredOffers,
    newArrivals,
    heroSlides,
    allProducts
  };
};
