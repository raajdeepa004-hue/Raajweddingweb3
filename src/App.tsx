import React, { useState, useEffect } from 'react';
import { defaultWeddingConfig, WeddingConfig } from './config/wedding';
import { SealedEnvelope } from './components/envelope/SealedEnvelope';
import { EnchantedGardenCanvas } from './components/garden/EnchantedGardenCanvas';
import { GardenWelcome } from './components/welcome/GardenWelcome';
import { WeddingTimeline } from './components/timeline/WeddingTimeline';
import { VenueDetails } from './components/venue/VenueDetails';
import { CountdownFarewell } from './components/countdown/CountdownFarewell';
import { SectionProgressNav } from './components/navigation/SectionProgressNav';
import { MusicController } from './components/audio/MusicController';
import { Settings, X, RefreshCw, Upload, Check } from 'lucide-react';

const normalizeInvitationCopy = (value: unknown, fallback: string): string => {
  if (typeof value !== 'string') return fallback;

  return value.replace(/\b(thier|their)\b/gi, (match) => {
    if (match === match.toUpperCase()) return 'OUR';
    if (match[0] === match[0].toUpperCase()) return 'Our';
    return 'our';
  });
};

const normalizeMomentLabels = (moments: WeddingConfig['moments']): WeddingConfig['moments'] =>
  moments.map((moment, index) => {
    if (index === 1) return { ...moment, tagline: 'Groom to Bride' };
    if (index === 2) return { ...moment, tagline: 'Bride to Groom' };
    return moment;
  });

export default function App() {
  const [config, setConfig] = useState<WeddingConfig>(defaultWeddingConfig);
  const [isInvitationOpened, setIsInvitationOpened] = useState<boolean>(false);
  const [shouldAutoStartMusic, setShouldAutoStartMusic] = useState<boolean>(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);
  const [adminToken, setAdminToken] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  
  //A beautiful day to celebrate love
  
  // Attempt to load existing config from server on mount
  useEffect(() => {
    fetch('/api/invitation')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json && json.data) {
          const savedAudio = json.data.audio ?? {};
          const savedInvitation = json.data.invitation ?? {};
            const savedVenues = json.data.venues ?? {};
            const savedMarriage = savedVenues.marriage ?? {};
            const savedReception = savedVenues.reception ?? {};
          const isLegacyDefaultAudio = savedAudio.audioSrc === '/audio/wedding-song.mp3'
            && savedAudio.title === 'Eternal Vows';
          const isLegacySubHeadline = savedInvitation.subHeadline
            === 'Together with their families invite you to share in the joy of their holy matrimony';
          const isLegacyMarriageTitle = savedMarriage.title === 'EXCHANGING VOWS';
            const isLegacyMarriageVenue = savedMarriage.venueName === 'Level 9, Sky Garden By Diva'
              || savedMarriage.venueAddress === "1 Jalan Bayu Puteri 2/1, Johor Bahru, Johor Darul Ta'zim";
            const isLegacyMarriageTime = savedMarriage.timeFormatted === '7.30 AM - 9.00 AM'
              || savedMarriage.timeFormatted === '7.30 AM to 9.00 AM';

          setConfig({
            ...defaultWeddingConfig,
            ...json.data,
              venues: {
                ...defaultWeddingConfig.venues,
                ...savedVenues,
                marriage: {
                  ...defaultWeddingConfig.venues.marriage,
                  ...savedMarriage,
                  timeFormatted: isLegacyMarriageTime
                    ? defaultWeddingConfig.venues.marriage.timeFormatted
                    : savedMarriage.timeFormatted?.trim()
                    ? savedMarriage.timeFormatted
                    : defaultWeddingConfig.venues.marriage.timeFormatted,
                  ...(isLegacyMarriageVenue ? defaultWeddingConfig.venues.marriage : {}),
                  ...(isLegacyMarriageTitle
                    ? { title: defaultWeddingConfig.venues.marriage.title }
                    : {}),
                },
                reception: {
                  ...defaultWeddingConfig.venues.reception,
                  ...savedReception,
                },
              },
            invitation: {
              ...defaultWeddingConfig.invitation,
              ...savedInvitation,
              ...(isLegacySubHeadline
                ? { subHeadline: defaultWeddingConfig.invitation.subHeadline }
                : {
                    subHeadline: normalizeInvitationCopy(
                      savedInvitation.subHeadline,
                      defaultWeddingConfig.invitation.subHeadline,
                    ),
                  }),
              familyBlessing: normalizeInvitationCopy(
                savedInvitation.familyBlessing,
                defaultWeddingConfig.invitation.familyBlessing,
              ),
            },
            audio: {
              ...defaultWeddingConfig.audio,
              ...savedAudio,
              ...(isLegacyDefaultAudio
                ? {
                    audioSrc: defaultWeddingConfig.audio.audioSrc,
                    title: defaultWeddingConfig.audio.title,
                  }
                : {}),
            },
            moments: normalizeMomentLabels(
              (json.data.moments && json.data.moments.length > 0)
                ? json.data.moments
                : defaultWeddingConfig.moments,
            ),
          });
        }
      })
      .catch(() => {
        // Fallback to local default config seamlessly
      });
  }, []);

  const handleEnvelopeOpen = () => {
    setIsInvitationOpened(true);
    setShouldAutoStartMusic(true);
  };

  const handleScrollToTimeline = () => {
    const el = document.getElementById('timeline');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedAdminToken = adminToken.trim();
    if (!trimmedAdminToken) {
      setSaveStatus('Administrator token required. No server changes were saved.');
      return;
    }

    setSaveStatus('Saving…');

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${trimmedAdminToken}`,
      };

      const res = await fetch('/api/invitation', {
        method: 'POST',
        headers,
        body: JSON.stringify(config),
      });

      if (res.ok) {
        setSaveStatus('Settings successfully saved!');
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        const err = await res.json();
        setSaveStatus(`Notice: ${err.error || 'Settings were not saved.'}`);
      }
    } catch {
      setSaveStatus('Unable to save settings. No server changes were saved.');
    }
  };

  const handleQrUpload = async (e: React.ChangeEvent<HTMLInputElement>, venueKey: 'marriage' | 'reception') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const trimmedAdminToken = adminToken.trim();
    if (!trimmedAdminToken) {
      e.currentTarget.value = '';
      setSaveStatus('Administrator token required. No server changes were saved.');
      return;
    }

    const formData = new FormData();
    formData.append('media', file);

    try {
      const headers: Record<string, string> = {
        Authorization: `Bearer ${trimmedAdminToken}`,
      };

      const res = await fetch('/api/media/upload', {
        method: 'POST',
        headers,
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          setConfig((prev) => ({
            ...prev,
            venues: {
              ...prev.venues,
              [venueKey]: {
                ...prev.venues[venueKey],
                qrCodeUrl: data.url,
              },
            },
          }));
        }
      } else {
        const err = await res.json().catch(() => null) as { error?: string } | null;
        setSaveStatus(`Notice: ${err?.error || 'Image was not uploaded.'}`);
      }
    } catch {
      setSaveStatus('Unable to upload image. No server changes were saved.');
    }
  };

  return (
    <div className="invitation-shell relative min-h-screen bg-[#FFF8ED] text-[#39302E] selection:bg-[#7B263A] selection:text-[#FFF8ED]">
      {/* PAGE 1: The Sealed Physical Envelope (starts closed) */}
      {!isInvitationOpened && (
        <SealedEnvelope
          config={config}
          isOpen={isInvitationOpened}
          onOpen={handleEnvelopeOpen}
          onStartOpening={() => setShouldAutoStartMusic(true)}
        />
      )}

      {/* GLOBAL THREE.JS ENCHANTED GARDEN CANVAS (Sections 2 to 5) */}
      <EnchantedGardenCanvas isInvitationOpened={isInvitationOpened} />

      {/* SECTIONS 2 TO 5: Continuous Vertical Experience */}
      {isInvitationOpened && (
        <main className="invitation-main relative z-10 flex flex-col">
          {/* Section 2: The Enchanted Garden / Welcome */}
          <GardenWelcome
            config={config}
            onExploreClick={handleScrollToTimeline}
          />

          {/* Section 3: Our Story and Wedding Timeline (with Heart Scratch Card) */}
          <WeddingTimeline config={config} />

          {/* Section 4: Venue and Location (Google Maps & QR code frames) */}
          <VenueDetails config={config} />

          {/* Section 5: Countdown and A Beautiful Farewell */}
          <CountdownFarewell config={config} />
        </main>
      )}

      {/* Persistent Vertical Navigation Dots */}
      <SectionProgressNav isInvitationOpened={isInvitationOpened} />

      {/* Persistent Background Music Controller */}
      <MusicController
        config={config}
        shouldAutoStartOnOpen={shouldAutoStartMusic}
      />

      {/* Subtle Collapsible Customizer Drawer for Testing & Placeholders */}
      {isInvitationOpened && (
        <>
          <aside className="customizer-controller fixed z-40">
            <button
              onClick={() => setIsCustomizerOpen(true)}
              className="customizer-trigger p-2.5 rounded-full bg-[#FFFDF9]/90 border border-[#C4A46A]/50 text-[#7B263A] hover:bg-[#641C2C] hover:text-[#FFF8ED] transition-all shadow-md flex items-center gap-1.5 font-cinzel text-xs tracking-wider font-semibold focus:outline-none"
              title="Customize invitation details"
              aria-label="Open customization panel"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Customize</span>
            </button>
          </aside>

          {isCustomizerOpen && (
            <div className="settings-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
              <div className="settings-panel bg-[#FFFDF9] border-2 border-[#C4A46A] rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto parchment-shadow text-left">
                <div className="flex items-center justify-between pb-4 border-b border-[#C4A46A]/30 mb-4">
                  <div className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-[#641C2C]" />
                    <h3 className="font-cinzel text-lg font-bold text-[#641C2C]">
                      Wedding Invitation Settings
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsCustomizerOpen(false)}
                    className="p-1 rounded-full text-[#92967A] hover:text-[#641C2C] focus:outline-none"
                    aria-label="Close settings"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveConfig} className="space-y-4 font-sans text-xs">
                  <div>
                    <h4 className="font-cinzel text-xs uppercase font-bold text-[#7B263A] mb-2">
                      Couple Details
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold mb-1">Groom Name</label>
                        <input
                          type="text"
                          value={config.couple.groomName}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              couple: { ...prev.couple, groomName: e.target.value },
                            }))
                          }
                          className="w-full p-2 rounded border border-[#D5C2A5] bg-[#FFF8ED]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold mb-1">Bride Name</label>
                        <input
                          type="text"
                          value={config.couple.brideName}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              couple: { ...prev.couple, brideName: e.target.value },
                            }))
                          }
                          className="w-full p-2 rounded border border-[#D5C2A5] bg-[#FFF8ED]"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-cinzel text-xs uppercase font-bold text-[#7B263A] mb-2 mt-4">
                      Venue Google Maps Links
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-[11px] font-semibold mb-1">Marriage Map URL</label>
                        <input
                          type="text"
                          placeholder="https://maps.google.com/..."
                          value={config.venues.marriage.googleMapsUrl}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              venues: {
                                ...prev.venues,
                                marriage: { ...prev.venues.marriage, googleMapsUrl: e.target.value },
                              },
                            }))
                          }
                          className="w-full p-2 rounded border border-[#D5C2A5] bg-[#FFF8ED]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold mb-1">Reception Map URL</label>
                        <input
                          type="text"
                          placeholder="https://maps.google.com/..."
                          value={config.venues.reception.googleMapsUrl}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              venues: {
                                ...prev.venues,
                                reception: { ...prev.venues.reception, googleMapsUrl: e.target.value },
                              },
                            }))
                          }
                          className="w-full p-2 rounded border border-[#D5C2A5] bg-[#FFF8ED]"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-cinzel text-xs uppercase font-bold text-[#7B263A] mb-2 mt-4">
                      QR Code Images
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold mb-1">Marriage QR Code</label>
                        <label className="flex items-center gap-1.5 px-3 py-2 border border-[#C4A46A] rounded bg-[#FFF8ED] cursor-pointer hover:bg-[#F3E7D4]">
                          <Upload className="w-3.5 h-3.5 text-[#641C2C]" />
                          <span>Choose file</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleQrUpload(e, 'marriage')}
                          />
                        </label>
                        {config.venues.marriage.qrCodeUrl && (
                          <span className="text-[10px] text-[#92967A] block mt-1">Image configured ✓</span>
                        )}
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold mb-1">Reception QR Code</label>
                        <label className="flex items-center gap-1.5 px-3 py-2 border border-[#C4A46A] rounded bg-[#FFF8ED] cursor-pointer hover:bg-[#F3E7D4]">
                          <Upload className="w-3.5 h-3.5 text-[#641C2C]" />
                          <span>Choose file</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleQrUpload(e, 'reception')}
                          />
                        </label>
                        {config.venues.reception.qrCodeUrl && (
                          <span className="text-[10px] text-[#92967A] block mt-1">Image configured ✓</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold mb-1">
                      Admin Token (Required - from ADMIN_UPLOAD_TOKEN)
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Enter administrator token to save changes"
                      value={adminToken}
                      onChange={(e) => setAdminToken(e.target.value)}
                      className="w-full p-2 rounded border border-[#D5C2A5] bg-[#FFF8ED]"
                    />
                  </div>

                  {saveStatus && (
                    <div className="p-2 rounded bg-[#F7EEDA] text-[#7B263A] text-xs font-semibold flex items-center gap-1.5">
                      <Check className="w-4 h-4" />
                      <span>{saveStatus}</span>
                    </div>
                  )}

                  <div className="pt-4 flex justify-between items-center border-t border-[#C4A46A]/30">
                    <button
                      type="button"
                      onClick={() => setConfig(defaultWeddingConfig)}
                      className="inline-flex items-center gap-1 text-[#92967A] hover:text-[#641C2C] font-cormorant italic text-xs"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Reset to Defaults
                    </button>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setIsCustomizerOpen(false)}
                        className="px-4 py-1.5 rounded-full border border-[#D5C2A5] text-[#39302E] font-cinzel text-xs uppercase"
                      >
                        Close
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-1.5 rounded-full bg-[#641C2C] text-[#FFF8ED] hover:bg-[#7B263A] font-cinzel text-xs uppercase font-semibold"
                      >
                        Save Details
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
