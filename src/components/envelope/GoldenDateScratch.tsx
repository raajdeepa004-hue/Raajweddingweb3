import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { WeddingConfig } from '../../config/wedding';

interface GoldenDateScratchProps {
  config: WeddingConfig;
  onContinue: () => void;
}

interface ScratchPoint {
  x: number;
  y: number;
}

const revealSparkles = [
  { left: '8%', top: '20%', delay: '0ms', size: '12px' },
  { left: '18%', top: '76%', delay: '180ms', size: '8px' },
  { left: '30%', top: '11%', delay: '420ms', size: '10px' },
  { left: '68%', top: '14%', delay: '260ms', size: '9px' },
  { left: '83%', top: '32%', delay: '520ms', size: '12px' },
  { left: '90%', top: '72%', delay: '90ms', size: '8px' },
  { left: '66%', top: '85%', delay: '360ms', size: '10px' },
  { left: '35%', top: '90%', delay: '600ms', size: '8px' },
];

const paintGoldSurface = (context: CanvasRenderingContext2D, width: number, height: number) => {
  context.clearRect(0, 0, width, height);

  const gold = context.createLinearGradient(0, 0, width, height);
  gold.addColorStop(0, '#f9df9a');
  gold.addColorStop(0.28, '#d5a84f');
  gold.addColorStop(0.52, '#f5d77f');
  gold.addColorStop(0.78, '#b77b2f');
  gold.addColorStop(1, '#efd087');
  context.fillStyle = gold;
  context.fillRect(0, 0, width, height);

  context.save();
  context.globalAlpha = 0.16;
  context.strokeStyle = '#fff4c9';
  context.lineWidth = 1;
  for (let offset = -height; offset < width + height; offset += 24) {
    context.beginPath();
    context.moveTo(offset, 0);
    context.lineTo(offset + height, height);
    context.stroke();
  }
  context.restore();

  for (let index = 0; index < 420; index += 1) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = 0.35 + Math.random() * 1.25;
    const alpha = 0.08 + Math.random() * 0.2;
    context.beginPath();
    context.fillStyle = index % 3 === 0
      ? `rgba(255, 246, 198, ${alpha})`
      : `rgba(92, 53, 14, ${alpha * 0.55})`;
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }

  context.save();
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.font = '700 11px Cinzel, serif';
  context.fillStyle = 'rgba(80, 45, 13, 0.28)';
  context.fillText('SCRATCH TO REVEAL', width / 2, height / 2 + 3);
  context.font = '20px serif';
  context.fillStyle = 'rgba(255, 247, 206, 0.72)';
  context.fillText('✦', width / 2, height / 2 - 25);
  context.fillText('✦', width / 2, height / 2 + 31);
  context.restore();

  const edgeInset = Math.min(18, width * 0.06);
  context.strokeStyle = 'rgba(255, 245, 194, 0.72)';
  context.lineWidth = 1.5;
  context.strokeRect(edgeInset, edgeInset, width - edgeInset * 2, height - edgeInset * 2);
};

export const GoldenDateScratch: React.FC<GoldenDateScratchProps> = ({ config, onContinue }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastPointRef = useRef<ScratchPoint | null>(null);
  const progressFrameRef = useRef<number | null>(null);
  const revealedRef = useRef(false);
  const [scratchProgress, setScratchProgress] = useState(0);
  const [isScratching, setIsScratching] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return undefined;

    const resizeSurface = () => {
      const bounds = host.getBoundingClientRect();
      const width = Math.max(1, bounds.width);
      const height = Math.max(1, bounds.height);
      const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * devicePixelRatio);
      canvas.height = Math.round(height * devicePixelRatio);

      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) return;
      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

      if (revealedRef.current) {
        context.clearRect(0, 0, width, height);
      } else {
        paintGoldSurface(context, width, height);
      }
    };

    resizeSurface();
    const observer = new ResizeObserver(resizeSurface);
    observer.observe(host);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (progressFrameRef.current !== null) {
        window.cancelAnimationFrame(progressFrameRef.current);
      }
    };
  }, []);

  const getPoint = (event: React.PointerEvent<HTMLCanvasElement>): ScratchPoint => {
    const bounds = event.currentTarget.getBoundingClientRect();
    return {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    };
  };

  const measureScratchProgress = () => {
    if (progressFrameRef.current !== null || revealedRef.current) return;

    progressFrameRef.current = window.requestAnimationFrame(() => {
      progressFrameRef.current = null;
      const canvas = canvasRef.current;
      const context = canvas?.getContext('2d', { willReadFrequently: true });
      if (!canvas || !context) return;

      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      const step = Math.max(5, Math.round(Math.min(canvas.width, canvas.height) / 85));
      let sampled = 0;
      let cleared = 0;

      for (let y = 0; y < canvas.height; y += step) {
        for (let x = 0; x < canvas.width; x += step) {
          sampled += 1;
          if (pixels[(y * canvas.width + x) * 4 + 3] < 92) {
            cleared += 1;
          }
        }
      }

      const progress = sampled > 0 ? cleared / sampled : 0;
      setScratchProgress((current) => Math.max(current, progress));

      if (progress >= 0.44) {
        revealedRef.current = true;
        setIsRevealed(true);
        setScratchProgress(1);
      }
    });
  };

  const eraseAt = (point: ScratchPoint) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d', { willReadFrequently: true });
    if (!canvas || !context || revealedRef.current) return;

    const bounds = canvas.getBoundingClientRect();
    const brushSize = Math.max(30, Math.min(bounds.width, bounds.height) * 0.105);
    const previousPoint = lastPointRef.current;

    context.save();
    context.globalCompositeOperation = 'destination-out';
    context.globalAlpha = 0.94;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = brushSize;
    context.beginPath();

    if (previousPoint) {
      context.moveTo(previousPoint.x, previousPoint.y);
      context.lineTo(point.x, point.y);
    } else {
      context.moveTo(point.x, point.y);
      context.lineTo(point.x + 0.01, point.y + 0.01);
    }

    context.stroke();
    context.restore();
    lastPointRef.current = point;
    measureScratchProgress();
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (revealedRef.current) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsScratching(true);
    lastPointRef.current = null;
    eraseAt(getPoint(event));
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isScratching || revealedRef.current) return;
    eraseAt(getPoint(event));
  };

  const stopScratching = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setIsScratching(false);
    lastPointRef.current = null;
    measureScratchProgress();
  };

  const renderCelebration = (title: string, date: string) => (
    <div className="scratch-date-card flex min-w-0 flex-col items-center rounded-xl border border-[#c4a46a]/35 bg-[#fffaf0]/45 px-3 py-4 text-center">
      <span className="font-cinzel text-sm font-bold uppercase tracking-[0.16em] text-[#7b263a]">
        {title}
      </span>
      <span className="mt-2 flex w-full justify-center text-center font-cormorant text-sm italic font-medium text-[#7b263a]">
        On
      </span>
      <p className="mt-0.5 w-full text-center font-cinzel text-xs font-bold leading-tight tracking-[0.05em] text-[#641c2c]">
        {date.toUpperCase()}
      </p>
    </div>
  );

  return (
    <div
      className="scratch-gate-backdrop fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-[#2d0b17]/25 px-4 py-8 backdrop-blur-[3px] sm:p-10"
      role="dialog"
      aria-modal="true"
      aria-labelledby="scratch-gate-title"
    >
      <div className="relative my-auto w-full max-w-[520px]">
        <div className="absolute -inset-5 rounded-[34px] bg-[#ecc88b]/20 blur-2xl" />
        <div className="scratch-gate-shell relative overflow-hidden rounded-[28px] border border-[#ecc88b]/80 bg-[#fffaf0]/95 p-4 shadow-[0_30px_90px_rgba(45,11,23,0.4)] sm:p-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.9),transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.34),transparent_45%)]" />
          <div className="relative z-10 text-center">
            <div className="mb-2 flex items-center justify-center gap-2 text-[#c4a46a]">
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#c4a46a]" />
              <Sparkles className="h-3.5 w-3.5" />
              <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#c4a46a]" />
            </div>
            <p className="font-cinzel text-[9px] font-bold uppercase leading-relaxed tracking-[0.24em] text-[#7b263a] sm:text-[10px] sm:tracking-[0.32em]">
              A date sealed with Love
            </p>
            <h2 id="scratch-gate-title" className="mt-1 font-script text-3xl leading-[1.12] text-[#641c2c] sm:text-5xl">
              Unveil the Dates
            </h2>
            <p className="mx-auto mt-2 max-w-sm font-cormorant text-base italic text-[#6d5050]">
              Beneath this gilded veil waits the first promise of your celebration.
            </p>
          </div>

          <div className="scratch-gate-ticket relative z-10 mx-auto mt-5 w-full max-w-[430px] rounded-[26px] border border-[#c4a46a]/65 bg-[#f8edda] p-2.5 shadow-[0_18px_40px_rgba(67,18,31,0.18)] sm:mt-6 sm:p-3">
            <div className="relative min-h-[330px] overflow-hidden rounded-[20px] border border-[#9b6827]/55 bg-[#fbf0cf] sm:min-h-[350px]">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_50%_32%,#fffdf7_0%,#f8edda_48%,#e5c68b_100%)] px-4 py-5 text-center">
                <span className="font-cinzel text-[10px] font-bold uppercase tracking-[0.3em] text-[#c4a46a]">
                  The celebrations begin
                </span>
                <div className="grid w-full max-w-[390px] grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {renderCelebration('Marriage', config.venues.marriage.dateFormatted)}
                  {renderCelebration('Reception', config.venues.reception.dateFormatted)}
                </div>
                <span className="mt-4 text-lg text-[#c4a46a]">❦</span>
              </div>

              <canvas
                ref={canvasRef}
                className={`absolute inset-0 z-20 h-full w-full touch-none cursor-crosshair transition-opacity duration-1000 ${
                  isRevealed ? 'opacity-0' : 'opacity-100'
                }`}
                aria-label="Scratch the gold surface to reveal the wedding dates"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={stopScratching}
                onPointerCancel={stopScratching}
              />
              <div className="pointer-events-none absolute inset-2 z-30 rounded-[16px] border border-[#fff0b6]/60" />
              <div className="scratch-veil-shimmer pointer-events-none absolute -inset-y-10 left-[-45%] z-30 w-[32%] rotate-[18deg] bg-gradient-to-r from-transparent via-white/45 to-transparent" />

              {isRevealed && revealSparkles.map((sparkle, index) => (
                <span
                  key={`${sparkle.left}-${index}`}
                  className="scratch-reveal-sparkle pointer-events-none absolute z-40 text-[#d4af37]"
                  style={{
                    left: sparkle.left,
                    top: sparkle.top,
                    animationDelay: sparkle.delay,
                    fontSize: sparkle.size,
                  }}
                >
                  ✦
                </span>
              ))}
            </div>
          </div>

          <div className="relative z-10 mt-4 flex items-center justify-center gap-3 text-[#7b263a]" aria-live="polite">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#c4a46a]/70 p-1"
              style={{
                background: `conic-gradient(#c4a46a ${scratchProgress * 360}deg, rgba(196,164,106,0.18) 0deg)`,
              }}
            >
              <div className="flex h-full w-full items-center justify-center rounded-full bg-[#fffaf0]">
                <span className="font-cinzel text-[8px] font-bold">{isRevealed ? '✓' : `${Math.round(scratchProgress * 100)}%`}</span>
              </div>
            </div>
            <span className="font-cinzel text-[10px] font-bold uppercase tracking-[0.22em]">
              {isRevealed ? 'The date is revealed' : 'Scratch the gilded veil'}
            </span>
          </div>

          <div className="relative z-10 mt-4 flex justify-center">
            {isRevealed && (
              <button
                type="button"
                onClick={onContinue}
                className="group inline-flex items-center gap-3 rounded-full border border-[#ecc88b]/80 bg-gradient-to-r from-[#641c2c] via-[#7b263a] to-[#641c2c] px-7 py-3 text-xs font-bold uppercase tracking-[0.2em] text-[#fff8ed] shadow-[0_12px_26px_rgba(67,18,31,0.28)] transition-transform hover:scale-[1.03] active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#c4a46a] focus:ring-offset-2 focus:ring-offset-[#fffaf0]"
              >
                Enter the celebration
                <ArrowRight className="h-4 w-4 text-[#ecc88b] transition-transform group-hover:translate-x-1" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
