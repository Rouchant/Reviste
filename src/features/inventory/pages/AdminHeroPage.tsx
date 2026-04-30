import React, { useState, useEffect } from 'react';
import { Images, Trash2, Plus, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import AdminLayout from '../../../layouts/AdminLayout';

interface HeroSlideData {
  id: number;
  title: string;
  subtitle: string;
  buttonText: string;
  image: string;
  link: string;
}

const AdminHeroPage: React.FC = () => {
  const [slides, setSlides] = useState<HeroSlideData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    buttonText: '',
    image: '',
    link: ''
  });

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/catalog/hero-slides');
      const data = await res.json();
      setSlides(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      const res = await fetch('/api/catalog/hero-slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setFormData({ title: '', subtitle: '', buttonText: '', image: '', link: '' });
        fetchSlides();
      } else {
        alert('Error al agregar slide');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Seguro que deseas eliminar este slide?')) {
      try {
        const res = await fetch(`/api/catalog/hero-slides/${id}`, { method: 'DELETE' });
        if (res.ok) fetchSlides();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-black font-brand text-brand-dark mb-1 tracking-tight">Carrusel Principal</h1>
          <p className="text-gray-400 font-medium text-sm">Administra las imágenes y textos destacados del inicio</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add New Slide Form */}
        <div className="lg:col-span-1">
          <Card className="border-transparent shadow-xl shadow-brand-pink/5 sticky top-8">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus size={20} className="text-brand-pink" /> Nuevo Slide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddSlide} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Título</label>
                  <Input name="title" value={formData.title} onChange={handleInputChange} placeholder="Ej: Moda Vintage" required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Subtítulo</label>
                  <Input name="subtitle" value={formData.subtitle} onChange={handleInputChange} placeholder="Ej: Descubre tesoros únicos" required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Texto del Botón</label>
                  <Input name="buttonText" value={formData.buttonText} onChange={handleInputChange} placeholder="Ej: Comprar ahora" required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">URL de la Imagen</label>
                  <Input name="image" value={formData.image} onChange={handleInputChange} placeholder="https://ejemplo.com/imagen.jpg" required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Enlace (Destino)</label>
                  <Input name="link" value={formData.link} onChange={handleInputChange} placeholder="/search" required />
                </div>
                <Button type="submit" className="w-full" disabled={isAdding}>
                  {isAdding ? <Loader2 className="animate-spin" /> : 'Agregar Slide'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Slides List */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="text-center py-12 text-gray-400">Cargando slides...</div>
          ) : slides.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No hay slides configurados.</div>
          ) : (
            slides.map((slide) => (
              <Card key={slide.id} className="border-transparent shadow-xl shadow-brand-pink/5 overflow-hidden flex flex-col sm:flex-row">
                <div className="sm:w-1/3 aspect-video sm:aspect-auto bg-gray-100 flex-shrink-0 relative">
                  <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-black text-xl text-brand-dark mb-1">{slide.title}</h3>
                    <p className="text-sm text-gray-500 mb-4">{slide.subtitle}</p>
                    <div className="flex flex-wrap gap-2 text-xs font-bold text-gray-400">
                      <span className="bg-gray-100 px-2 py-1 rounded-md border">Botón: {slide.buttonText}</span>
                      <span className="bg-gray-100 px-2 py-1 rounded-md border">Link: {slide.link}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button 
                      onClick={() => handleDelete(slide.id)}
                      className="p-2 border border-gray-100 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm flex items-center gap-2 text-sm font-bold"
                    >
                      <Trash2 size={16} /> Eliminar
                    </button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminHeroPage;
