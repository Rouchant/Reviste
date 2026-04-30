import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card } from '../../../components/ui/card';
import { useAuthStore } from '../store/useAuthStore';
import AuthLayout from '../../../layouts/AuthLayout';

import { toast } from 'sonner';



const AuthPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(
    location.hash === '#register' ? 'register' : 'login'
  );
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedComuna, setSelectedComuna] = useState('');
  const [street, setStreet] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [strength, setStrength] = useState({ label: '', color: '', width: '0%' });
  const [isLoading, setIsLoading] = useState(false);
  const [regionsList, setRegionsList] = useState<{id: number, name: string}[]>([]);
  const [comunasList, setComunasList] = useState<{id: number, name: string}[]>([]);

  useEffect(() => {
    fetch('/api/location/regions')
      .then(res => res.json())
      .then(data => setRegionsList(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedRegion) {
      setComunasList([]);
      return;
    }
    fetch(`/api/location/comunas/${selectedRegion}`)
      .then(res => res.json())
      .then(data => setComunasList(data))
      .catch(console.error);
  }, [selectedRegion]);

  useEffect(() => {
    if (location.hash === '#register') {
      setActiveTab('register');
    } else if (location.hash === '' || location.hash === '#login') {
      setActiveTab('login');
    }
  }, [location.hash]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === 'login') {
      if (!email || !password) {
        toast.error('Por favor ingresa correo y contraseña');
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al iniciar sesión');
        
        login(data);
        navigate('/');
      } catch (err) {
        toast.error((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    } else {
      if (!email || !password || !fullName || !username) {
        toast.error('Por favor completa los campos obligatorios (Nombre, Usuario, Correo, Contraseña)');
        return;
      }
      if (password !== confirmPassword) {
        toast.error('Las contraseñas no coinciden');
        return;
      }
      setIsLoading(true);

      const rName = regionsList.find(r => r.id.toString() === selectedRegion)?.name || '';
      const cName = comunasList.find(c => c.id.toString() === selectedComuna)?.name || '';
      const fullAddress = [street, cName, rName].filter(Boolean).join(', ');

      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name: fullName, username, phone, address: fullAddress })
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al registrarse');
        
        login(data);
        navigate('/');
      } catch (err) {
        toast.error((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    }
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
            onClick={() => {
              setActiveTab('login');
              navigate('/auth', { replace: true });
            }}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
              activeTab === 'login' ? "bg-white text-brand-pink shadow-sm" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Ingresar
          </button>
          <button 
            onClick={() => {
              setActiveTab('register');
              navigate('/auth#register', { replace: true });
            }}
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
            <form className="space-y-4" onSubmit={handleSubmit}>
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
              <Button type="submit" className="w-full mt-4" size="lg" disabled={isLoading}>
                {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
              </Button>
            </form>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin">
            <h2 className="text-xl font-bold mb-6 text-gray-800 font-brand">Únete a Reviste 🌿</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Nombre Completo</label>
                <Input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ej: Juan Pérez" 
                  className="h-12" 
                />
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
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Usuario</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">@</span>
                    <Input 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value.replace(/^@/, ''))}
                      placeholder="usuario" 
                      className="h-12 pl-8" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Teléfono</label>
                  <Input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+56 9..." 
                    className="h-12" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Dirección (Calle y Número)</label>
                <Input 
                  type="text" 
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Ej: Av. Providencia 1234, depto 501" 
                  className="h-12" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Región</label>
                  <select 
                    className="flex h-12 w-full rounded-2xl border border-transparent bg-gray-50 px-4 py-3 text-sm transition-all focus:bg-white focus:border-brand-pink outline-none appearance-none"
                    value={selectedRegion}
                    onChange={(e) => {
                      setSelectedRegion(e.target.value);
                      setSelectedComuna('');
                    }}
                  >
                    <option value="">Selecciona</option>
                    {regionsList.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Comuna</label>
                  <select 
                    className="flex h-12 w-full rounded-2xl border border-transparent bg-gray-50 px-4 py-3 text-sm transition-all focus:bg-white focus:border-brand-pink outline-none disabled:opacity-50 appearance-none"
                    disabled={!selectedRegion}
                    value={selectedComuna}
                    onChange={(e) => setSelectedComuna(e.target.value)}
                  >
                    <option value="">Comuna</option>
                    {comunasList.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Contraseña</label>
                <Input 
                  type="password" 
                  value={password}
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
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Confirmar Contraseña</label>
                <Input 
                  type="password" 
                  value={confirmPassword}
                  className={`h-12 ${confirmPassword && password !== confirmPassword ? 'border-red-400 focus:border-red-500' : ''}`}
                  placeholder="Repite tu contraseña"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">Las contraseñas no coinciden</p>
                )}
              </div>
              <Button type="submit" className="w-full mt-4" size="lg" disabled={isLoading}>
                {isLoading ? 'Creando cuenta...' : 'Crear mi cuenta'}
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
