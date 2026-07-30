# Ray Tracer Page: Filmstrip Viewer Redesign

**Date:** 2026-07-28
**Branch:** siggraph-refresh
**Status:** Approved design, pending implementation plan

## Problem

The `rayTracer.mdx` rebuild (from the "Pinned Case File" plan) replaced the old hand-rolled flip-card viewer with `InteractiveDashboard` card grids. The result loses what made the page work: the tap-to-flip interaction is gone, all content is dumped on screen at once, the dashboard styling reads as an admin panel, and the renders — the star of the page — shrink into card thumbnails.

The old committed widget had the right *interaction* (a focused viewer with a tap-to-reveal card) but was 650 lines of bespoke HTML/CSS/JS with confirmed iOS mobile bugs (missing `-webkit-backface-visibility`, non-wrapping tab row).

## Goal

Rebuild the page around a **filmstrip metaphor**: renders are frames on a strip; tapping a frame toggles between the **positive** (the render) and the **negative** (the technique explanation). Built as clean, reusable, mobile-safe Astro components on the site's design tokens. All prose is preserved verbatim.

## Core interaction: Darkroom Invert

Tapping the main frame "develops" it in place — no 3D flip:

- The render inverts and dims (`filter: invert(1) hue-rotate(180deg) contrast(.85) brightness(.5)`, ~450ms crossfade).
- Technique text prints over it: an amber monospace **edge-code line** (e.g. `PT-512 ▸ FRAME 01 ▸ GLOBAL ILLUMINATION`), title, description, and optional formula + note.
- Tapping again returns to the positive.

Because there is no 3D transform, the iOS `backface-visibility` bug class is eliminated by construction.

## New components

### `FilmstripViewer.astro` (reusable, data-driven)

Registered in `ProjectLayout`'s `components={{...}}` map alongside `Compare`/`Gallery`. One instance renders:

1. **Main frame** — dark film chrome (charcoal ~`#1c1a17`), sprocket-hole rows top and bottom, current render at prose width. Tap = darkroom invert.
2. **Filmstrip nav** — continuous dark strip of thumbnails below. Inactive frames render as negatives (inverted + dimmed), active frame is the full-color positive with an amber border. Tap to jump. Horizontal scroll on overflow (intentional — film scrolls; no wrapping bug possible).
3. **Roll chips** — rendered only when `rolls.length > 1`. Small labels (`ROLL 1 · SNOW`) above the strip. Switching rolls swaps the strip's frames and preserves the current frame index (clamped to the roll's length).

Props shape (authored as exported data in MDX, same pattern as today):

```ts
{
  id: string,
  eyebrow?: string,
  title?: string,
  rolls: [{
    id: string,
    label: string,
    frames: [{
      image: { src: string, alt: string },
      caption: string,            // positive side
      edgecode: string,           // negative side, amber mono line
      title: string,
      desc: string,
      formula?: string,
      note?: string
    }]
  }]
}
```

Usage on this page:
- **Path Tracer viewer**: 1 roll, 5 technique frames (Monte Carlo, cosine-weighted sampling, Russian Roulette, NEE, jittered sampling).
- **Ray Tracer viewer**: 3 rolls — Snow (5 stages), Spheres (5 stages), Test2 (8 stages incl. reflections).

### `ContactSheet.astro` (static, no JS)

Replaces the two "Core Features" icon-card grids and the "Source Code" repo cards. A static grid styled like a photographer's contact sheet: paper-card background (site dot-grid recipe), thin frame border per cell, amber monospace index (`01`, `02`, …) replacing icons, title, description, optional detail rows (branch/tags) in edge-code style. Repo cells wrap the whole cell in a link.

### `TogglePanels.astro` (small, plain)

A two-button segmented control (`Path Tracer` / `Ray Tracer`) styled with existing site tokens — deliberately plain, no film graphics. Labels prop + two named slots. Swaps its panels; `astro:page-load` init with `dataset.initialized` guard.

### `Compare.astro` — film variant (targeted diff)

Keeps its drag interaction and pointer handling untouched. New opt-in `variant="film"` prop adds: dark film-frame border with sprocket holes, scene tabs replaced by the same negative/positive thumbnail strip as the viewer, and `64 SPP` / `512 SPP` labels in amber edge-code style. Other pages using `Compare` are unaffected.

## Visual system

- **Film chrome** is dark in both themes (a physical dark object on the paper background); only paper/contact-sheet surfaces swap via existing dark-mode tokens.
- **Amber accent** (`#e8a33d`-ish) defined once as a CSS variable (e.g. `--film-accent`), shared by all film components.
- **Section eyebrows**: amber monospace edge-code lines above section headings (e.g. `REEL A ▸ WHAT IS A PATH TRACER?` above the prose explainers, matching each heading) tie prose sections in. Prose, tables, and explainer sections stay plain markdown — film styling frames content, it does not invade text.
- No em dashes in visible copy (site convention).

## Page structure (`rayTracer.mdx`)

Prose preserved verbatim; only component instances change:

1. Overview (prose + GitHub links)
2. **TogglePanels**:
   - PT panel: `FilmstripViewer` (PT techniques) + `Compare variant="film"` (64 vs 512 spp, 5 scenes)
   - RT panel: `FilmstripViewer` (3 scene rolls)
3. "What Is a Path Tracer?" (prose, unchanged)
4. PT Core Features — `ContactSheet`
5. "What Is a Ray Tracer?" (prose + diagram figure, unchanged)
6. RT Core Features — `ContactSheet`
7. Applications and Tradeoffs (prose + table, unchanged)
8. Source Code — `ContactSheet` (linked cells)

Only the viewers live inside the toggle; everything readable stays in normal scroll flow.

Existing MDX data exports (`ptTechniqueSections`, `baseRtStepDefs`, `reflectionRtStepDefs`, `sppCompareScenes`, feature/repo sections) are reshaped to the new props with no copy rewritten. The `toRtSteps(scene, defs)` helper pattern survives as a frame builder.

`InteractiveDashboard` itself is untouched and remains in use by `mobileGames`, `robotics`, `ourHouseInVR`, `videoCompression`. The rayTracer page simply stops importing it.

## Technical notes

- All interactive components follow the existing `astro:page-load` init pattern with an `id`-scoped root and `dataset.initialized` guard (required: View Transitions are enabled site-wide).
- `ContactSheet` ships zero JS.
- Filmstrip nav uses native horizontal overflow scrolling; no `flex-wrap` needed, no fixed pixel heights (aspect-ratio based sizing).
- Buttons are real `<button>` elements; the main frame toggle is keyboard-operable (Enter/Space) with `aria-pressed`; thumbnails carry `aria-label`s.

## Verification

1. `npm run build` green.
2. `npm run preview`: 375px and 390px viewports × light/dark (4 combos) — no page-level horizontal overflow; strip scrolls internally.
3. Client-side navigation between project pages to catch `astro:page-load` re-init bugs.
4. `grep` confirms no `backface-visibility`, `rotateY`, or `preserve-3d` in new code.
5. Frame counts match original content: PT 5 techniques, RT Snow 5 / Spheres 5 / Test2 8; spp compare 5 scenes; all image paths resolve.

## Out of scope

- Migrating other pages' `InteractiveDashboard` sections to the filmstrip look (possible later adopters: heightFields, urbanRenderer).
- Any changes to `ProjectLayout` hero/spec-strip, schema, or other content files.
