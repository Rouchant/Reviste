import React from 'react';
import { Instagram, Twitter, Facebook, ExternalLink } from 'lucide-react';


const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-dark text-white pt-16 pb-12 md:pb-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-pink/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 relative z-10">
          
          {/* Brand Info */}
          <div className="space-y-6">
            <img src="/Reviste/assets/images/ui/logo.png" alt="REVISTE" className="h-10" />
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs italic">
              "El futuro de la moda es circular. Dale una segunda vida a tu ropa y sé parte del cambio."
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<Instagram size={20} />} />
              <SocialIcon icon={<Twitter size={20} />} />
              <SocialIcon icon={<Facebook size={20} />} />
            </div>
          </div>

          {/* Site Map */}
          <div>
            <h4 className="font-brand text-lg font-bold mb-6">Comprar</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><FooterLink label="Novedades" /></li>
              <li><FooterLink label="Vintage 90s" /></li>
              <li><FooterLink label="Estilo Y2K" /></li>
              <li><FooterLink label="Streetwear" /></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-brand text-lg font-bold mb-6">Ayuda</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><FooterLink label="Cómo comprar" icon /></li>
              <li><FooterLink label="Guía de tallas" icon /></li>
              <li><FooterLink label="Envíos y devoluciones" /></li>
              <li><FooterLink label="Términos y condiciones" /></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-brand text-lg font-bold mb-6">Contacto</h4>
            <p className="text-gray-400 text-sm mb-4">
              ¿Tienes dudas? Escríbenos a hola@reviste.cl
            </p>
            <button className="bg-white/10 hover:bg-white/20 transition-all border border-white/20 px-6 py-3 rounded-2xl text-sm font-bold w-full md:w-auto">
              Soporte Reviste
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
          <p>© 2026 REVISTE SpA. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon }: { icon: React.ReactNode }) => (
  <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-brand-pink transition-all border border-white/10">
    {icon}
  </a>
);

const FooterLink = ({ label, icon = false }: { label: string, icon?: boolean }) => (
  <a href="#" className="hover:text-white transition-colors flex items-center gap-2 group">
    {label} {icon && <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
  </a>
);

export default Footer;
