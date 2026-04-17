import React from 'react';
import MainLayout from '../../../layouts/MainLayout';
import { Trash2, ShoppingBag, Truck, MapPin } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';

const CartPage: React.FC = () => {
  const { items, removeItem, updateQuantity, getItemCount, getTotalPrice } = useCartStore();
  const cartCount = getItemCount();
  const totalPrice = getTotalPrice();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-6 gap-2">
          <h1 className="text-2xl md:text-3xl font-bold font-brand text-brand-dark">Tu Carrito</h1>
          <span className="text-gray-500 font-medium font-brand">({cartCount} productos)</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-4">
            {items.length === 0 ? (
              <Card className="p-12 text-center flex flex-col items-center border-transparent shadow-xl shadow-brand-pink/5">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6 shadow-sm">
                   <ShoppingBag size={40} />
                </div>
                <p className="text-lg text-gray-500 font-medium mb-8">Tu carrito está vacío</p>
                <Link to="/">
                  <Button variant="primary">Explorar productos</Button>
                </Link>
              </Card>
            ) : (
              <>
                <Card className="divide-y divide-gray-50 overflow-hidden border-transparent shadow-xl shadow-brand-pink/5">
                  {items.map((item) => (
                    <div key={item.id} className="p-6 flex gap-4 md:gap-6 items-start hover:bg-gray-50/50 transition-colors">
                      <div className="w-24 md:w-32 aspect-square rounded-2xl overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100 shadow-sm">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      
                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-start gap-4 mb-1">
                          <Link to={`/product/${item.id}`}>
                            <h2 className="text-sm md:text-lg font-bold text-gray-900 line-clamp-2 leading-tight hover:text-brand-pink transition-colors">
                              {item.name}
                            </h2>
                          </Link>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                        
                        <p className="text-xs text-gray-400 mb-4 font-medium uppercase tracking-wider">
                          Talla: M | Vendedor: @RetroShop
                        </p>
                        
                        <div className="flex justify-between items-end">
                          <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1 border border-gray-100 shadow-sm">
                            <button 
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-8 h-8 flex items-center justify-center font-bold text-gray-500 hover:text-gray-900 transition-colors"
                            >-</button>
                            <span className="w-8 text-center font-bold text-gray-800">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-8 h-8 flex items-center justify-center font-bold text-gray-500 hover:text-gray-900 transition-colors"
                            >+</button>
                          </div>
                          <span className="text-xl font-extrabold text-brand-pink">
                            ${(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </Card>

                {/* Shipping Placeholder */}
                <Card className="p-6 border-transparent shadow-xl shadow-brand-pink/5">
                  <div className="flex items-center gap-2 mb-4">
                    <Truck size={20} className="text-brand-pink" />
                    <h3 className="font-bold text-gray-800">Opciones de envío</h3>
                  </div>
                  <div className="p-4 bg-gray-50/50 rounded-2xl flex justify-between items-center border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-pink shadow-sm">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-gray-800">Enviar a: Mi Casa (Santiago)</p>
                        <p className="text-xs text-gray-400">Llegada estimada: 12-14 de Abril</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-brand-pink font-bold uppercase tracking-widest px-0 hover:bg-transparent hover:underline">
                      Cambiar
                    </Button>
                  </div>
                </Card>
              </>
            )}
          </div>

          {/* Summary Box */}
          <div className="lg:col-span-4">
            <Card className="sticky top-24 p-6 md:p-8 border-transparent shadow-2xl shadow-brand-pink/10">
              <h3 className="text-lg font-bold font-brand mb-6 text-gray-900 leading-tight">Resumen de compra</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-medium">Subtotal ({cartCount} productos)</span>
                  <span className="font-bold text-gray-800">${totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-medium">Envío</span>
                  <span className="text-brand-green font-bold">Gratis</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-medium">Descuento</span>
                  <span className="text-red-500 font-bold">-$0</span>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-50 mb-8">
                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-black text-brand-pink">${totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <Button 
                variant="primary"
                className="w-full h-14"
                disabled={items.length === 0}
              >
                Continuar compra
              </Button>
              <p className="text-center text-[10px] text-gray-400 mt-4 uppercase font-bold tracking-widest">
                Paga seguro con <span className="text-gray-600">Reviste Pay</span>
              </p>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CartPage;
