# Mumbai Street Portfolio — UI Pitch

> A pixel art South Mumbai street scene where the city is the navigation.

---

## The Idea

Instead of a traditional portfolio homepage with a hero section and nav links, the landing page is an interactive **16-bit pixel art South Mumbai street scene**. Every prop on the street represents a section of the site. Visitors explore the city to discover the portfolio.

No nav bar. No hero text. Just a city that invites you to look closer.

---

## The World

The scene exists in two states tied directly to the site's light/dark mode toggle:

| Mode | Time | Vibe |
|---|---|---|
| Light | Bright midday | Harsh sunlight, vivid Art Deco colors, dry pavements, crows on power lines |
| Dark | Night | Warm amber street lamps, wet cobblestone, neon reflections, deep navy sky |

Switching themes switches the entire city — every prop swaps between its day and night version simultaneously.

---

## The Street

A wide South Mumbai street scene — Art Deco building facades, dense power lines, overgrown vines, auto rickshaws in the distance. The foreground is an empty flat pavement where all interactive props are layered.

```
[Bulletin] [Chaiwala] [Garage] [YOU] [Photographer] [Wada Pav] [Office] [Billboard]
───────────────────────────────────────────────────────────────────────────────────
                             PAVEMENT
───────────────────────────────────────────────────────────────────────────────────
                               ROAD
```

---

## Props & Navigation

### 🚶 You — Pranav Sprite
**Links to:** `/about`

A pixel art version of Pranav standing casually on the pavement — smart casual, hands in pockets, looking directly at the viewer. The sprite IS the About page. Clicking you tells your story.

- Hover → red neon glow + "About Me" tooltip
- Click → navigates to `/about`

---

### 🔧 Garage Workshop
**Links to:** `/projects`

A South Mumbai garage tucked into the ground floor of an Art Deco building. Rolling metal shutter half open revealing a workbench with blueprints, tools on a pegboard, bamboo scaffolding on the side.

- Day → harsh sunlight flooding into the dark interior
- Night → warm yellow light spilling onto wet cobblestone, sparks near the floor
- Hover → red neon glow + "Projects" tooltip
- Click → navigates to `/projects`

---

### ☕ Chaiwala + Newspaper Stall
**Links to:** `/blog`

A chaiwala and newspaper combo stall against an Art Deco wall. Steaming aluminum kettle, cutting chai glasses, newspapers clipped to a wire above, striped awning.

- Day → bright midday, steam rising from kettle
- Night → bare bulb casting a warm pool of light, chai glasses glowing amber
- Hover → red neon glow + "Blog" tooltip
- Click → navigates to `/blog`

---

### 📷 Street Photographer
**Links to:** `photos.pranavrathod.com`

A young man crouched low on the pavement holding a camera up to his eye, camera bag open beside him, pigeons nearby.

- Day → harsh midday shadow beneath him, pigeons on dry pavement
- Night → camera flash firing, sharp white burst lighting the wet ground
- Hover → red neon glow + "Photos" tooltip
- Click → opens `photos.pranavrathod.com` in new tab

---

### 🌶️ Wada Pav Stall
**Links to:** Contact overlay

A tiny hole-in-the-wall Wada Pav stall tucked between two Art Deco buildings. Stack of Wada Pavs wrapped in newspaper, chutney pots, worn wooden counter.

- Day → canvas tarp casting harsh shadow, bright vivid exterior
- Night → kerosene lamp glowing warm inside dark interior
- Hover → red neon glow
- Click → triggers the **Newspaper Contact Overlay**

---

### 📌 Bulletin Board
**Links to:** `/tags`

A large wooden bulletin board mounted on a wall, completely covered in overlapping pinned papers, torn flyers and handwritten notes.

- Hover → red neon glow + "Tags" tooltip
- Click → navigates to `/tags`

---

### 🏢 Office Building
**Links to:** Resume PDF

A mid-rise Art Deco office building. Most windows dark, one upper floor window warmly lit suggesting someone working late.

- Hover → red neon glow + "Resume" tooltip
- Click → opens Resume PDF in new tab

---

### 🏙️ Billboard Building
**Links to:** Featured Projects

The tallest building on the street with a large rooftop billboard. The billboard face is blank — featured project content overlaid dynamically from MDX content collections.

- Hover → red neon glow + "Featured Projects" tooltip
- Click → navigates to featured projects

---

## The Wada Pav Contact Overlay

The most distinctive interaction on the site. Clicking the Wada Pav stall triggers:

```
1. Full screen dark overlay fades in
2. Pixel art image appears — a fresh Wada Pav 
   sitting on an unfolded Indian newspaper
3. Right side of newspaper shows a contact card:

   ┌─────────────────────────────┐
   │  CONTACT ME                 │
   │  ─────────────────────────  │
   │  ✉  pranavdev@duck.com      │
   │  in linkedin/pranavsrathod  │
   │  ⌥  github/pranavsrathod    │
   └─────────────────────────────┘

4. Hover over each row → red neon glow highlight
5. Click → opens email / LinkedIn / GitHub
6. Click outside overlay → closes
```

The newspaper wrapping is a distinctly Mumbai detail — street food has always been served in newspaper. Here it becomes your contact card.

---

## Hover & Interaction States

All props share a consistent interaction language:

```
Default  → prop visible, no highlight
Hover    → red neon drop-shadow glow around prop
           tooltip appears above: destination name
           cursor: pointer
Click    → navigate / trigger interaction
```

The red neon glow ties back to the PR logo's red — brand consistent throughout.

---

## Technical Architecture

### Stack
Built as a new Astro page on the `pixel-city-redesign` branch. No new frameworks — pure HTML, CSS, and vanilla JS layered on top of the existing Astro + Tailwind setup.

### Layer System
```
Layer 4 → Tooltips + hover states
Layer 3 → Sprite (z-index: 30)
Layer 2 → Props (z-index: 20, bottom-aligned to pavement)
Layer 1 → City background image (z-index: 10)
Layer 0 → Page background color
```

### File Structure
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
      garage-day.png       garage-night.png
      chaiwala-day.png     chaiwala-night.png
      photographer-day.png photographer-night.png
      wadapav-day.png      wadapav-night.png
      sprite-day.png       sprite-night.png
      bulletin-day.png     bulletin-night.png
      office-day.png       office-night.png
      billboard-day.png    billboard-night.png
    contact/
      newspaper-contact.png
```

### Day / Night Switching
Each prop carries both asset references. The existing theme toggle fires a class change on `<html>` — a small JS listener swaps all prop `src` attributes simultaneously.

### Responsive
| Breakpoint | Behaviour |
|---|---|
| Desktop | Full wide scene, all props visible |
| Tablet | Scene scales down proportionally |
| Mobile | Horizontal scroll, 2-3 props visible at a time |

---

## Asset Status

| Asset | Day | Night |
|---|---|---|
| City background | ✅ | ❌ |
| Garage / Projects | ✅ | ❌ |
| Chaiwala / Blog | ✅ | ❌ |
| Photographer / Photos | ✅ | ❌ |
| Wada Pav / Contact | ✅ | ✅ |
| Sprite / About | ❌ | ❌ |
| Bulletin board / Tags | ❌ | ❌ |
| Office building / Resume | ❌ | ❌ |
| Billboard / Featured | ❌ | ❌ |
| Newspaper contact card | ❌ | — |

---

## Build Phases

### Phase 1 — Core Scene
- [ ] `PixelCity.astro` component
- [ ] City background layered
- [ ] Existing day props positioned on street
- [ ] Hover glow on all props
- [ ] Click navigation working
- [ ] Day / night asset swap tied to theme toggle

### Phase 2 — Contact Overlay
- [ ] `ContactOverlay.astro` component
- [ ] Newspaper image with clickable hotspots
- [ ] Overlay open / close
- [ ] Red neon hover on contact rows

### Phase 3 — Remaining Assets
- [ ] All night versions generated
- [ ] Sprite generated
- [ ] Bulletin board generated
- [ ] Office building generated
- [ ] Billboard generated
- [ ] Newspaper contact card generated

### Phase 4 — Polish
- [ ] Mobile horizontal scroll
- [ ] Responsive scaling
- [ ] Micro animations
- [ ] Performance optimization

---

## Open Questions

- Does the billboard show live featured project data pulled from MDX content collections?
- Does the office building open the resume PDF directly or link to a resume page?
- Does mobile get a simplified version or the full scrollable scene?
- What is the sprite's idle state — fully static or subtle CSS breathing loop?

---

*Branch: `pixel-city-redesign` — forked from `astro`*