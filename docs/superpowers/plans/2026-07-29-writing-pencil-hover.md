# Writing Pencil-on-Hover Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** On hover, blog list rows get hand-drawn pencil strokes — a rough accent circle sketching around the date and a wavy underline drawing under the title — replacing the current tick + scaleX underline. Pure CSS/SVG, no JS.

**Architecture:** Astro 5 + Tailwind 4. The strokes are inline SVGs inside `PostPreview.astro` (shared by homepage Writing, /blog index, and prev/next rows), animated with `stroke-dasharray`/`stroke-dashoffset` transitions driven by `.planner-row:hover` rules in `src/styles/global.css`. The mockup-validated paths and timings are transcribed exactly.

**Tech Stack:** Astro 5, Tailwind CSS 4, CSS custom properties (`--accent` swaps in dark mode).

**Spec:** `docs/superpowers/specs/2026-07-29-writing-pencil-hover-design.md`

## Global Constraints

- No JavaScript anywhere in this change.
- Strokes use `stroke: var(--accent)` only (auto dark-mode swap).
- `prefers-reduced-motion: reduce` disables the draw transitions (strokes appear/disappear instantly).
- SVGs are `aria-hidden="true"` and `pointer-events: none`; no layout shift on hover (absolute positioning).
- The `.planner-list` dashed dividers and the row grid (`grid-cols-[5.5rem_1fr]`) are unchanged.
- No em dashes in visible copy.
- Verification is `npm run build` (exit 0) + preview checks; no test runner exists.

## File Structure

- `src/components/PostPreview.astro` — swap tick for circle SVG, add underline SVG, unclamp excerpt
- `src/pages/index.astro` — archive row: same swap (underline only, no date circle)
- `src/styles/global.css` — delete tick/underline-bar rules, add `.pencil-*` recipe

---

### Task 1: Pencil hover treatment

**Files:**
- Modify: `src/components/PostPreview.astro` (lines 15-25)
- Modify: `src/pages/index.astro` (lines 45-55, the archive `<a>` row)
- Modify: `src/styles/global.css` (lines ~200-240: `.planner-tick` and `.planner-title::after` rules)

**Interfaces:**
- Consumes: existing `.planner-row`, `.planner-list`, `.planner-title` classes and `--accent` token.
- Produces: `.pencil-circle` and `.pencil-under` CSS classes + SVG markup pattern; no API/prop changes for any `PostPreview` consumer.

- [ ] **Step 1: Rewrite `PostPreview.astro` markup**

Replace the template (lines 15-25) with:

```astro
<a class:list={['planner-row grid grid-cols-[5.5rem_1fr] items-baseline gap-4 py-5', className]} href={`/blog/${post.id}/`}>
    <div class="relative text-xs uppercase tracking-wide text-muted [font-variant-numeric:tabular-nums]">
        <svg class="pencil-circle" viewBox="0 0 120 34" preserveAspectRatio="none" aria-hidden="true">
            <path d="M8,17 C10,6 48,2 76,4 C104,6 116,10 113,19 C110,29 74,32 44,30 C18,28 5,25 8,17 C9,12 20,8 34,6" />
        </svg>
        {dateLabel}
    </div>
    <div class="min-w-0">
        <TitleTag class="planner-title text-lg leading-snug font-medium">
            {title}
            <svg class="pencil-under" viewBox="0 0 240 10" preserveAspectRatio="none" aria-hidden="true">
                <path d="M2,6 C40,3 80,8 120,5 C160,2 200,7 238,4" />
            </svg>
        </TitleTag>
        {excerpt && <div class="mt-1 text-sm text-muted">{excerpt}</div>}
        <div class="mt-1 text-xs text-muted">{readingMinutes} min read</div>
    </div>
</a>
```

Changes vs today: the `planner-tick` span is gone (circle SVG replaces it inside the already-`relative` date cell), the underline SVG sits inside `planner-title` (which is already `position: relative; display: inline-block` via the retained recipe), and the excerpt loses `truncate`. Frontmatter (lines 1-13) is untouched.

- [ ] **Step 2: Update the archive row in `index.astro`**

Replace the archive `<a>` block (lines 45-55) with:

```astro
                    <a class="planner-row reveal grid grid-cols-[5.5rem_1fr] items-baseline gap-4 py-5" href="/blog">
                        <div class="relative text-xs uppercase tracking-wide text-muted">Archive</div>
                        <div class="min-w-0">
                            <span class="planner-title inline-flex items-center gap-1 text-lg leading-snug font-medium whitespace-nowrap">
                                All {posts.length} posts <ArrowRight class="w-4 h-4 fill-current shrink-0" />
                                <svg class="pencil-under" viewBox="0 0 240 10" preserveAspectRatio="none" aria-hidden="true">
                                    <path d="M2,6 C40,3 80,8 120,5 C160,2 200,7 238,4" />
                                </svg>
                            </span>
                        </div>
                    </a>
```

(The `planner-tick` span is removed; no date circle here since the gutter says "Archive", not a date.)

- [ ] **Step 3: Replace the CSS recipe in `global.css`**

Delete the `.planner-tick`, `.planner-row:hover .planner-tick`, `.planner-title::after`, and `.planner-row:hover .planner-title::after` rules AND the reduced-motion block that references `.planner-title::after` / `.planner-tick` (lines ~200-240). KEEP the `.planner-title { position: relative; display: inline-block; }` rule. In their place add:

```css
    /* Pencil-on-hover: a rough circle sketches around the date and a wavy
       line draws under the title, like marking the entry you're about to read */
    .pencil-circle,
    .pencil-under {
        position: absolute;
        overflow: visible;
        pointer-events: none;
    }
    .pencil-circle {
        inset: -0.375rem -0.625rem;
        width: calc(100% + 1.25rem);
        height: calc(100% + 0.75rem);
    }
    .pencil-under {
        left: -2px;
        bottom: -7px;
        width: calc(100% + 8px);
        height: 10px;
    }
    .pencil-circle path,
    .pencil-under path {
        fill: none;
        stroke: var(--accent);
        stroke-linecap: round;
    }
    .pencil-circle path {
        stroke-width: 1.6;
        stroke-dasharray: 340;
        stroke-dashoffset: 340;
        opacity: 0.85;
        transition: stroke-dashoffset 0.5s ease-out;
    }
    .pencil-under path {
        stroke-width: 1.8;
        stroke-dasharray: 260;
        stroke-dashoffset: 260;
        opacity: 0.9;
        transition: stroke-dashoffset 0.45s ease-out 0.08s;
    }
    .planner-row:hover .pencil-circle path,
    .planner-row:hover .pencil-under path {
        stroke-dashoffset: 0;
    }
    @media (prefers-reduced-motion: reduce) {
        .pencil-circle path,
        .pencil-under path {
            transition: none;
        }
    }
```

(Dasharray values exceed each path's user-unit length — 340 for the double-pass ellipse, 260 for the wave — so the stroke is fully hidden at rest and fully drawn on hover; un-hover transitions back, giving the "erase". `pencil-under` needs no `right` since `width` covers it.)

- [ ] **Step 4: Verify build and structure**

Run: `npm run build`
Expected: exit 0.

Checks:

```bash
grep -c "pencil-under" dist/index.html          # expect >= 3 (2+ posts + archive row)
grep -c "pencil-circle" dist/index.html         # expect >= 2
grep -c "planner-tick" dist/index.html          # expect 0
grep -n "planner-tick" src/ -r                  # expect no matches
```

- [ ] **Step 5: Commit**

```bash
git add src/components/PostPreview.astro src/pages/index.astro src/styles/global.css
git commit -m "feat: pencil-drawn hover strokes for writing list"
```

---

### Task 2: Verification pass

**Files:** none (verification only; mechanical fixes committed as `fix: <what>`)

- [ ] **Step 1: Build + preview**

```bash
npm run build && npm run preview
```

(Port 4321 may be occupied; use the port preview reports.)

- [ ] **Step 2: Scriptable checks**

- Homepage: rows contain `pencil-circle` + `pencil-under` SVGs; archive row has `pencil-under` only; zero `planner-tick`.
- `/blog` page HTML: each row has both SVGs.
- Blog post pages (e.g. first slug in `dist/blog/`): prev/next rows carry the SVGs.
- Built CSS asset greps: `pencil-circle`, `pencil-under`, `stroke-dashoffset` present; no `planner-tick` remains.
- No `truncate` on the excerpt div in built homepage HTML.

- [ ] **Step 3: Human visual checklist (report as pending)**

- Hover a row: circle sketches around date (~0.5s), underline draws under title with slight delay; un-hover erases both.
- Archive row: underline draws, no circle.
- No layout shift on hover. Dark mode: strokes visible in accent orange.
- Reduced motion (macOS: System Settings > Accessibility > Display > Reduce motion): strokes appear instantly.

- [ ] **Step 4: Commit any fixes**

```bash
git add -u && git commit -m "fix: pencil hover polish"
```
