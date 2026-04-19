import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card } from '../../../components/ui/card';
import { useAuthStore } from '../store/useAuthStore';
import AuthLayout from '../../../layouts/AuthLayout';

const comunasMap: Record<string, string[]> = {
  'RM': ['Santiago', 'Providencia', 'Las Condes', 'Ñuñoa', 'Maipú', 'Puente Alto'],
  'VA': ['Valparaíso', 'Viña del Mar', 'Quilpué', 'Villa Alemana', 'Concón'],
  'BI': ['Concepción', 'Talcahuano', 'San Pedro de la Paz', 'Chiguayante']
};

const AuthPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(
    location.hash === '#register' ? 'register' : 'login'
  );
  const [email, setEmail] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState({ label: '', color: '', width: '0%' });

  useEffect(() => {
    if (location.hash === '#register' && activeTab !== 'register') {
      setActiveTab('register');
    } else if (location.hash !== '#register' && activeTab === 'register' && !location.hash) {
      setActiveTab('login');
    }
  }, [location.hash, activeTab]);

  const checkStrength = (val: string) => {
    setPassword(val);
    if (!val) {
      setStrength({ label: '', color: '', width: '0%' });
      return;
    }
    
    let s = 0;
    if (val.length >= 8) s += 1;
    if (/[A-Z]/.test(val)) s += 1;
    if (/[0-9]/.test(val)) s += 1;
    if (/[^A-Za-z0-9]/.test(val)) s += 1;

    const levels = [
      { label: 'Débil', color: '#ff4d4d', width: '25%' },
      { label: 'Regular', color: '#ffa500', width: '50%' },
      { label: 'Buena', color: '#ffcc00', width: '75%' },
      { label: '¡Fuerte! 💪', color: '#2ecc71', width: '100%' }
    ];
    setStrength(levels[Math.min(s, levels.length - 1)]);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // Simple magic: if email contains "admin", log in as admin
    const role = email.includes('admin') ? 'admin' : 'user';
    login(email, role);
    navigate('/');
  };

  return (
    <AuthLayout>
      <Card className="w-full max-w-[450px] p-8 md:p-10 z-10 shadow-2xl shadow-brand-pink/10 border-transparent">
        <Link to="/" className="block mb-8">
          <img src="/assets/images/ui/logo-h.png" alt="REVISTE" className="h-10 mx-auto transition-transform hover:scale-105" />
        </Link>

        {/* Tab Switcher */}
        <div className="flex bg-gray-50 p-1.5 rounded-2xl mb-8 border border-gray-100">
          <button 
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
              activeTab === 'login' ? "bg-white text-brand-pink shadow-sm" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Ingresar
          </button>
          <button 
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
              activeTab === 'register' ? "bg-white text-brand-pink shadow-sm" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Crear Cuenta
          </button>
        </div>

        {activeTab === 'login' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold mb-6 text-gray-800 font-brand">Te extrañamos ✨</h2>
            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Correo Electrónico</label>
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Contraseña</label>
                <Input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                />
              </div>
              <div className="flex justify-between items-center py-2 text-sm">
                <label className="flex items-center gap-2 text-gray-500 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-100 text-brand-pink focus:ring-brand-pink" />
                  Recuérdame
                </label>
                <a href="#" className="text-brand-pink font-bold hover:underline">¿Olvidaste tu clave?</a>
              </div>
              <Button type="submit" className="w-full mt-4" size="lg">
                Iniciar Sesión
              </Button>
            </form>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin">
            <h2 className="text-xl font-bold mb-6 text-gray-800 font-brand">Únete a Reviste 🌿</h2>
            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Nombre Completo</label>
                <Input type="text" placeholder="Ej: Juan Pérez" className="h-12" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Correo Electrónico</label>
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com" 
                  className="h-12"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Región</label>
                  <select 
                    className="flex h-12 w-full rounded-2xl border border-transparent bg-gray-50 px-4 py-3 text-sm transition-all focus:bg-white focus:border-brand-pink outline-none appearance-none"
                    onChange={(e) => setSelectedRegion(e.target.value)}
                  >
                    <option value="">Selecciona</option>
                    <option value="RM">Metropolitana</option>
                    <option value="VA">Valparaíso</option>
                    <option value="BI">Biobío</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Comuna</label>
                  <select 
                    className="flex h-12 w-full rounded-2xl border border-transparent bg-gray-50 px-4 py-3 text-sm transition-all focus:bg-white focus:border-brand-pink outline-none disabled:opacity-50 appearance-none"
                    disabled={!selectedRegion}
                  >
                    <option value="">Comuna</option>
                    {selectedRegion && comunasMap[selectedRegion].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Contraseña</label>
                <Input 
                  type="password" 
                  className="h-12"
                  placeholder="Mínimo 8 caracteres"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => checkStrength(e.target.value)}
                />
                {strength.label && (
                  <div className="mt-2 space-y-1">
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full transition-all duration-500" style={{ width: strength.width, backgroundColor: strength.color }}></div>
                    </div>
                    <p className="text-[10px] font-bold uppercase text-right" style={{ color: strength.color }}>{strength.label}</p>
                  </div>
                )}
              </div>
              <Button type="submit" className="w-full mt-4" size="lg">
                Crear mi cuenta
              </Button>
            </form>
          </div>
        )}

        <div className="mt-8 pt-8 border-t border-gray-50 text-center">
          <Link to="/" className="text-gray-400 text-sm font-medium hover:text-brand-pink transition-colors inline-flex items-center gap-2">
            <ArrowLeft size={16} /> Volver a la tienda
          </Link>
        </div>
      </Card>
    </AuthLayout>
  );
};

export default AuthPage;
