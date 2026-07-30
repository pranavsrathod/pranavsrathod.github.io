# Homepage: Full-Screen Hero + Sticker-Sheet Project Cards

**Date:** 2026-07-29
**Branch:** siggraph-refresh
**Status:** Approved design, pending implementation plan

## Problem

The homepage reads as a standard template: the hero occupies a fraction of the first screen inside the site's 768px column, the project cards are generic image-top tiles whose two-line clamped descriptions cut off mid-sentence, and nothing carries the eye down the page.

## Goal

Make the first screen a full-viewport hero on every device, restyle the project cards as die-cut stickers on the dot-paper board, and fix the description truncation structurally. The Writing section is explicitly out of scope (pinned for a later pass).

## 1. Full-screen hero

- **Height**: the hero section fills the remainder of the first viewport after the nav: `min-height: calc(100svh - <nav offset>)`, tuned per breakpoint (nav is `pt-4 pb-8 min-h-10` mobile, `md:pt-8 pb-12 min-h-14` desktop). `svh` units so mobile browser chrome does not cause layout jumps. Hero content is vertically centered; the scroll cue sits at the hero's bottom edge.
- **Width**: the hero breaks out of the 768px prose column to an internal `max-w-5xl`, using the same full-bleed wrapper technique as `ProjectLayout`'s `hero-bleed` (100vw + translateX(-50%), `overflow-x: clip` guard).
- **Scale**: title `text-3xl` mobile stepping to `text-5xl`/`text-6xl` desktop (Climate Crisis display font); intro paragraph `prose-base` mobile / `prose-lg` desktop; avatar card ~1.3x on desktop. Mobile keeps today's stacked, centered arrangement, now filling the viewport.
- **Scroll cue**: small bottom-of-hero element, uppercase monospace "scroll" with a chevron, gentle bob animation. Disabled under `prefers-reduced-motion`; fades out after the user scrolls (tiny script following the site's `astro:page-load` + `dataset.initialized` init pattern).

## 2. Sticker-sheet project cards

Restyle the shared `.project-card` recipe in `src/styles/global.css` (affects homepage grid AND /projects index — intentional, site-wide consistency):

- **Die-cut edge**: ~4px solid paper-white border + 1px hairline outline, `rounded-xl`, echoing the avatar's sticker card. The border stays paper-white in dark mode (a sticker on a dark board keeps its white edge).
- **Tape strip removed**: delete the `.project-card::after` tape; the sticker border is now the physical-object cue.
- **Hover**: keep existing tilt-to-straight + lift physics; shadow becomes an asymmetric peel-lift (offset down-right, slightly stronger). `prefers-reduced-motion` handling preserved as today.
- **Truncation fix**: remove `line-clamp-2` from `ProjectPreview.astro`; descriptions render in full. Uneven card heights are accepted in the 2-column grid.
- **View-all card**: unchanged (dashed empty slot reads as the empty spot on the sticker sheet).

## Scope

Files touched:

- `src/components/Hero.astro` — full-screen layout, scale, scroll cue
- `src/pages/index.astro` — hero wrapper/breakout only
- `src/components/ProjectPreview.astro` — remove clamp (and any class the sticker recipe requires)
- `src/styles/global.css` — `.project-card` sticker restyle, hero/scroll-cue utilities

No schema, content, layout, or Writing-section changes. No new JS beyond the scroll-cue fade.

## Verification

1. `npm run build` exit 0.
2. Preview at 375px, 768px, 1440px x light/dark: hero fills the first viewport with no page-level horizontal scroll; scroll cue visible and bobbing (static under reduced motion); content vertically centered.
3. Homepage cards: full descriptions, sticker borders, peel-lift hover, tilt preserved.
4. /projects index renders correctly with the new card style.
5. Client-side navigation home -> project -> home re-inits the scroll cue (View Transitions).
