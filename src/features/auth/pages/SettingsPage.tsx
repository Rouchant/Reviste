import React from 'react';
import { 
  User, Bell, Shield, CreditCard, ChevronRight, LogOut, 
  Trash2, Camera
} from 'lucide-react';
import MainLayout from '../../../layouts/MainLayout';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { useAuthStore } from '../store/useAuthStore';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<'perfil' | 'notificaciones' | 'seguridad' | 'pagos'>('perfil');
  const { user, logout } = useAuthStore();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-3xl font-black font-brand text-brand-dark mb-2 tracking-tight">Configuración</h1>
        <p className="text-gray-500 mb-10 font-medium font-brand">Gestiona tu cuenta, preferencias y seguridad.</p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Menu Sidebar */}
          <div className="md:col-span-4 space-y-2">
            <SettingsSidebarItem 
              icon={<User size={18} />} 
              label="Perfil" 
              active={activeTab === 'perfil'} 
              onClick={() => setActiveTab('perfil')}
            />
            <SettingsSidebarItem 
              icon={<Bell size={18} />} 
              label="Notificaciones" 
              active={activeTab === 'notificaciones'} 
              onClick={() => setActiveTab('notificaciones')}
            />
            <SettingsSidebarItem 
              icon={<Shield size={18} />} 
              label="Seguridad" 
              active={activeTab === 'seguridad'} 
              onClick={() => setActiveTab('seguridad')}
            />
            <SettingsSidebarItem 
              icon={<CreditCard size={18} />} 
              label="Pagos" 
              active={activeTab === 'pagos'} 
              onClick={() => setActiveTab('pagos')}
            />
            <div className="pt-4 mt-4 border-t border-gray-100">
              <button 
                onClick={logout}
                className="w-full flex items-center justify-between p-4 rounded-2xl text-red-500 hover:bg-red-50 font-bold transition-all group"
              >
                <span className="flex items-center gap-3"><LogOut size={18} /> Cerrar Sesión</span>
                <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all" />
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="md:col-span-8 space-y-8 pb-16">
            
            {activeTab === 'perfil' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className="p-8 border-transparent shadow-xl shadow-brand-pink/5">
                  <h2 className="text-xl font-bold text-gray-800 mb-6 font-brand">Información Pública</h2>
                  <div className="space-y-6">
                    <div className="flex items-center gap-6 mb-8">
                      <div className="relative group">
                        <div className="w-24 h-24 rounded-[32px] bg-brand-pink/10 border-2 border-brand-pink/20 flex items-center justify-center text-brand-pink text-4xl font-black overflow-hidden shadow-inner">
                          {user?.name?.substring(0, 2).toUpperCase() || 'JP'}
                        </div>
                        <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-brand-pink transition-all">
                          <Camera size={18} />
                        </button>
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">Foto de perfil</p>
                        <p className="text-xs text-gray-400">JPG o PNG. Máximo 1MB.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nombre</label>
                        <Input defaultValue={user?.name || "Juan Pérez"} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Alias</label>
                        <Input defaultValue={`@${user?.name?.toLowerCase().replace(/\s/g, '_') || 'usuario'}`} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Biografía</label>
                      <textarea 
                        className="flex w-full rounded-[24px] border border-transparent bg-gray-50 px-6 py-4 text-sm transition-all focus:bg-white focus:border-brand-pink outline-none"
                        rows={3}
                        defaultValue="Amante de lo vintage y la moda circular 🌿"
                      ></textarea>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button className="px-8 h-12">Guardar cambios</Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-8 border-red-50 bg-red-50/10 mt-8">
                  <h2 className="text-xl font-bold text-red-600 mb-2 font-brand">Zona de Peligro</h2>
                  <p className="text-sm text-red-400 mb-6">Acciones irreversibles para tu cuenta.</p>
                  <button className="flex items-center gap-3 text-red-500 font-bold hover:underline transition-all">
                    <Trash2 size={18} /> Eliminar mi cuenta permanentemente
                  </button>
                </Card>
              </div>
            )}

            {activeTab === 'notificaciones' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className="p-8 border-transparent shadow-xl shadow-brand-pink/5">
                  <h2 className="text-xl font-bold text-gray-800 mb-6 font-brand">Notificaciones</h2>
                  <div className="space-y-6">
                    <NotificationToggle label="Ventas realizadas" description="Recibe un aviso cuando alguien compre tu prenda." defaultChecked />
                    <NotificationToggle label="Mensajes de compradores" description="Notificaciones de chat y preguntas." defaultChecked />
                    <NotificationToggle label="Novedades de Reviste" description="Promociones y actualizaciones de la plataforma." />
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'seguridad' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className="p-8 border-transparent shadow-xl shadow-brand-pink/5">
                  <h2 className="text-xl font-bold text-gray-800 mb-6 font-brand">Seguridad</h2>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Contraseña Actual</label>
                      <Input type="password" placeholder="••••••••" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nueva Contraseña</label>
                      <Input type="password" placeholder="Mínimo 8 caracteres" />
                    </div>
                    <Button className="w-full">Cambiar contraseña</Button>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'pagos' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className="p-8 border-transparent shadow-xl shadow-brand-pink/5">
                  <h2 className="text-xl font-bold text-gray-800 mb-6 font-brand">Métodos de Pago & Cobro</h2>
                  <div className="p-6 border-2 border-dashed border-gray-100 rounded-3xl text-center">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mx-auto mb-4">
                      <CreditCard size={24} />
                    </div>
                    <p className="text-sm font-bold text-gray-500 mb-4">Aún no has vinculado una cuenta para recibir tus pagos.</p>
                    <Button variant="outline">Vincular cuenta bancaria</Button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

const SettingsSidebarItem = ({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all group ${
    active 
    ? "bg-brand-pink text-white shadow-lg shadow-brand-pink/20" 
    : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
  }`}>
    <span className="flex items-center gap-3">{icon} {label}</span>
    <ChevronRight size={16} className={`transition-all ${
      active ? "translate-x-0 opacity-100" : "opacity-0 translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0"
    }`} />
  </button>
);

const NotificationToggle = ({ label, description, defaultChecked = false }: { label: string, description: string, defaultChecked?: boolean }) => (
  <div className="flex items-center justify-between py-2">
    <div>
      <p className="font-bold text-gray-800">{label}</p>
      <p className="text-xs text-gray-400">{description}</p>
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" defaultChecked={defaultChecked} className="sr-only peer" />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-pink"></div>
    </label>
  </div>
);

export default SettingsPage;
