import React from 'react';
import { ShoppingBag, LogIn, ShieldCheck, LayoutPanelLeft, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../features/cart/store/useCartStore';
import { Input } from './ui/input';

const Navbar: React.FC = () => {
  const cartCount = useCartStore((state) => state.getItemCount());

  return (
    <nav className="sticky top-0 bg-white/80 backdrop-blur-lg z-50 border-b border-gray-100 py-3 md:py-4 transition-all">
      <div className="container mx-auto px-4 flex items-center justify-between">
        
        {/* Placeholder for small screen balance if needed, or just left-aligned on md */}
        <div className="hidden md:block w-40 lg:w-48 flex-shrink-0">
          <Link to="/">
            <img 
              src="assets/images/ui/logo-h.png" 
              alt="REVISTE Logo" 
              className="h-10 md:h-12 w-auto transition-transform hover:scale-105" 
            />
          </Link>
        </div>

        {/* Mobile Logo: Centered */}
        <div className="flex md:hidden absolute left-1/2 -translate-x-1/2">
          <Link to="/">
            <img 
              src="assets/images/ui/logo-h.png" 
              alt="REVISTE Logo" 
              className="h-9 w-auto" 
            />
          </Link>
        </div>
        
        {/* Desktop Search Bar: Only visible on md+ */}
        <div className="hidden md:flex flex-grow max-w-2xl mx-8 lg:mx-16">
          <div className="relative w-full group">
            <Input 
              type="text" 
              variant="standard"
              className="!py-3 !px-6 !pr-12 text-sm"
              placeholder="Busca tesoros circulares (Y2K, Grunge, 90s)..."
            />
            <Search 
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-pink transition-colors" 
              size={18} 
            />
          </div>
        </div>

        {/* Action Buttons: Hidden on mobile, moved to BottomNav */}
        <div className="hidden md:flex items-center gap-1 md:gap-4 w-40 lg:w-48 justify-end">
          <Link to="/admin" className="p-2 text-brand-pink hover:bg-pink-50 rounded-xl transition-all flex" title="Administración">
            <ShieldCheck size={24} />
          </Link>
          <Link to="/my-garments" className="p-2 text-brand-dark hover:bg-gray-50 rounded-xl transition-all flex" title="Mis Prendas">
            <LayoutPanelLeft size={24} />
          </Link>
          <Link to="/cart" className="p-2 text-brand-dark hover:bg-gray-50 rounded-xl transition-all relative" title="Carrito">
            <ShoppingBag size={24} />
            {cartCount > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-brand-pink text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-bounce">
                {cartCount}
              </span>
            )}
          </Link>
          <Link to="/auth" className="p-2 text-brand-dark hover:bg-gray-50 rounded-xl transition-all" title="Iniciar Sesión">
            <LogIn size={24} />
          </Link>
        </div>

        {/* Mobile Spacer (to keep space for the centered logo if we had a burger menu or similar on the left) */}
        <div className="md:hidden w-10"></div>
        <div className="md:hidden w-10"></div>

      </div>
    </nav>
  );
};

export default Navbar;
