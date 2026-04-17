import React from 'react';
import MainLayout from '../../../layouts/MainLayout';
import { Package, DollarSign, Eye, Heart, Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';

const MyGarmentsPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black font-brand text-brand-dark mb-1 tracking-tight">Mis Prendas Publicadas</h1>
            <p className="text-gray-500 font-medium">Gestiona tu clóset circular y monitorea tus ventas.</p>
          </div>
          <Link to="/upload">
            <Button size="lg" className="h-14">
              <Plus size={20} className="mr-2" /> Publicar Prenda
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <MyStatCard icon={<Package size={20} />} label="Prendas en venta" value="12" badge="+2 esta semana" />
          <MyStatCard icon={<DollarSign size={20} />} label="Ventas totales" value="$145.000" />
          <MyStatCard icon={<Eye size={20} />} label="Visitas totales" value="1.240" />
          <MyStatCard icon={<Heart size={20} />} label="Favoritos" value="85" />
        </div>

        {/* Inventory Table */}
        <Card className="border-transparent shadow-xl shadow-brand-pink/5 overflow-hidden mb-16">
          <CardHeader className="p-8 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-50 bg-gray-50/30">
            <CardTitle className="text-xl">Inventario Actual</CardTitle>
            <div className="relative w-full md:w-64">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                <Search size={18} />
              </span>
              <Input 
                type="text" 
                className="h-11 pl-12 pr-4 bg-white border-gray-100" 
                placeholder="Buscar prenda..." 
              />
            </div>
          </CardHeader>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-[10px] uppercase font-bold tracking-widest text-gray-400 border-b border-gray-50">
                <tr>
                  <th className="px-8 py-5">Imagen</th>
                  <th className="px-8 py-5">Prenda</th>
                  <th className="px-8 py-5">Precio</th>
                  <th className="px-8 py-5">Estado</th>
                  <th className="px-8 py-5">Vistas</th>
                  <th className="px-8 py-5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <GarmentRow 
                  img="assets/images/products/item1.png"
                  name="Chaqueta Denim Vintage"
                  date="Publicada hace 2 días"
                  price="$25.990"
                  status="Activa"
                  views="452"
                />
                <GarmentRow 
                  img="assets/images/products/item2.png"
                  name="Suéter Retro Color Block"
                  date="Publicada hace 5 días"
                  price="$18.500"
                  status="Vendida"
                  views="128"
                />
              </tbody>
            </table>
          </div>
          
          <CardContent className="p-6 bg-gray-50/10 text-center flex justify-center border-t border-gray-50">
              <Button variant="ghost" className="text-brand-pink font-bold uppercase tracking-widest hover:bg-transparent hover:underline px-0 h-auto">
                Ver todas mis publicaciones
              </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

interface MyStatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  badge?: string;
}

const MyStatCard = ({ icon, label, value, badge }: MyStatCardProps) => (
  <Card className="p-6 flex flex-col items-center text-center transition-all hover:translate-y-[-4px] hover:shadow-lg border-transparent shadow-xl shadow-brand-pink/5">
    <div className="w-12 h-12 bg-gray-50/80 rounded-2xl flex items-center justify-center text-brand-pink mb-4 shadow-sm">
      {icon}
    </div>
    <h3 className="text-3xl font-black text-gray-900 mb-1">{value}</h3>
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">{label}</p>
    {badge && (
      <Badge variant="success" className="px-3 py-1">{badge}</Badge>
    )}
  </Card>
);

interface GarmentRowProps {
  img: string;
  name: string;
  date: string;
  price: string;
  status: string;
  views: string;
}

const GarmentRow = ({ img, name, date, price, status, views }: GarmentRowProps) => (
  <tr className="hover:bg-gray-50/50 transition-colors group">
    <td className="px-8 py-6">
      <img 
        src={img} 
        loading="lazy"
        decoding="async"
        className="w-16 h-16 rounded-2xl object-cover shadow-sm border border-gray-100 transition-transform group-hover:scale-105" 
        alt={name} 
      />
    </td>
    <td className="px-8 py-6">
      <p className="font-bold text-gray-900 mb-0.5 line-clamp-1 group-hover:text-brand-pink transition-colors">{name}</p>
      <p className="text-[10px] text-gray-400 font-bold italic tracking-wide">{date}</p>
    </td>
    <td className="px-8 py-6 font-black text-brand-pink">{price}</td>
    <td className="px-8 py-6">
      <Badge variant={status === "Activa" ? "success" : "muted"}>{status}</Badge>
    </td>
    <td className="px-8 py-6">
      <div className="flex items-center gap-1.5 text-gray-500 text-sm font-bold">
        <Eye size={14} className="text-gray-300" /> {views}
      </div>
    </td>
    <td className="px-8 py-6">
      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
        <button 
          aria-label="Editar"
          className="p-2 border border-gray-100 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-white hover:shadow-md transition-all"
        >
          <Edit2 size={16} />
        </button>
        <button 
          aria-label="Eliminar"
          className="p-2 border border-gray-100 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 hover:shadow-md transition-all"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </td>
  </tr>
);

export default MyGarmentsPage;
