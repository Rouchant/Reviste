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
import { toast } from 'sonner';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<'perfil' | 'notificaciones' | 'seguridad' | 'pagos'>('perfil');
  const { user, logout, updateUser } = useAuthStore();

  const [name, setName] = React.useState(user?.name || '');
  const [username, setUsername] = React.useState(user?.username || user?.name?.toLowerCase().replace(/\s/g, '_') || '');
  const [bio, setBio] = React.useState(user?.bio || '');
  const [phone, setPhone] = React.useState(user?.phone || '');
  const [street, setStreet] = React.useState(user?.street || '');
  const [selectedRegion, setSelectedRegion] = React.useState(user?.regionId || '');
  const [selectedComuna, setSelectedComuna] = React.useState(user?.comunaId || '');
  const [regionsList, setRegionsList] = React.useState<{id: number, name: string}[]>([]);
  const [comunasList, setComunasList] = React.useState<{id: number, name: string}[]>([]);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    fetch('/api/location/regions')
      .then(res => res.json())
      .then(data => setRegionsList(data))
      .catch(console.error);
  }, []);

  React.useEffect(() => {
    if (!selectedRegion) {
      setComunasList([]);
      return;
    }
    fetch(`/api/location/comunas/${selectedRegion}`)
      .then(res => res.json())
      .then(data => setComunasList(data))
      .catch(console.error);
  }, [selectedRegion]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, bio, phone, street, regionId: selectedRegion, comunaId: selectedComuna })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al guardar');
      updateUser(data);
      toast.success('Perfil actualizado correctamente');
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmNewPassword, setConfirmNewPassword] = React.useState('');
  const [isChangingPassword, setIsChangingPassword] = React.useState(false);

  const handlePasswordChange = async () => {
    if (!user) return;
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error('Por favor completa todos los campos de contraseña');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error('Las contraseñas nuevas no coinciden');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('La nueva contraseña debe tener al menos 8 caracteres');
      return;
    }

    setIsChangingPassword(true);
    try {
      const response = await fetch(`/api/users/${user.id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al cambiar contraseña');
      
      toast.success('Contraseña actualizada correctamente');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-3xl font-black font-brand text-brand-dark mb-2 tracking-tight">Configuración</h1>
        <p className="text-gray-500 mb-10 font-medium font-brand">Gestiona tu cuenta, preferencias y seguridad.</p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Menu Sidebar */}
          <div className="md:col-span-4 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 mb-6 md:mb-0">
            <SettingsSidebarItem 
              icon={<User size={20} />} 
              label="Perfil" 
              active={activeTab === 'perfil'} 
              onClick={() => setActiveTab('perfil')}
            />
            <SettingsSidebarItem 
              icon={<Bell size={20} />} 
              label="Notificaciones" 
              active={activeTab === 'notificaciones'} 
              onClick={() => setActiveTab('notificaciones')}
            />
            <SettingsSidebarItem 
              icon={<Shield size={20} />} 
              label="Seguridad" 
              active={activeTab === 'seguridad'} 
              onClick={() => setActiveTab('seguridad')}
            />
            <SettingsSidebarItem 
              icon={<CreditCard size={20} />} 
              label="Pagos" 
              active={activeTab === 'pagos'} 
              onClick={() => setActiveTab('pagos')}
            />
            
            <div className="md:pt-4 md:mt-4 md:border-t border-gray-100 flex-shrink-0">
              <button 
                onClick={logout}
                className="flex md:w-full items-center justify-center md:justify-between p-4 rounded-2xl text-red-500 hover:bg-red-50 font-bold transition-all group bg-red-50/30 md:bg-transparent"
              >
                <span className="flex items-center gap-3"><LogOut size={20} /> <span className="hidden md:inline">Cerrar Sesión</span></span>
                <ChevronRight size={16} className="hidden md:block opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all" />
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
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">Avatar de cuenta</p>
                        <p className="text-xs text-gray-400">Tu avatar se genera automáticamente según tu nombre.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nombre Completo</label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Alias (Usuario)</label>
                        <Input value={username} onChange={(e) => setUsername(e.target.value.replace(/^@/, ''))} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Teléfono</label>
                        <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+56 9..." />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Dirección (Calle y Número)</label>
                      <Input value={street} onChange={(e) => setStreet(e.target.value)} placeholder="Ej: Av. Providencia 1234, depto 501" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Región</label>
                        <select 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Comuna</label>
                        <select 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Biografía</label>
                      <textarea 
                        className="flex w-full rounded-[24px] border border-transparent bg-gray-50 px-6 py-4 text-sm transition-all focus:bg-white focus:border-brand-pink outline-none"
                        rows={3}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Cuéntanos un poco sobre ti..."
                      ></textarea>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button onClick={handleSave} disabled={isSaving} className="px-8 h-12">
                        {isSaving ? 'Guardando...' : 'Guardar cambios'}
                      </Button>
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
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nueva Contraseña</label>
                      <Input 
                        type="password" 
                        placeholder="Mínimo 8 caracteres" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Repetir Nueva Contraseña</label>
                      <Input 
                        type="password" 
                        placeholder="Confirma tu nueva contraseña" 
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                      />
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={handlePasswordChange}
                      disabled={isChangingPassword}
                    >
                      {isChangingPassword ? 'Actualizando...' : 'Cambiar contraseña'}
                    </Button>
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
    className={`flex items-center justify-center md:justify-between p-4 rounded-2xl font-bold transition-all group flex-shrink-0 min-w-[56px] md:w-full ${
    active 
    ? "bg-brand-pink text-white shadow-lg shadow-brand-pink/20" 
    : "text-gray-400 hover:text-gray-600 hover:bg-gray-50 bg-gray-50/50 md:bg-transparent"
  }`}>
    <span className="flex items-center gap-3">{icon} <span className="hidden md:inline">{label}</span></span>
    <ChevronRight size={16} className={`hidden md:block transition-all ${
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
