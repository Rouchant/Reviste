import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Truck, ShieldCheck, RotateCcw, Award, ShoppingBag } from 'lucide-react';
import { parseProductId, getProductUrl } from '../../../lib/slugify';
import MainLayout from '../../../layouts/MainLayout';
import ProductCard from '../components/ProductCard';
import GallerySection from '../../../components/GallerySection';
import { useCartStore } from '../../cart/store/useCartStore';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { useCatalog } from '../hooks/useCatalog';
import { Product } from '../types';

const ProductDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const id = parseProductId(slug);
  const addItem = useCartStore((state) => state.addItem);
  const { allProducts } = useCatalog();
  const { isAuthenticated } = useAuthStore();
  
  const [productDetail, setProductDetail] = useState<any>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(true);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setDetailError('URL de producto inválida');
        setIsDetailLoading(false);
        return;
      }
      setIsDetailLoading(true);
      try {
        const response = await fetch(`/api/catalog/products/${id}`);
        if (!response.ok) throw new Error('Producto no encontrado');
        const data = await response.json();
        setProductDetail(data);
        setSelectedImage(getImageUrl(data.image));
      } catch (err) {
        setDetailError((err as Error).message);
      } finally {
        setIsDetailLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const getImageUrl = (src: string) => {
    if (!src) return '/assets/images/ui/placeholder.png';
    return src.startsWith('http') || src.startsWith('/') ? src : `/${src}`;
  };

  if (isDetailLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-pink"></div>
        </div>
      </MainLayout>
    );
  }

  if (detailError || !productDetail) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Producto no encontrado</h2>
          <Button onClick={() => window.location.reload()} variant="primary" className="mt-4">Reintentar</Button>
          <Link to="/">
            <Button variant="outline" className="mt-4 ml-2">Volver al inicio</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const currentImage = selectedImage || getImageUrl(productDetail.image);
  const images = productDetail.images || [productDetail.image];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-4">
        {/* Breadcrumbs */}
        <nav className="mb-4 md:mb-8 text-sm">
          <ol className="flex items-center gap-2 text-gray-500">
            <li><Link to="/" className="hover:text-brand-pink transition-colors">Inicio</Link></li>
            <li className="before:content-['/'] before:mr-2 text-gray-400">Catálogo</li>
            <li className="before:content-['/'] before:mr-2 font-bold text-brand-dark tracking-tight truncate">{productDetail.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* Left: Gallery */}
          <div className="lg:col-span-7">
            <div className="space-y-4">
              <Card className="aspect-[4/5] md:aspect-square overflow-hidden border-transparent bg-gray-50">
                <img 
                  src={currentImage} 
                  alt={productDetail.name} 
                  className="w-full h-full object-cover transition-all duration-700"
                />
              </Card>
              
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {images.map((img: string, idx: number) => {
                    const thumbUrl = getImageUrl(img);
                    return (
                      <button 
                        key={idx}
                        onClick={() => setSelectedImage(thumbUrl)}
                        className={`w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                          currentImage === thumbUrl ? "border-brand-pink" : "border-transparent hover:border-gray-200"
                        }`}
                      >
                        <img src={thumbUrl} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                      </button>
                    );
                  })}
                </div>
              )}

              <Card className="mt-8 p-6 md:p-8 border-transparent bg-white shadow-sm">
                <h4 className="text-xl font-bold font-brand mb-4">Descripción</h4>
                <p className="text-gray-600 leading-relaxed">
                  {productDetail.description || `Esta icónica pieza ${productDetail.tag || ''} es una joya única para tu armario. Está en excelentes condiciones, seleccionada cuidadosamente para nuestro mercado de moda circular.`}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <Badge variant="muted">#EstiloUnico</Badge>
                  <Badge variant="muted">#ModaCircular</Badge>
                  <Badge variant="muted">#Reviste</Badge>
                </div>
              </Card>
            </div>
          </div>

          {/* Right: Checkout Box */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-6">
              <Card className="p-6 md:p-8 shadow-xl shadow-brand-pink/5 border-transparent">
                <div className="mb-4">
                  <Badge variant="success" className="px-3 py-1">Usado - Como nuevo</Badge>
                </div>
                
                <h1 className="text-2xl md:text-3xl font-bold font-brand mb-3 text-gray-900 leading-tight">
                  {productDetail.name}
                </h1>

                <div className="flex items-center gap-2 mb-6">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => {
                      const ratingVal = productDetail.rating || 4;
                      const isFull = i < Math.floor(ratingVal);
                      const isHalf = !isFull && i < ratingVal;
                      return (
                        <Star 
                          key={i} 
                          size={16} 
                          fill={isFull ? "#FFD700" : (isHalf ? "url(#starGradient)" : "none")} 
                          className={isFull || isHalf ? "text-[#FFD700]" : "text-gray-300"} 
                        />
                      );
                    })}
                  </div>
                  <span className="text-gray-400 text-sm">({productDetail.reviews || 0} valoraciones)</span>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="text-3xl md:text-4xl font-black text-brand-dark">
                      ${productDetail.price.toLocaleString()}
                    </span>
                    {productDetail.oldPrice && (
                      <span className="text-lg text-gray-400 line-through">
                        ${productDetail.oldPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className="text-brand-green font-bold flex items-center gap-1 text-sm">
                    <Truck size={18} /> Envío gratis a todo el país
                  </p>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl mb-8 border border-gray-100">
                  <ShieldCheck className="text-brand-pink" size={24} />
                  <div className="text-sm">
                    <p className="font-bold text-gray-800">Vendido por {productDetail.seller || '@Reviste'}</p>
                    <p className="text-xs text-brand-pink font-bold">Vendedor Verificado</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-3 bg-gray-50 rounded-2xl text-center border border-gray-100">
                    <p className="text-[10px] text-gray-400 uppercase font-bold mb-1 tracking-widest">Talla</p>
                    <p className="font-bold text-gray-800">M</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-2xl text-center border border-gray-100">
                    <p className="text-[10px] text-gray-400 uppercase font-bold mb-1 tracking-widest">Color</p>
                    <p className="font-bold text-gray-800">Classic</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button 
                    onClick={() => {
                      if (!isAuthenticated) {
                        navigate('/auth');
                      } else {
                        addItem(productDetail);
                        navigate('/cart');
                      }
                    }}
                    className="w-full"
                    size="lg"
                  >
                    Comprar ahora
                  </Button>
                  <Button 
                    onClick={() => addItem(productDetail)}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    Agregar al carrito
                  </Button>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-50 flex flex-col gap-4 text-xs text-center text-gray-400 font-medium">
                  <div className="flex items-center justify-center gap-2">
                    <RotateCcw size={14} /> <span><b>Devolución gratis</b> (30 días para arrepentirte)</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Award size={14} /> <span><b>Compra Protegida</b> por Reviste Pay</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <GallerySection title="También te podría gustar">
          {allProducts
            .filter(p => p.tag?.split(' | ')[0] === productDetail.tag?.split(' | ')[0] && p.id !== productDetail.id)
            .slice(0, 6)
            .map(p => (
            <div key={p.id} className="w-[160px] md:w-[240px] flex-shrink-0 snap-start">
              <ProductCard>
                <ProductCard.Image 
                  src={p.image} 
                  alt={p.name} 
                  id={p.id} 
                  name={p.name}
                  tag={p.tag}
                  onQuickAdd={() => addItem(p)}
                />
                <ProductCard.Info name={p.name} price={p.price} id={p.id} />
              </ProductCard>
            </div>
          ))}
        </GallerySection>

        {/* Sticky CTA Mobile (Extra layer above navigation) */}
        <div className="lg:hidden fixed bottom-[64px] left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 p-4 shadow-[0_-8px_30px_-10px_rgba(0,0,0,0.1)] z-40">
          <div className="flex items-center gap-4">
            <div className="flex-grow">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Precio</p>
              <p className="text-xl font-black text-brand-dark">${productDetail.price.toLocaleString()}</p>
            </div>
            <Button 
              variant="outline"
              size="icon"
              aria-label="Agregar al carrito"
              onClick={() => addItem(productDetail)}
              className="rounded-xl h-12 w-12"
            >
               <ShoppingBag size={20} />
            </Button>
            <Button 
              onClick={() => {
                if (!isAuthenticated) {
                  navigate('/auth');
                } else {
                  addItem(productDetail);
                  navigate('/cart');
                }
              }}
              className="flex-grow max-w-[150px] h-12 rounded-xl"
            >
              Comprar
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductDetailPage;
