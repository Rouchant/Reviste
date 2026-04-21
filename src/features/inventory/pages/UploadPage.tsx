import React, { useState } from 'react';
import { Camera, Info, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { useCatalogStore } from '../../catalog/store/useCatalogStore';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card } from '../../../components/ui/card';
import MainLayout from '../../../layouts/MainLayout';

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const fetchCatalog = useCatalogStore(state => state.fetchCatalog);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    oldPrice: '',
    categoryId: '1',
    talla: 'M',
    estado: 'como_nuevo',
    description: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preview) {
      alert('Por favor, sube una foto de la prenda');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/catalog/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          oldPrice: formData.oldPrice ? Number(formData.oldPrice) : undefined,
          categoryId: Number(formData.categoryId),
          sellerId: user?.id ? Number(user.id) : 10,
          image: preview
        })
      });

      if (response.ok) {
        alert('¡Genial! Tu prenda ha sido publicada exitosamente.');
        await fetchCatalog(); // Refresh store
        navigate('/my-store'); // Go back to "Mi Tienda"
      } else {
        const error = await response.json();
        alert(`Error al subir prenda: ${error.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Ocurrió un error inesperado al subir la prenda.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-10 flex flex-col items-center relative overflow-hidden">
        <div className="w-full max-w-2xl z-10">
          <Card className="p-8 md:p-12 shadow-2xl shadow-brand-pink/10 border-transparent">
            <h1 className="text-2xl md:text-3xl font-black font-brand text-center mb-4 text-brand-dark leading-tight">
              Darle una segunda vida a tu ropa 🌿
            </h1>
            <p className="text-gray-500 text-center mb-10 font-medium font-brand">
              Sube los detalles de tu prenda y únete a la moda circular.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Foto de la prenda</label>
                <div 
                  onClick={() => document.getElementById('fileInput')?.click()}
                  className="relative aspect-video rounded-[32px] border-2 border-dashed border-gray-100 bg-gray-50/50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-brand-pink/30 transition-all overflow-hidden group"
                >
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover animate-in fade-in duration-500" />
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-gray-300 mx-auto mb-4 shadow-sm group-hover:text-brand-pink transition-colors">
                        <Camera size={32} />
                      </div>
                      <p className="font-bold text-gray-400 group-hover:text-gray-600 transition-colors">Añadir foto principal</p>
                      <span className="text-[10px] text-gray-300 uppercase tracking-widest font-bold">Luz natural recomendada</span>
                    </div>
                  )}
                  <input type="file" id="fileInput" hidden accept="image/*" onChange={handleImageChange} />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Título de la publicación</label>
                <Input 
                  name="name"
                  type="text" 
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ej: Chaqueta Denim Vintage 90s" 
                  required 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Categoría</label>
                  <select 
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className="flex h-14 w-full rounded-2xl border border-transparent bg-gray-50 px-6 py-4 text-sm transition-all focus:bg-white focus:border-brand-pink outline-none appearance-none cursor-pointer" 
                    required
                  >
                    <option value="1">Vintage 90s</option>
                    <option value="2">Y2K Style</option>
                    <option value="3">Denim</option>
                    <option value="4">Streetwear</option>
                    <option value="5">Accesorios</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Talla</label>
                  <select 
                    name="talla"
                    value={formData.talla}
                    onChange={handleInputChange}
                    className="flex h-14 w-full rounded-2xl border border-transparent bg-gray-50 px-6 py-4 text-sm transition-all focus:bg-white focus:border-brand-pink outline-none appearance-none cursor-pointer" 
                    required
                  >
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="UNICA">Talla Única</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Precio de venta</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold z-10">$</span>
                    <Input 
                      name="price"
                      type="number" 
                      value={formData.price}
                      onChange={handleInputChange}
                      className="!pl-10" 
                      placeholder="0" 
                      required 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Estado</label>
                  <select 
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                    className="flex h-14 w-full rounded-2xl border border-transparent bg-gray-50 px-6 py-4 text-sm transition-all focus:bg-white focus:border-brand-pink outline-none appearance-none cursor-pointer" 
                    required
                  >
                    <option value="nuevo">Nuevo con etiqueta</option>
                    <option value="como_nuevo">Como nuevo</option>
                    <option value="bueno">Buen estado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Detalles de la prenda</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="flex w-full rounded-[24px] border border-transparent bg-gray-50 px-6 py-4 text-sm transition-all placeholder:text-gray-300 focus:bg-white focus:border-brand-pink focus:ring-4 focus:ring-brand-pink/5 outline-none disabled:cursor-not-allowed disabled:opacity-50" 
                  rows={4} 
                  placeholder="Cuéntanos más sobre el material, calce, desperfectos, etc." 
                  required
                ></textarea>
              </div>

              <div className="p-4 bg-pink-50 rounded-2xl flex items-start gap-4 border border-pink-100">
                <Info className="text-brand-pink shrink-0 mt-0.5" size={20} />
                <p className="text-xs text-brand-pink/80 font-medium leading-relaxed">
                  Tu publicación será revisada por nuestro equipo de curatoria. Te avisaremos cuando esté publicada.
                </p>
              </div>

              <Button type="submit" className="w-full h-16 text-base" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin" /> Publicando...
                  </span>
                ) : (
                  'Publicar prenda'
                )}
              </Button>
              
              <div className="text-center">
                <button 
                  type="button"
                  onClick={() => navigate(-1)}
                  className="text-gray-400 text-sm font-bold hover:text-gray-600 transition-colors inline-flex items-center gap-2"
                >
                  <ArrowLeft size={16} /> Cancelar y volver
                </button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default UploadPage;
