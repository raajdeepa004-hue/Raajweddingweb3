/**
 * Centralized Wedding Configuration
 * An Eternal Love Letter in a Maroon Enchanted Garden
 * 
 * Edit this configuration to update names, dates, venues, links, and text.
 * All dates strictly follow the master prompt requirements.
 */

export interface VenueInfo {
  title: string;
  eventName: string;
  dateFormatted: string;
  dayFormatted: string;
  isoDate: string; // YYYY-MM-DD
  timeFormatted: string;
  venueName: string;
  venueAddress: string;
  googleMapsUrl: string; // Leave empty if not yet configured
  qrCodeUrl: string;     // URL or /api/media/:id for scanned QR code; empty shows elegant placeholder
  notes?: string;
}

export interface WeddingMilestone {
  id: string;
  title: string;
  dateFormatted: string;
  isoDate: string;
  dayFormatted: string;
  description: string;
  isScratchCard?: boolean;
}

export interface CoupleMoment {
  id: string;
  imageSrc: string;
  alt: string;
  caption: string;
  tagline: string;
  dateOrMemory?: string;
}

export interface WeddingConfig {
  couple: {
    groomName: string;
    groomHonorific: string;
    groomParents: string;
    brideName: string;
    brideHonorific: string;
    brideParents: string;
    monogram: string; // e.g. "EA"
  };
  invitation: {
    storyPreamble: string;
    sealInstruction: string;
    headline: string;
    subHeadline: string;
    heartfeltMessage: string;
    familyBlessing: string;
    farewellMessage: string;
    farewellSub: string;
  };
  moments: CoupleMoment[];
  milestones: WeddingMilestone[];
  venues: {
    marriage: VenueInfo;
    reception: VenueInfo;
  };
  countdown: {
    targetIsoDate: string; // 2026-11-22 in Asia/Kolkata
    targetTime: string;    // e.g. "19:30:00"
    timezone: string;      // "Asia/Kolkata"
    eventName: string;
  };
  audio: {
    audioSrc: string;
    title: string;
    artist: string;
    defaultVolume: number;
  };
}

export const defaultWeddingConfig: WeddingConfig = {
  couple: {
    groomName: "Raaj Kumar",
    groomHonorific: "Groom",
    groomParents: "S/o Mr Ananda Rao & Mrs Vijayalakshmi",
    brideName: "Harshavardhini Padmaja",
    brideHonorific: "Bride",
    brideParents: "D/o Mr Vizaianand & Mrs Nalini",
    monogram: "RH",
  },
  invitation: {
    storyPreamble: "A little story, sealed with love",
    sealInstruction: "Tap the seal to open your invitation",
    headline: "An Eternal Love Letter",
    subHeadline: "We invite you to share in the joy of our holy matrimony",
    heartfeltMessage: "“Two souls with but a single thought, two hearts that beat as one. Your presence, prayers, and blessings will make our celebration truly complete.”",
    familyBlessing: "With the loving blessings of our elders, parents, and family members",
    farewellMessage: "See You There",
    farewellSub: "With boundless love, joy, and the dawn of a beautiful forever.",
  },
  moments: [
    {
      id: "moment-1",
      imageSrc: "/images/moments_1.jpg",
      alt: "The Sacred Ring Tray adorned with fresh jasmine, marigold petals, and gold wedding bands",
      caption: "Two rings waiting on a bed of marigolds, ready to seal our eternal promises.",
      tagline: "The Ring Tray",
      dateOrMemory: "Ring Ceremony · Step 01",
    },
    {
      id: "moment-2",
      imageSrc: "/images/moments_2.jpg",
      alt: "Bride with henna decorated hands placing a wedding ring onto the groom's finger",
      caption: "Placing my heart in your hands, bound by love, trust, and endless devotion.",
      tagline: "Groom to Bride",
      dateOrMemory: "Ring Ceremony · Step 02",
    },
    {
      id: "moment-3",
      imageSrc: "/images/moments_3.jpg",
      alt: "Groom gently sliding a sparkling diamond solitaire ring onto the bride's henna-patterned hand",
      caption: "With this ring, I promise to walk beside you through every dawn and starlight.",
      tagline: "Bride to Groom",
      dateOrMemory: "Ring Ceremony · Step 03",
    },
  ],
  milestones: [
    {
      id: "met",
      title: "We Met",
      dateFormatted: "26 June 2026",
      isoDate: "2026-06-26",
      dayFormatted: "Friday",
      description: "A serendipitous glance turned into hours of endless conversation, marking the beginning of our forever.",
      isScratchCard: false,
    },
    {
      id: "engagement",
      title: "Engagement",
      dateFormatted: "30 August 2026",
      isoDate: "2026-08-30",
      dayFormatted: "Sunday",
      description: "Surrounded by blooming flowers and our cherished families, we exchanged rings and promised our tomorrows.",
      isScratchCard: false,
    },
    {
      id: "marriage",
      title: "Marriage Ceremony",
      dateFormatted: "16 November 2026",
      isoDate: "2026-11-16",
      dayFormatted: "Monday",
      description: "Under the sacred mantras and holy fire, we unite our souls in sacred Indian wedding matrimony.",
      isScratchCard: false,
    },
    {
      id: "reception",
      title: "Our Reception",
      dateFormatted: "22 November 2026",
      isoDate: "2026-11-22",
      dayFormatted: "Sunday",
      description: "An evening of laughter, music, feast, and celebration under the starlit sky.",
      isScratchCard: true, // The only scratch card on the entire website
    },
  ],
  venues: {
    marriage: {
      title: "WEDDING CELEBRATION",
      eventName: "Marriage",
      dateFormatted: "16 NOVEMBER 2026",
      dayFormatted: "Monday",
      isoDate: "2026-11-16",
      timeFormatted: "9.00 AM to 9.45 AM",
      venueName: "TMR MAHAL",
      venueAddress: "Tanjore Road, Trichy, Tamil Nadu 620008",
      googleMapsUrl: "https://maps.app.goo.gl/awPVQNewE6DHGWH16?g_st=ig",
      qrCodeUrl: "/images/wedding_location_qr.png",
      notes: "Join us for an amazing and traditional wedding celebration.",
    },
    reception: {
      title: "The Grand Celebration",
      eventName: "Reception & Dinner",
      dateFormatted: "22 November 2026",
      dayFormatted: "Sunday",
      isoDate: "2026-11-22",
      timeFormatted: "6.30 PM onwards",
      venueName: "Hotel Aadithya",
      venueAddress: "Arcot Rd, Vadapalani, Chennai, Tamil Nadu 600026",
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Hotel+Aadithya%2C+Arcot+Rd%2C+Vadapalani%2C+Chennai%2C+Tamil+Nadu+600026",
      qrCodeUrl: "/images/reception_qr.png",
      notes: "Join us for an exquisite dinner feast and evening celebration.",
    },
  },
  countdown: {
    targetIsoDate: "2026-11-22",
    targetTime: "18:30:00",
    timezone: "Asia/Kolkata",
    eventName: "Our Grand Reception",
  },
  audio: {
    audioSrc: "/audio/Ullam%20Paadum-%20Wedding%20Song%20_%202%20States%20_%20Lyrics%20_%20Arjun%20Kapoor,%20Alia%20Bhatt%20-%20(320%20Kbps).mp3",
    title: "Ullam Paadum",
    artist: "Acoustic Sitar & Flute",
    defaultVolume: 0.7,
  },
};
