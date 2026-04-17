import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  buttonText: string;
  image: string;
}

interface HeroCarouselProps {
  slides: Slide[];
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ slides }) => {
  const [current, setCurrent] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isAutoScrolling = useRef(false);

  // Sync dots with scroll position
  const handleScroll = () => {
    if (isAutoScrolling.current) return;
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const newIndex = Math.round(scrollLeft / clientWidth);
      if (newIndex !== current) {
        setCurrent(newIndex);
      }
    }
  };

  const scrollToSlide = (index: number) => {
    if (scrollRef.current) {
      isAutoScrolling.current = true;
      const { clientWidth } = scrollRef.current;
      scrollRef.current.scrollTo({
        left: index * clientWidth,
        behavior: 'smooth',
      });
      setCurrent(index);
      
      // Reset auto-scrolling flag after transition
      setTimeout(() => {
        isAutoScrolling.current = false;
      }, 700);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const next = (current + 1) % slides.length;
      scrollToSlide(next);
    }, 5000);
    return () => clearInterval(timer);
  }, [current, slides.length]);

  const nextSlide = () => scrollToSlide((current + 1) % slides.length);
  const prevSlide = () => scrollToSlide((current - 1 + slides.length) % slides.length);

  return (
    <section className="relative h-[320px] md:h-[480px] rounded-[32px] mb-10 group shadow-lg overflow-hidden">
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {slides.map((slide) => (
          <div 
            key={slide.id} 
            className="w-full h-full flex-shrink-0 relative flex items-center px-8 md:px-20 text-white snap-center"
          >
            {/* Background Image with Gradient Overlay */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] hover:scale-105"
              style={{ 
                backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 60%), url(${slide.image})` 
              }}
            />
            
            <div className="relative z-10 max-w-2xl animate-fade-in">
              <h1 className="text-3xl md:text-6xl font-black font-brand mb-4 leading-[1.1]">
                {slide.title}
              </h1>
              <p className="text-base md:text-xl opacity-90 mb-8 font-medium max-w-lg leading-relaxed">
                {slide.subtitle}
              </p>
              <button className="btn-primary !px-8 !py-4 text-sm md:text-base">
                {slide.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <button 
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 z-30"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 z-30"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollToSlide(idx)}
            className={`transition-all duration-300 rounded-full ${
              current === idx ? "w-8 h-2.5 bg-white" : "w-2.5 h-2.5 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
