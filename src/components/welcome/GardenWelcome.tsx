import React from 'react';
import { WeddingConfig } from '../../config/wedding';

interface GardenWelcomeProps {
  config: WeddingConfig;
  onExploreClick: () => void;
}

export const GardenWelcome: React.FC<GardenWelcomeProps> = ({ config, onExploreClick }) => {
  return (
    <section
      id="welcome"
      className="section-stage section-stage--welcome relative min-h-[100svh] sm:min-h-screen flex flex-col items-center justify-center px-4 py-16 sm:py-24 z-10"
    >
      <div className="max-w-2xl w-full mx-auto text-center">
        {/* Editorial Stationery Card with Royal Focus and Elevation */}
        <div className="premium-surface premium-surface--hero bg-[#FFFDF9]/95 backdrop-blur-md border-2 border-[#C4A46A]/55 rounded-3xl p-6 sm:p-12 shadow-[0_24px_65px_rgba(67,18,31,0.28)] relative overflow-hidden transition-all duration-700">
          {/* Subtle floral watermark / background aura */}
          <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-[#7B263A]/5 pointer-events-none blur-2xl" />
          <div className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full bg-[#C4A46A]/10 pointer-events-none blur-2xl" />

          {/* Top Traditional Motif */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-[#C4A46A] text-lg select-none">❦</span>
            <span className="h-[1px] w-12 bg-gradient-to-r from-transparent via-[#C4A46A] to-transparent" />
            <span className="font-cinzel text-xs tracking-[0.35em] text-[#7B263A] uppercase font-semibold">
              The Wedding Invitation
            </span>
            <span className="h-[1px] w-12 bg-gradient-to-r from-transparent via-[#C4A46A] to-transparent" />
            <span className="text-[#C4A46A] text-lg select-none">❦</span>
          </div>

          {/* Script Intro */}
          <div className="font-script text-3xl sm:text-4xl text-[#7B263A] mb-3">
            Together with our families
          </div>

          <h2 className="font-cormorant text-base sm:text-lg text-[#39302E] max-w-lg mx-auto font-normal leading-relaxed mb-8">
            {config.invitation.subHeadline}
          </h2>

          {/* Couple Display with Luxury Editorial Hierarchy */}
          <div className="premium-couple-plate my-8 py-6 border-y border-[#C4A46A]/30 relative">
            {/* Groom Block */}
            <div className="mb-6">
              <span className="inline-block px-3 py-0.5 rounded-full bg-[#641C2C]/10 text-[#641C2C] font-cinzel text-[11px] tracking-[0.25em] uppercase font-semibold mb-2">
                {config.couple.groomHonorific}
              </span>
              <h1 className="font-cinzel text-3xl sm:text-5xl font-semibold tracking-wider text-[#641C2C]">
                {config.couple.groomName}
              </h1>
              <p className="font-cormorant italic text-sm sm:text-base text-[#7B263A] mt-1">
                {config.couple.groomParents}
              </p>
            </div>

            {/* Connecting Ampersand / Motif */}
            <div className="my-3 flex items-center justify-center">
              <div className="premium-monogram w-10 h-10 rounded-full border border-[#C4A46A]/60 flex items-center justify-center bg-[#FFF8ED] text-[#C4A46A] font-cinzel-dec text-xl">
                &amp;
              </div>
            </div>

            {/* Bride Block */}
            <div className="mt-6">
              <span className="inline-block px-3 py-0.5 rounded-full bg-[#641C2C]/10 text-[#641C2C] font-cinzel text-[11px] tracking-[0.25em] uppercase font-semibold mb-2">
                {config.couple.brideHonorific}
              </span>
              <h1 className="font-cinzel text-3xl sm:text-5xl font-semibold tracking-wider text-[#641C2C]">
                {config.couple.brideName}
              </h1>
              <p className="font-cormorant italic text-sm sm:text-base text-[#7B263A] mt-1">
                {config.couple.brideParents}
              </p>
            </div>
          </div>

          {/* Heartfelt Message & Blessing */}
          <blockquote className="font-cormorant italic text-base sm:text-lg text-[#39302E] leading-relaxed max-w-md mx-auto my-6 px-4">
            {config.invitation.heartfeltMessage}
          </blockquote>

          <p className="font-cinzel text-[11px] tracking-[0.2em] text-[#92967A] uppercase mt-4">
            {config.invitation.familyBlessing}
          </p>

          {/* Gold ornamental bottom flourish */}
          <div className="mt-8 flex justify-center text-[#C4A46A]">
            <span className="tracking-[0.4em]">❖ ❖ ❖</span>
          </div>
        </div>

        {/* Scroll To Explore Cue */}
        <div className="premium-scroll-cue mt-10 flex flex-col items-center">
          <button
            onClick={onExploreClick}
            className="group flex flex-col items-center text-[#641C2C] hover:text-[#7B263A] transition-colors focus:outline-none"
            aria-label="Scroll to our moments"
          >
            <span className="font-cinzel text-xs tracking-[0.3em] uppercase mb-2 font-semibold">
              Scroll To Explore
            </span>
            <div className="w-6 h-10 rounded-full border-2 border-[#C4A46A] flex justify-center pt-2 p-1">
              <div className="w-1.5 h-2.5 bg-[#641C2C] rounded-full animate-bounce" />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};
