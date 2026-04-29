import React from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Heart, ShoppingCart } from 'lucide-react';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { getProductUrl } from '../../../lib/slugify';
import { useCartStore, Product, CartState } from '../../cart/store/useCartStore';
import { useFavoritesStore } from '../store/useFavoritesStore';

// Compound Component Types
interface ProductCardComposition {
  Image: React.FC<{ src: string; alt: string; id: number; name: string; tag?: string; discount?: number; onQuickAdd?: () => void }>;
  Info: React.FC<{ name: string; price: number; oldPrice?: number; id: number }>;
  Action: React.FC<{ onClick: () => void }>;
}

const ProductCard: React.FC<{ children: React.ReactNode }> & ProductCardComposition = ({ children }) => {
  return (
    <Card className="group overflow-hidden border-transparent hover:border-brand-pink/20 hover:shadow-xl hover:shadow-brand-pink/5 transition-all duration-300">
      {children}
    </Card>
  );
};

// 1. Image Component
const ProductImage: React.FC<{ src: string; alt: string; id: number; name: string; tag?: string; discount?: number; onQuickAdd?: () => void }> = ({ 
  src, alt, id, name, tag, discount, onQuickAdd 
}) => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const favorite = isFavorite(id);

  const imageUrl = src.startsWith('http') || src.startsWith('/') ? src : `/${src}`;

  return (
    <div className="relative aspect-[4/5] overflow-hidden">
      <Link to={getProductUrl(id, name)}>
        <img 
          src={imageUrl} 
          alt={alt} 
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
      </Link>
      
      <div className="absolute top-4 left-4 flex flex-col items-start gap-1.5 pointer-events-none">
        {tag?.split(' | ').map((t, idx) => {
          let variant: any = "outline";
          if (t === 'Oferta') variant = "secondary";
          if (t === 'Nuevo') variant = "default";
          if (t === 'Top') variant = "warning";
          
          return (
            <Badge key={idx} variant={variant} className="shadow-sm">
              {t}
            </Badge>
          );
        })}
        {discount && discount > 0 ? (
          <Badge variant="destructive" className="bg-red-500 text-white border-transparent">
            -{discount}%
          </Badge>
        ) : null}
      </div>

      {isAuthenticated && (
        <button 
          onClick={() => toggleFavorite(id)}
          aria-label="Agregar a favoritos"
          className={`absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-sm ${
            favorite ? 'text-brand-pink opacity-100' : 'text-brand-dark opacity-0 group-hover:opacity-100'
          }`}
        >
          <Heart size={20} fill={favorite ? 'currentColor' : 'none'} />
        </button>
      )}

      {onQuickAdd && (
        <div className="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
          <Button 
            className="w-full shadow-2xl" 
            size="sm"
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              if (!isAuthenticated) {
                navigate('/auth');
                return;
              }
              onQuickAdd();
            }}
          >
            <ShoppingCart size={18} className="mr-2" />
            Añadir rápido
          </Button>
        </div>
      )}
    </div>
  );
};

// 2. Info Component
const ProductInfo: React.FC<{ name: string; price: number; oldPrice?: number; id: number }> = ({ 
  name, price, oldPrice, id 
}) => (
  <CardContent className="p-4 pt-4">
    <Link to={getProductUrl(id, name)} className="block group/title">
      <h3 className="font-bold text-brand-dark group-hover/title:text-brand-pink transition-colors line-clamp-1 mb-1">
        {name}
      </h3>
    </Link>
    <div className="flex items-baseline gap-2">
      <span className="text-lg font-black text-brand-pink">${price.toLocaleString()}</span>
      {oldPrice && (
        <span className="text-xs text-gray-400 line-through font-medium">${oldPrice.toLocaleString()}</span>
      )}
    </div>
  </CardContent>
);

// 3. Action Component (Custom button if needed elsewhere)
const ProductAction: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div className="px-4 pb-4">
    <Button variant="outline" className="w-full" size="sm" onClick={onClick}>
      Ver más
    </Button>
  </div>
);

// Assignment
ProductCard.Image = ProductImage;
ProductCard.Info = ProductInfo;
ProductCard.Action = ProductAction;

export default ProductCard;

// Legacy/Convenience Export for automated mappings
export const ProductCardLegacy: React.FC<Product> = (props) => {
  const { id, name, price, oldPrice, image, tag } = props;
  const addItem = useCartStore((state: CartState) => state.addItem);
  const discount = oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

  return (
    <ProductCard>
      <ProductCard.Image 
        src={image} 
        alt={name} 
        id={id} 
        name={name}
        tag={tag} 
        discount={discount} 
        onQuickAdd={() => addItem(props)} 
      />
      <ProductCard.Info name={name} price={price} oldPrice={oldPrice} id={id} />
    </ProductCard>
  );
};
