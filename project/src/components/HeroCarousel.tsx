import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface CarouselImage {
  url: string;
  alt: string;
}

interface HeroCarouselProps {
  images: CarouselImage[];
  interval?: number;
}

export default function HeroCarousel({ images, interval = 6000 }: HeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  const next = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length]);
  const goTo = useCallback((i: number) => setIndex(i), []);

  useEffect(() => {
    if (paused || reduceMotion || images.length <= 1) return;
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [paused, reduceMotion, interval, next, images.length]);

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-label="Hero image carousel"
    >
      <AnimatePresence mode="sync">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <img
            src={images[index].url}
            alt={images[index].alt}
            className={`absolute inset-0 w-full h-full object-cover ${
              reduceMotion ? '' : 'animate-ken-burns'
            }`}
            loading="eager"
            fetchPriority="high"
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-charcoal/20 to-charcoal/30" />

      {/* Carousel indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-10">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === index
                ? 'w-8 bg-ivory'
                : 'w-1.5 bg-ivory/50 hover:bg-ivory/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
