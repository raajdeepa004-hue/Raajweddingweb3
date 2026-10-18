# Implementation Plan: "Our Moments" Revolving Door Polaroid Gallery

An exquisite, interactive "Our Moments" gallery section placed seamlessly between the Welcome section and Our Story timeline, showcasing 3 polaroids with romantic handwritten captions and a physical 3D revolving-door transition.

## User Review & Critical Decisions

> [!IMPORTANT]
> The specifications confirmed from your clarifying responses have been incorporated into this architectural plan:
> - **Display Mode**: Show 1 polaroid at a time revolving through all 3 uploaded photos with authentic depth and physical 3D rotation.
> - **Captions**: Short, playful love notes celebrating your memories inscribed on the lower white margin of each polaroid.
> - **Interactions**: Continuous auto-revolving with pause on hover/touch, plus manual arrow buttons, indicator dots, and drag/swipe support.
> - **Placement**: Inserted naturally between the Welcome & Blessing section (Section 2) and the Our Story & Timeline section (Section 3).

---

## 1. Overview & Core Concept

- **What It Does**: Presents a bespoke, nostalgic photo gallery section titled **"Our Moments"** that blends into "An Eternal Love Letter". Guests experience an authentic 3D revolving-door animation where each photo turns gracefully on its vertical axis to reveal the next memory, framed in a tactile polaroid border with gentle paper grain, subtle tape/pin accents, and warm handwritten descriptions.
- **Target Audience / Persona**: Wedding guests, close friends, and family viewing the luxury wedding invitation on mobile phones, tablets, and desktops.
- **Key Value**: Deepens the emotional connection of the invitation by giving guests a personal glimpse into the couple's joyful memories and shared smiles, without disrupting the continuous enchanted garden experience.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Vertical Journey**: As guests scroll down from the Welcome & Blessing garden section, the camera and background leaves flow smoothly into the **"Our Moments"** section.
2. **Revolving Door Experience**: A central polaroid frame rests at a gentle artistic tilt ($ -1^\circ $ to $ +1.5^\circ $). It automatically begins a smooth, measured revolving-door rotation every 4.5 seconds.
3. **Hover & Touch Pause**: Hovering the cursor over the polaroid or touching it on mobile smoothly pauses the rotation so guests can read the caption and admire the photo.
4. **Manual Navigation**: Subtle gold-trimmed arrow buttons (`‹` and `›`) on either side and 3 refined ivory-and-gold pagination dots allow guests to jump directly to any memory.
5. **Fluid Continuity**: Scrolling further down leads effortlessly into "Our Story & Wedding Timeline" with the heart-shaped scratch card.

### Visual Identity & Theme
- **Aesthetic Direction**: Nostalgic luxury stationery meets warm editorial romance.
- **Color Palette & Tokens**:
  - Dominant Canvas: Warm ivory (`#FFF8ED`) and parchment cream (`#F3E7D4`)
  - Primary Accents: Deep maroon (`#641C2C`), burgundy (`#7B263A`), antique gold (`#C4A46A`)
  - Typography Colors: Warm charcoal (`#39302E`) and deep wine (`#43121F`)
- **Typography & Hierarchy**:
  - Section Kicker: Cinzel uppercase tracking (`0.3em`) in antique gold (`#C4A46A`)
  - Section Heading: Cinzel serif (`2rem`–`2.5rem`) in deep maroon (`#641C2C`)
  - Section Subtitle: Cormorant Garamond italic in warm charcoal
  - Polaroid Captions: Playful, heartfelt handwritten script pairing (`font-cormorant italic` with curated font weight and natural letter-spacing) resembling real pen ink on photographic paper
- **Polaroid Geometry & Texture**:
  - Authentic photo aspect ratio (square/4:3 image with classic extended bottom chin).
  - Multi-layered drop shadows (`parchment-shadow` with soft warm gold ambient occlusion).
  - Subtle top corner washi tape or gold leaf corner motif holding the memory in place.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: 3D Revolving Door Mechanism (CSS 3D Transforms with `perspective`)**
  - *Chosen Approach*: Implement a customized 3D revolving-door cylinder container with `perspective: 1200px`, `transform-style: preserve-3d`, and smooth 3D axis rotation (`rotateY`).
  - *Why*: Provides a physical, cinematic feel that matches the physical envelope opening in Section 1, while maintaining 60fps hardware acceleration on all mobile devices and laptops without WebGL particle overhead.
  - *Alternatives Considered*: Flat opacity crossfade (felt too generic and missed the revolving door request) or full Three.js mesh texture mapping (unnecessary overhead for photographic presentation).
- **Decision 2: Image Storage & Resolution**
  - *Chosen Approach*: Move the 3 user-provided engagement images from the temporary storage directory into `/public/images/` as `moment_1.webp`, `moment_2.webp`, and `moment_3.webp` (with high-res JPG fallback) and configure them cleanly inside `src/config/wedding.ts`.
  - *Why*: Ensures instant, resilient loading on Vercel deployment with zero broken image links and clean centralized configuration for future updates.
- **Decision 3: Navigation Integration**
  - *Chosen Approach*: Update `SectionProgressNav.tsx` to include "Our Moments" as step 02 between Welcome and Story, updating the total steps to 5 sections seamlessly.

---

## 4. Technical Architecture & Data Strategy

### Component Hierarchy & Interaction Flow

```
┌─────────────────────────────────────────────────────────────┐
│                          App.tsx                            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         EnchantedGardenCanvas (Global Three.js)       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  [Section 1] SealedEnvelope (Initial closed state)          │
│  [Section 2] GardenWelcome (Welcome & Blessing)             │
│                                                             │
│  [Section 3 NEW] OurMomentsGallery                          │
│   ├── Section Header (Kicker, Cinzel Title, Subtitle)       │
│   ├── 3D Revolving Door Stage (Perspective container)       │
│   │    └── Polaroid Card (Active moment)                    │
│   │         ├── High-fidelity couple photo                  │
│   │         ├── Authentic paper border & texture            │
│   │         └── Playful handwritten love note caption       │
│   ├── Navigation Affordances                                │
│   │    ├── Prev / Next Gold Arrow Buttons                   │
│   │    └── 3 Segmented Indicator Dots                       │
│   └── Auto-Rotation Timer Hook (with pause on hover/touch)  │
│                                                             │
│  [Section 4] WeddingTimeline (Love Story & Scratch Card)    │
│  [Section 5] VenueDetails (Hotel Aadithya Reception)        │
│  [Section 6] CountdownFarewell (Reception countdown)        │
│                                                             │
│  SectionProgressNav (Updated with "Our Moments" dot)        │
│  MusicController (Persistent audio)                         │
└─────────────────────────────────────────────────────────────┘
```

### Data Model Extension (`src/config/wedding.ts`)
```typescript
export interface CoupleMoment {
  id: string;
  imageSrc: string;
  alt: string;
  caption: string;
  tagline: string;
  dateOrMemory?: string;
}

// In WeddingConfig:
moments: CoupleMoment[];
```

### Playful Captions for the 3 Memories
1. **Photo 1**: *"Every laugh begins with you. From quiet smiles to stolen glances."*
2. **Photo 2**: *"Hand in hand, building a lifetime of giggles, late-night talks, and endless love."*
3. **Photo 3**: *"Here’s to our favorite chapter yet—getting ready to dance into forever!"*

### Interactive Handlers & Lifecycle
- `handleNext()`: Rotates forward with positive angle increment and subtle perspective depth.
- `handlePrev()`: Rotates backward with negative angle increment.
- `handleSelect(index)`: Directly animates to the chosen index.
- `onMouseEnter` / `onMouseLeave` & `onTouchStart` / `onTouchEnd`: Safely pauses and resumes the auto-play timer.
- Keyboard accessibility: Left and Right arrow key support when the gallery is in view.
