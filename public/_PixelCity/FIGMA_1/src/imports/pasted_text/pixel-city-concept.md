# Pranav Rathod — Portfolio Redesign (pixel-city-redesign branch)

## Concept

The homepage is an interactive 16-bit pixel art South Mumbai street scene. The city IS the navigation — every prop on the street links to a section of the site. No hero text, no nav bar.

---

## Stack

- Astro + Tailwind CSS v4 + TypeScript + MDX
- Content collections for blog posts and projects (unchanged)
- Pure CSS + vanilla JS for the city scene
- New branch: `pixel-city-redesign` forked from `astro`

---

## Aesthetic

**Style:** 16-bit pixel art, flat front-facing perspective, black 1px outlines, dithering on shadows, limited 32 color palettes. Reference: Chrono Trigger / Final Fantasy VI environmental props.

**Setting:** South Mumbai — Art Deco building facades, dense power lines, overgrown vines, auto rickshaws, crows on wires.

**Two modes tied to light/dark theme toggle:**

| Mode | Time | Vibe |
|---|---|---|
| Light | Bright midday | Harsh sunlight, vivid colors, dry pavements, deep shadows |
| Dark | Night | Warm amber street lamps, wet cobblestone, neon reflections, deep navy sky |

Switching themes swaps every prop between its day and night version simultaneously.

---

## Props & Navigation

| Prop | Links To | Notes |
|---|---|---|
| 🚶 Pranav sprite | `/about` | YOU are the About page. Smart casual, hands in pockets, facing viewer |
| 🔧 Garage workshop | `/projects` | Rolling shutter, blueprints on workbench, bamboo scaffolding |
| ☕ Chaiwala + newspaper stall | `/blog` | Steaming kettle, cutting chai glasses, newspapers on wire |
| 📷 Street photographer | `photos.pranavrathod.com` | Crouching, camera to eye, pigeons, opens new tab |
| 🌶️ Wada Pav stall | Contact overlay | Triggers newspaper unwrap interaction |
| 📌 Bulletin board | `/tags` | Wall-mounted, covered in layered flyers |
| 🏢 Office building | Resume PDF | One warmly lit upper window |
| 🏙️ Billboard building | Featured projects | Blank billboard face, content overlaid dynamically from MDX |

---

## Interaction Language

**All props:**
- Hover → red neon drop-shadow glow + tooltip with destination name
- Click → navigate / trigger interaction
- No text on any prop — tooltips do all the labeling

**Red neon glow hex:** `#FF3B3B` — ties back to the PR logo red

---

## Wada Pav Contact Overlay

The signature interaction. Clicking the Wada Pav stall:

1. Full screen dark overlay fades in
2. Pixel art image appears — fresh Wada Pav sitting on unfolded Indian newspaper
3. Right side of newspaper shows a classified ad:
   - Heading: CONTACT ME
   - ✉ email row (clickable)
   - in LinkedIn row (clickable)
   - ⌥ GitHub row (clickable)
4. Hover over each row → red neon glow highlight box
5. Click outside → closes overlay

Night version: Wada Pav stall becomes a **chaat stall** — same newspaper unwrap interaction.

> The newspaper wrapping is a distinctly Mumbai detail — street food has always been served in newspaper. Here it becomes the contact card.

Potential future enhancement: pixelated 3D animation of crumpled newspaper unfolding (low-poly, pixel aesthetic) — collaboration with animator friend being explored.

---

## Street Layout

```
[Bulletin] [Chaiwala] [Garage] [SPRITE] [Photographer] [Wada Pav] [Office] [Billboard]
───────────────────────────────────────────────────────────────────────────────────────
                              PAVEMENT
───────────────────────────────────────────────────────────────────────────────────────
                                ROAD
```

Props are absolutely positioned, bottom-aligned to the pavement line, layered on top of the background image.

---

## Layer System

```
Layer 4 → Tooltips + hover states
Layer 3 → Sprite (z-index: 30)
Layer 2 → Props (z-index: 20)
Layer 1 → City background image (z-index: 10)
Layer 0 → Page background color
```

---

## Asset Status

| Asset | Day | Night |
|---|---|---|
| City background | ✅ | ❌ |
| Garage / Projects | ✅ | ❌ |
| Chaiwala / Blog | ✅ | ❌ |
| Photographer / Photos | ✅ | ❌ |
| Wada Pav / Contact | ✅ | ✅ |
| Chaat stall / Contact night | ❌ | ❌ |
| Sprite / About | ❌ | ❌ |
| Bulletin board / Tags | ❌ | ❌ |
| Office building / Resume | ❌ | ❌ |
| Billboard / Featured | ❌ | ❌ |
| Newspaper contact card | ❌ | — |

---

## File Structure

```
src/
  pages/
    index.astro           ← New pixel city landing page
    home.astro            ← Current homepage moved here
  components/
    PixelCity.astro       ← Main city scene component
    ContactOverlay.astro  ← Wada Pav newspaper overlay

public/
  pixel-city/
    backgrounds/
      city-day.png
      city-night.png
    props/
      [prop-name]-day.png
      [prop-name]-night.png
    contact/
      newspaper-contact.png
```

---

## Existing Site (unchanged)

- Warm off-white (`#f2f1ec`) light / deep navy (`#152039`) dark
- Newsreader serif + Inter sans-serif typography
- Max-width 3xl centered column
- Content collections: blog, projects, pages
- `InteractiveDashboard.astro` component used across project/blog MDX files
- All `.md` / `.mdx` content files untouched by this redesign

---

## Build Phases

- **Phase 1** — Core scene: background + existing props + hover + click + day/night swap
- **Phase 2** — Contact overlay: newspaper image + hotspots + open/close
- **Phase 3** — Remaining assets: all night versions + sprite + missing props
- **Phase 4** — Polish: mobile scroll, responsive scaling, micro animations