import React from 'react';
import MainLayout from '../../../layouts/MainLayout';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useCatalog } from '../hooks/useCatalog';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { Button } from '../../../components/ui/button';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { allProducts } = useCatalog();
  const { itemIds } = useFavoritesStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  const favoriteProducts = allProducts.filter(p => itemIds.includes(p.id));

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-brand-pink">
            <Heart size={28} fill="currentColor" />
          </div>
          <div>
            <h1 className="text-3xl font-black font-brand text-brand-dark tracking-tight">Mis Favoritos</h1>
            <p className="text-gray-500 font-medium">{favoriteProducts.length} items guardados</p>
          </div>
        </div>

        {favoriteProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 animate-fade-in">
            {favoriteProducts.map(product => (
              <ProductCard key={product.id}>
                <ProductCard.Image 
                  src={product.image} 
                  alt={product.name} 
                  id={product.id} 
                  name={product.name}
                  tag={product.tag}
                  discount={product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : undefined}
                />
                <ProductCard.Info 
                  name={product.name} 
                  price={product.price} 
                  oldPrice={product.oldPrice} 
                  id={product.id} 
                />
              </ProductCard>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white rounded-[40px] border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
              <Heart size={32} />
            </div>
            <h2 className="text-xl font-bold text-brand-dark mb-2">Aún no tienes favoritos</h2>
            <p className="text-gray-500 mb-8 max-w-xs mx-auto">
              Guarda las prendas que más te gusten para verlas aquí más tarde.
            </p>
            <Link to="/">
              <Button variant="primary">Explorar catálogo</Button>
            </Link>
          </div>
        )}

        {/* Recommended for you section if empty or as a footer */}
        {favoriteProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-xl font-bold text-brand-dark mb-6">También te podría gustar</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-60">
              {allProducts.slice(0, 4).map(product => (
                 <div key={`rec-${product.id}`} className="scale-95 grayscale">
                    <ProductCard.Image src={product.image} alt={product.name} id={product.id} name={product.name} />
                 </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default FavoritesPage;
