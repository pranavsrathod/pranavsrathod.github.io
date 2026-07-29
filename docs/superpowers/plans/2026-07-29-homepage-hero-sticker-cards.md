# Homepage Full-Screen Hero + Sticker Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the homepage hero fill the first viewport on every device with a scroll cue, and restyle project cards as die-cut stickers with full (unclamped) descriptions.

**Architecture:** Astro 5 static site, Tailwind 4 utilities + CSS-variable recipes in `src/styles/global.css`. The hero breaks out of the 768px `main` column with the existing `.hero-bleed` recipe (`global.css:245-251`) and sizes itself with `svh`-based min-heights. Card styling lives in the shared `.project-card` recipe (used by the homepage grid AND `/projects` index).

**Tech Stack:** Astro 5, Tailwind CSS 4, View Transitions enabled site-wide (`astro:page-load` init pattern).

**Spec:** `docs/superpowers/specs/2026-07-29-homepage-hero-sticker-cards-design.md`

## Global Constraints

- No em dashes in visible copy (site convention).
- Any JS init: `document.addEventListener('astro:page-load', ...)` + `dataset.initialized` guard.
- `prefers-reduced-motion` must disable the scroll-cue bob and keep the existing card-motion reduction block.
- Use `svh` units (not `vh`) for hero heights.
- Sticker border stays paper-white in BOTH themes.
- The Writing section, `Nav.astro`, `BaseLayout.astro`, and all content files are untouched.
- Verification is `npm run build` (exit 0) + preview checks; there is no test runner.

## File Structure

- `src/styles/global.css` — `.project-card` sticker restyle (replaces lines ~141-176), `--sticker-edge` token, `.hero-scroll-cue` recipe
- `src/components/ProjectPreview.astro` — drop clamp + old border classes
- `src/components/Hero.astro` — full-screen layout, scale bumps, scroll cue markup + script
- `src/components/PixelAvatar.astro` — desktop size bump
- `src/pages/index.astro` — NO changes (the breakout lives inside `Hero.astro`; spec listed it defensively)

---

### Task 1: Sticker-sheet project cards

**Files:**
- Modify: `src/styles/global.css` (the `.project-card` block, currently lines 141-176, and the `:root`/`html.dark` token blocks)
- Modify: `src/components/ProjectPreview.astro:15,23`

**Interfaces:**
- Consumes: existing tokens `--card-shadow`, `--bg-muted`, `--border-main`.
- Produces: `--sticker-edge` token; restyled `.project-card` class consumed unchanged by `index.astro` and `src/pages/projects/index.astro`.

- [ ] **Step 1: Add the sticker token**

In `src/styles/global.css`, add to the `:root` block (after `--card-shadow`):

```css
    --sticker-edge: #fffdf7;
```

And the identical line to the `html.dark` block (after `--card-shadow`) — a sticker's edge stays paper-white on a dark board:

```css
    --sticker-edge: #fffdf7;
```

- [ ] **Step 2: Replace the `.project-card` recipe**

Replace the entire current block (`.project-card` through the `@media (prefers-reduced-motion: reduce)` card rules, lines ~141-176) with:

```css
    /* Die-cut sticker on the dot-paper board: thick white edge + hairline
       cut line, echoing the avatar's sticker card. Hover peels it up. */
    .project-card {
        rotate: 0.7deg;
        border: 4px solid var(--sticker-edge);
        outline: 1px solid color-mix(in oklab, var(--border-main) 20%, transparent);
        box-shadow: 0 6px 14px -8px var(--card-shadow);
        transition:
            rotate 0.2s ease,
            translate 0.2s ease,
            box-shadow 0.2s ease;
    }
    .project-card:nth-child(even) {
        rotate: -0.7deg;
    }
    .project-card:hover {
        rotate: 0deg;
        translate: 0 -4px;
        box-shadow: 10px 18px 28px -12px var(--card-shadow);
    }
    @media (prefers-reduced-motion: reduce) {
        .project-card,
        .project-card:nth-child(even),
        .project-card:hover {
            rotate: 0deg;
            translate: 0 0;
            transition: box-shadow 0.2s ease;
        }
    }
```

Note what is deleted: the `.project-card::after` tape strip is GONE (the sticker edge replaces it as the physical-object cue). The `.view-all-card` block below it is untouched.

- [ ] **Step 3: Update `ProjectPreview.astro`**

Line 15 — the anchor loses the thin border (the CSS recipe now draws the sticker edge) and rounds up to match; `relative` is dropped (it only existed for the deleted tape):

```astro
<a class:list={['project-card flex flex-col rounded-xl bg-muted', className]} href={`/projects/${project.id}/`}>
```

Line 17 — the image wrapper's top radius shrinks so it nests inside the 4px edge without a visible gap:

```astro
        <div class="overflow-hidden rounded-t-lg">
```

(unchanged line, verify it is `rounded-t-lg`, which sits fine inside `rounded-xl` + 4px border).

Line 23 — remove the clamp so descriptions render in full:

```astro
        {description && <div class="text-sm leading-normal">{description}</div>}
```

- [ ] **Step 4: Verify build and visual spot-check**

Run: `npm run build`
Expected: exit 0.

Then with `npm run preview`, fetch the homepage and confirm structurally (set `$PORT` to the port `astro preview` reports — 4321 may be occupied by a running dev server):

```bash
curl -s http://localhost:$PORT/ | grep -c "line-clamp-2"
```

Expected: `0`.

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.css src/components/ProjectPreview.astro
git commit -m "feat: restyle project cards as die-cut stickers, unclamp descriptions"
```

---

### Task 2: Full-screen hero with scroll cue

**Files:**
- Modify: `src/components/Hero.astro` (section markup lines 11-45, plus new script)
- Modify: `src/components/PixelAvatar.astro:33-37`
- Modify: `src/styles/global.css` (append `.hero-scroll-cue` recipe near `.hero-bleed`)

**Interfaces:**
- Consumes: `.hero-bleed` recipe (`global.css:245-251`), `heading-accent`, `avatar-card`, Button, PixelAvatar.
- Produces: `#hero-scroll-cue` element + `.hero-scroll-cue`/`.is-hidden` CSS; no other component depends on this task.

Nav height arithmetic for the min-heights (from `Nav.astro:9`, `pt-4 pb-8 min-h-10 sm:min-h-14 sm:pb-12 md:pt-8`):
- mobile: 1rem + 2rem + 2.5rem = **5.5rem**
- sm: 1rem + 3rem + 3.5rem = **7.5rem**
- md+: 2rem + 3rem + 3.5rem = **8.5rem**

- [ ] **Step 1: Restructure the hero section**

In `src/components/Hero.astro`, replace the `<section>` open tag and wrap the existing two columns in a width container; the section becomes the full-screen flex frame. Full new JSX body (the two inner column `<div>`s are today's content with only the noted class changes):

```astro
{
    (hero?.title || hero?.text || (hero?.actions && hero.actions.length > 0)) && (
        <section class="hero-bleed relative mb-12 sm:mb-20 flex flex-col justify-center px-4 md:px-8 min-h-[calc(100svh-5.5rem)] sm:min-h-[calc(100svh-7.5rem)] md:min-h-[calc(100svh-8.5rem)]">
            <div class="mx-auto w-full max-w-5xl flex flex-col-reverse items-center gap-8 text-center sm:flex-row sm:items-center sm:justify-between sm:gap-12 sm:text-left">
                <div class="w-full min-w-0 flex flex-col items-center gap-5 sm:items-start">
                    <div class="flex flex-col gap-0.5">
                        <span class="text-[0.8rem] font-medium uppercase tracking-widest">{siteConfig.title}</span>
                        {siteConfig.subtitle && <span class="text-[0.8rem] tracking-wide text-muted">{siteConfig.subtitle.replaceAll('|', '/')}</span>}
                    </div>
                    {hero.title && (
                        <h1 class="text-3xl leading-tight font-display heading-accent max-sm:[&::after]:mx-auto sm:text-5xl sm:leading-tight lg:text-6xl lg:leading-tight">{hero.title}</h1>
                    )}
                    {hero.text && <div class="max-w-[52ch] prose prose-base sm:prose-lg" set:html={marked.parse(hero.text)} />}
                    <a class="group inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline hover:underline-offset-4" href="/about">
                        more about me <ArrowRight class="w-4 h-4 fill-current transition-transform group-hover:translate-x-0.5" />
                    </a>
                    {hero.actions && hero.actions.length > 0 && (
                        <div class="flex flex-wrap justify-center gap-4 sm:justify-start">
                            {hero.actions.map((action) => (
                                <Button href={action.href}>{action.text}</Button>
                            ))}
                        </div>
                    )}
                </div>
                <div class="shrink-0 flex flex-col items-center">
                    <div class="avatar-card">
                        <PixelAvatar />
                    </div>
                    <div class="avatar-baseline" aria-hidden="true"></div>
                    <p class="avatar-caption text-xs text-muted" aria-hidden="true">
                        <span class="if-hover">hover me</span><span class="if-touch">tap me</span>
                    </p>
                </div>
            </div>
            <div class="hero-scroll-cue absolute inset-x-0 bottom-5 flex flex-col items-center gap-1" id="hero-scroll-cue" aria-hidden="true">
                <span class="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-muted">scroll</span>
                <svg viewBox="0 0 24 24" class="h-4 w-4 text-accent" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6" />
                </svg>
            </div>
        </section>
    )
}
```

Changes vs today, for the reviewer's eye: section swaps `w-full ... sm:justify-between` layout classes for the full-screen frame (`hero-bleed`, `justify-center`, `px`, `min-h` calcs); a new `max-w-5xl` container div takes over the old two-column layout; `h1` steps `text-2xl→text-3xl`, `sm:text-4xl→sm:text-5xl`, adds `lg:text-6xl`; intro prose steps `prose-sm→prose-base`, `sm:prose-base→sm:prose-lg`; scroll cue block is new. Everything else inside the columns is byte-identical.

- [ ] **Step 2: Add the scroll-cue script**

Append to `src/components/Hero.astro` (after the existing `<style>` block):

```astro
<script>
    document.addEventListener('astro:page-load', () => {
        const cue = document.getElementById('hero-scroll-cue');
        if (!cue || cue.dataset.initialized === 'true') return;
        cue.dataset.initialized = 'true';

        const onScroll = () => {
            cue.classList.toggle('is-hidden', window.scrollY > 40);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    });
</script>
```

- [ ] **Step 3: Add the scroll-cue CSS recipe**

In `src/styles/global.css`, immediately after the `.hero-bleed` rule (line ~251), add:

```css
    /* Bottom-of-hero scroll hint: bobs gently, hides once the reader moves */
    .hero-scroll-cue {
        animation: hero-cue-bob 2.2s ease-in-out infinite;
        transition: opacity 0.4s ease;
    }
    .hero-scroll-cue.is-hidden {
        opacity: 0;
    }
    @keyframes hero-cue-bob {
        0%,
        100% {
            translate: 0 0;
        }
        50% {
            translate: 0 6px;
        }
    }
    @media (prefers-reduced-motion: reduce) {
        .hero-scroll-cue {
            animation: none;
        }
    }
```

(The cue is centered by its flex parent, not by a `translate` utility, so the keyframe's `translate` property cannot conflict with Tailwind positioning.)

- [ ] **Step 4: Bump the avatar on desktop**

In `src/components/PixelAvatar.astro`, after the existing `@media (min-width: 640px)` block (lines 33-37), add:

```css
    @media (min-width: 1024px) {
        .pixel-avatar {
            width: 17rem;
            height: 17rem;
        }
    }
```

(Sprite math is safe: `background-size: 500% 100%` is percentage-based, so any element size renders frames correctly.)

- [ ] **Step 5: Verify build and viewport behavior**

Run: `npm run build`
Expected: exit 0.

With `npm run preview` running, structural checks:

```bash
curl -s http://localhost:$PORT/ | grep -c "hero-scroll-cue"   # expect >= 1
curl -s http://localhost:$PORT/ | grep -c "100svh"            # expect >= 1
```

- [ ] **Step 6: Commit**

```bash
git add src/components/Hero.astro src/components/PixelAvatar.astro src/styles/global.css
git commit -m "feat: full-screen homepage hero with scroll cue"
```

---

### Task 3: Full verification pass

**Files:** none (verification only; small mechanical fixes allowed, committed as `fix: <what>`)

- [ ] **Step 1: Build + preview**

```bash
npm run build && npm run preview
```

- [ ] **Step 2: Scriptable checks**

- Homepage HTML contains no `line-clamp-2`, contains `hero-scroll-cue`, `min-h-[calc(100svh-5.5rem)]` markup.
- `/projects` index page still renders `.project-card` elements (shared recipe consumers intact).
- `grep -n "project-card::after" src/styles/global.css` returns nothing (tape gone).
- No `vh` (non-svh) unit introduced in the new hero classes.

- [ ] **Step 3: Human visual checklist (report, don't attempt visually yourself)**

At 375px, 768px, 1440px x light/dark:
- Hero fills the first viewport, content vertically centered, no page-level horizontal scroll.
- Scroll cue bobs, fades after scrolling ~40px, static under reduced motion.
- Cards: sticker edges, peel-lift hover, full descriptions, tilt preserved; /projects page consistent.
- Client-side nav home → project → home re-inits the cue.

- [ ] **Step 4: Commit any fixes**

```bash
git add -u && git commit -m "fix: homepage verification polish"
```
