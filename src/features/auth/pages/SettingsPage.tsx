import React from 'react';
import { User, Bell, Shield, CreditCard, ChevronRight, LogOut, Trash2, Camera } from 'lucide-react';
import MainLayout from '../../../layouts/MainLayout';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';

const SettingsPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-black font-brand text-brand-dark mb-2 tracking-tight">Configuración</h1>
        <p className="text-gray-500 mb-10 font-medium font-brand">Gestiona tu cuenta, preferencias y seguridad.</p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Menu Sidebar */}
          <div className="md:col-span-4 space-y-2">
            <SettingsSidebarItem icon={<User size={18} />} label="Perfil" active />
            <SettingsSidebarItem icon={<Bell size={18} />} label="Notificaciones" />
            <SettingsSidebarItem icon={<Shield size={18} />} label="Seguridad" />
            <SettingsSidebarItem icon={<CreditCard size={18} />} label="Pagos" />
            <div className="pt-4 mt-4 border-t border-gray-100">
              <button className="w-full flex items-center justify-between p-4 rounded-2xl text-red-500 hover:bg-red-50 font-bold transition-all group">
                <span className="flex items-center gap-3"><LogOut size={18} /> Cerrar Sesión</span>
                <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all" />
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="md:col-span-8 space-y-8 pb-16">
            
            {/* Profile Section */}
            <Card className="p-8 border-transparent shadow-xl shadow-brand-pink/5">
              <h2 className="text-xl font-bold text-gray-800 mb-6 font-brand">Información Pública</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-[32px] bg-brand-pink/10 border-2 border-brand-pink/20 flex items-center justify-center text-brand-pink text-4xl font-black overflow-hidden shadow-inner">
                      JP
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
                    <Input defaultValue="Juan Pérez" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Alias</label>
                    <Input defaultValue="@juanp_retro" />
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

            {/* Account Danger Zone */}
            <Card className="p-8 border-red-50 bg-red-50/10">
              <h2 className="text-xl font-bold text-red-600 mb-2 font-brand">Zona de Peligro</h2>
              <p className="text-sm text-red-400 mb-6">Acciones irreversibles para tu cuenta.</p>
              
              <button className="flex items-center gap-3 text-red-500 font-bold hover:underline transition-all">
                <Trash2 size={18} /> Eliminar mi cuenta permanentemente
              </button>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

const SettingsSidebarItem = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
  <button className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all group ${
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

export default SettingsPage;
