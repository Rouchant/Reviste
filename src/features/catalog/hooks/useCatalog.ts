import { useState, useMemo } from 'react';
import mockData from '../../../data/mockData.json';
import { Product } from '../types';

export const useCatalog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

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

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    featuredOffers,
    newArrivals,
    heroSlides
  };
};
