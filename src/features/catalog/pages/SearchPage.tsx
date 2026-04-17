import React from 'react';
import MainLayout from '../../../layouts/MainLayout';
import { Search as SearchIcon, ArrowLeft } from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useCatalog } from '../hooks/useCatalog';

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery, featuredOffers } = useCatalog();

  // Simple filtering for demonstration
  const filteredProducts = featuredOffers.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tag?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

        {/* Results */}
        <div className="space-y-6">
          <div className="flex justify-between items-baseline px-2">
            <h2 className="text-xl font-black font-brand text-brand-dark">
              {searchQuery ? `Resultados para "${searchQuery}"` : 'Sugerencias para ti'}
            </h2>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              {filteredProducts.length} productos
            </span>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map(product => (
                <div key={product.id}>
                  <ProductCard>
                    <ProductCard.Image 
                      src={product.image} 
                      alt={product.name} 
                      id={product.id} 
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
                onClick={() => setSearchQuery('')}
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
