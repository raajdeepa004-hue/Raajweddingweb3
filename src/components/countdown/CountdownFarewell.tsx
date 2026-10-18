import React, { useEffect, useState, useMemo } from 'react';
import { WeddingConfig } from '../../config/wedding';

interface CountdownFarewellProps {
  config: WeddingConfig;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isCompleted: boolean;
}

const FloralArtwork: React.FC<{ className: string; mirrored?: boolean }> = ({ className, mirrored = false }) => (
  <img
    src="/images/flowers-transparent.png"
    alt=""
    aria-hidden="true"
    className={`${className} object-cover drop-shadow-[0_3px_4px_rgba(67,18,31,0.12)]`}
    style={mirrored ? { transform: 'scaleX(-1)' } : undefined}
    draggable={false}
  />
);

export const CountdownFarewell: React.FC<CountdownFarewellProps> = ({ config }) => {
  // Target date timestamp in Asia/Kolkata timezone (UTC+05:30)
  // If targetTime is empty or unspecified, counts down to the beginning of reception day
  const targetTimestamp = useMemo(() => {
    const { targetIsoDate, targetTime } = config.countdown;
    const timePart = targetTime && targetTime.trim().length > 0 ? targetTime : '00:00:00';
    // Format ISO string with Asia/Kolkata timezone offset (+05:30)
    const targetIsoString = `${targetIsoDate}T${timePart}+05:30`;
    const parsed = new Date(targetIsoString).getTime();
    return isNaN(parsed) ? new Date('2026-11-22T00:00:00+05:30').getTime() : parsed;
  }, [config.countdown]);

  const calculateTimeRemaining = (): TimeRemaining => {
    const now = Date.now();
    const diff = targetTimestamp - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { days, hours, minutes, seconds, isCompleted: false };
  };

  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(calculateTimeRemaining());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeRemaining());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetTimestamp]);

  return (
    <section
      id="countdown"
      className="section-stage section-stage--countdown relative min-h-[100svh] sm:min-h-screen flex flex-col items-center justify-between px-4 pt-20 pb-12 z-10"
    >
      <div className="max-w-2xl w-full mx-auto text-center my-auto">
        {/* Section Header */}
        <div className="mb-10 sm:mb-12">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-[#C4A46A] text-sm">❦</span>
            <span className="h-[1px] w-10 bg-[#C4A46A]/60" />
            <span className="font-cinzel text-xs tracking-[0.3em] text-[#7B263A] uppercase font-semibold">
              The Moment Awaits
            </span>
            <span className="h-[1px] w-10 bg-[#C4A46A]/60" />
            <span className="text-[#C4A46A] text-sm">❦</span>
          </div>

          <div className="font-script text-4xl sm:text-5xl text-[#641C2C] mb-2">
            The Big Day
          </div>
          <h2 className="px-2 font-cinzel text-lg leading-tight sm:text-xl tracking-[0.2em] text-[#39302E] uppercase font-semibold break-words">
            Counting Down To {config.couple.groomName.split(' ')[0]} &amp; {config.couple.brideName.split(' ')[0]}
          </h2>
          <p className="font-cormorant italic text-sm text-[#92967A] mt-1">
            22 November 2026 • Asia/Kolkata Standard Time
          </p>
        </div>

        {/* Countdown Timer Display */}
        <div className="countdown-surface bg-[#FFFDF9]/92 backdrop-blur-[2px] border border-[#C4A46A]/45 rounded-2xl p-6 sm:p-10 parchment-shadow mb-12 relative overflow-hidden">
          {/* Subtle gold ornamentation */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[#C4A46A]/40 text-xs tracking-[0.5em]">
            ❖ ❖ ❖
          </div>

          <div className="relative z-10 mx-auto mb-4 flex items-center justify-center gap-3 pt-4 sm:mb-5 sm:gap-6">
            <FloralArtwork className="h-[108px] w-[66px] sm:h-[138px] sm:w-[84px]" />
            <figure className="shrink-0">
              <div className="countdown-portrait-frame rounded-[3rem_3rem_0.8rem_0.8rem] border border-[#C4A46A] bg-[#321d26] p-1.5 shadow-[0_8px_20px_rgba(67,18,31,0.2)]">
                <div className="overflow-hidden rounded-[2.55rem_2.55rem_0.55rem_0.55rem] border border-[#ECC88B]/55">
                  <img
                    src="/images/r%26h.jpg"
                    alt="Raaj and Harshavardhini in their wedding attire"
                    className="block h-[120px] w-[80px] object-cover object-top sm:h-[144px] sm:w-[96px]"
                  />
                </div>
              </div>
            </figure>
            <FloralArtwork className="h-[108px] w-[66px] sm:h-[138px] sm:w-[84px]" mirrored />
          </div>

          {!timeLeft.isCompleted ? (
            <div className="grid grid-cols-4 gap-2 sm:gap-6 pt-3">
              {/* Days */}
              <div className="countdown-tile flex flex-col items-center p-2 sm:p-4 rounded-xl bg-[#F7EEDA]/70 border border-[#C4A46A]/30">
                <span className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-bold text-[#641C2C] tabular-nums">
                  {timeLeft.days}
                </span>
                <span className="font-cinzel text-[10px] sm:text-xs tracking-[0.2em] text-[#7B263A] uppercase font-semibold mt-1">
                  Days
                </span>
              </div>

              {/* Hours */}
              <div className="countdown-tile flex flex-col items-center p-2 sm:p-4 rounded-xl bg-[#F7EEDA]/70 border border-[#C4A46A]/30">
                <span className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-bold text-[#641C2C] tabular-nums">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="font-cinzel text-[10px] sm:text-xs tracking-[0.2em] text-[#7B263A] uppercase font-semibold mt-1">
                  Hours
                </span>
              </div>

              {/* Minutes */}
              <div className="countdown-tile flex flex-col items-center p-2 sm:p-4 rounded-xl bg-[#F7EEDA]/70 border border-[#C4A46A]/30">
                <span className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-bold text-[#641C2C] tabular-nums">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="font-cinzel text-[10px] sm:text-xs tracking-[0.2em] text-[#7B263A] uppercase font-semibold mt-1">
                  Minutes
                </span>
              </div>

              {/* Seconds */}
              <div className="countdown-tile flex flex-col items-center p-2 sm:p-4 rounded-xl bg-[#F7EEDA]/70 border border-[#C4A46A]/30">
                <span className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-bold text-[#641C2C] tabular-nums">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="font-cinzel text-[10px] sm:text-xs tracking-[0.2em] text-[#7B263A] uppercase font-semibold mt-1">
                  Seconds
                </span>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center">
              <div className="text-3xl text-[#C4A46A] mb-2">❦</div>
              <h3 className="font-cinzel text-2xl font-bold text-[#641C2C] mb-2">
                The Auspicious Celebration Has Begun!
              </h3>
              <p className="font-cormorant italic text-lg text-[#7B263A]">
                May their lives be filled with everlasting laughter, love, and sacred joy.
              </p>
            </div>
          )}

          {/* Couple Monogram Badge */}
          <div className="mt-8 flex flex-col items-center">
            <div className="countdown-monogram w-16 h-16 rounded-full border-2 border-[#C4A46A] bg-[#FFF8ED] flex items-center justify-center text-[#641C2C] font-cinzel text-xl font-bold shadow-md">
              {config.couple.monogram}
            </div>
            <div className="font-cormorant italic text-base text-[#39302E] mt-3">
              “Hand in hand, heart to heart, on this day our forever starts.”
            </div>
          </div>
        </div>

        {/* Farewell Greeting */}
        <div className="text-center max-w-lg mx-auto">
          <div className="font-cinzel text-2xl sm:text-3xl font-semibold text-[#641C2C] tracking-wide mb-2">
            {config.invitation.farewellMessage}
          </div>
          <p className="font-cormorant italic text-base sm:text-lg text-[#7B263A] leading-relaxed">
            {config.invitation.farewellSub}
          </p>
        </div>
      </div>

      {/* Elegant Invitation Footer */}
      <footer className="countdown-footer w-full border-t border-[#C4A46A]/30 pt-6 mt-16 text-center text-xs text-[#92967A] font-cormorant">
        <p className="tracking-wider uppercase font-cinzel text-[10px] text-[#7B263A] mb-1">
          {config.couple.groomName} &amp; {config.couple.brideName} • Wedding Celebration
        </p>
        <p className="italic">
          Crafted with love and devotion for our family and friends.
        </p>
      </footer>
    </section>
  );
};
