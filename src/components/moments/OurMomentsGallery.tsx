import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WeddingConfig, CoupleMoment, defaultWeddingConfig } from '../../config/wedding';
import { ChevronLeft, ChevronRight, Pause, Play, Sparkles } from 'lucide-react';

interface OurMomentsGalleryProps {
  config: WeddingConfig;
}

export const OurMomentsGallery: React.FC<OurMomentsGalleryProps> = ({ config }) => {
  const moments: CoupleMoment[] = (config.moments && config.moments.length > 0)
    ? config.moments
    : defaultWeddingConfig.moments;
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Touch tracking for swipe gestures
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const totalMoments = moments.length;

  const handleNext = useCallback(() => {
    if (totalMoments === 0) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalMoments);
  }, [totalMoments]);

  const handlePrev = useCallback(() => {
    if (totalMoments === 0) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + totalMoments) % totalMoments);
  }, [totalMoments]);

  const handleSelect = (index: number) => {
    if (index === currentIndex || totalMoments === 0) return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Auto-revolve timer: advances every 4.8 seconds when not paused or hovered
  useEffect(() => {
    if (totalMoments <= 1 || isPaused || isHovered) return;

    const timer = setInterval(() => {
      handleNext();
    }, 4800);

    return () => clearInterval(timer);
  }, [totalMoments, isPaused, isHovered, handleNext]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    // Horizontal swipe threshold (ensure it wasn't a vertical scroll)
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  // Keyboard navigation when section is in view
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      handleNext();
    } else if (e.key === 'ArrowLeft') {
      handlePrev();
    } else if (e.key === ' ') {
      e.preventDefault();
      setIsPaused((p) => !p);
    }
  };

  const getMomentImg = (moment: CoupleMoment, idx: number) => {
    let src = moment && moment.imageSrc ? moment.imageSrc.trim() : '';
    if (!src || src.includes('.svg')) {
      return `/images/moments_${idx + 1}.jpg`;
    }
    if (src.startsWith('public/')) {
      return '/' + src;
    }
    if (!src.startsWith('/')) {
      return '/' + src;
    }
    return src;
  };

  const currentMoment = moments[currentIndex];
  const imgSrc = getMomentImg(currentMoment, currentIndex);
  const [loadedImageSrc, setLoadedImageSrc] = useState<string | null>(null);

  useEffect(() => {
    moments.forEach((moment, idx) => {
      const image = new window.Image();
      image.src = getMomentImg(moment, idx);
    });
  }, [moments]);

  useEffect(() => {
    setLoadedImageSrc(null);
  }, [imgSrc]);

  // Revolving door animation variants:
  // Rotates along the Y axis around the vertical hinge edge with 3D perspective
  const revolvingDoorVariants = {
    enter: (dir: number) => ({
      rotateY: dir > 0 ? 38 : -38,
      opacity: 0,
      scale: 0.97,
      x: dir > 0 ? 22 : -22,
      transformOrigin: 'center center',
      boxShadow: '0 10px 25px -5px rgba(67, 18, 31, 0.1)',
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
      x: 0,
      transformOrigin: 'center center',
      boxShadow: '0 28px 65px -12px rgba(67, 18, 31, 0.32), 0 12px 24px -8px rgba(196, 164, 106, 0.28)',
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
    exit: (dir: number) => ({
      rotateY: dir > 0 ? -38 : 38,
      opacity: 0,
      scale: 0.97,
      x: dir > 0 ? -22 : 22,
      transformOrigin: 'center center',
      boxShadow: '0 10px 25px -5px rgba(67, 18, 31, 0.1)',
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    }),
  };

  return (
    <section
      id="moments"
      className="section-stage section-stage--gallery relative min-h-[100svh] sm:min-h-screen flex flex-col items-center justify-center px-4 py-20 sm:py-28 z-10 select-none overflow-hidden"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="Our Moments photo gallery"
    >
      <div className="max-w-4xl w-full mx-auto flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="flex items-center justify-center gap-3 mb-2.5">
            <span className="text-[#C4A46A] text-sm">✦</span>
            <span className="h-[1px] w-12 bg-gradient-to-r from-transparent via-[#C4A46A] to-transparent" />
            <span className="font-cinzel text-xs tracking-[0.32em] text-[#7B263A] uppercase font-semibold">
              Captured Memories
            </span>
            <span className="h-[1px] w-12 bg-gradient-to-r from-transparent via-[#C4A46A] to-transparent" />
            <span className="text-[#C4A46A] text-sm">✦</span>
          </div>

          <h2 className="font-cinzel text-3xl sm:text-5xl font-semibold tracking-wider text-[#641C2C] mb-3">
            Our Moments
          </h2>

          <p className="font-cormorant italic text-base sm:text-xl text-[#39302E] max-w-lg mx-auto leading-relaxed">
            A glimpse into the quiet smiles, stolen glances, and sweet beginnings that led us to this beautiful day.
          </p>
        </div>

        {/* 3D Revolving Door Stage */}
        <div
          className="relative w-full max-w-[340px] sm:max-w-[400px] flex flex-col items-center"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{ perspective: '1400px' }}
        >
          {/* Subtle Ambient Glow Behind Card */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-80 bg-[#C4A46A]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Polaroid Frame Container with 3D Revolving Door Motion */}
          <div className="relative w-full min-h-[460px] sm:min-h-[510px] flex items-center justify-center">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={currentMoment.id}
                custom={direction}
                variants={revolvingDoorVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="gallery-polaroid w-full bg-[#FFFDF9] rounded-2xl border-2 border-[#C4A46A]/50 p-4 sm:p-5 relative backface-hidden cursor-grab active:cursor-grabbing transition-colors duration-300"
                style={{
                  transformStyle: 'preserve-3d',
                  willChange: 'transform, opacity',
                }}
              >
                {/* Antique Gold Washi Tape Accent at Top Edge */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-gradient-to-r from-[#DFB775]/90 via-[#FFE8A3] to-[#C4A46A]/90 rounded-sm shadow-xs border-t border-b border-[#ECC88B]/60 rotate-[-1deg] flex items-center justify-center pointer-events-none z-20">
                  <span className="text-[9px] font-cinzel tracking-[0.25em] text-[#641C2C] uppercase font-bold opacity-80">
                    Forever
                  </span>
                </div>

                {/* The Photograph Frame */}
                <div
                  className="gallery-photo-frame relative w-full aspect-[4/3.8] rounded-lg overflow-hidden bg-[#2D161C] border border-[#C4A46A]/40 shadow-inner group"
                >
                  <img
                    key={currentMoment.id + '-' + imgSrc}
                    src={imgSrc}
                    alt={currentMoment.alt}
                    className={`w-full h-full object-cover object-center transition-opacity duration-300 ease-out pointer-events-none ${
                      loadedImageSrc === imgSrc ? 'opacity-100' : 'opacity-0'
                    }`}
                    loading="eager"
                    referrerPolicy="no-referrer"
                    onLoad={() => setLoadedImageSrc(imgSrc)}
                    onError={(e) => {
                      const target = e.currentTarget;
                      const altSrc = `public/images/moments_${currentIndex + 1}.jpg`;
                      if (target.src !== window.location.origin + altSrc) {
                        target.src = altSrc;
                      }
                    }}
                  />
                  {/* Subtle photographic vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#43121F]/20 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* The Polaroid White Bottom Chin (with cute handwritten love note) */}
                <div className="pt-4 pb-3 px-2 flex flex-col items-center text-center">
                  {/* Tagline / Memory Tag */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#641C2C]/8 text-[#7B263A] mb-2 border border-[#C4A46A]/30">
                    <Sparkles className="w-2.5 h-2.5 text-[#C4A46A]" />
                    <span className="font-cinzel text-[10px] tracking-[0.2em] uppercase font-semibold">
                      {currentMoment.tagline}
                    </span>
                    <Sparkles className="w-2.5 h-2.5 text-[#C4A46A]" />
                  </div>

                  {/* Playful Handwritten Love Note Description */}
                  <p className="font-cormorant italic text-lg sm:text-xl text-[#39302E] leading-relaxed font-semibold max-w-[92%] mx-auto my-1 selection:bg-[#7B263A] selection:text-[#FFF8ED]">
                    “{currentMoment.caption}”
                  </p>

                  {/* Bottom Footer Details on the Polaroid Margin */}
                  <div className="w-full mt-3 pt-2.5 border-t border-[#C4A46A]/25 flex items-center justify-between text-xs">
                    <span className="font-cormorant italic text-xs text-[#7B263A] font-medium tracking-wide">
                      ✦ {currentMoment.dateOrMemory || 'Cherished Memory'}
                    </span>
                    <div className="flex items-center gap-1 text-[#C4A46A]">
                      <span className="font-cinzel text-[10px] tracking-widest uppercase font-semibold text-[#641C2C]">
                        {config.couple.monogram}
                      </span>
                      <span className="text-xs">❦</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Interactive Navigation Affordances */}
          <div className="gallery-controls w-full mt-6 flex items-center justify-between gap-4 px-2">
            {/* Prev Arrow Button */}
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full bg-[#FFFDF9]/90 border border-[#C4A46A]/60 text-[#641C2C] hover:bg-[#641C2C] hover:text-[#FFF8ED] hover:border-[#641C2C] transition-all duration-300 shadow-md flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#C4A46A] active:scale-95 group"
              aria-label="Previous photo in revolving door"
              title="Previous moment"
            >
              <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
            </button>

            {/* Segmented Indicator Dots & Play/Pause */}
            <div className="flex items-center gap-3">
              {moments.map((m, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={m.id}
                    onClick={() => handleSelect(idx)}
                    className="relative group p-1.5 focus:outline-none"
                    aria-label={`Go to photo ${idx + 1}`}
                    title={`Moment ${idx + 1}: ${m.tagline}`}
                  >
                    <div
                      className={`transition-all duration-300 rounded-full ${
                        isActive
                          ? 'w-7 h-2.5 bg-[#641C2C] border border-[#C4A46A] shadow-xs'
                          : 'w-2.5 h-2.5 bg-[#C4A46A]/45 hover:bg-[#7B263A]'
                      }`}
                    />
                  </button>
                );
              })}

              {/* Pause / Resume Auto-Revolve Button */}
              <button
                onClick={() => setIsPaused((p) => !p)}
                className="w-7 h-7 rounded-full bg-[#F3E7D4]/80 border border-[#C4A46A]/40 text-[#7B263A] hover:text-[#641C2C] hover:bg-[#FFF8ED] transition-all ml-1.5 flex items-center justify-center focus:outline-none"
                aria-label={isPaused ? 'Resume auto-revolving' : 'Pause auto-revolving'}
                title={isPaused ? 'Resume auto-revolve' : 'Pause auto-revolve'}
              >
                {isPaused ? <Play className="w-3 h-3 fill-current ml-0.5" /> : <Pause className="w-3 h-3 fill-current" />}
              </button>
            </div>

            {/* Next Arrow Button */}
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full bg-[#FFFDF9]/90 border border-[#C4A46A]/60 text-[#641C2C] hover:bg-[#641C2C] hover:text-[#FFF8ED] hover:border-[#641C2C] transition-all duration-300 shadow-md flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#C4A46A] active:scale-95 group"
              aria-label="Next photo in revolving door"
              title="Next moment"
            >
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Touch / Interaction hint */}
          <div className="mt-3.5 text-center">
            <span className="font-cormorant italic text-xs text-[#92967A]">
              {isHovered ? '✦ Paused on hover ✦' : 'Swipe or use arrows to revolve through memories'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
