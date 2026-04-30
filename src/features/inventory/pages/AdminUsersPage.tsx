import React, { useState, useEffect } from 'react';
import { Users, Trash2, ShieldCheck, User } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import AdminLayout from '../../../layouts/AdminLayout';

interface UserData {
  id: number;
  name: string;
  username: string;
  email: string;
  isAdmin: boolean;
  registeredAt: string;
}

const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Seguro que deseas eliminar a este usuario de forma permanente?')) {
      try {
        const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
        if (res.ok) fetchUsers();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleToggleRole = async (id: number, currentRole: boolean) => {
    if (window.confirm(`¿Deseas ${currentRole ? 'quitar' : 'otorgar'} privilegios de administrador a este usuario?`)) {
      try {
        const res = await fetch(`/api/users/${id}/role`, { 
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isAdmin: !currentRole })
        });
        if (res.ok) fetchUsers();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-black font-brand text-brand-dark mb-1 tracking-tight">Gestión de Usuarios</h1>
          <p className="text-gray-400 font-medium text-sm">Administra los usuarios registrados en la plataforma</p>
        </div>
      </div>

      <Card className="border-transparent shadow-xl shadow-brand-pink/5">
        <CardHeader className="flex flex-row justify-between items-center sm:px-8">
          <CardTitle className="text-lg flex items-center gap-2"><Users size={20}/> Lista de Usuarios</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                <th className="px-6 sm:px-8 py-4">Usuario</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Rol</th>
                <th className="px-6 py-4">Registro</th>
                <th className="px-6 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">Cargando usuarios...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">No hay usuarios registrados.</td>
                </tr>
              ) : (
                users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 sm:px-8 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.email}`}
                          className="w-10 h-10 rounded-full bg-gray-100"
                          alt="Avatar"
                        />
                        <div>
                          <p className="font-bold text-gray-800">{u.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold tracking-wider">@{u.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-medium">{u.email}</td>
                    <td className="px-6 py-4">
                      {u.isAdmin ? (
                        <Badge variant="success" className="bg-brand-pink text-white border-none">Admin</Badge>
                      ) : (
                        <Badge variant="default" className="bg-gray-100 text-gray-600 border-none hover:bg-gray-200">Usuario</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs">
                      {new Date(u.registeredAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleToggleRole(u.id, u.isAdmin)}
                          aria-label="Cambiar Rol"
                          title={u.isAdmin ? "Quitar admin" : "Hacer admin"}
                          className={`p-2 border rounded-xl transition-all shadow-sm ${u.isAdmin ? 'border-brand-pink text-brand-pink hover:bg-pink-50' : 'border-gray-100 text-gray-400 hover:text-brand-pink hover:border-brand-pink hover:bg-pink-50'}`}
                        >
                          {u.isAdmin ? <User size={16} /> : <ShieldCheck size={16} />}
                        </button>
                        <button 
                          onClick={() => handleDelete(u.id)}
                          aria-label="Eliminar"
                          title="Eliminar usuario"
                          className="p-2 border border-gray-100 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </AdminLayout>
  );
};

export default AdminUsersPage;
