import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Disc3, Volume2, VolumeX, X } from 'lucide-react';
import { WeddingConfig } from '../../config/wedding';

interface MusicControllerProps {
  config: WeddingConfig;
  shouldAutoStartOnOpen?: boolean;
}

export const MusicController: React.FC<MusicControllerProps> = ({
  config,
  shouldAutoStartOnOpen = false,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSynthFallbackActive, setIsSynthFallbackActive] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthTimerRef = useRef<number | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  const isMutedRef = useRef<boolean>(false);

  // Procedural Web Audio API Ambient Indian Wedding Music Synthesizer
  // Used gracefully when /audio/wedding-song.mp3 is not present
  const playProceduralAmbientChord = useCallback(() => {
    if (!audioCtxRef.current || !isPlayingRef.current || isMutedRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Raag Yaman / Bhupali inspired warm pentatonic frequencies (Sa Re Ga Pa Dha)
    // Root D: D3(146.83), F#3(185.0), A3(220.0), B3(246.94), D4(293.66), E4(329.63), F#4(369.99), A4(440.0)
    const notes = [146.83, 185.0, 220.0, 246.94, 293.66, 329.63, 369.99, 440.0];
    const pickedNote = notes[Math.floor(Math.random() * notes.length)];

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Sitar / Tanpura like harmonic overtone warmth
    osc.type = Math.random() > 0.5 ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(pickedNote, ctx.currentTime);

    const now = ctx.currentTime;
    const duration = 4.5 + Math.random() * 3.0;

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.045, now + 1.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.1);

    // Schedule next note in sequence
    const nextInterval = (1.8 + Math.random() * 2.2) * 1000;
    synthTimerRef.current = window.setTimeout(playProceduralAmbientChord, nextInterval);
  }, []);

  const startProceduralSynth = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      setIsSynthFallbackActive(true);
      playProceduralAmbientChord();
    } catch {
      // AudioContext unavailable
    }
  }, [playProceduralAmbientChord]);

  const stopProceduralSynth = useCallback(() => {
    if (synthTimerRef.current) {
      clearTimeout(synthTimerRef.current);
      synthTimerRef.current = null;
    }
  }, []);

  // Initialize Audio element
  useEffect(() => {
    const audio = new Audio(config.audio.audioSrc);
    audio.loop = true;
    audio.volume = config.audio.defaultVolume;
    audioRef.current = audio;

    // Graceful error listener if audio file is missing
    const handleError = () => {
      // Audio file not present or failed to load; smoothly switch to Web Audio ambient mode
      if (isPlayingRef.current) {
        startProceduralSynth();
      }
    };
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = '';
      stopProceduralSynth();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, [config.audio.audioSrc, config.audio.defaultVolume, startProceduralSynth, stopProceduralSynth]);

  // Handle play/pause
  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (isPlaying) {
      isPlayingRef.current = false;
      setIsPlaying(false);
      if (audio) audio.pause();
      stopProceduralSynth();
    } else {
      isPlayingRef.current = true;
      setIsPlaying(true);
      if (audio) {
        try {
          await audio.play();
        } catch {
          // If native audio file fails (e.g. 404 or policy), use procedural ambient synth!
          startProceduralSynth();
        }
      } else {
        startProceduralSynth();
      }
    }
  }, [isPlaying, startProceduralSynth, stopProceduralSynth]);

  // Handle auto-start on envelope open user gesture
  useEffect(() => {
    if (shouldAutoStartOnOpen && !isPlaying) {
      togglePlay();
    }
  }, [shouldAutoStartOnOpen, isPlaying, togglePlay]);

  useEffect(() => {
    if (!isDrawerOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDrawerOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen]);

  // Handle mute toggle
  const toggleMute = () => {
    const audio = audioRef.current;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    isMutedRef.current = nextMuted;
    if (audio) {
      audio.muted = nextMuted;
    }
  };

  return (
    <aside
      className="music-controller fixed z-40"
      aria-label="Background music controls"
    >
      <div
        id="music-drawer-panel"
        className={`music-drawer-panel ${isDrawerOpen ? 'music-drawer-panel--open' : ''}`}
        aria-hidden={!isDrawerOpen}
      >
        <div className="music-drawer-header">
          <div className="music-drawer-heading">
            <Disc3
              className={`music-disc-icon music-disc-icon--panel ${isPlaying ? 'music-disc-icon--spinning' : ''}`}
              aria-hidden="true"
            />
            <div className="music-drawer-copy">
              <span className="font-cinzel text-[10px] tracking-wider uppercase font-bold text-[#641C2C] truncate">
                {config.audio.title}
              </span>
              <span className="font-cormorant italic text-[11px] text-[#92967A] truncate">
                {isSynthFallbackActive ? 'Harmonic Chimes' : config.audio.artist}
              </span>
            </div>
          </div>

          <div className="music-drawer-actions">
            {isPlaying && (
              <button
                type="button"
                onClick={toggleMute}
                className="music-drawer-mute"
                aria-label={isMuted ? 'Unmute music' : 'Mute music'}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="music-drawer-close"
              aria-label="Close music controls"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setIsDrawerOpen((isOpen) => !isOpen)}
        className="music-drawer-trigger"
        aria-expanded={isDrawerOpen}
        aria-controls="music-drawer-panel"
        aria-label={isDrawerOpen ? 'Close music controls' : 'Open music controls'}
        title={isDrawerOpen ? 'Close music controls' : 'Open music controls'}
      >
        <Disc3
          className={`music-disc-icon ${isPlaying ? 'music-disc-icon--spinning' : ''}`}
          aria-hidden="true"
        />
        <span className="sr-only">
          {isDrawerOpen ? 'Close music controls' : 'Open music controls'}
        </span>
      </button>
    </aside>
  );
};
