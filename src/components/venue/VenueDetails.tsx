import React from 'react';
import { WeddingConfig, VenueInfo } from '../../config/wedding';
import { MapPin, Clock, Calendar, ExternalLink, QrCode } from 'lucide-react';

interface VenueDetailsProps {
  config: WeddingConfig;
}

export const VenueDetails: React.FC<VenueDetailsProps> = ({ config }) => {
  const renderVenueCard = (venue: VenueInfo, badgeText: string) => {
    const hasMapLink = Boolean(venue.googleMapsUrl && venue.googleMapsUrl.trim().length > 0);
    const hasQrCode = Boolean(venue.qrCodeUrl && venue.qrCodeUrl.trim().length > 0);

    return (
      <div className="venue-card bg-[#FFFDF9]/92 backdrop-blur-[2px] border border-[#C4A46A]/45 rounded-2xl p-6 sm:p-8 parchment-shadow flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:border-[#C4A46A]">
        {/* Subtle decorative gold corner motif */}
        <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
          <div className="absolute transform rotate-45 bg-[#C4A46A]/20 w-8 h-8 -top-4 -right-4" />
        </div>

        <div>
          {/* Badge & Title */}
          <div className="flex items-center justify-between mb-4">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#641C2C]/10 text-[#641C2C] font-cinzel text-xs tracking-[0.2em] uppercase font-semibold">
              {badgeText}
            </span>
            <span className="text-[#C4A46A] text-lg font-serif">❦</span>
          </div>

          <h3 className="font-cinzel text-2xl sm:text-3xl font-semibold text-[#641C2C] mb-1 break-words">
            {venue.title}
          </h3>
          <p className="font-cormorant italic text-lg sm:text-xl text-[#7B263A] font-semibold tracking-wide mb-6 break-words">
            {venue.eventName}
          </p>

          {/* Details list */}
          <div className="space-y-4 mb-6">
            {/* Date & Day */}
            <div className="flex items-start gap-3.5">
              <div className="venue-icon w-9 h-9 rounded-full bg-[#F3E7D4] text-[#641C2C] flex items-center justify-center shrink-0 mt-0.5 border border-[#C4A46A]/40 shadow-xs">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="font-cinzel text-xs tracking-wider text-[#92967A] uppercase block">
                  Date &amp; Day
                </span>
                <span className="font-cinzel text-base sm:text-lg font-bold text-[#39302E] break-words">
                  {venue.dateFormatted}
                </span>
                <span className="font-cormorant text-base text-[#7B263A] ml-2 italic font-medium">
                  ({venue.dayFormatted})
                </span>
              </div>
            </div>

            {/* Time */}
            {venue.timeFormatted?.trim() && (
              <div className="flex items-start gap-3.5">
                <div className="venue-icon w-9 h-9 rounded-full bg-[#F3E7D4] text-[#641C2C] flex items-center justify-center shrink-0 mt-0.5 border border-[#C4A46A]/40 shadow-xs">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-cinzel text-xs tracking-wider text-[#92967A] uppercase block">
                    Auspicious Time
                  </span>
                  <span className="font-cinzel text-base sm:text-lg font-bold text-[#641C2C]">
                    {venue.timeFormatted}
                  </span>
                </div>
              </div>
            )}

            {/* Venue & Address */}
            <div className="flex items-start gap-3.5">
              <div className="venue-icon w-9 h-9 rounded-full bg-[#F3E7D4] text-[#641C2C] flex items-center justify-center shrink-0 mt-0.5 border border-[#C4A46A]/40 shadow-xs">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="font-cinzel text-xs tracking-wider text-[#92967A] uppercase block">
                  Venue
                </span>
                  <span className="font-cinzel text-lg sm:text-xl font-bold text-[#641C2C] block break-words">
                  {venue.venueName}
                </span>
                <p className="font-cormorant text-base sm:text-lg text-[#39302E] leading-relaxed mt-1 font-medium break-words">
                  {venue.venueAddress}
                </p>
              </div>
            </div>
          </div>

          {/* Special Notes if available */}
          {venue.notes && (
            <p className="font-cormorant italic text-xs sm:text-sm text-[#92967A] bg-[#F7EEDA]/60 p-3 rounded-lg border border-[#C4A46A]/20 mb-6">
              ✦ {venue.notes}
            </p>
          )}
        </div>

        {/* Footer Area: Map Navigation & QR Code */}
        <div className="pt-6 border-t border-[#C4A46A]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Google Maps Button or Placeholder */}
          <div className="w-full sm:w-auto">
            {hasMapLink ? (
              <a
                href={venue.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#641C2C] text-[#FFF8ED] hover:bg-[#7B263A] transition-all font-cinzel text-xs leading-tight tracking-wider text-center uppercase font-semibold border border-[#C4A46A]/50 shadow-md hover:shadow-lg group"
              >
                <MapPin className="w-3.5 h-3.5 text-[#ECC88B]" />
                <span>View Location on Map</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-0.5 transition-transform" />
              </a>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F3E7D4]/80 text-[#92967A] font-cormorant italic text-sm border border-[#D5C2A5]/60">
                <span>Google Maps link will appear here</span>
              </div>
            )}
          </div>

          {/* QR Code Scan Frame */}
          <div className="w-full sm:w-auto flex items-center justify-center sm:justify-end">
            <div className="venue-qr-frame w-24 h-24 rounded-xl border-2 border-dashed border-[#C4A46A]/60 bg-[#F9F4EB] p-1.5 flex flex-col items-center justify-center text-center shadow-inner relative group">
              {hasQrCode ? (
                <img
                  src={venue.qrCodeUrl}
                  alt={`QR code for ${venue.venueName}`}
                  className="w-full h-full object-contain rounded-lg"
                  loading="lazy"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-1 text-[#92967A]">
                  <QrCode className="w-6 h-6 text-[#C4A46A] mb-1" />
                  <span className="font-cinzel text-[8px] tracking-tight uppercase leading-none font-semibold">
                    Venue QR Code
                  </span>
                  <span className="font-cormorant italic text-[9px] text-[#7B263A] mt-0.5">
                    Frame ready
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section
      id="venue"
      className="section-stage section-stage--venue relative min-h-[100svh] sm:min-h-screen flex flex-col items-center justify-center px-4 py-20 sm:py-28 z-10"
    >
      <div className="max-w-5xl w-full mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-[#C4A46A] text-sm">✦</span>
            <span className="h-[1px] w-10 bg-[#C4A46A]/60" />
            <span className="font-cinzel text-xs tracking-[0.3em] text-[#7B263A] uppercase font-semibold">
              Destination of Celebration
            </span>
            <span className="h-[1px] w-10 bg-[#C4A46A]/60" />
            <span className="text-[#C4A46A] text-sm">✦</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-semibold tracking-wider text-[#641C2C] mb-3">
            OUR WEDDING EVENTS
          </h2>
          <p className="font-cormorant italic text-base sm:text-lg text-[#39302E] max-w-lg mx-auto">
            We look forward to celebrating the sacred wedding ceremony and reception with you.
          </p>
        </div>

        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 items-stretch gap-6 md:grid-cols-2">
          {renderVenueCard(config.venues.marriage, 'Marriage Celebration')}
          {renderVenueCard(config.venues.reception, 'Reception Celebration')}
        </div>
      </div>
    </section>
  );
};
