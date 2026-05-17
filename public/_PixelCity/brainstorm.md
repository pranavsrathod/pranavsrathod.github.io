# Pixel City — Mumbai Street Portfolio Redesign
### README & Reference Document
**Branch:** `pixel-city-redesign` (forked from `astro`)

---

## 1. Project Overview

A complete redesign of `pranavrathod.com`'s landing page. The homepage is replaced with a fully interactive **16-bit pixel art South Mumbai street scene**. The city IS the navigation — every prop on the street links to a section of the existing Astro site. The existing site (blog, projects, about etc.) remains completely untouched underneath.

---

## 2. Core Concept

> No nav bar. No hero text. No personal photo. Just a Mumbai street that invites you to explore.

Visitors land on a wide pixel art street scene. Every building, stall and character on the street is a clickable navigation element. Hovering reveals a tooltip, clicking navigates. The most distinctive interaction — clicking the Wada Pav stall — triggers a newspaper unwrap animation that reveals the contact card.

---

## 3. Visual Identity & Aesthetic

### Overall Style
- **Art form:** 16-bit pixel art
- **Perspective:** Flat front-facing view (side-scroller style)
- **Pixel density:** Consistent across all assets — matching Chrono Trigger / Final Fantasy VI environmental prop style
- **Outlines:** Black 1px outlines on all assets
- **Dithering:** Heavy dithering on shadows, light and depth
- **Color palette:** 32 colors per prop, 32-48 for background
- **Text on props:** None — props communicate through visual identity only
- **No Figma** — everything built directly in code

### Reference Style
The Tokyo pixel art street scene (dense layered buildings, organic details, lived-in feel) adapted to **South Mumbai Art Deco** architecture:
- Ornate geometric Art Deco building facades
- Curved balconies, arched windows
- Weathered plaster walls in faded yellows, greens, terracotta
- Dense power lines strung between buildings
- Overgrown vines on brick walls
- Crows sitting on power lines
- Auto rickshaws, BEST buses in the distance
- Potted plants on balconies
- Cracked plaster, moss, water stains

### Typography (existing site — unchanged)
- **Serif:** Newsreader Variable
- **Sans:** Inter Variable
- **Equations:** KaTeX

### Color Scheme (existing site — unchanged)
- Light mode: `#f2f1ec` warm off-white, `#171717` text
- Dark mode: `#152039` deep navy, `#f2f1ec` text
- Accent / hover glow: `#FF3B3B` neon red (matches PR logo)

---

## 4. Day / Night Duality

The scene exists in two complete versions tied to the site's existing light/dark mode toggle:

| | Light Mode | Dark Mode |
|---|---|---|
| Time | Bright midday | Night |
| Sky | Clear blue, vivid | Deep navy, pixel stars, crescent moon |
| Lighting | Harsh sunlight, deep sharp shadows | Warm amber street lamps, neon reflections |
| Ground | Dry pavement, vivid colors | Wet cobblestone, neon color bleeds |
| Mood | Energetic, vivid, South Mumbai midday | Moody, warm, atmospheric night |

Toggling light/dark mode swaps every prop and the background simultaneously between their day and night versions.

---

## 5. Street Layout

```
[Bulletin] [Chaiwala] [Garage] [SPRITE] [Photographer] [Wada Pav] [Office] [Billboard]
───────────────────────────────────────────────────────────────────────────────────────
                                   PAVEMENT
───────────────────────────────────────────────────────────────────────────────────────
                                     ROAD
```

- Background city image = atmosphere only (buildings, sky, road, depth)
- Props = individually generated images, absolutely positioned, bottom-aligned to pavement
- Sprite = centered, interactive, highest z-index

---

## 6. Props, Assets & Navigation

### 🌆 City Background
Pure atmospheric backdrop — South Mumbai Art Deco buildings at multiple depths, power lines, water tanks, vines, crows, auto rickshaw in distance. Foreground pavement completely empty (props layered on top in code).

- **Day:** Bright midday, clear blue sky, vivid colors, harsh shadows
- **Night:** Deep navy sky, wet reflective road, amber street lamp pools, neon color bleeds
- **Format:** Wide 3:1 aspect ratio, seamless horizontal composition
- **Status:** Day ✅ | Night ❌

---

### 🚶 Pranav Sprite
**Links to:** `/about`

The sprite IS the About page. A pixel art version of Pranav standing casually on the pavement — smart casual (collared shirt with sleeves rolled up, slim chinos, clean sneakers), hands in pockets, looking directly at the viewer. South Asian, short neat dark hair, warm brown skin.

- **Day:** Harsh midday shadow beneath feet on dry pavement
- **Night:** Warm amber street lamp pool of light from above, wet cobblestone reflection below
- **Hover:** Red neon glow + "About Me" tooltip
- **Click:** Navigates to `/about`
- **Status:** Day ❌ | Night ❌

---

### 🔧 Garage Workshop
**Links to:** `/projects`

A South Mumbai garage tucked into the ground floor of an Art Deco building. Rolling metal shutter half open revealing workbench with blueprints, tools on pegboard, desk fan, bamboo scaffolding on the side of the building with a rolled blueprint tucked in.

- **Day:** Harsh sunlight flooding into dark interior, oil stains on dry concrete floor
- **Night:** Warm yellow light spilling onto wet cobblestone, cyan blueprint glow, sparks near the floor, flickering fluorescent bulb
- **Hover:** Red neon glow + "Projects" tooltip
- **Click:** Navigates to `/projects`
- **Status:** Day ✅ | Night ❌

---

### ☕ Chaiwala + Newspaper Stall
**Links to:** `/blog`

A chaiwala and newspaper combo stall against an Art Deco wall. Steaming aluminum kettle on gas stove, rows of cutting chai glasses, newspapers and magazines clipped to a wire above, striped canvas awning, biscuit packets on a shelf.

- **Day:** Bright midday, steam rising, deep shadow under awning, scattered newspaper pages on ground
- **Night:** Single bare bulb hanging from wire casting warm yellow pool, gas flame glowing blue-orange, chai glasses glowing amber
- **Hover:** Red neon glow + "Blog" tooltip
- **Click:** Navigates to `/blog`
- **Status:** Day ✅ | Night ❌

---

### 📷 Street Photographer
**Links to:** `photos.pranavrathod.com`

A young man crouched low on the pavement, camera held up to his eye, camera strap hanging loose, camera bag open beside him with spare lens visible, pigeons nearby.

- **Day:** Harsh midday shadow beneath him on dry pavement, Art Deco column visible behind
- **Night:** Camera flash firing — sharp white burst illuminating surrounding wet ground, dramatic shadow thrown behind
- **Hover:** Red neon glow + "Photos" tooltip
- **Click:** Opens `photos.pranavrathod.com` in new tab
- **Special:** Camera shutter animation on click before tab opens
- **Status:** Day ✅ | Night ❌

---

### 🌶️ Wada Pav Stall
**Links to:** Contact overlay (see Section 7)

A tiny hole-in-the-wall Wada Pav stall tucked between two Art Deco buildings. Narrow opening, worn wooden counter, stack of Wada Pavs wrapped in newspaper, pots of green and red chutney.

- **Day:** Canvas tarp overhead casting harsh deep shadow, bright vivid exterior, flies near food
- **Night:** Kerosene lamp glowing warm inside dark interior, chutney pots catching lamp light
- **Hover:** Red neon glow
- **Click:** Triggers Newspaper Contact Overlay
- **Status:** Day ✅ | Night ✅

---

### 🍢 Chaat Stall (Night only)
**Links to:** Contact overlay (same interaction as Wada Pav)

A hole-in-the-wall chaat stall, slightly wider than the Wada Pav stall. Pani puri shells stacked, steel cups of pani, tray of toppings, large pot of pani puri water with ladle, vendor hands partially visible, string of small yellow festival bulbs above.

- **Night:** Yellow bulb string glowing festive warm, wet ground reflecting bulbs, steam rising from pani pot
- **Status:** Night ❌

---

### 📌 Bulletin Board
**Links to:** `/tags`

A large wooden bulletin board mounted on a post, completely covered in overlapping pinned papers, torn flyers, photographs and notes in various colors. Cork texture visible in gaps.

- **Day:** Harsh midday light, deep shadows between layered papers
- **Night:** Single overhead lamp illuminating board, papers casting small shadows
- **Hover:** Red neon glow + "Tags" tooltip
- **Click:** Navigates to `/tags`
- **Status:** Day ❌ | Night ❌

---

### 🏢 Office Building
**Links to:** Resume PDF

A mid-rise Art Deco office building. Grid of windows, revolving door entrance at street level, stone facade. One upper floor window warmly lit — silhouette of papers on a desk visible inside.

- **Day:** Warm sunlight on facade, most windows reflecting sky
- **Night:** Most windows dark, one window glowing warm with desk lamp
- **Hover:** Red neon glow + "Resume" tooltip
- **Click:** Opens Resume PDF in new tab
- **Status:** Day ❌ | Night ❌

---

### 🏙️ Billboard Building
**Links to:** Featured Projects

The tallest building on the street. Large rooftop billboard with a blank rectangular display face framed by lightbulbs — featured project content overlaid dynamically from Astro MDX content collections.

- **Day:** Clean bright billboard face, warm sunlight
- **Night:** Billboard glowing, lightbulb frame lit, color casting down onto rooftop
- **Hover:** Red neon glow + "Featured Projects" tooltip
- **Click:** Navigates to featured projects
- **Status:** Day ❌ | Night ❌

---

## 7. The Wada Pav Contact Overlay

The signature interaction of the entire site.

### What is a Wada Pav?
A deep-fried spiced potato patty stuffed in a soft bread roll, smeared with green and red chutneys, sometimes with a fried green chilli on the side. Mumbai's most iconic street food — cheap, eaten by everyone, sold on every corner. Always served wrapped in a torn piece of newspaper. That newspaper detail is the inspiration for this interaction.

### The Interaction Flow
```
1. Visitor clicks the Wada Pav stall (day) 
   or Chaat stall (night)

2. Full screen dark overlay fades in

3. Pixel art image appears center screen:
   A fresh Wada Pav sitting on an unfolded 
   Indian newspaper spread flat

4. Right side of newspaper shows contact card:

   ┌─────────────────────────────┐
   │  CONTACT ME                 │
   │  ─────────────────────────  │
   │  ✉  pranavdev@duck.com      │
   │  in linkedin/pranavsrathod  │
   │  ⌥  github/pranavsrathod    │
   └─────────────────────────────┘

5. Each icon row is a clickable hotspot
   Hover → red neon glow box around that row
   Click → opens email / LinkedIn / GitHub

6. Click anywhere outside overlay → closes
```

### The Contact Card Image Spec
- 16-bit pixel art style — strictly pixel art, no painterly textures
- Wada Pav positioned slightly left of center on the spread newspaper
- Pav bun open, golden batata vada visible inside, two fried green chillies beside it
- Newspaper beneath slightly crumpled, fake illegible pixel text columns throughout
- Classified ad box on right with clean single pixel border
- Slightly yellowed tint on ad box distinguishing it from rest of newspaper
- Pixel envelope icon for email, pixel 'in' square for LinkedIn, pixel octocat for GitHub

### Potential Enhancement (deferred — Phase 4)
A pixelated 3D animation of the newspaper physically crumpling open — low-poly pixel aesthetic, real fold geometry — rather than a flat 2D CSS unfold. Potential collaboration with an animator friend.

---

## 8. Interaction Design

### Universal Hover State
```css
.prop-wrapper:hover .prop-img {
  filter: drop-shadow(0 0 6px #FF3B3B)
          drop-shadow(0 0 12px #FF3B3B);
}

.prop-tooltip {
  background: #0a0a0a;
  color: #FF3B3B;
  border: 1px solid #FF3B3B;
  font-family: monospace;
  font-size: 11px;
  padding: 4px 8px;
}
```

### Click Behaviours
| Prop | Click Action |
|---|---|
| Sprite | Navigate to `/about` |
| Garage | Navigate to `/projects` |
| Chaiwala | Navigate to `/blog` |
| Photographer | Open `photos.pranavrathod.com` new tab |
| Wada Pav / Chaat | Trigger contact overlay |
| Bulletin board | Navigate to `/tags` |
| Office building | Open Resume PDF new tab |
| Billboard | Navigate to featured projects |

---

## 9. Micro Animations (Deferred — Phase 4)

| Prop | Animation |
|---|---|
| Chaiwala kettle | Steam rising pixel particles |
| Chaiwala gas flame | Blue-orange color flicker |
| Chaiwala bare bulb (night) | Warm pulse brightness |
| Garage sparks (night) | Pixel particle scatter near floor |
| Garage bulb (night) | Flicker cycle |
| Photographer (night) | Camera flash fires every few seconds |
| Wada Pav (day) | Flies lazily circling food |
| Chaat bulbs (night) | Festive warm flicker |
| Sprite | Idle breathing loop |

---

## 10. Technical Architecture

### Stack
- **Framework:** Astro
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript
- **Content:** MDX content collections (unchanged)
- **City page:** Pure HTML + CSS + vanilla JS

### File Structure
```
src/
  pages/
    index.astro              ← New pixel city landing page
    home.astro               ← Current homepage moved here
  components/
    PixelCity.astro          ← Main city scene component
    ContactOverlay.astro     ← Wada Pav newspaper overlay

public/
  pixel-city/
    backgrounds/
      city-day.png
      city-night.png
    props/
      garage-day.png         garage-night.png
      chaiwala-day.png       chaiwala-night.png
      photographer-day.png   photographer-night.png
      wadapav-day.png        wadapav-night.png
      chaat-night.png
      sprite-day.png         sprite-night.png
      bulletin-day.png       bulletin-night.png
      office-day.png         office-night.png
      billboard-day.png      billboard-night.png
    contact/
      newspaper-contact.png
```

### Layer System
```
Layer 4 → Tooltips + hover states (CSS)
Layer 3 → Sprite (z-index: 30)
Layer 2 → Props (z-index: 20, bottom-aligned to pavement line)
Layer 1 → City background image (z-index: 10)
Layer 0 → Page background color
```

### Day / Night Switching
```javascript
// Tied to existing ThemeToggle.astro
// Each prop has data-day and data-night src attributes
// JS swaps all prop src attributes on theme change

document.addEventListener('themeChange', () => {
  const isDark = document.documentElement.classList.contains('dark')
  document.querySelectorAll('.prop').forEach(prop => {
    prop.src = isDark ? prop.dataset.night : prop.dataset.day
  })
})
```

### Responsive Behaviour
| Breakpoint | Behaviour |
|---|---|
| Desktop (lg+) | Full wide scene, all props visible |
| Tablet (md) | Scene scales down proportionally |
| Mobile (sm) | Horizontal scroll, 2-3 props visible at a time |

---

## 11. Asset Generation

All assets generated via ChatGPT DALL-E or Midjourney.

### Style Anchor (appended to every prompt)
> "16-bit pixel art, flat front-facing perspective, black 1px outlines, limited palette of 32 colors, dithering on shadows, transparent background, style reference: Chrono Trigger / Final Fantasy VI environmental props. No text, no signs, no labels."

### Consistency Rule
Upload the garage workshop sprite as a style reference when generating every new prop — locks in pixel density, outline weight and dithering style across all assets.

### Asset Status
| Asset | Day | Night |
|---|---|---|
| City background | ✅ | ❌ |
| Garage / Projects | ✅ | ❌ |
| Chaiwala / Blog | ✅ | ❌ |
| Photographer / Photos | ✅ | ❌ |
| Wada Pav / Contact | ✅ | ✅ |
| Chaat stall / Contact night | — | ❌ |
| Sprite / About | ❌ | ❌ |
| Bulletin board / Tags | ❌ | ❌ |
| Office building / Resume | ❌ | ❌ |
| Billboard / Featured | ❌ | ❌ |
| Newspaper contact card | ❌ | — |

---

## 12. Build Phases

### Phase 1 — Core Scene (Current focus)
- [ ] `PixelCity.astro` component
- [ ] City background layered
- [ ] Existing day props positioned on street
- [ ] Hover glow on all props
- [ ] Click navigation working
- [ ] Day / night asset swap tied to theme toggle

### Phase 2 — Contact Overlay
- [ ] `ContactOverlay.astro` component
- [ ] Newspaper contact card image
- [ ] Clickable hotspots on email / LinkedIn / GitHub
- [ ] Red neon hover on contact rows
- [ ] Overlay open / close behaviour

### Phase 3 — Remaining Assets
- [ ] All night prop versions
- [ ] Sprite (day + night)
- [ ] Bulletin board (day + night)
- [ ] Office building (day + night)
- [ ] Billboard (day + night)
- [ ] Chaat stall (night)
- [ ] Newspaper contact card image

### Phase 4 — Polish & Animations
- [ ] Mobile horizontal scroll
- [ ] Responsive scaling
- [ ] Micro animations per prop
- [ ] Performance optimization
- [ ] Potential 3D newspaper unwrap animation (collab)

---

## 13. Open Questions

- Does the billboard show live featured project data pulled from MDX content collections dynamically?
- Does the office building open the resume PDF directly or link to a dedicated resume page?
- Does mobile get the full horizontally scrollable scene or a simplified version?
- Is the sprite's idle state fully static or a subtle CSS breathing loop?
- Does the 3D newspaper unwrap animation happen — and is it a collaboration?

---

## 14. What Stays Unchanged

Everything below the landing page is completely untouched:

- All `.md` and `.mdx` content files
- All Astro content collections (blog, projects, pages)
- `InteractiveDashboard.astro` component
- All project and blog page layouts
- `site-config.ts`
- Global CSS and typography
- KaTeX equation rendering
- RSS feed, sitemap, tags system

The pixel city is purely a new front door into the existing site.

---

*Branch: `pixel-city-redesign` | Forked from: `astro`*  
*Site: `pranavrathod.com`*