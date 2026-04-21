import React from 'react';
import { LayoutPanelLeft, LogIn, Heart, User, Store } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../features/auth/store/useAuthStore';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  color: string;
  badge?: number;
}

const BottomNav: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  const navItems: NavItem[] = [
    { icon: <LayoutPanelLeft size={26} />, label: 'Explorar', path: '/', color: 'text-brand-muted' },
    { icon: <Heart size={26} />, label: 'Favoritos', path: '/favorites', color: 'text-brand-pink' },
  ];

  if (isAuthenticated) {
    navItems.push({ icon: <Store size={26} />, label: 'Tienda', path: '/my-store', color: 'text-brand-muted' });
    navItems.push({ icon: <User size={26} />, label: 'Perfil', path: '/settings', color: 'text-brand-muted' });
  } else {
    navItems.push({ icon: <LogIn size={26} />, label: 'Perfil', path: '/auth', color: 'text-brand-muted' });
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 md:hidden z-50 px-4 pb-safe shadow-[0_-5px_20px_-10px_rgba(0,0,0,0.1)]">
      <div className="flex justify-around py-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={`relative transition-all active:scale-95 ${isActive ? item.color : 'text-gray-400'}`}
            >
              {item.icon}
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-pink text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold border-2 border-white">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
