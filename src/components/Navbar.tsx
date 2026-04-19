import React from 'react';
import { ShoppingBag, LogIn, ShieldCheck, Search, UserRoundCog } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCartStore } from '../features/cart/store/useCartStore';
import { useCatalogStore } from '../features/catalog/store/useCatalogStore';
import { useAuthStore } from '../features/auth/store/useAuthStore';
import { Input } from './ui/input';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();
  const cartCount = useCartStore((state) => state.getItemCount());
  const { searchQuery, setSearchQuery, setSelectedCategory } = useCatalogStore();

  const isSearchPage = location.pathname === '/search';

  const handleSearchFocus = () => {
    if (!isSearchPage) {
      setSelectedCategory('Todos');
      navigate('/search');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (!isSearchPage && e.target.value.length > 0) {
      setSelectedCategory('Todos');
      navigate(`/search?q=${encodeURIComponent(e.target.value)}`);
    }
  };

  return (
    <nav className="sticky top-0 bg-white/80 backdrop-blur-lg z-50 border-b border-gray-100 transition-all min-h-[56px] md:min-h-0 py-3 md:py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        
        {/* Mobile Left: Search Toggle */}
        <div className="flex md:hidden w-10">
          <button 
            onClick={() => navigate('/search')}
            className="p-2 -ml-2 text-brand-dark hover:bg-gray-50 rounded-xl transition-all"
          >
            <Search size={24} />
          </button>
        </div>

        {/* Desktop Left Logo */}
        <div className="hidden md:block w-40 lg:w-48 flex-shrink-0">
          <Link to="/">
            <img 
              src="/assets/images/ui/logo-h.png" 
              alt="REVISTE Logo" 
              className="h-10 md:h-12 w-auto transition-transform hover:scale-105" 
            />
          </Link>
        </div>

        {/* Mobile Logo: Centered */}
        <div className="flex md:hidden absolute left-1/2 -translate-x-1/2">
          <Link to="/">
            <img 
              src="/assets/images/ui/logo-h.png" 
              alt="REVISTE Logo" 
              className="h-8 w-auto" 
            />
          </Link>
        </div>
        
        {/* Desktop Search Bar: Hidden on Search Page */}
        <div className={`hidden md:flex flex-grow max-w-2xl mx-8 lg:mx-16 transition-opacity duration-300 ${isSearchPage ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="relative w-full group">
            <Input 
              type="text" 
              variant="standard"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              className="!py-3 !px-6 !pr-12 text-sm"
              placeholder="Busca tesoros circulares (Y2K, Grunge, 90s)..."
            />
            <Search 
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-pink transition-colors" 
              size={18} 
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 md:gap-4 w-40 lg:w-48 justify-end">
          {isAuthenticated && user?.role === 'admin' && (
            <Link to="/admin" className="p-2 text-brand-pink hover:bg-pink-50 rounded-xl transition-all hidden md:flex" title="Administración">
              <ShieldCheck size={24} />
            </Link>
          )}
          
          {isAuthenticated && (
            <Link to="/cart" className="p-2 text-brand-dark hover:bg-gray-50 rounded-xl transition-all relative" title="Carrito">
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-brand-pink text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          <Link to={isAuthenticated ? "/settings" : "/auth"} className="p-2 text-brand-dark hover:bg-gray-50 rounded-xl transition-all hidden md:inline-flex" title={isAuthenticated ? "Mi Perfil" : "Iniciar Sesión"}>
            {isAuthenticated ? <UserRoundCog size={24} /> : <LogIn size={24} />}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
