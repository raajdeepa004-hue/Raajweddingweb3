import React from 'react';
import { WeddingConfig, WeddingMilestone } from '../../config/wedding';

const receptionHeartPath = 'M 50,96 C 42,88 8,64 4,36 C 1,17 13,5 28,5 C 39,5 47,12 50,22 C 53,12 61,5 72,5 C 87,5 99,17 96,36 C 92,64 58,88 50,96 Z';
const receptionHeartClipPath = 'M 0.5,0.96 C 0.42,0.88 0.08,0.64 0.04,0.36 C 0.01,0.17 0.13,0.05 0.28,0.05 C 0.39,0.05 0.47,0.12 0.5,0.22 C 0.53,0.12 0.61,0.05 0.72,0.05 C 0.87,0.05 0.99,0.17 0.96,0.36 C 0.92,0.64 0.58,0.88 0.5,0.96 Z';

interface WeddingTimelineProps {
  config: WeddingConfig;
}

export const WeddingTimeline: React.FC<WeddingTimelineProps> = ({ config }) => {
  return (
    <section
      id="timeline"
      className="section-stage section-stage--timeline relative min-h-[100svh] sm:min-h-screen flex flex-col items-center justify-center px-4 py-20 sm:py-28 z-10"
    >
      {/* SVG ClipPath Definition for Heart Silhouette */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <clipPath id="receptionHeartClip" clipPathUnits="objectBoundingBox">
              <path d={receptionHeartClipPath} />
          </clipPath>
        </defs>
      </svg>

      <div className="max-w-3xl w-full mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14 sm:mb-18">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-[#C4A46A] text-sm">✦</span>
            <span className="h-[1px] w-10 bg-[#C4A46A]/60" />
            <span className="font-cinzel text-xs tracking-[0.3em] text-[#7B263A] uppercase font-semibold">
              Our Journey
            </span>
            <span className="h-[1px] w-10 bg-[#C4A46A]/60" />
            <span className="text-[#C4A46A] text-sm">✦</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-semibold tracking-wider text-[#641C2C] mb-3">
            A Journey Written in Love
          </h2>
          <p className="font-cormorant italic text-base sm:text-lg text-[#39302E] max-w-md mx-auto">
            From our very first words to our sacred forever, each chapter holds our deepest blessing.
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="relative">
          {/* Central connecting gold spine */}
          <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-[1.5px] bg-gradient-to-b from-[#C4A46A]/20 via-[#C4A46A] to-[#C4A46A]/20 -translate-x-1/2" />

          {/* Milestones Container */}
          <div className="space-y-12 sm:space-y-16">
            {config.milestones.map((milestone: WeddingMilestone, index: number) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={milestone.id}
                  className={`relative flex flex-col sm:flex-row items-start sm:items-center ${
                    isEven ? 'sm:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline Node Marker */}
                  <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
                    <div className="timeline-node w-8 h-8 rounded-full bg-[#FFF8ED] border-2 border-[#641C2C] shadow-md flex items-center justify-center text-[#7B263A]">
                      <span className="text-xs">❦</span>
                    </div>
                  </div>

                  {/* Milestone Card */}
                  <div
                    className={`ml-14 min-w-0 w-[calc(100%_-_3.5rem)] sm:ml-0 sm:w-1/2 ${
                      isEven ? 'sm:pl-10' : 'sm:pr-10'
                    }`}
                  >
                    <div className="timeline-card bg-[#FFFDF9]/92 backdrop-blur-[2px] border border-[#C4A46A]/40 rounded-xl p-6 sm:p-7 parchment-shadow hover:border-[#C4A46A] transition-all duration-300 relative group">
                      {/* Milestone Number & Title */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-cinzel text-[11px] tracking-[0.25em] text-[#C4A46A] uppercase font-semibold">
                          Chapter 0{index + 1}
                        </span>
                        <span className="font-cinzel text-xs tracking-wider text-[#92967A] uppercase font-medium">
                          {milestone.dayFormatted}
                        </span>
                      </div>

                      <h3 className="font-cinzel text-xl sm:text-2xl font-semibold text-[#641C2C] mb-1">
                        {milestone.title}
                      </h3>

                      {/* Regular Date Display (for Chapters 1-3) */}
                      {!milestone.isScratchCard ? (
                        <div className="timeline-date-pill inline-block px-3 py-1 rounded bg-[#F3E7D4] text-[#7B263A] font-cinzel text-sm tracking-wider font-semibold my-2 border border-[#C4A46A]/30">
                          {milestone.dateFormatted}
                        </div>
                      ) : (
                        /* RECEPTION HEART DISPLAY */
                        <div className="relative w-full flex justify-center items-center my-4">
                          <div
                            className="timeline-heart relative w-full max-w-[380px] aspect-[0.92/1] select-none filter drop-shadow-[0_10px_20px_rgba(67,18,31,0.22)]"
                          >
                            <div
                              className="absolute inset-0 bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E6] to-[#F3E7D4]"
                              style={{
                                clipPath: 'url(#receptionHeartClip)',
                                WebkitClipPath: 'url(#receptionHeartClip)',
                              }}
                            />

                            {/* RECEPTION DATE CONTENT INSIDE THE HEART */}
                            <div className="absolute inset-x-[8%] top-[24%] bottom-[13%] z-30 flex flex-col items-center justify-center text-center px-1">
                              <span className="text-[#C4A46A] text-[9px] sm:text-[10px] font-cinzel tracking-[0.22em] leading-tight uppercase font-bold mb-1 whitespace-nowrap">
                                Together We Celebrate
                              </span>
                              <span className="font-script text-[1.7rem] sm:text-3xl text-[#7B263A] leading-none my-0.5 whitespace-nowrap">
                                Our Reception
                              </span>
                              <div className="flex flex-col items-center my-1 leading-none">
                                <span className="font-cinzel text-[0.5rem] sm:text-[0.55rem] font-bold text-[#C4A46A] tracking-[0.28em] mb-1">
                                  ON
                                </span>
                                <span className="font-cinzel text-[0.62rem] sm:text-xs font-bold text-[#641C2C] tracking-[0.06em] bg-[#FFF8ED] px-2 py-0.5 rounded-full border border-[#C4A46A]/50 shadow-xs whitespace-nowrap">
                                  {milestone.dateFormatted}
                                </span>
                              </div>
                              <span className="text-[#C4A46A] text-xs mt-2">❦</span>
                            </div>

                            {/* Decorative Gold Foil Rim Overlay */}
                            <svg
                              viewBox="0 0 100 100"
                              preserveAspectRatio="none"
                              className="absolute inset-0 w-full h-full pointer-events-none z-20"
                              fill="none"
                            >
                              <path
                                d={receptionHeartPath}
                                stroke="#C4A46A"
                                strokeWidth="2.5"
                                fill="none"
                              />
                              <path
                                d="M 50,91 C 43,84 14,62 10,36 C 8,20 17,11 29,11 C 38,11 46,17 50,27 C 54,17 62,11 71,11 C 83,11 92,20 90,36 C 86,62 57,84 50,91 Z"
                                stroke="#ECC88B"
                                strokeWidth="1"
                                strokeDasharray="3 2"
                                fill="none"
                                opacity="0.85"
                              />
                            </svg>
                          </div>
                        </div>
                      )}

                      <p className="font-cormorant text-sm sm:text-base text-[#39302E] leading-relaxed mt-2.5">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
