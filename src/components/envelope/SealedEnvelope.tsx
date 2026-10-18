import React, { useState, useEffect, useRef } from 'react';
import { WeddingConfig } from '../../config/wedding';
import { Sparkles } from 'lucide-react';
import { GoldenDateScratch } from './GoldenDateScratch';

interface SealedEnvelopeProps {
  config: WeddingConfig;
  isOpen: boolean;
  onOpen: () => void;
  onStartOpening?: () => void;
}

type CinematicStage =
  | 'sealed'        // 100% closed pearl white envelope with visible gold folding seams
  | 'seal-burst'    // Radiant gold fracture shockwave, seal breaks in light
  | 'unfolding-4'   // Slow-motion 3.6s physical 3D unfolding of all 4 flaps
  | 'card-revealed' // Flaps dissolve, pristine royal wedding card shines in center
  | 'scratch-gate'  // Gold scratch veil locks the invitation until the date is revealed
  | 'transitioning';// Card floats and dissolves smoothly into the enchanted garden

interface GoldParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
}

type ButterflyVariant = 'amber' | 'coral' | 'teal' | 'violet' | 'sapphire' | 'lime' | 'scarlet';

interface ButterflyWingPairProps {
  variant: ButterflyVariant;
  side: 'left' | 'right';
}

const ButterflyWingPair: React.FC<ButterflyWingPairProps> = ({ variant, side }) => (
  <g
    className={`envelope-butterfly-wing-art envelope-butterfly-wing-art--${side}`}
    filter="url(#butterflyWingTexture)"
  >
    <path
      d="M 48 41 C 40 32 40 19 32 9 C 25 1 14 3 9 10 C 2 20 8 33 19 41 C 29 48 39 47 48 44 Z"
      fill={`url(#butterfly-${variant}-wing-gradient)`}
      stroke="var(--butterfly-edge)"
      strokeWidth="1.35"
      strokeLinejoin="round"
    />
    <path
      d="M 48 43 C 40 43 33 46 30 52 C 27 54 27 58 29 60 C 26 64 30 69 34 69 C 37 75 44 75 47 69 C 49 62 49 52 49 46 Z"
      fill={`url(#butterfly-${variant}-wing-gradient)`}
      stroke="var(--butterfly-edge)"
      strokeWidth="1.25"
      strokeLinejoin="round"
    />
    <path
      d="M 46 41 C 36 32 25 20 10 10 M 45 42 C 34 35 24 28 6 19 M 44 43 C 34 40 22 38 9 30 M 43 44 C 34 46 26 43 16 38 M 47 45 C 39 49 34 56 29 62 M 48 46 C 43 54 42 63 40 72"
      fill="none"
      stroke="var(--butterfly-vein)"
      strokeWidth="1"
      strokeLinecap="round"
      opacity="0.94"
    />
    <ellipse
      cx="17"
      cy="16"
      rx="4.2"
      ry="5.1"
      fill={`url(#butterfly-${variant}-eyespot)`}
      stroke="var(--butterfly-edge)"
      strokeWidth="0.85"
    />
    <circle cx="17" cy="16" r="1.25" fill="var(--butterfly-edge)" opacity="0.88" />
    <circle cx="35" cy="61" r="2.6" fill="var(--butterfly-eyespot)" stroke="var(--butterfly-edge)" strokeWidth="0.7" />
    <circle cx="35" cy="61" r="1" fill="var(--butterfly-edge)" />
    <circle cx="40" cy="66" r="1.5" fill="var(--butterfly-eyespot)" stroke="var(--butterfly-edge)" strokeWidth="0.5" />
    <path
      d="M 7 23 C 9 34 18 42 29 45 M 27 7 C 36 15 40 25 44 34 M 31 50 C 29 55 30 61 34 66"
      fill="none"
      stroke="rgba(255,255,255,0.82)"
      strokeWidth="1"
      strokeLinecap="round"
    />
    <circle cx="8" cy="17" r="0.9" fill="#fff7df" />
    <circle cx="10" cy="28" r="0.8" fill="#fff7df" />
    <circle cx="13" cy="36" r="0.8" fill="#fff7df" />
    <circle cx="30" cy="70" r="0.8" fill="#fff7df" />
    <circle cx="37" cy="72" r="0.8" fill="#fff7df" />
  </g>
);

const EnvelopeButterflyArt: React.FC<{ variant: ButterflyVariant }> = ({ variant }) => (
  <svg className="envelope-butterfly-art" viewBox="0 0 96 84" aria-hidden="true">
    <defs>
      <linearGradient id={`butterfly-${variant}-wing-gradient`} x1="8%" y1="4%" x2="91%" y2="96%">
        <stop offset="0%" stopColor="var(--butterfly-highlight)" />
        <stop offset="34%" stopColor="var(--butterfly-light)" />
        <stop offset="72%" stopColor="var(--butterfly-mid)" />
        <stop offset="100%" stopColor="var(--butterfly-deep)" />
      </linearGradient>
      <radialGradient id={`butterfly-${variant}-eyespot`} cx="34%" cy="28%" r="78%">
        <stop offset="0%" stopColor="#fffef1" />
        <stop offset="48%" stopColor="var(--butterfly-highlight)" />
        <stop offset="100%" stopColor="var(--butterfly-deep)" />
      </radialGradient>
      <linearGradient id={`butterfly-${variant}-body`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="var(--butterfly-body-deep)" />
        <stop offset="32%" stopColor="var(--butterfly-body-highlight)" />
        <stop offset="55%" stopColor="var(--butterfly-body-mid)" />
        <stop offset="100%" stopColor="var(--butterfly-body-deep)" />
      </linearGradient>
    </defs>

    <ButterflyWingPair variant={variant} side="left" />
    <g transform="translate(96 0) scale(-1 1)">
      <ButterflyWingPair variant={variant} side="right" />
    </g>

    <path
      d="M 46.3 34 C 44.7 43 45.2 56 46.2 68 C 46.6 73 50.6 74 51.5 69 C 54 57 52.8 43 51.2 34 Z"
      fill={`url(#butterfly-${variant}-body)`}
      stroke="var(--butterfly-body-deep)"
      strokeWidth="0.75"
    />
    <path
      d="M 46.2 46 C 48 47.2 50.3 47.2 52 46 M 46 53 C 48 54.3 50.7 54.2 52.2 53 M 46.2 60 C 48 61.1 50.5 61.2 51.8 60"
      fill="none"
      stroke="var(--butterfly-body-highlight)"
      strokeWidth="0.85"
      strokeLinecap="round"
      opacity="0.92"
    />
    <path d="M 46.5 39 C 47.4 38.1 50.8 38.1 51.4 39" fill="none" stroke="#fff9e5" strokeWidth="0.85" strokeLinecap="round" opacity="0.86" />
    <circle cx="48.8" cy="32.6" r="2.5" fill="var(--butterfly-body-mid)" stroke="var(--butterfly-body-deep)" strokeWidth="0.8" />
    <circle cx="48.1" cy="31.8" r="0.72" fill="#fff8df" />
    <path
      d="M 47.8 31 C 43 25 42.3 21 39 18 M 49.6 31 C 54.5 25 55 21 58.5 18"
      fill="none"
      stroke="var(--butterfly-body-deep)"
      strokeWidth="0.95"
      strokeLinecap="round"
    />
    <circle cx="39" cy="18" r="0.9" fill="var(--butterfly-body-highlight)" />
    <circle cx="58.5" cy="18" r="0.9" fill="var(--butterfly-body-highlight)" />
  </svg>
);

export const SealedEnvelope: React.FC<SealedEnvelopeProps> = ({
  config,
  isOpen,
  onOpen,
  onStartOpening,
}) => {
  const [stage, setStage] = useState<CinematicStage>('sealed');
  const [burstParticles, setBurstParticles] = useState<GoldParticle[]>([]);
  const openingStartedRef = useRef(false);

  // Cinematic shockwave of radiant golden stardust and embers
  const triggerGrandShockwave = () => {
    const list: GoldParticle[] = [];
    const palette = ['#FFE89E', '#ECC88B', '#FFF3D6', '#D4AF37', '#FFFBF2', '#C4A46A'];
    for (let i = 0; i < 84; i++) {
      const angle = (i / 84) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const dist = 60 + Math.random() * 180;
      list.push({
        id: i,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        size: 3.5 + Math.random() * 7,
        color: palette[i % palette.length],
        delay: Math.random() * 0.18,
        duration: 1.35 + Math.random() * 0.8,
      });
    }
    setBurstParticles(list);
  };

  const handleBreakSeal = () => {
    if (stage !== 'sealed' || openingStartedRef.current) return;
    openingStartedRef.current = true;

    // Start background music immediately via user click gesture
    onStartOpening?.();

    // Stage 1: Golden fracture shockwave & seal release (0ms)
    setStage('seal-burst');
    triggerGrandShockwave();

    // Stage 2: Slow-motion 3.6s physical 3D unfolding of all 4 flaps (starts at 750ms)
    setTimeout(() => {
      setStage('unfolding-4');
    }, 750);

    // Stage 3: Flaps dissolve and the royal invitation card emerges to full center focus (at 3800ms)
    setTimeout(() => {
      setStage('card-revealed');
    }, 3800);
  };

  const handleEnterGarden = () => {
    if (stage !== 'scratch-gate') return;
    setStage('transitioning');

    // Smooth cinematic dissolve into the living maroon-leaf garden
    setTimeout(() => {
      onOpen();
    }, 1000);
  };

  // Give the revealed card a moment of focus before presenting the date gate.
  useEffect(() => {
    if (stage === 'card-revealed') {
      const timer = setTimeout(() => setStage('scratch-gate'), 1600);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  // Clean unmount once user has entered the celebration
  if (isOpen) {
    return null;
  }

  const isFlapsUnfolded = stage === 'unfolding-4' || stage === 'card-revealed' || stage === 'scratch-gate' || stage === 'transitioning';
  const isCardVisible = stage === 'unfolding-4' || stage === 'card-revealed' || stage === 'scratch-gate' || stage === 'transitioning';

  return (
    <section
      id="envelope-section"
      className={`fixed inset-0 z-50 isolate flex items-center justify-center overflow-x-hidden overflow-y-auto p-4 sm:p-6 transition-all duration-1000 envelope-cinematic-surface ${
        stage === 'transitioning'
          ? 'opacity-0 scale-105 pointer-events-none'
          : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'radial-gradient(ellipse at 50% 35%, #FFFFFF 0%, #FAF6EE 50%, #ECE2D2 100%)',
      }}
    >
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <div className="envelope-light-sweep absolute inset-y-[-20%] left-[-28%] w-[34%]" />
        <div className="envelope-vignette absolute inset-0" />
      </div>

      {/* Royal Palace corner filigree watermarks */}
      <div className="absolute top-6 left-6 text-[#C4A46A] opacity-40 select-none text-2xl font-serif">❧</div>
      <div className="absolute top-6 right-6 text-[#C4A46A] opacity-40 select-none text-2xl font-serif">☙</div>
      <div className="absolute bottom-6 left-6 text-[#C4A46A] opacity-40 select-none text-2xl font-serif">❦</div>
      <div className="absolute bottom-6 right-6 text-[#C4A46A] opacity-40 select-none text-2xl font-serif">❦</div>

      {/* Subtle fine paper texture */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#C4A46A_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative z-10 my-auto flex w-full max-w-lg flex-col items-center justify-center py-4">

        {/* Header Introduction (Gentle fade out when seal breaks) */}
        <div
          className={`text-center mb-6 sm:mb-8 transition-all duration-700 ease-out ${
            stage !== 'sealed' ? 'opacity-0 -translate-y-6 pointer-events-none' : 'opacity-100 translate-y-0'
          }`}
        >
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <span className="text-[#C4A46A] text-xs">✦</span>
            <span className="font-cormorant italic text-lg sm:text-xl text-[#7B263A] tracking-wider font-medium">
              {config.invitation.storyPreamble}
            </span>
            <span className="text-[#C4A46A] text-xs">✦</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <span className="h-[1px] w-12 bg-gradient-to-r from-transparent via-[#C4A46A] to-transparent" />
            <h1 className="font-cinzel text-xl sm:text-2xl font-semibold tracking-[0.22em] text-[#641C2C] uppercase">
              {config.couple.groomName.split(' ')[0]} &amp; {config.couple.brideName.split(' ')[0]}
            </h1>
            <span className="h-[1px] w-12 bg-gradient-to-r from-transparent via-[#C4A46A] to-transparent" />
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3D LUXURY PEARL WHITE ENVELOPE RIG                       */}
        {/* ======================================================== */}
        <div className={`relative w-full max-w-[400px] select-none perspective-container sm:max-w-[460px] envelope-rig ${
          stage === 'seal-burst'
            ? 'envelope-rig--shock'
            : isFlapsUnfolded
              ? 'envelope-rig--opening'
              : ''
        }`}>

          <div
            className={`pointer-events-none absolute inset-0 z-[45] envelope-butterflies ${
              stage === 'sealed' ? 'envelope-butterflies--active' : 'envelope-butterflies--leaving'
            }`}
            aria-hidden="true"
          >
            <span className="envelope-butterfly envelope-butterfly--amber">
              <EnvelopeButterflyArt variant="amber" />
            </span>
            <span className="envelope-butterfly envelope-butterfly--coral">
              <EnvelopeButterflyArt variant="coral" />
            </span>
            <span className="envelope-butterfly envelope-butterfly--teal">
              <EnvelopeButterflyArt variant="teal" />
            </span>
            <span className="envelope-butterfly envelope-butterfly--violet">
              <EnvelopeButterflyArt variant="violet" />
            </span>
            <span className="envelope-butterfly envelope-butterfly--sapphire">
              <EnvelopeButterflyArt variant="sapphire" />
            </span>
            <span className="envelope-butterfly envelope-butterfly--lime">
              <EnvelopeButterflyArt variant="lime" />
            </span>
            <span className="envelope-butterfly envelope-butterfly--scarlet">
              <EnvelopeButterflyArt variant="scarlet" />
            </span>
          </div>

          {/* ======================================================= */}
          {/* THE WEDDING CARD (100% CONCEALED INSIDE INITIALLY)      */}
          {/* ======================================================= */}
          <div
            className={`absolute inset-0 overflow-hidden rounded-2xl border-2 border-[#C4A46A] bg-gradient-to-b from-[#FFFFFF] via-[#FCF9F3] to-[#F7EFE2] p-4 sm:p-6 flex flex-col justify-between transition-all duration-[3000ms] ease-[cubic-bezier(0.22,1.0,0.36,1.0)] envelope-invitation-card ${
              isCardVisible
                ? 'z-40 opacity-100 scale-100 card-majestic-elevation'
                : 'z-0 opacity-0 scale-90 pointer-events-none'
            }`}
          >
            {/* Ornate Gold Filigree Inner Borders */}
            <div className="absolute inset-2 rounded-xl border border-[#C4A46A]/50 pointer-events-none" />
            <div className="absolute inset-3 rounded-lg border border-[#C4A46A]/25 pointer-events-none" />
            <div className="envelope-card-sheen pointer-events-none absolute inset-[-35%]" />

            {/* Corner Decorative Medallions */}
            <div className="absolute top-2.5 left-2.5 text-[#C4A46A] text-xs pointer-events-none">❖</div>
            <div className="absolute top-2.5 right-2.5 text-[#C4A46A] text-xs pointer-events-none">❖</div>
            <div className="absolute bottom-2.5 left-2.5 text-[#C4A46A] text-xs pointer-events-none">❖</div>
            <div className="absolute bottom-2.5 right-2.5 text-[#C4A46A] text-xs pointer-events-none">❖</div>

            {/* Card Content - Regal, Crisp, Perfectly Centered */}
            <div className="flex flex-col h-full min-h-0 relative z-10 py-1">
              {/* Top Auspicious Invocations */}
              <div className="text-center shrink-0">
                <img
                  src="/images/Ganapathi.png"
                  alt="Ganesha"
                  className="mx-auto mb-1 h-8 w-8 object-contain drop-shadow-[0_1px_2px_rgba(155,104,39,0.35)] sm:h-9 sm:w-9"
                />

                <div className="font-script text-3xl sm:text-4xl text-[#7B263A] leading-tight mb-0.5">
                  Save the Date
                </div>

                <div className="font-cormorant text-base sm:text-lg italic leading-tight text-[#C4A46A] mb-0.5">
                  For
                </div>

                <div className="w-16 h-[1.5px] bg-gradient-to-r from-transparent via-[#C4A46A] to-transparent mx-auto my-1 sm:my-2" />
              </div>

              {/* Couple Names - Centered in Card */}
              <div className="text-center flex-1 min-h-0 flex flex-col justify-center py-1 sm:py-2">
                <h2 className="font-script text-2xl sm:text-4xl font-normal text-[#641C2C] leading-[1.08] tracking-normal break-words px-1 drop-shadow-[0_1px_1px_rgba(0,0,0,0.06)]">
                  {config.couple.groomName}
                </h2>
                <div className="flex items-center justify-center gap-2.5 my-1 sm:my-1.5 shrink-0">
                  <span className="h-[1px] w-8 bg-[#C4A46A]/50" />
                  <span className="font-script text-2xl sm:text-3xl text-[#C4A46A] italic leading-none">&amp;</span>
                  <span className="h-[1px] w-8 bg-[#C4A46A]/50" />
                </div>
                <h2 className="font-script text-2xl sm:text-4xl font-normal text-[#641C2C] leading-[1.08] tracking-normal break-words px-1 drop-shadow-[0_1px_1px_rgba(0,0,0,0.06)]">
                  {config.couple.brideName}
                </h2>
              </div>

              {/* Card Footer Invocation */}
              <div className="shrink-0 text-center text-[10px] sm:text-xs leading-snug font-cormorant italic text-[#7B263A] border-t border-[#C4A46A]/30 pt-2 px-2">
                Together with our families, we request your presence and prayers
              </div>
            </div>
          </div>

          {/* ======================================================= */}
          {/* REAL PEARL WHITE 4-FLAP ENVELOPE WITH GOLD FOIL SEAMS   */}
          {/* ======================================================= */}
          <div
            className={`absolute inset-0 transition-opacity duration-[2000ms] ease-out ${
              stage === 'card-revealed' || stage === 'transitioning'
                ? 'opacity-0 pointer-events-none'
                : 'opacity-100 z-20'
            }`}
          >
            {/* Envelope Base Shell with Cotton Texture & Double Gold Borders */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl border-2 border-[#C4A46A]/80 bg-[#FFFFFF] envelope-deep-shadow paper-grain paper-bevel envelope-shell">
              <div className="absolute inset-1.5 rounded-xl border border-dashed border-[#ECC88B]/60 pointer-events-none" />
              <div className="envelope-shell-highlight pointer-events-none absolute inset-0" />
              {/* Corner rosettes */}
              <span className="absolute top-2 left-2 text-[#C4A46A] text-xs select-none">❖</span>
              <span className="absolute top-2 right-2 text-[#C4A46A] text-xs select-none">❖</span>
              <span className="absolute bottom-2 left-2 text-[#C4A46A] text-xs select-none">❖</span>
              <span className="absolute bottom-2 right-2 text-[#C4A46A] text-xs select-none">❖</span>
            </div>

            {/* SHARED SVG GRADIENT & FILTER DEFINITIONS */}
            <svg className="absolute w-0 h-0" aria-hidden="true">
              <defs>
                <linearGradient id="goldSeamGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ECC88B" />
                  <stop offset="45%" stopColor="#C4A46A" />
                  <stop offset="75%" stopColor="#E5C15E" />
                  <stop offset="100%" stopColor="#9B6827" />
                </linearGradient>
                <linearGradient id="pearlTop" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="65%" stopColor="#FAF7F2" />
                  <stop offset="100%" stopColor="#EFE5D6" />
                </linearGradient>
                <linearGradient id="pearlBottom" x1="50%" y1="100%" x2="50%" y2="0%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="65%" stopColor="#F8F5EF" />
                  <stop offset="100%" stopColor="#EBE1D0" />
                </linearGradient>
                <linearGradient id="pearlLeft" x1="0%" y1="50%" x2="100%" y2="50%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="65%" stopColor="#FAF7F1" />
                  <stop offset="100%" stopColor="#EDE2D2" />
                </linearGradient>
                <linearGradient id="pearlRight" x1="100%" y1="50%" x2="0%" y2="50%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="65%" stopColor="#FAF7F1" />
                  <stop offset="100%" stopColor="#EDE2D2" />
                </linearGradient>
                <filter id="topFlapDepth" x="-25%" y="-25%" width="150%" height="150%">
                  <feDropShadow dx="0" dy="7" stdDeviation="6" floodColor="rgba(67, 18, 31, 0.28)" />
                  <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0, 0, 0, 0.15)" />
                </filter>
                <filter id="paperFiberTexture" x="-4%" y="-4%" width="108%" height="108%" colorInterpolationFilters="sRGB">
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.025 0.7"
                    numOctaves="2"
                    seed="31"
                    stitchTiles="stitch"
                    result="paperNoise"
                  />
                  <feColorMatrix
                    in="paperNoise"
                    type="matrix"
                    values="0.08 0.08 0.08 0 0.72
                            0.08 0.08 0.08 0 0.69
                            0.08 0.08 0.08 0 0.62
                            0 0 0 0.18 0"
                    result="paperTone"
                  />
                  <feComposite in="paperTone" in2="SourceAlpha" operator="in" result="maskedPaperTone" />
                  <feBlend in="SourceGraphic" in2="maskedPaperTone" mode="soft-light" />
                </filter>
                <filter id="butterflyWingTexture" x="-12%" y="-12%" width="124%" height="124%" colorInterpolationFilters="sRGB">
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.035 0.18"
                    numOctaves="2"
                    seed="17"
                    result="wingNoise"
                  />
                  <feDisplacementMap
                    in="SourceGraphic"
                    in2="wingNoise"
                    scale="0.85"
                    xChannelSelector="R"
                    yChannelSelector="G"
                    result="texturedWing"
                  />
                  <feSpecularLighting
                    in="wingNoise"
                    surfaceScale="1.2"
                    specularConstant="0.42"
                    specularExponent="22"
                    lightingColor="#fff7d6"
                    result="wingHighlight"
                  >
                    <feDistantLight azimuth="225" elevation="52" />
                  </feSpecularLighting>
                  <feComposite in="wingHighlight" in2="SourceAlpha" operator="in" result="maskedHighlight" />
                  <feBlend in="texturedWing" in2="maskedHighlight" mode="screen" />
                </filter>
              </defs>
            </svg>

            {/* 1. BOTTOM FLAP (Upward Triangle with Gold Diagonal Edges - Slow-Motion 3.6s) */}
            <div
              className={`absolute inset-x-0 bottom-0 h-1/2 origin-bottom envelope-flap envelope-flap-bottom ${
                isFlapsUnfolded ? 'envelope-flap-open' : 'z-21'
              } crease-depth-bottom`}
            >
              <svg viewBox="0 0 440 165" className="w-full h-full overflow-visible preserve-3d">
                <path
                  d="M 0 165 L 440 165 L 220 0 Z"
                  fill="url(#pearlBottom)"
                  stroke="url(#goldSeamGradient)"
                  strokeWidth="2.2"
                />
                <path
                  d="M 24 156 L 416 156 L 220 16 Z"
                  fill="none"
                  stroke="url(#goldSeamGradient)"
                  strokeWidth="0.8"
                  strokeDasharray="5 3"
                  opacity="0.65"
                />
              </svg>
            </div>

            {/* 2. LEFT FLAP (Inward Triangle with Gold Diagonal Edge - Slow-Motion 3.6s) */}
            <div
              className={`absolute inset-y-0 left-0 w-1/2 origin-left envelope-flap envelope-flap-left ${
                isFlapsUnfolded ? 'envelope-flap-open' : 'z-22'
              } crease-depth-side`}
            >
              <svg viewBox="0 0 220 330" className="w-full h-full overflow-visible preserve-3d">
                <path
                  d="M 0 0 L 220 165 L 0 330 Z"
                  fill="url(#pearlLeft)"
                  stroke="url(#goldSeamGradient)"
                  strokeWidth="2.2"
                />
                <path
                  d="M 12 24 L 206 165 L 12 306 Z"
                  fill="none"
                  stroke="url(#goldSeamGradient)"
                  strokeWidth="0.8"
                  strokeDasharray="5 3"
                  opacity="0.65"
                />
              </svg>
            </div>

            {/* 3. RIGHT FLAP (Inward Triangle with Gold Diagonal Edge - Slow-Motion 3.6s) */}
            <div
              className={`absolute inset-y-0 right-0 w-1/2 origin-right envelope-flap envelope-flap-right ${
                isFlapsUnfolded ? 'envelope-flap-open' : 'z-23'
              } crease-depth-side-right`}
            >
              <svg viewBox="0 0 220 330" className="w-full h-full overflow-visible preserve-3d">
                <path
                  d="M 220 0 L 0 165 L 220 330 Z"
                  fill="url(#pearlRight)"
                  stroke="url(#goldSeamGradient)"
                  strokeWidth="2.2"
                />
                <path
                  d="M 208 24 L 14 165 L 208 306 Z"
                  fill="none"
                  stroke="url(#goldSeamGradient)"
                  strokeWidth="0.8"
                  strokeDasharray="5 3"
                  opacity="0.65"
                />
              </svg>
            </div>

            {/* 4. TOP FLAP (Overlapping Triangle with Rich Gold Foil Filigree & Shadow - Slow-Motion 3.6s) */}
            <div
              className={`absolute inset-x-0 top-0 h-1/2 origin-top envelope-flap envelope-flap-top ${
                isFlapsUnfolded ? 'envelope-flap-open' : 'z-24'
              }`}
            >
              <svg viewBox="0 0 440 165" className="w-full h-full overflow-visible preserve-3d">
                {/* Main Flap Body with Layered Drop Shadow */}
                <path
                  d="M 0 0 L 440 0 L 220 165 Z"
                  fill="url(#pearlTop)"
                  stroke="url(#goldSeamGradient)"
                  strokeWidth="2.8"
                  filter="url(#topFlapDepth)"
                />
                {/* Inner Decorative Stitched Gold Filigree Line */}
                <path
                  d="M 22 10 L 418 10 L 220 152 Z"
                  fill="none"
                  stroke="url(#goldSeamGradient)"
                  strokeWidth="1.2"
                  strokeDasharray="5 3"
                  opacity="0.85"
                />
                {/* Gold Royal Crest Motif */}
                <text
                  x="220"
                  y="52"
                  textAnchor="middle"
                  fill="#C4A46A"
                  fontSize="22"
                  fontFamily="Cinzel, serif"
                  fontWeight="bold"
                  opacity="0.8"
                >
                  ❖
                </text>
              </svg>
            </div>
          </div>

          {/* ======================================================= */}
          {/* 5. ROYAL WAX SEAL (CENTERS AND SEALS ALL 4 FLAPS)       */}
          {/* ======================================================= */}
          <button
            type="button"
            disabled={stage !== 'sealed'}
            className={`absolute left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 cursor-pointer touch-manipulation select-none border-0 bg-transparent p-2 transition-all duration-700 ease-out envelope-seal-container focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ECC88B] focus-visible:ring-offset-4 focus-visible:ring-offset-[#FFF8ED] ${
              stage === 'seal-burst'
                ? 'envelope-seal-breaking pointer-events-none'
                : stage !== 'sealed'
                  ? 'envelope-seal-dismissed pointer-events-none'
                  : 'opacity-100 scale-100 hover:scale-105 active:scale-95'
            }`}
            onPointerDown={handleBreakSeal}
            onPointerUp={handleBreakSeal}
            onClick={handleBreakSeal}
            aria-label="Break wax seal to open invitation"
          >
            {stage === 'seal-burst' && <div className="envelope-shockwave pointer-events-none absolute" aria-hidden="true" />}

            {/* Scalloped Molten Wax Border with 3D Depth */}
            <div
              className="relative flex h-22 w-22 flex-col items-center justify-center rounded-full border-2 border-[#FFE8A3]/80 shadow-[0_20px_45px_rgba(67,18,31,0.7)] wax-seal envelope-wax-seal sm:h-26 sm:w-26"
              style={{
                borderRadius: '48% 52% 50% 50% / 50% 48% 52% 50%',
              }}
            >
              {/* Inner Gold Foil Seal Ring */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-dashed border-[#FFDF85]/90 flex flex-col items-center justify-center p-1 bg-gradient-to-br from-white/20 to-transparent">
                {/* Monogram */}
                <span className="font-cinzel text-2xl sm:text-3xl font-bold tracking-widest text-[#FFF8ED] drop-shadow-[0_2px_5px_rgba(0,0,0,0.95)]">
                  {config.couple.monogram}
                </span>
                <span className="text-[8px] sm:text-[9px] text-[#FFDF85] tracking-widest uppercase font-bold mt-0.5">
                  SEALED
                </span>
              </div>

              <div className={`pointer-events-none absolute inset-0 envelope-seal-cracks ${stage === 'seal-burst' ? 'is-active' : ''}`} aria-hidden="true">
                <span className="absolute left-[48%] top-[9%] h-[42%] w-px origin-bottom rotate-[18deg] bg-[#ffe9a6]/90" />
                <span className="absolute bottom-[12%] left-[49%] h-[38%] w-px origin-top -rotate-[34deg] bg-[#ffe9a6]/80" />
                <span className="absolute left-[10%] top-[47%] h-px w-[38%] origin-right rotate-[21deg] bg-[#ffe9a6]/80" />
              </div>

              {/* Specular wax shine highlight */}
              <div className="absolute top-2.5 left-3.5 w-5 h-2.5 rounded-full bg-white/50 blur-[1px] transform -rotate-30 pointer-events-none" />
            </div>

            {/* Glowing Golden Particles Shockwave on Release */}
            {burstParticles.map((p) => (
              <span
                key={p.id}
                className="envelope-burst-particle pointer-events-none absolute rounded-full"
                style={{
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  backgroundColor: p.color,
                  left: '50%',
                  top: '50%',
                  animationDuration: `${p.duration}s`,
                  animationDelay: `${p.delay}s`,
                  boxShadow: `0 0 14px ${p.color}`,
                  '--particle-x': `${p.x}px`,
                  '--particle-y': `${p.y}px`,
                } as React.CSSProperties}
              />
            ))}
          </button>

        </div>

        {/* ======================================================== */}
        {/* ACTION BUTTON CONTROLS (Zero Overlap with Card)          */}
        {/* ======================================================== */}
        <div className="mt-8 sm:mt-12 text-center flex flex-col items-center justify-center min-h-[70px] relative z-50">
          {stage === 'sealed' && (
            <div className="flex flex-col items-center animate-fade-in">
              <button
                onClick={handleBreakSeal}
                className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#641C2C] via-[#7B263A] to-[#641C2C] text-[#FFF8ED] hover:from-[#7B263A] hover:to-[#641C2C] active:scale-95 transition-all shadow-xl hover:shadow-2xl font-cinzel text-xs sm:text-sm tracking-[0.25em] uppercase font-bold border border-[#ECC88B]/70 group cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#ECC88B] group-hover:rotate-12 transition-transform" />
                <span>{config.invitation.sealInstruction}</span>
                <span className="text-[#ECC88B] transition-transform group-hover:translate-x-1">➔</span>
              </button>
              <p className="mt-2.5 text-xs font-cormorant italic text-[#7B263A]">
                Tap the wax seal to unveil the auspicious celebration
              </p>
            </div>
          )}

        </div>

        {stage === 'scratch-gate' && (
          <GoldenDateScratch config={config} onContinue={handleEnterGarden} />
        )}

      </div>
    </section>
  );
};
