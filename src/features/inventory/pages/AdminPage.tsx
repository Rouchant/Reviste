import React from 'react';
import { 
  Plus, DollarSign, Package, ShoppingCart, Users, User, Menu,
  TrendingUp, Edit2, Trash2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Card, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import AdminLayout from '../../../layouts/AdminLayout';

const AdminPage: React.FC = () => {
  return (
    <AdminLayout>
      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center mb-8 px-2">
        <img src="/assets/images/ui/logo-h.png" alt="REVISTE" className="h-8" />
        <div className="flex gap-2">
          <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-brand-pink bg-white shadow-sm">
            <User size={20} />
          </div>
          <button className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center bg-white shadow-sm hover:bg-gray-50 transition-colors">
            <Menu size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-black font-brand text-brand-dark mb-1 tracking-tight">Panel de Control</h1>
          <p className="text-gray-400 font-medium text-sm">Bienvenido de nuevo, Administrador Reviste.</p>
        </div>
        <Link to="/upload">
          <Button className="h-12 px-6">
            <Plus size={20} className="mr-2" /> Nueva Prenda
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard 
          icon={<DollarSign size={20} />} 
          label="Ventas Totales" 
          value="$1.240.000" 
          trend="+12.5%" 
          theme="blue" 
        />
        <StatCard 
          icon={<Package size={20} />} 
          label="Prendas Activas" 
          value="142" 
          trend="8 hoy" 
          theme="green" 
        />
        <StatCard 
          icon={<ShoppingCart size={20} />} 
          label="Pedidos Pendientes" 
          value="12" 
          subText="Requieren atención" 
          theme="orange" 
        />
        <StatCard 
          icon={<Users size={20} />} 
          label="Nuevos Usuarios" 
          value="34" 
          subText="Esta semana" 
          theme="purple" 
        />
      </div>

      {/* Inventory Table */}
      <Card className="border-transparent shadow-xl shadow-brand-pink/5">
        <CardHeader className="flex flex-row justify-between items-center sm:px-8">
          <CardTitle className="text-lg">Inventario Reciente</CardTitle>
          <Button variant="ghost" size="sm" className="text-brand-pink h-auto font-bold uppercase tracking-widest px-0 hover:bg-transparent hover:underline">
            Ver todo
          </Button>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                <th className="px-6 sm:px-8 py-4">Imagen</th>
                <th className="px-6 py-4">Prenda</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4">Precio</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              <InventoryRow 
                img="/assets/images/products/item1.png"
                name="Chaqueta Denim Vintage"
                id="#4592"
                category="Denim"
                price="$25.990"
                status="Disponible"
                statusVariant="success"
              />
              <InventoryRow 
                img="/assets/images/products/item2.png"
                name="Suéter Retro Color Block"
                id="#4588"
                category="Vintage 90s"
                price="$18.500"
                status="Vendido"
                statusVariant="destructive"
              />
              <InventoryRow 
                img="/assets/images/products/item3.png"
                name="Pantalones Cargo Earthy"
                id="#4580"
                category="Streetwear"
                price="$22.000"
                status="Reservado"
                statusVariant="warning"
              />
            </tbody>
          </table>
        </div>
      </Card>
    </AdminLayout>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: string;
  subText?: string;
  theme: 'blue' | 'green' | 'orange' | 'purple';
}

const StatCard = ({ icon, label, value, trend, subText, theme }: StatCardProps) => {
  const themes: Record<StatCardProps['theme'], string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-purple-50 text-purple-600"
  };
  
  return (
    <Card className="p-6 hover:shadow-lg hover:-translate-y-1 group border-transparent">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${themes[theme]} shadow-sm`}>
        {icon}
      </div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-2xl font-black text-gray-800 mb-1">{value}</h3>
      {trend && (
        <span className="text-xs font-bold text-green-500 flex items-center gap-1">
          <TrendingUp size={14} /> {trend}
        </span>
      )}
      {subText && (
        <span className="text-xs font-medium text-gray-400">
          {subText}
        </span>
      )}
    </Card>
  );
};

interface InventoryRowProps {
  img: string;
  name: string;
  id: string;
  category: string;
  price: string;
  status: string;
  statusVariant: 'success' | 'destructive' | 'warning' | 'default' | 'muted';
}

const InventoryRow = ({ img, name, id, category, price, status, statusVariant }: InventoryRowProps) => (
  <tr className="hover:bg-gray-50/80 transition-colors">
    <td className="px-6 sm:px-8 py-4">
      <img 
        src={img} 
        loading="lazy"
        decoding="async"
        className="w-12 h-12 rounded-xl object-cover border border-gray-100 shadow-sm" 
        alt={name} 
      />
    </td>
    <td className="px-6 py-4">
      <p className="font-bold text-gray-800 line-clamp-1">{name}</p>
      <p className="text-[10px] text-gray-400 font-bold tracking-wider">{id}</p>
    </td>
    <td className="px-6 py-4 text-gray-500 font-medium">{category}</td>
    <td className="px-6 py-4 font-bold text-brand-dark">{price}</td>
    <td className="px-6 py-4">
      <Badge variant={statusVariant}>{status}</Badge>
    </td>
    <td className="px-6 py-4">
      <div className="flex gap-2">
        <button 
          aria-label="Editar"
          className="p-2 border border-gray-100 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all shadow-sm"
        >
          <Edit2 size={16} />
        </button>
        <button 
          aria-label="Eliminar"
          className="p-2 border border-gray-100 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </td>
  </tr>
);

export default AdminPage;
