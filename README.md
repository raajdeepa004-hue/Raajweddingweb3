# An Eternal Love Letter — Cinematic Luxury Indian Wedding Invitation

An award-winning, production-grade interactive Indian wedding invitation website set in an enchanted maroon garden. Built with React, TypeScript, Three.js (WebGL), Tailwind CSS, Express, and MongoDB Atlas with GridFS.

---

## Visual Concept & Features

- **Brand Palette**: Deep Maroon (`#641C2C`), Burgundy (`#7B263A`), Dark Wine (`#43121F`), Warm Ivory (`#FFF8ED`), Parchment Cream (`#F3E7D4`), and Antique Gold (`#C4A46A`).
- **Page 1 — The Sealed Invitation**: Handcrafted ivory envelope with realistic paper grain, 3D folded flaps, embossed monogram wax seal (`RH`), and authentic opening animation.
- **Page 2 — The Enchanted Garden / Welcome**: Procedural 3D WebGL trees swaying with natural wind, sunlit atmosphere, and continuous drifting maroon leaves framing the couple's solemn blessing.
- **Page 3 — Our Story & Wedding Timeline**: Four chronological milestones:
  1. **We Met** — 26 June 2026
  2. **Engagement** — 30 August 2026
  3. **Marriage** — 16 November 2026
  4. **Our Reception** — 22 November 2026 *(Contains the only interactive heart-shaped scratch card with touch/mouse erasing, threshold auto-reveal, and celebration sparkles)*
- **Page 4 — Venue & Directions**: Refined location cards for Marriage Ceremony (`Level 9, Sky Garden By Diva`) and Reception (`Dewan Serbaguna Kaum India Daerah Tangkak`) with Google Maps links and QR code scan frames.
- **Page 5 — Big Day Countdown & Farewell**: Live real-time countdown to 22 November 2026 in `Asia/Kolkata` timezone with emotional farewell and couple monogram.
- **Background Music Controller**: Persistent luxury audio widget with procedural Web Audio ambient synthesizer fallback (no 404 dependencies!).

---

## 1. Project Installation

```bash
# Clone repository
git clone <your-repo-url>
cd wedding-invitation

# Install dependencies
npm install
```

---

## 2. Local Development

```bash
# Run local full-stack development server on port 3000
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 3. MongoDB Atlas Free Setup Instructions

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and register for a free account.
2. Create a new **M0 Free Cluster** in your preferred region.
3. Under **Database Access**, create a database user (e.g. `wedding_admin`) with password authentication.
4. Under **Network Access**, add an IP Access List entry:
   - For universal hosting / serverless: allow `0.0.0.0/0` (Allow Access from Anywhere).
5. In your cluster dashboard, click **Connect** -> **Connect your application** (Drivers: Node.js).
6. Copy the connection URI string.

---

## 4. Environment Variables Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Set the following variables:

```ini
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority"
MONGODB_DB="wedding_invitation"
ADMIN_UPLOAD_TOKEN="your_secure_random_admin_token"
```

*Note: Public invitation reads fall back to the bundled defaults when MongoDB is unavailable. Persistent configuration and media uploads require both `MONGODB_URI` and `ADMIN_UPLOAD_TOKEN`; the server rejects writes when either is missing.*

---

## 5. How to Add Your Background Music File

1. Place your MP3 audio file into:
   ```
   public/audio/wedding-song.mp3
   ```
2. The music controller will automatically play your audio file when guests tap **Open Invitation** or the play button.
3. If no file is added, the invitation automatically plays its procedural ambient harmonized chimes.

---

## 6. How to Upload or Reference Venue QR Codes

1. Open the invitation and click the **Customize** gear icon in the bottom-left corner.
2. Under **QR Code Images**, upload your QR code image files for Marriage or Reception.
3. Enter your `ADMIN_UPLOAD_TOKEN` and click **Save Details**.
4. The image is stored in MongoDB GridFS and rendered in high resolution for phone scanning.

---

## 7. How to Replace Wedding Placeholders

All wedding details are centrally configured in:
```
src/config/wedding.ts
```

You can customize:
- Groom and bride names, honorifics, and parents
- Monogram letters
- Milestone descriptions
- Venue names, addresses, auspicious timings, and Google Maps links
- Countdown date and timezone (`Asia/Kolkata`)
- Farewell text

---

## 8. Deploying to Vercel

1. Commit and push your code to your GitHub repository:
   ```bash
   git add .
   git commit -m "feat: complete luxury indian wedding invitation"
   git push origin main
   ```
2. Go to [Vercel](https://vercel.com) and click **Add New** -> **Project**.
3. Select your GitHub repository.
4. Under **Environment Variables**, add:
   - `MONGODB_URI`
   - `MONGODB_DB`
   - `ADMIN_UPLOAD_TOKEN`
5. Keep the default Vite build settings, or set **Build Command** to `npm run build` and **Output Directory** to `dist`.
6. Click **Deploy**. Vercel serves the Vite frontend and the protected API from `api/[...path].ts`.

---

## 9. Troubleshooting & FAQ

- **WebGL on older phones**: The website automatically detects WebGL capabilities. If unsupported, it gracefully falls back to CSS-animated petals and botanical frames without crashing.
- **Audio Autoplay**: Modern mobile browsers block audio autoplay until a direct user gesture. Tapping the wax seal counts as the required gesture and initiates music smoothly.
- **Scratching on Mobile**: Touch gestures are captured using HTML5 Pointer Events and touch action isolation (`touch-none`), ensuring smooth scratching without accidental page scrolling.
