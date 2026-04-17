import React from 'react';
import MainLayout from '../../../layouts/MainLayout';
import ProductCard from '../components/ProductCard';
import GallerySection from '../../../components/GallerySection';
import HeroCarousel from '../../../components/HeroCarousel';
import { Search } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { useCartStore } from '../../cart/store/useCartStore';
import { useCatalog } from '../hooks/useCatalog';
import { Product } from '../types';

const HomePage: React.FC = () => {
  const addItem = useCartStore((state) => state.addItem);
  const { 
    categories, 
    selectedCategory, 
    setSelectedCategory, 
    featuredOffers, 
    newArrivals, 
    heroSlides 
  } = useCatalog();

  const renderProduct = (product: Product, customTag?: string) => {
    const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
    
    return (
      <ProductCard key={product.id}>
        <ProductCard.Image 
          src={product.image} 
          alt={product.name} 
          id={product.id} 
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
        
        {/* Search Header: ONLY visible on Mobile to avoid duplication with Navbar */}
        <div className="mb-8 md:hidden text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-black mb-6 font-brand tracking-tight text-brand-dark leading-tight">
            Encuentra tu estilo único
          </h1>
          <div className="relative group">
            <Input 
              type="text" 
              className="!py-5 !px-8 !pr-14 shadow-sm bg-white"
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
          <HeroCarousel slides={heroSlides as any[]} />
        </div>

        {/* Categories */}
        <section className="mb-10 md:mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xs font-bold font-sans text-brand-muted uppercase tracking-[0.2em]">Categorías Populares</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((category) => (
              <Button 
                key={category}
                variant={selectedCategory === category ? "primary" : "muted"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="rounded-full flex-shrink-0"
              >
                {category}
              </Button>
            ))}
          </div>
        </section>

        {/* Sections... */}
        <GallerySection title="Ofertas del Día" linkText="Ver todas">
          {featuredOffers.map(product => (
            <div key={product.id} className="w-[200px] md:w-[280px] flex-shrink-0 snap-start">
              {renderProduct(product)}
            </div>
          ))}
        </GallerySection>

        <GallerySection title="Recién Llegados" linkText="Ver todo">
          {newArrivals.map(product => (
            <div key={product.id} className="w-[200px] md:w-[280px] flex-shrink-0 snap-start">
              {renderProduct(product)}
            </div>
          ))}
        </GallerySection>

        <GallerySection title="Accesorios únicos" linkText="Ver todos">
          {featuredOffers.slice().reverse().map(product => (
            <div key={`acc-${product.id}`} className="w-[200px] md:w-[280px] flex-shrink-0 snap-start">
              {renderProduct(product, "Accesorio")}
            </div>
          ))}
        </GallerySection>

        <div className="mb-16">
           <GallerySection title="Más Vendidos" linkText="Ver ranking">
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
