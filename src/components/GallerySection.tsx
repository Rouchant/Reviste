import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GallerySectionProps {
  title: string;
  linkText?: string;
  linkHref?: string;
  children: React.ReactNode;
}

const GallerySection: React.FC<GallerySectionProps> = ({ title, linkText, linkHref, children }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeft(scrollLeft > 10);
      setShowRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [children]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="mb-8 md:mb-12">
      <div className="flex justify-between items-end mb-6 px-1">
        <h2 className="text-2xl md:text-3xl font-black font-brand text-brand-dark tracking-tight">{title}</h2>
        {linkText && (
          <a href={linkHref || "#"} className="text-xs font-bold text-brand-pink hover:underline uppercase tracking-widest">
            {linkText}
          </a>
        )}
      </div>

      <div className={`group/gallery relative scroll-container-mask ${showLeft ? 'mask-left' : ''} ${showRight ? 'mask-right' : ''}`}>
        {showLeft && (
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 bg-white shadow-lg rounded-full p-2 opacity-0 group-hover/gallery:opacity-100 transition-opacity hidden md:block border border-gray-100"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        <div 
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-1 pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {children}
        </div>

        {showRight && (
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 bg-white shadow-lg rounded-full p-2 opacity-0 group-hover/gallery:opacity-100 transition-opacity hidden md:block border border-gray-100"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </section>
  );
};

export default GallerySection;
