import React from 'react';
import MainLayout from '../../../layouts/MainLayout';
import ProductCard from '../components/ProductCard';
import GallerySection from '../../../components/GallerySection';
import HeroCarousel from '../../../components/HeroCarousel';
import { Search } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../cart/store/useCartStore';
import { useCatalog } from '../hooks/useCatalog';
import { Product } from '../types';

const HomePage: React.FC = () => {
  const addItem = useCartStore((state) => state.addItem);
  const navigate = useNavigate();
  const { 
    allProducts,
    categories, 
    selectedCategory, 
    setSelectedCategory, 
    featuredOffers, 
    newArrivals, 
    heroSlides,
    searchQuery,
    setSearchQuery,
    isLoading,
    error
  } = useCatalog();

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-pink"></div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Ups! Algo salió mal</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()} variant="primary">
            Reintentar
          </Button>
        </div>
      </MainLayout>
    );
  }

  const handleSearchFocus = () => {
    navigate('/search');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length > 0) {
      navigate('/search');
    }
  };

  const renderProduct = (product: Product, customTag?: string) => {
    const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
    
    return (
      <ProductCard key={product.id}>
        <ProductCard.Image 
          src={product.image} 
          alt={product.name} 
          id={product.id} 
          name={product.name}
          tag={customTag || product.tag}
          discount={discount}
          onQuickAdd={() => addItem(product)}
        />
        <ProductCard.Info 
          name={product.name} 
          price={product.price} 
          oldPrice={product.oldPrice} 
          id={product.id} 
        />
      </ProductCard>
    );
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 mt-4 md:mt-8">
        
        {/* Search Header: ONLY visible on Mobile */}
        <div className="mb-8 md:hidden text-center max-w-2xl mx-auto animate-fade-in">
          <h1 className="text-3xl font-black mb-6 font-brand tracking-tight text-brand-dark leading-tight">
            Encuentra tu estilo único
          </h1>
          <div className="relative group">
            <Input 
              type="text" 
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              className="!py-5 !px-8 !pr-14 shadow-sm bg-white border-gray-200"
              placeholder="Buscar por marca, prenda o estilo..."
            />
            <Search 
              className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-pink transition-colors" 
              size={24} 
            />
          </div>
        </div>

        {/* Hero Section */}
        <div className="mb-12">
          <HeroCarousel slides={heroSlides} />
        </div>

        {/* Categories Cloud on Mobile / Scroll on Desktop */}
        <section className="mb-10 md:mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xs font-bold font-sans text-brand-muted uppercase tracking-[0.2em]">Categorías Populares</h2>
          </div>
          <div className="flex flex-wrap md:flex-nowrap md:overflow-x-auto gap-3 pb-4 scrollbar-hide md:scroll-container-mask justify-center md:justify-start">
            {categories.slice(0, 8).map((category) => (
              <Button 
                key={category}
                variant={selectedCategory === category ? "primary" : "muted"}
                size="sm"
                onClick={() => {
                  navigate(`/search?cat=${encodeURIComponent(category)}`);
                }}
                className="rounded-full flex-shrink-0"
              >
                {category}
              </Button>
            ))}
          </div>
        </section>

        {/* Sections... */}
        <GallerySection 
          title="Ofertas del Día" 
          linkText="Ver todas" 
          onLinkClick={() => {
            navigate('/search?q=Oferta');
          }}
        >
          {featuredOffers.map(product => (
            <div key={product.id} className="w-[200px] md:w-[280px] flex-shrink-0 snap-start">
              {renderProduct(product)}
            </div>
          ))}
        </GallerySection>

        <GallerySection 
          title="Recién Llegados" 
          linkText="Ver todo"
          onLinkClick={() => {
            navigate('/search?q=Nuevo');
          }}
        >
          {newArrivals.map(product => (
            <div key={product.id} className="w-[200px] md:w-[280px] flex-shrink-0 snap-start">
              {renderProduct(product)}
            </div>
          ))}
        </GallerySection>

        <GallerySection 
          title="Accesorios únicos" 
          linkText="Ver todos"
          onLinkClick={() => {
            navigate('/search?cat=Accesorios');
          }}
        >
          {allProducts
            .filter((p: Product) => p.tag?.toLowerCase().includes('accesorio'))
            .map((product: Product) => (
            <div key={`acc-${product.id}`} className="w-[200px] md:w-[280px] flex-shrink-0 snap-start">
              {renderProduct(product)}
            </div>
          ))}
        </GallerySection>

        <div className="mb-16">
           <GallerySection 
            title="Más Vendidos" 
            linkText="Ver ranking"
            onLinkClick={() => {
              navigate('/search?q=Top');
            }}
          >
            {newArrivals.map(product => (
              <div key={`best-${product.id}`} className="w-[200px] md:w-[280px] flex-shrink-0 snap-start">
                {renderProduct(product, "Top 10")}
              </div>
            ))}
          </GallerySection>
        </div>

      </div>
    </MainLayout>
  );
};

export default HomePage;
