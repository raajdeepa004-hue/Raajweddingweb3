import React, { useEffect, useState } from 'react';

interface SectionProgressNavProps {
  isInvitationOpened: boolean;
}

interface SectionItem {
  id: string;
  label: string;
  shortLabel: string;
}

const sections: SectionItem[] = [
  { id: 'welcome', label: 'Welcome & Blessing', shortLabel: '01' },
  { id: 'timeline', label: 'Our Story & Reveal', shortLabel: '02' },
  { id: 'venue', label: 'Wedding Celebrations', shortLabel: '03' },
  { id: 'countdown', label: 'Big Day Countdown', shortLabel: '04' },
];

export const SectionProgressNav: React.FC<SectionProgressNavProps> = ({ isInvitationOpened }) => {
  const [activeSection, setActiveSection] = useState<string>('welcome');

  useEffect(() => {
    if (!isInvitationOpened) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.35;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isInvitationOpened]);

  if (!isInvitationOpened) return null;

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className="floating-nav fixed left-3 sm:left-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-3 select-none"
      aria-label="Section navigation"
    >
      <div className="floating-nav-shell flex flex-col items-center gap-3 p-2 py-3 rounded-full bg-[#FFFDF9]/80 backdrop-blur-[2px] border border-[#C4A46A]/40 shadow-md">
        {sections.map((sec) => {
          const isActive = activeSection === sec.id;

          return (
            <button
              key={sec.id}
              onClick={() => scrollTo(sec.id)}
              className="relative group flex items-center justify-center p-1 focus:outline-none"
              aria-label={`Scroll to ${sec.label}`}
              title={sec.label}
            >
              {/* Outer circle indicator */}
              <div
                className={`transition-all duration-300 rounded-full flex items-center justify-center ${
                  isActive
                    ? 'w-4 h-4 bg-[#641C2C] border-2 border-[#C4A46A] scale-110'
                    : 'w-2.5 h-2.5 bg-[#C4A46A]/50 hover:bg-[#7B263A]'
                }`}
              />

              {/* Tooltip Label on Hover / Active */}
              <div
                className={`hidden sm:block absolute left-7 px-2.5 py-1 rounded bg-[#641C2C] text-[#FFF8ED] text-[10px] font-cinzel tracking-wider uppercase font-semibold whitespace-nowrap pointer-events-none transition-all duration-200 shadow-md ${
                  isActive
                    ? 'opacity-90 translate-x-0'
                    : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
                }`}
              >
                {sec.label}
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
