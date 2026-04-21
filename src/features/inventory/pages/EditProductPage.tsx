import React, { useState, useEffect } from 'react';
import { Camera, Info, ArrowLeft, Loader2, Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { useCatalogStore } from '../../catalog/store/useCatalogStore';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card } from '../../../components/ui/card';
import MainLayout from '../../../layouts/MainLayout';

const EditProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const fetchCatalog = useCatalogStore(state => state.fetchCatalog);
  
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    categoryId: '1',
    talla: 'M',
    estado: 'como_nuevo',
    description: '',
    status: 'Disponible'
  });

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const res = await fetch(`/api/catalog/products/${id}`);
        if (res.ok) {
          const product = await res.json();
          setFormData({
            name: product.name,
            price: product.price.toString(),
            categoryId: product.categoryId?.toString() || '1',
            talla: product.talla || 'M',
            estado: product.estado || 'como_nuevo',
            description: product.description || '',
            status: product.status || 'Disponible'
          });
          setPreview(product.image);
        } else {
          alert('No se pudo encontrar el producto.');
          navigate('/my-store');
        }
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setIsFetching(false);
      }
    };

    if (id) fetchProductData();
  }, [id, navigate]);

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
    setIsLoading(true);

    try {
      const response = await fetch(`/api/catalog/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          categoryId: Number(formData.categoryId),
          image: preview
        })
      });

      if (response.ok) {
        alert('¡Cambios guardados exitosamente!');
        await fetchCatalog();
        navigate('/my-store');
      } else {
        const error = await response.json();
        alert(`Error al actualizar: ${error.error}`);
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Error inesperado al guardar los cambios.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-gray-400">
          <Loader2 className="animate-spin text-brand-pink" size={40} />
          <p className="font-bold italic">Cargando datos de la prenda...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <button 
          onClick={() => navigate('/my-store')}
          className="flex items-center gap-2 text-gray-400 hover:text-brand-pink font-bold mb-8 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Volver a Mi Tienda
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black font-brand text-brand-dark tracking-tight">Editar Publicación</h1>
            <p className="text-gray-500 font-medium font-brand italic">Ajusta los detalles de tu prenda para mejorar tus ventas.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Image Upload */}
          <div className="lg:col-span-5">
            <Card className="p-6 border-transparent shadow-xl shadow-brand-pink/5 sticky top-24">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 ml-1">Imagen de la prenda</label>
              <div className="relative group cursor-pointer aspect-[4/5] rounded-[32px] overflow-hidden border-2 border-dashed border-gray-100 hover:border-brand-pink/30 transition-all bg-gray-50 flex items-center justify-center">
                {preview ? (
                  <>
                    <img 
                      src={preview.startsWith('data:') || preview.startsWith('http') ? preview : `/${preview}`} 
                      className="w-full h-full object-cover" 
                      alt="Preview" 
                    />
                    <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="text-white" size={32} />
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-gray-300 mx-auto mb-4 group-hover:text-brand-pink transition-colors">
                      <Camera size={32} />
                    </div>
                    <p className="text-sm font-bold text-gray-400">Click para subir foto</p>
                    <p className="text-[10px] text-gray-300 mt-2">Formatos sugeridos: JPG, PNG</p>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                />
              </div>
              
              <div className="mt-6 p-4 bg-blue-50/50 rounded-2xl flex gap-3 text-blue-600">
                <Info size={20} className="flex-shrink-0" />
                <p className="text-xs font-medium leading-relaxed">
                  Las fotos claras y con buena iluminación venden un 80% más rápido.
                </p>
              </div>
            </Card>
          </div>

          {/* Right: Form Details */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="p-8 border-transparent shadow-xl shadow-brand-pink/5 space-y-6">
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
                    className="flex h-14 w-full rounded-2xl border border-transparent bg-gray-50 px-6 py-4 text-sm transition-all focus:bg-white focus:border-brand-pink outline-none appearance-none cursor-pointer font-bold" 
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
                    className="flex h-14 w-full rounded-2xl border border-transparent bg-gray-50 px-6 py-4 text-sm transition-all focus:bg-white focus:border-brand-pink outline-none appearance-none cursor-pointer font-bold" 
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
                      className="!pl-10 !font-black !text-lg text-brand-pink" 
                      placeholder="0" 
                      required 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Estado de Venta</label>
                  <select 
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="flex h-14 w-full rounded-2xl border border-transparent bg-gray-50 px-6 py-4 text-sm transition-all focus:bg-white focus:border-brand-pink outline-none appearance-none cursor-pointer font-bold" 
                    required
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="Reservado">Reservado</option>
                    <option value="Vendido">Vendido</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Detalles de la prenda</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="flex w-full rounded-[24px] border border-transparent bg-gray-50 px-6 py-4 text-sm transition-all placeholder:text-gray-300 focus:bg-white focus:border-brand-pink focus:ring-4 focus:ring-brand-pink/5 outline-none font-medium" 
                  rows={6} 
                  placeholder="Cuéntanos más sobre el material, calce, desperfectos, etc." 
                  required
                ></textarea>
              </div>

              <Button type="submit" className="w-full h-16 text-base shadow-xl shadow-brand-pink/10" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin" /> Guardando cambios...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save size={20} /> Guardar cambios
                  </span>
                )}
              </Button>
            </Card>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default EditProductPage;
