import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Truck, ShieldCheck, RotateCcw, Award, ShoppingBag } from 'lucide-react';
import MainLayout from '../../../layouts/MainLayout';
import mockData from '../../../data/mockData.json';
import ProductCard from '../components/ProductCard';
import GallerySection from '../../../components/GallerySection';
import { useCartStore } from '../../cart/store/useCartStore';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const addItem = useCartStore((state) => state.addItem);
  
  // For now, let's just use the first product from any list or a mock one if ID doesn't match
  const product = mockData.featuredOffers.find(p => p.id === Number(id)) || mockData.featuredOffers[0];
  
  const [selectedImage, setSelectedImage] = useState(product.image);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-4">
        {/* Breadcrumbs */}
        <nav className="mb-4 md:mb-8 text-sm">
          <ol className="flex items-center gap-2 text-gray-500">
            <li><Link to="/" className="hover:text-brand-pink transition-colors">Inicio</Link></li>
            <li className="before:content-['/'] before:mr-2 text-gray-400">Catálogo</li>
            <li className="before:content-['/'] before:mr-2 font-bold text-brand-dark tracking-tight truncate">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* Left: Gallery */}
          <div className="lg:col-span-7">
            <div className="space-y-4">
              <Card className="aspect-[4/5] md:aspect-square overflow-hidden border-transparent">
                <img 
                  src={selectedImage} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-all duration-700"
                />
              </Card>
              
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {[product.image, "/assets/images/products/item4.png", "/assets/images/products/item5.png", "/assets/images/products/item6.png"].map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                      selectedImage === img ? "border-brand-pink" : "border-transparent hover:border-gray-200"
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              <Card className="mt-8 p-6 md:p-8 border-transparent bg-white shadow-sm">
                <h4 className="text-xl font-bold font-brand mb-4">Descripción</h4>
                <p className="text-gray-600 leading-relaxed">
                  Esta icónica pieza vintage es una joya única para tu armario. 
                  Captura la esencia del estilo que buscas con una calidad excepcional. 
                  Está en excelentes condiciones, seleccionada cuidadosamente para nuestro mercado de moda circular.
                  Ideal para combinar con tus prendas favoritas.
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
                  {product.name}
                </h1>

                <div className="flex items-center gap-2 mb-6">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        fill={i < 4 ? "#FFD700" : "none"} 
                        className={i < 4 ? "text-[#FFD700]" : "text-gray-300"} 
                      />
                    ))}
                  </div>
                  <span className="text-gray-400 text-sm">(24 valoraciones)</span>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="text-3xl md:text-4xl font-black text-brand-dark">
                      ${product.price.toLocaleString()}
                    </span>
                    {product.oldPrice && (
                      <span className="text-lg text-gray-400 line-through">
                        ${product.oldPrice.toLocaleString()}
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
                    <p className="font-bold text-gray-800">Vendido por @RetroShop</p>
                    <p className="text-gray-500 text-xs">MercadoLíder Platinum</p>
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
                    onClick={() => addItem(product)}
                    className="w-full"
                    size="lg"
                  >
                    Comprar ahora
                  </Button>
                  <Button 
                    onClick={() => addItem(product)}
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
          {mockData.featuredOffers.map(p => (
            <div key={p.id} className="w-[160px] md:w-[240px] flex-shrink-0 snap-start">
              <ProductCard>
                <ProductCard.Image 
                  src={p.image} 
                  alt={p.name} 
                  id={p.id} 
                  tag={p.tag}
                  onQuickAdd={() => addItem(p)}
                />
                <ProductCard.Info name={p.name} price={p.price} oldPrice={p.oldPrice} id={p.id} />
              </ProductCard>
            </div>
          ))}
        </GallerySection>

        {/* Sticky CTA Mobile (Extra layer above navigation) */}
        <div className="lg:hidden fixed bottom-[72px] left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 p-4 shadow-[0_-5px_20px_-10px_rgba(0,0,0,0.1)] z-40">
          <div className="flex items-center gap-4">
            <div className="flex-grow">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Precio</p>
              <p className="text-xl font-black text-brand-dark">${product.price.toLocaleString()}</p>
            </div>
            <Button 
              variant="outline"
              size="icon"
              aria-label="Agregar al carrito"
              onClick={() => addItem(product)}
              className="rounded-xl h-12 w-12"
            >
               <ShoppingBag size={20} />
            </Button>
            <Button 
              onClick={() => addItem(product)}
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
