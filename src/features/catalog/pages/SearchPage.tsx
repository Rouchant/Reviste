import React from 'react';
import MainLayout from '../../../layouts/MainLayout';
import { Search as SearchIcon, ArrowLeft } from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useCatalog } from '../hooks/useCatalog';

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, allProducts } = useCatalog();
  const [atlasResults, setAtlasResults] = React.useState<any[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);

  // Sync with URL parameters
  React.useEffect(() => {
    const q = searchParams.get('q') || '';
    const cat = searchParams.get('cat') || 'Todos';
    
    setSearchQuery(q);
    setSelectedCategory(cat);
  }, [searchParams, setSearchQuery, setSelectedCategory]);

  // Atlas Search Debounce
  React.useEffect(() => {
    if (!searchQuery) {
      setAtlasResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/catalog/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setAtlasResults(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 400); // 400ms debounce delay
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Enhanced filtering logic (Combines Local Search + Atlas Search)
  const filteredProducts = allProducts.filter(p => {
    // 1. Local Search (Atrapa tags virtuales como "Oferta", "Nuevo" y coincidencias exactas)
    const matchesLocalSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tag?.toLowerCase().includes(searchQuery.toLowerCase());
      
    // 2. Atlas Search (Atrapa errores ortográficos y plurales que el local search no ve)
    const matchesAtlasSearch = atlasResults.some(ar => ar.id === p.id);
    
    // Debe coincidir con alguna de las dos búsquedas
    const matchesSearch = !searchQuery || matchesLocalSearch || matchesAtlasSearch;

    // 3. Filtro de Categoría (Por Tag de categoría o si el nombre incluye la palabra)
    const matchesCategory = selectedCategory === 'Todos' || 
      p.tag?.split(' | ').some((t: string) => 
        t === selectedCategory || 
        (selectedCategory === 'Accesorios' && t === 'Accesorio')
      ) || 
      p.name.toLowerCase().includes(selectedCategory.toLowerCase());
    
    return matchesSearch && matchesCategory;
  });

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Search Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="rounded-xl flex-shrink-0"
          >
            <ArrowLeft size={24} />
          </Button>
          <div className="relative flex-grow">
            <Input 
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="¿Qué estás buscando hoy?"
              className="!pr-12"
            />
            <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        {/* Category Filter Badge */}
        {selectedCategory !== 'Todos' && (
          <div className="flex flex-wrap items-center gap-2 mb-6 px-2">
            <span className="text-sm font-bold text-gray-500">Filtrando por categoría:</span>
            <div className="flex items-center gap-2 bg-brand-pink/10 text-brand-pink px-3 py-1.5 rounded-full text-sm font-bold">
              {selectedCategory}
              <button 
                onClick={() => {
                  setSelectedCategory('Todos');
                  // Update URL parameter as well so it doesn't get stuck on refresh
                  navigate('/search');
                }}
                className="hover:bg-brand-pink/20 rounded-full p-0.5 transition-colors"
                aria-label="Quitar filtro"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="space-y-6">
          <div className="flex justify-between items-baseline px-2">
            <h2 className="text-xl font-black font-brand text-brand-dark">
              {searchQuery 
                ? `Resultados para "${searchQuery}"` 
                : selectedCategory !== 'Todos'
                  ? `Catálogo de ${selectedCategory}`
                  : 'Sugerencias para ti'}
            </h2>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              {filteredProducts.length} productos
            </span>
          </div>

          {isSearching ? (
            <div className="py-20 text-center">
              <div className="w-12 h-12 border-4 border-brand-pink/20 border-t-brand-pink rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500 font-medium animate-pulse">Buscando inteligentemente...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map(product => (
                <div key={product.id}>
                  <ProductCard>
                    <ProductCard.Image 
                      src={product.image} 
                      alt={product.name} 
                      id={product.id} 
                      name={product.name}
                      tag={product.tag}
                    />
                    <ProductCard.Info 
                      name={product.name} 
                      price={product.price} 
                      oldPrice={product.oldPrice} 
                      id={product.id} 
                    />
                  </ProductCard>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                <SearchIcon size={32} />
              </div>
              <p className="text-gray-500 font-medium">No encontramos resultados para tu búsqueda.</p>
              <Button 
                variant="ghost" 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('Todos');
                }}
                className="mt-2 text-brand-pink font-bold"
              >
                Ver todo el catálogo
              </Button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default SearchPage;
