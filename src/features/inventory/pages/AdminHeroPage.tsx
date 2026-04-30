import React, { useState, useEffect } from 'react';
import { Images, Trash2, Plus, Loader2, Edit2, X, Camera } from 'lucide-react';
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
  const [editingId, setEditingId] = useState<number | null>(null);

  const getImageUrl = (url: string) => url.startsWith('http') || url.startsWith('/') ? url : `/${url}`;

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, image: event.target?.result as string }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmitSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      if (editingId !== null) {
        const res = await fetch(`/api/catalog/hero-slides/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (res.ok) {
          handleCancelEdit();
          fetchSlides();
        } else {
          alert('Error al actualizar slide');
        }
      } else {
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
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleEditInit = (slide: HeroSlideData) => {
    setEditingId(slide.id);
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle,
      buttonText: slide.buttonText,
      image: slide.image,
      link: slide.link
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ title: '', subtitle: '', buttonText: '', image: '', link: '' });
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
                {editingId !== null ? (
                  <><Edit2 size={20} className="text-brand-pink" /> Editar Slide</>
                ) : (
                  <><Plus size={20} className="text-brand-pink" /> Nuevo Slide</>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitSlide} className="space-y-4">
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
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Imagen del Slide</label>
                  <div 
                    onClick={() => document.getElementById('heroImageInput')?.click()}
                    className="relative aspect-video rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50/50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-brand-pink/30 transition-all overflow-hidden group mb-2"
                  >
                    {formData.image ? (
                      <img src={getImageUrl(formData.image)} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-4">
                        <Camera size={24} className="text-gray-300 mx-auto mb-2 group-hover:text-brand-pink transition-colors" />
                        <p className="text-[10px] font-bold text-gray-400">Subir imagen</p>
                      </div>
                    )}
                    <input type="file" id="heroImageInput" hidden accept="image/*" onChange={handleImageChange} />
                  </div>
                  <Input 
                    name="image" 
                    value={formData.image} 
                    onChange={handleInputChange} 
                    placeholder="O pega una URL aquí..." 
                    className="h-8 text-[10px]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Enlace (Destino)</label>
                  <Input name="link" value={formData.link} onChange={handleInputChange} placeholder="Ej: /search o /product/nombre" required />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" disabled={isAdding}>
                    {isAdding ? <Loader2 className="animate-spin mx-auto" /> : (editingId !== null ? 'Guardar Cambios' : 'Agregar Slide')}
                  </Button>
                  {editingId !== null && (
                    <Button type="button" variant="outline" onClick={handleCancelEdit} title="Cancelar">
                      <X size={20} />
                    </Button>
                  )}
                </div>
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
              <Card key={slide.id} className={`border-transparent shadow-xl shadow-brand-pink/5 overflow-hidden flex flex-col sm:flex-row transition-all ${editingId === slide.id ? 'ring-2 ring-brand-pink' : ''}`}>
                <div className="sm:w-1/3 aspect-video sm:aspect-auto bg-gray-100 flex-shrink-0 relative">
                  <img src={getImageUrl(slide.image)} alt={slide.title} className="w-full h-full object-cover" />
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
                  <div className="mt-4 flex justify-end gap-2">
                    <button 
                      onClick={() => handleEditInit(slide)}
                      className="p-2 border border-gray-100 rounded-xl text-gray-400 hover:text-brand-pink hover:bg-pink-50 transition-all shadow-sm flex items-center gap-2 text-sm font-bold"
                    >
                      <Edit2 size={16} /> Editar
                    </button>
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
