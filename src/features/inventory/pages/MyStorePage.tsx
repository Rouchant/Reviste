import React from 'react';
import { 
  ShoppingBag, Plus, Package, DollarSign, Eye, Edit2, Trash2, ArrowLeft
} from 'lucide-react';
import MainLayout from '../../../layouts/MainLayout';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../auth/store/useAuthStore';

const MyStorePage: React.FC = () => {
  const { user } = useAuthStore();
  const [userProducts, setUserProducts] = React.useState<any[]>([]);
  const [isProductsLoading, setIsProductsLoading] = React.useState(false);

  const fetchUserProducts = React.useCallback(async () => {
    if (!user?.id) return;
    setIsProductsLoading(true);
    try {
      const res = await fetch(`/api/catalog/products/seller/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setUserProducts(data);
      }
    } catch (error) {
      console.error('Error fetching user products:', error);
    } finally {
      setIsProductsLoading(false);
    }
  }, [user?.id]);

  React.useEffect(() => {
    fetchUserProducts();
  }, [fetchUserProducts]);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar "${name}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/catalog/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Producto eliminado correctamente.');
        fetchUserProducts();
      } else {
        alert('Error al eliminar el producto.');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error de conexión al eliminar.');
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black font-brand text-brand-dark mb-1 tracking-tight flex items-center gap-3">
              <ShoppingBag className="text-brand-pink" size={32} /> Mi Tienda
            </h1>
            <p className="text-gray-500 font-medium">Gestiona tu inventario y monitorea tus ventas en Reviste.</p>
          </div>
          <Link to="/upload">
            <Button size="lg" className="h-14 px-8 shadow-lg shadow-brand-pink/20">
              <Plus size={20} className="mr-2" /> Publicar nueva prenda
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard icon={<Package size={20} />} label="Prendas activas" value={userProducts.length.toString()} theme="pink" />
          <StatCard icon={<DollarSign size={20} />} label="Ventas totales" value="$0" theme="green" />
          <StatCard icon={<Eye size={20} />} label="Vistas totales" value="128" theme="blue" />
          <StatCard icon={<Plus size={20} />} label="Crédito Reviste" value="$0" theme="orange" />
        </div>

        <Card className="border-transparent shadow-xl shadow-brand-pink/5 overflow-hidden">
          <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Inventario Actual</h2>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              {userProducts.length} {userProducts.length === 1 ? 'Prenda' : 'Prendas'}
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-[10px] uppercase font-bold tracking-widest text-gray-400 border-b border-gray-50">
                <tr>
                  <th className="px-8 py-5">Imagen</th>
                  <th className="px-8 py-5">Prenda</th>
                  <th className="px-8 py-5">Precio</th>
                  <th className="px-8 py-5">Estado</th>
                  <th className="px-8 py-5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isProductsLoading ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-brand-pink/20 border-t-brand-pink rounded-full animate-spin"></div>
                        <p className="text-gray-400 font-bold italic text-sm">Cargando tu clóset...</p>
                      </div>
                    </td>
                  </tr>
                ) : userProducts.length > 0 ? (
                  userProducts.map((p: any) => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden shadow-sm border border-gray-100 group-hover:scale-105 transition-transform">
                          <img 
                            src={p.image.startsWith('data:') || p.image.startsWith('http') ? p.image : `/${p.image}`} 
                            className="w-full h-full object-cover" 
                            alt={p.name}
                          />
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="font-bold text-gray-900 group-hover:text-brand-pink transition-colors">{p.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">ID: #{p.id}</p>
                      </td>
                      <td className="px-8 py-6 font-black text-brand-dark">${p.price.toLocaleString()}</td>
                      <td className="px-8 py-6">
                        <Badge variant={p.status === 'Disponible' ? 'success' : 'muted'}>{p.status}</Badge>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <Link 
                            to={`/edit-product/${p.id}`}
                            className="p-2 border border-gray-100 rounded-xl text-gray-400 hover:text-brand-pink hover:bg-white hover:shadow-md transition-all"
                            title="Editar Publicación"
                          >
                            <Edit2 size={16} />
                          </Link>
                          <button 
                            onClick={() => handleDelete(p.id, p.name)}
                            className="p-2 border border-gray-100 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 hover:shadow-md transition-all"
                            title="Eliminar Prenda"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <div className="max-w-xs mx-auto">
                        <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-200 mx-auto mb-4">
                          <Package size={32} />
                        </div>
                        <p className="text-gray-500 font-bold mb-4 text-sm">Tu tienda está vacía.</p>
                        <Link to="/upload">
                          <Button variant="outline" size="sm" className="font-bold">Empezar a vender</Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

const StatCard = ({ icon, label, value, theme }: { icon: React.ReactNode, label: string, value: string, theme: 'pink' | 'green' | 'blue' | 'orange' }) => {
  const themes = {
    pink: "bg-pink-50 text-brand-pink",
    green: "bg-green-50 text-green-600",
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600"
  };

  return (
    <Card className="p-6 border-transparent shadow-xl shadow-brand-pink/5 hover:translate-y-[-4px] transition-all">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${themes[theme]}`}>
        {icon}
      </div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-black text-brand-dark">{value}</p>
    </Card>
  );
};

export default MyStorePage;
