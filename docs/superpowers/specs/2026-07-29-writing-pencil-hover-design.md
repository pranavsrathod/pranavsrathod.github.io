# Writing Section: Pencil-on-Hover Treatment

**Date:** 2026-07-29
**Branch:** siggraph-refresh
**Status:** Approved design, pending implementation plan

## Problem

The homepage Writing section (and the /blog index that shares `PostPreview.astro`) is functional but plain next to the new full-screen hero and sticker project cards: a straight scaleX underline bar on hover, a small accent tick, and excerpts truncated to one cut-off line.

## Goal

Make the list chic and on-theme: quiet rest state, and on hover the page "marks" the entry with hand-drawn pencil strokes — a rough circle sketching around the date and a wobbly underline drawing under the title. Pure CSS/SVG, no JS.

## Interaction (validated in mockup, option A)

- **Hover in**: an accent-colored rough ellipse draws around the date (~0.5s, `stroke-dashoffset` transition to 0), and a wavy underline draws beneath the title (~0.45s, ~0.08s delay).
- **Hover out**: strokes reverse ("erase" back) via the same transition.
- **Reduced motion**: no draw transition; both strokes appear/disappear instantly on hover.
- **Dark mode**: strokes use `var(--accent)` so they swap automatically.

## Implementation

### `PostPreview.astro` (shared by homepage, /blog list, prev/next on blog posts)

- Date cell: keep small-caps tabular date; remove the `planner-tick` span; add an inline `<svg class="pencil-circle" aria-hidden="true">` overlay, absolutely positioned around the date text, `viewBox` + `preserveAspectRatio="none"` so it stretches to the date width. Path is a hand-drawn double-pass ellipse.
- Title: keep the `planner-title` class name (it stays the positioning anchor); add inline `<svg class="pencil-under" aria-hidden="true">` positioned under the title text (wavy 2-curve path).
- Excerpt: remove `truncate`; the excerpt wraps naturally. Reading time line unchanged.

### `src/pages/index.astro`

- The "Archive / All N posts" row (line ~45) gets the same title underline SVG on its "All N posts" label (no date circle — it has no date). Same hover behavior.

### `src/styles/global.css`

- Remove `.planner-tick` rules and `.planner-title::after` underline rules (and their reduced-motion entries).
- Add a `.pencil-*` recipe: SVG paths `fill: none; stroke: var(--accent); stroke-linecap: round;` with `stroke-dasharray`/`stroke-dashoffset` set to the path length, transitioned on `.planner-row:hover`; `prefers-reduced-motion` sets `transition: none`.
- `.planner-list` dashed dividers stay.

### Untouched

`PostPreview` consumers keep working with zero prop changes (`blog/[...page].astro`, `blog/[id].astro` prev/next, homepage). No content or frontmatter changes. No JS.

## Verification

1. `npm run build` exit 0.
2. Homepage Writing section and /blog: hover draws circle + underline, un-hover erases; archive row underline works.
3. Blog post prev/next rows get the treatment too (shared component) and look right there.
4. Reduced motion: instant show/hide. Dark mode: accent strokes visible on navy.
5. No page-level layout shift on hover (SVGs absolutely positioned).
