import React from 'react';
import { 
  LayoutDashboard, ShoppingBag, ShoppingCart, Users, BarChart3, 
  ArrowLeft, LogOut, Images
} from 'lucide-react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/store/useAuthStore';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();
  const logout = useAuthStore(state => state.logout);

  if (!isAuthenticated || !user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  const sidebarLinks = [
    { icon: <LayoutDashboard size={20} />, label: "Resumen Global", path: "/admin" },
    { icon: <Users size={20} />, label: "Usuarios", path: "/admin/users" },
    { icon: <Images size={20} />, label: "Carrusel", path: "/admin/hero" },
  ];

  return (
    <div className="min-h-screen bg-brand-cream/20 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 lg:w-72 bg-white border-r border-gray-100 flex-col sticky top-0 h-screen p-6 shadow-sm z-30">
        <div className="mb-12 px-2">
          <Link to="/">
            <img src="/assets/images/ui/logo-h.png" alt="REVISTE" className="h-10 transition-transform hover:scale-105" />
          </Link>
        </div>
        
        <nav className="space-y-2 flex-grow">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all ${
                  isActive 
                  ? "bg-brand-pink text-white shadow-lg shadow-brand-pink/20" 
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                }`}
              >
                {link.icon} {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="pt-8 border-t border-gray-50 space-y-2">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-brand-pink font-bold transition-all rounded-xl hover:bg-pink-50">
            <ArrowLeft size={20} /> Volver a Tienda
          </Link>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-500 font-bold transition-all rounded-xl hover:bg-red-50"
          >
            <LogOut size={20} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8 lg:p-12 pb-24 md:pb-8">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
