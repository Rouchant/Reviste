import { useMemo, useEffect } from 'react';
import { useCatalogStore } from '../store/useCatalogStore';

export const useCatalog = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory,
    categories,
    products,
    heroSlides,
    isLoading,
    error,
    fetchCatalog
  } = useCatalogStore();

  useEffect(() => {
    // Only fetch if we don't have products yet (basic cache)
    if (products.length === 0) {
      fetchCatalog();
    }
  }, [fetchCatalog, products.length]);

  // Compatibility with the previous static structure
  const featuredOffers = useMemo(() => 
    products.slice(0, 7), 
    [products]
  );

  const newArrivals = useMemo(() => 
    products.slice(7), 
    [products]
  );

  const allProducts = products;

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    featuredOffers,
    newArrivals,
    heroSlides,
    allProducts,
    isLoading,
    error
  };
};
