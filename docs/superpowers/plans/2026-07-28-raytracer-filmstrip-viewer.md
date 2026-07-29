# Ray Tracer Filmstrip Viewer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `rayTracer.mdx` around a filmstrip metaphor: a tap-to-invert "darkroom" viewer (`FilmstripViewer`), static contact-sheet grids (`ContactSheet`), a plain PT/RT toggle (`TogglePanels`), and a film-chrome variant of `Compare`.

**Architecture:** Astro static site (v5, Tailwind v4 via `@tailwindcss/vite`, MDX). Components are `.astro` files with scoped `<script define:vars>` blocks initialized on `astro:page-load` with a `dataset.initialized` guard (View Transitions are site-wide). No test runner exists; each task's verify cycle is `npm run build` (must exit 0) plus targeted greps and preview checks.

**Tech Stack:** Astro 5, Tailwind CSS 4 (utility classes + CSS variables in `src/styles/global.css`), MDX content collections.

**Spec:** `docs/superpowers/specs/2026-07-28-raytracer-filmstrip-viewer-design.md`

## Global Constraints

- No 3D transforms anywhere in new code: `backface-visibility`, `rotateY`, `preserve-3d` must not appear (the old iOS bug class).
- No em dashes in visible copy (site convention).
- All interactive init: `document.addEventListener('astro:page-load', ...)` + `id`-scoped root + `if (!root || root.dataset.initialized === 'true') return;` guard.
- Site tokens only: `var(--accent)`, `var(--bg-muted)`, `var(--dot-grid)`, `var(--text-muted)`, `var(--card-shadow)`, Tailwind classes `text-accent`, `bg-muted`, `border-main/20`, `font-display`. New film tokens defined once in `global.css` (Task 1).
- Film chrome is dark in BOTH themes (charcoal `#1c1a17`); paper surfaces swap via existing tokens.
- Film accent amber: `#e8a33d`.
- `InteractiveDashboard.astro` is not modified. Other content files are not modified.
- Prose in `rayTracer.mdx` is preserved verbatim; only component instances and data shapes change.
- No fixed pixel heights on media; use `aspect-ratio` or natural image flow. Filmstrip nav scrolls horizontally (`overflow-x: auto`), never wraps.
- Buttons are real `<button type="button">` elements. Main frame toggle uses `aria-pressed`; thumbnails carry `aria-label`.

## File Structure

- `src/styles/global.css` — append `.film-*` utility recipes + `--film-accent`/`--film-chrome` variables (Task 1)
- `src/components/FilmstripViewer.astro` — new (Task 2)
- `src/components/ContactSheet.astro` — new (Task 3)
- `src/components/TogglePanels.astro` — new (Task 4)
- `src/components/Compare.astro` — add `variant="film"` (Task 5)
- `src/layouts/ProjectLayout.astro` — register new components (Task 6)
- `src/content/projects/rayTracer.mdx` — rewrite data + component usage, prose verbatim (Task 7)

---

### Task 1: Film design tokens and shared recipes in `global.css`

**Files:**
- Modify: `src/styles/global.css` (append inside the file: variables to the existing `:root` / `html.dark` blocks, recipes near the other component recipes like `.spec-strip`)

**Interfaces:**
- Produces: CSS variables `--film-accent`, `--film-chrome`, `--film-paper-on-chrome`; classes `.film-sprockets`, `.film-edgecode`, `.film-negative` used by Tasks 2, 3, 5.

- [ ] **Step 1: Add variables**

In the existing `:root` block (after `--card-shadow`), add:

```css
    --film-accent: #e8a33d;
    --film-chrome: #1c1a17;
    --film-paper-on-chrome: rgba(245, 242, 234, 0.92);
```

In the existing `html.dark` block (after `--card-shadow`), add the same three lines verbatim (film chrome is identical in both themes; declaring in both makes the intent explicit).

- [ ] **Step 2: Add shared recipes**

Append after the `.spec-strip` / callout recipes:

```css
/* ── Film system (rayTracer page): sprockets, edge codes, negatives ── */
.film-sprockets {
    display: flex;
    justify-content: space-between;
    padding: 0.3rem 0.6rem;
}
.film-sprockets i {
    width: 0.85rem;
    height: 0.55rem;
    background-color: var(--film-paper-on-chrome);
    border-radius: 0.125rem;
}
.film-edgecode {
    font-family: var(--font-mono, ui-monospace, monospace);
    font-size: 0.625rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--film-accent);
}
.film-negative {
    filter: invert(1) hue-rotate(180deg) contrast(0.85) brightness(0.5);
}
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: exit 0, no CSS errors.

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add film design tokens and shared recipes"
```

---

### Task 2: `FilmstripViewer.astro`

**Files:**
- Create: `src/components/FilmstripViewer.astro`

**Interfaces:**
- Consumes: Task 1 classes/variables.
- Produces: component with props `{ id: string; eyebrow?: string; title?: string; rolls: Roll[] }` where `Roll = { id: string; label: string; frames: Frame[] }` and `Frame = { image: { src: string; alt: string }; caption: string; edgecode: string; title: string; desc: string; formula?: string; note?: string }`. MDX usage: `<FilmstripViewer id="pt" rolls={...} />`.

- [ ] **Step 1: Write the component**

Create `src/components/FilmstripViewer.astro`:

```astro
---
interface Frame {
    image: { src: string; alt: string };
    caption: string;
    edgecode: string;
    title: string;
    desc: string;
    formula?: string;
    note?: string;
}

interface Roll {
    id: string;
    label: string;
    frames: Frame[];
}

interface Props {
    id: string;
    eyebrow?: string;
    title?: string;
    rolls: Roll[];
}

const { id, eyebrow, title, rolls } = Astro.props;
const rootId = `filmstrip-${id}`;
const firstFrame = rolls[0].frames[0];
---

<div class="not-prose my-8" id={rootId}>
    {(eyebrow || title) && (
        <div class="mb-3">
            {eyebrow && <div class="film-edgecode">{eyebrow}</div>}
            {title && <div class="mt-0.5 font-serif text-lg font-medium">{title}</div>}
        </div>
    )}

    {rolls.length > 1 && (
        <div class="mb-3 flex flex-wrap gap-2">
            {rolls.map((roll, i) => (
                <button
                    type="button"
                    class:list={[
                        'fsv-roll rounded-full border border-main/30 px-3 py-1 text-xs font-medium transition-colors',
                        i === 0 ? 'bg-accent text-white' : 'hover:bg-muted'
                    ]}
                    data-roll-index={i}
                >
                    {roll.label}
                </button>
            ))}
        </div>
    )}

    <button
        type="button"
        class="fsv-frame block w-full cursor-pointer overflow-hidden rounded-lg text-left"
        style="background-color: var(--film-chrome);"
        aria-pressed="false"
        aria-label="Toggle between render and technique details"
        data-rolls={JSON.stringify(rolls)}
    >
        <div class="film-sprockets" aria-hidden="true">
            {Array.from({ length: 8 }).map(() => <i></i>)}
        </div>
        <div class="fsv-gate relative mx-2.5">
            <img
                class="fsv-image block w-full transition-[filter] duration-[450ms]"
                src={firstFrame.image.src}
                alt={firstFrame.image.alt}
            />
            <div class="fsv-negside pointer-events-none absolute inset-0 flex flex-col justify-end p-4 opacity-0 transition-opacity duration-[450ms]">
                <div class="film-edgecode fsv-edgecode mb-1.5">{firstFrame.edgecode}</div>
                <div class="fsv-title text-lg font-bold" style="color: var(--film-paper-on-chrome);">{firstFrame.title}</div>
                <div class="fsv-desc mt-1 text-sm leading-relaxed" style="color: var(--film-paper-on-chrome); opacity: 0.85;">{firstFrame.desc}</div>
                <div
                    class="fsv-formula mt-2 border-t border-dashed pt-2 font-mono text-sm"
                    style={`color: var(--film-accent); border-color: color-mix(in oklab, var(--film-accent) 40%, transparent); ${firstFrame.formula ? '' : 'display: none;'}`}
                >
                    {firstFrame.formula}
                </div>
                <div class="fsv-note mt-1 text-xs" style={`color: var(--film-paper-on-chrome); opacity: 0.7; ${firstFrame.note ? '' : 'display: none;'}`}>
                    {firstFrame.note}
                </div>
            </div>
        </div>
        <div class="flex items-center justify-between px-2.5">
            <div class="fsv-caption film-edgecode py-1.5" style="letter-spacing: 0.08em;">{firstFrame.caption}</div>
            <div class="film-edgecode py-1.5 opacity-60">tap to develop</div>
        </div>
        <div class="film-sprockets" aria-hidden="true">
            {Array.from({ length: 8 }).map(() => <i></i>)}
        </div>
    </button>

    <div class="mt-3 overflow-hidden rounded-md" style="background-color: var(--film-chrome);">
        <div class="film-sprockets" aria-hidden="true">
            {Array.from({ length: 10 }).map(() => <i></i>)}
        </div>
        <div class="fsv-strip flex gap-1.5 overflow-x-auto px-1.5">
            {rolls[0].frames.map((frame, i) => (
                <button
                    type="button"
                    class="fsv-thumb flex-none"
                    data-frame-index={i}
                    aria-label={`Show frame: ${frame.caption}`}
                >
                    <img
                        class:list={['block h-14 w-24 rounded-sm border-2 object-cover', i === 0 ? 'fsv-thumb-on' : 'film-negative opacity-80 border-transparent']}
                        style={i === 0 ? 'border-color: var(--film-accent);' : ''}
                        src={frame.image.src}
                        alt=""
                    />
                    <span class:list={['film-edgecode block py-1 text-center', i !== 0 && 'opacity-50']} style="font-size: 0.5rem; letter-spacing: 0.1em;">
                        {String(i + 1).padStart(2, '0')}
                    </span>
                </button>
            ))}
        </div>
        <div class="film-sprockets" aria-hidden="true">
            {Array.from({ length: 10 }).map(() => <i></i>)}
        </div>
    </div>
</div>

<script define:vars={{ rootId }}>
    document.addEventListener('astro:page-load', () => {
        const root = document.getElementById(rootId);
        if (!root || root.dataset.initialized === 'true') return;
        root.dataset.initialized = 'true';

        const frameBtn = root.querySelector('.fsv-frame');
        const rolls = JSON.parse(frameBtn.dataset.rolls);
        const img = root.querySelector('.fsv-image');
        const negSide = root.querySelector('.fsv-negside');
        const strip = root.querySelector('.fsv-strip');

        let rollIndex = 0;
        let frameIndex = 0;
        let developed = false;

        function currentFrame() {
            return rolls[rollIndex].frames[frameIndex];
        }

        function setDeveloped(on) {
            developed = on;
            frameBtn.setAttribute('aria-pressed', String(on));
            img.classList.toggle('film-negative', on);
            negSide.classList.toggle('opacity-0', !on);
        }

        function renderFrame() {
            const f = currentFrame();
            img.src = f.image.src;
            img.alt = f.image.alt;
            root.querySelector('.fsv-caption').textContent = f.caption;
            root.querySelector('.fsv-edgecode').textContent = f.edgecode;
            root.querySelector('.fsv-title').textContent = f.title;
            root.querySelector('.fsv-desc').textContent = f.desc;
            const formula = root.querySelector('.fsv-formula');
            formula.textContent = f.formula ?? '';
            formula.style.display = f.formula ? '' : 'none';
            const note = root.querySelector('.fsv-note');
            note.textContent = f.note ?? '';
            note.style.display = f.note ? '' : 'none';

            strip.querySelectorAll('.fsv-thumb').forEach((thumb, i) => {
                const tImg = thumb.querySelector('img');
                const tLbl = thumb.querySelector('span');
                const active = i === frameIndex;
                tImg.classList.toggle('film-negative', !active);
                tImg.classList.toggle('opacity-80', !active);
                tImg.classList.toggle('fsv-thumb-on', active);
                tImg.style.borderColor = active ? 'var(--film-accent)' : 'transparent';
                tLbl.classList.toggle('opacity-50', !active);
            });
        }

        function renderStrip() {
            const frames = rolls[rollIndex].frames;
            strip.innerHTML = '';
            frames.forEach((f, i) => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'fsv-thumb flex-none';
                btn.dataset.frameIndex = String(i);
                btn.setAttribute('aria-label', `Show frame: ${f.caption}`);
                const tImg = document.createElement('img');
                tImg.className = 'block h-14 w-24 rounded-sm border-2 object-cover';
                tImg.src = f.image.src;
                tImg.alt = '';
                const tLbl = document.createElement('span');
                tLbl.className = 'film-edgecode block py-1 text-center';
                tLbl.style.fontSize = '0.5rem';
                tLbl.style.letterSpacing = '0.1em';
                tLbl.textContent = String(i + 1).padStart(2, '0');
                btn.appendChild(tImg);
                btn.appendChild(tLbl);
                btn.addEventListener('click', () => {
                    frameIndex = i;
                    setDeveloped(false);
                    renderFrame();
                });
                strip.appendChild(btn);
            });
            renderFrame();
        }

        frameBtn.addEventListener('click', () => setDeveloped(!developed));

        strip.querySelectorAll('.fsv-thumb').forEach((thumb) => {
            thumb.addEventListener('click', () => {
                frameIndex = Number(thumb.dataset.frameIndex);
                setDeveloped(false);
                renderFrame();
            });
        });

        root.querySelectorAll('.fsv-roll').forEach((btn) => {
            btn.addEventListener('click', () => {
                rollIndex = Number(btn.dataset.rollIndex);
                frameIndex = Math.min(frameIndex, rolls[rollIndex].frames.length - 1);
                setDeveloped(false);
                root.querySelectorAll('.fsv-roll').forEach((b) => {
                    b.classList.remove('bg-accent', 'text-white');
                    b.classList.add('hover:bg-muted');
                });
                btn.classList.add('bg-accent', 'text-white');
                btn.classList.remove('hover:bg-muted');
                renderStrip();
            });
        });
    });
</script>
```

Notes for the implementer:
- The whole main frame is a single `<button>`, so Enter/Space keyboard toggling comes free; `aria-pressed` tracks state.
- The negative side text sits over the inverted image (spec: darkroom invert, no 3D flip).
- `renderStrip` rebuilds thumbnails on roll switch because rolls have different frame counts (5 vs 8).

- [ ] **Step 2: Verify build and grep constraints**

Run: `npm run build && grep -rn "backface-visibility\|rotateY\|preserve-3d" src/components/FilmstripViewer.astro || echo "CLEAN"`
Expected: build exit 0; grep prints `CLEAN` (no matches).

- [ ] **Step 3: Commit**

```bash
git add src/components/FilmstripViewer.astro
git commit -m "feat: add FilmstripViewer component with darkroom invert"
```

---

### Task 3: `ContactSheet.astro`

**Files:**
- Create: `src/components/ContactSheet.astro`

**Interfaces:**
- Consumes: Task 1 classes.
- Produces: props `{ id: string; eyebrow?: string; title?: string; cells: Cell[] }` where `Cell = { title: string; desc: string; href?: string; details?: { label: string; value: string }[] }`. Zero JS.

- [ ] **Step 1: Write the component**

Create `src/components/ContactSheet.astro`:

```astro
---
interface Cell {
    title: string;
    desc: string;
    href?: string;
    details?: { label: string; value: string }[];
}

interface Props {
    id: string;
    eyebrow?: string;
    title?: string;
    cells: Cell[];
}

const { id, eyebrow, title, cells } = Astro.props;
---

<div class="not-prose my-8" id={`contactsheet-${id}`}>
    {(eyebrow || title) && (
        <div class="mb-3">
            {eyebrow && <div class="film-edgecode">{eyebrow}</div>}
            {title && <div class="mt-0.5 font-serif text-lg font-medium">{title}</div>}
        </div>
    )}
    <div class="grid gap-3 sm:grid-cols-2">
        {cells.map((cell, i) => {
            const Tag = cell.href ? 'a' : 'div';
            return (
                <Tag
                    href={cell.href}
                    target={cell.href ? '_blank' : undefined}
                    rel={cell.href ? 'noreferrer' : undefined}
                    class:list={[
                        'block rounded-md border border-main/20 bg-muted p-4',
                        cell.href && 'transition-colors hover:border-accent'
                    ]}
                    style="background-image: radial-gradient(var(--dot-grid) 1px, transparent 1px); background-size: 16px 16px;"
                >
                    <div class="film-edgecode mb-2" style="color: var(--film-accent);">
                        {String(i + 1).padStart(2, '0')}
                    </div>
                    <div class="text-sm font-bold">{cell.title}</div>
                    <p class="mt-1.5 text-sm leading-relaxed" style="color: var(--text-muted);">{cell.desc}</p>
                    {cell.details && cell.details.length > 0 && (
                        <dl class="mt-3 border-t border-dashed border-main/20 pt-2">
                            {cell.details.map((d) => (
                                <div class="flex gap-2 py-0.5">
                                    <dt class="film-edgecode flex-none" style="font-size: 0.5625rem;">{d.label}</dt>
                                    <dd class="text-xs" style="color: var(--text-muted);">{d.value}</dd>
                                </div>
                            ))}
                        </dl>
                    )}
                </Tag>
            );
        })}
    </div>
</div>
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/ContactSheet.astro
git commit -m "feat: add static ContactSheet grid component"
```

---

### Task 4: `TogglePanels.astro`

**Files:**
- Create: `src/components/TogglePanels.astro`

**Interfaces:**
- Produces: props `{ id: string; labels: [string, string] }` with named slots `a` and `b`. MDX usage:
  `<TogglePanels id="renderer" labels={["Path Tracer", "Ray Tracer"]}><div slot="a">...</div><div slot="b">...</div></TogglePanels>`

- [ ] **Step 1: Write the component**

Create `src/components/TogglePanels.astro`:

```astro
---
interface Props {
    id: string;
    labels: [string, string];
}

const { id, labels } = Astro.props;
const rootId = `toggle-${id}`;
---

<div class="not-prose my-8" id={rootId}>
    <div class="mb-4 inline-flex rounded-lg border border-main/30 p-1" role="tablist">
        {labels.map((label, i) => (
            <button
                type="button"
                role="tab"
                aria-selected={i === 0 ? 'true' : 'false'}
                class:list={[
                    'tp-tab rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
                    i === 0 ? 'bg-accent text-white' : 'hover:bg-muted'
                ]}
                data-panel-index={i}
            >
                {label}
            </button>
        ))}
    </div>
    <div class="tp-panel" data-panel="0"><slot name="a" /></div>
    <div class="tp-panel hidden" data-panel="1"><slot name="b" /></div>
</div>

<script define:vars={{ rootId }}>
    document.addEventListener('astro:page-load', () => {
        const root = document.getElementById(rootId);
        if (!root || root.dataset.initialized === 'true') return;
        root.dataset.initialized = 'true';

        const tabs = root.querySelectorAll('.tp-tab');
        const panels = root.querySelectorAll('.tp-panel');

        tabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                const index = tab.dataset.panelIndex;
                tabs.forEach((t) => {
                    const active = t === tab;
                    t.setAttribute('aria-selected', String(active));
                    t.classList.toggle('bg-accent', active);
                    t.classList.toggle('text-white', active);
                    t.classList.toggle('hover:bg-muted', !active);
                });
                panels.forEach((p) => p.classList.toggle('hidden', p.dataset.panel !== index));
            });
        });
    });
</script>
```

Note: `querySelectorAll('.tp-panel')` only matches this root's direct panels here because panel markup is unique to this component; there is exactly one `TogglePanels` on the page. If nested toggles are ever needed, scope with `:scope > .tp-panel`.

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/TogglePanels.astro
git commit -m "feat: add TogglePanels segmented control component"
```

---

### Task 5: `Compare.astro` film variant

**Files:**
- Modify: `src/components/Compare.astro`

**Interfaces:**
- Consumes: existing `Compare` props + Task 1 classes.
- Produces: new optional prop `variant?: 'default' | 'film'` (default `'default'`). All existing usages (`mobileGames`, etc.) unaffected. Film variant: sprocket rows above/below the frame, thumbnail scene strip instead of pill tabs, edge-code corner labels.

- [ ] **Step 1: Extend props**

In the frontmatter, add to `interface Props`:

```ts
    variant?: 'default' | 'film';
```

and destructure:

```ts
const { id, eyebrow, title, beforeLabel = 'Before', afterLabel = 'After', aspectRatio = '3 / 2', scenes, variant = 'default' } = Astro.props;
const isFilm = variant === 'film';
```

- [ ] **Step 2: Wrap the frame in film chrome**

Replace the scene-tabs block (the `{scenes.length > 1 && (...)}` pill row) with a conditional: keep the existing pill row when `!isFilm`; when `isFilm`, render a thumbnail strip after the frame instead (Step 3). Wrap the existing `.compare-frame` div: when `isFilm`, it is preceded and followed by sprocket rows inside a chrome wrapper:

```astro
    {!isFilm && scenes.length > 1 && (
        <div class="compare-scene-tabs mb-3 flex flex-wrap gap-2">
            {scenes.map((scene, i) => (
                <button
                    type="button"
                    class:list={['rounded-full border border-main/30 px-3 py-1 text-xs font-medium transition-colors', i === 0 ? 'bg-accent text-white' : 'hover:bg-muted']}
                    data-scene-index={i}
                >
                    {scene.label}
                </button>
            ))}
        </div>
    )}

    <div class:list={[isFilm && 'overflow-hidden rounded-lg']} style={isFilm ? 'background-color: var(--film-chrome);' : undefined}>
        {isFilm && (
            <div class="film-sprockets" aria-hidden="true">
                {Array.from({ length: 8 }).map(() => <i></i>)}
            </div>
        )}
        <div
            class:list={[
                'compare-frame relative w-full touch-none overflow-hidden select-none',
                isFilm ? 'mx-2.5 !w-auto rounded-sm' : 'rounded-lg border border-main/20'
            ]}
            style={`aspect-ratio: ${aspectRatio}; --compare-pos: 50%;`}
            data-scenes={JSON.stringify(scenes)}
        >
```

(inner contents of `.compare-frame` unchanged, except the two bottom labels:)

```astro
        <span class:list={['pointer-events-none absolute bottom-2 left-2 rounded px-2 py-0.5', isFilm ? 'film-edgecode bg-black/70' : 'bg-black/60 text-xs text-white']}>{beforeLabel}</span>
        <span class:list={['pointer-events-none absolute right-2 bottom-2 rounded px-2 py-0.5', isFilm ? 'film-edgecode bg-black/70' : 'bg-black/60 text-xs text-white']}>{afterLabel}</span>
```

then close the frame and add:

```astro
        {isFilm && (
            <div class="film-sprockets" aria-hidden="true">
                {Array.from({ length: 8 }).map(() => <i></i>)}
            </div>
        )}
    </div>

    {isFilm && scenes.length > 1 && (
        <div class="mt-3 overflow-hidden rounded-md" style="background-color: var(--film-chrome);">
            <div class="compare-scene-tabs flex gap-1.5 overflow-x-auto px-1.5 py-1.5">
                {scenes.map((scene, i) => (
                    <button type="button" class="flex-none" data-scene-index={i} aria-label={`Show scene: ${scene.label}`}>
                        <img
                            class:list={['compare-thumb block h-12 w-20 rounded-sm border-2 object-cover', i === 0 ? '' : 'film-negative opacity-80']}
                            style={i === 0 ? 'border-color: var(--film-accent);' : 'border-color: transparent;'}
                            src={scene.after.src}
                            alt=""
                        />
                        <span class:list={['film-edgecode block py-0.5 text-center', i !== 0 && 'opacity-50']} style="font-size: 0.5rem;">{scene.label}</span>
                    </button>
                ))}
            </div>
        </div>
    )}
```

- [ ] **Step 3: Update the script's active-state handling**

The existing scene-click handler toggles pill classes. Make it variant-aware. Pass `isFilm` through `define:vars`:

```js
<script define:vars={{ rootId, isFilm }}>
```

and replace the class-toggling block inside the scene click handler with:

```js
                if (isFilm) {
                    root.querySelectorAll('[data-scene-index]').forEach((b) => {
                        const t = b.querySelector('.compare-thumb');
                        const lbl = b.querySelector('span');
                        const active = b === btn;
                        t.classList.toggle('film-negative', !active);
                        t.classList.toggle('opacity-80', !active);
                        t.style.borderColor = active ? 'var(--film-accent)' : 'transparent';
                        lbl.classList.toggle('opacity-50', !active);
                    });
                } else {
                    root.querySelectorAll('[data-scene-index]').forEach((b) => {
                        b.classList.remove('bg-accent', 'text-white');
                        b.classList.add('hover:bg-muted');
                    });
                    btn.classList.add('bg-accent', 'text-white');
                    btn.classList.remove('hover:bg-muted');
                }
```

Pointer/drag logic is untouched.

- [ ] **Step 4: Verify build and other pages unaffected**

Run: `npm run build && grep -rln "Compare" src/content/projects/ | xargs grep -l 'variant="film"' || echo "no film usage yet"`
Expected: build exit 0; `no film usage yet` (Task 7 adds the usage). Confirm `dist/projects/mobile-games/index.html` (an existing Compare consumer, if present) still builds by checking build output lists all pages.

- [ ] **Step 5: Commit**

```bash
git add src/components/Compare.astro
git commit -m "feat: add opt-in film variant to Compare"
```

---

### Task 6: Register components in `ProjectLayout.astro`

**Files:**
- Modify: `src/layouts/ProjectLayout.astro:3-9` (imports) and `:93` (components map)

**Interfaces:**
- Consumes: Tasks 2, 3, 4 components.
- Produces: MDX files can use `<FilmstripViewer>`, `<ContactSheet>`, `<TogglePanels>` without imports.

- [ ] **Step 1: Add imports and registrations**

Add imports (alphabetical with existing):

```astro
import ContactSheet from '../components/ContactSheet.astro';
import FilmstripViewer from '../components/FilmstripViewer.astro';
import TogglePanels from '../components/TogglePanels.astro';
```

Change line 93 to:

```astro
            <Content components={{ InteractiveDashboard, Compare, Gallery, MediaEmbed, Callout, Button, FilmstripViewer, ContactSheet, TogglePanels }} />
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/ProjectLayout.astro
git commit -m "feat: register film components in ProjectLayout"
```

---

### Task 7: Rewrite `rayTracer.mdx`

**Files:**
- Modify: `src/content/projects/rayTracer.mdx`

**Interfaces:**
- Consumes: all new components. Frontmatter unchanged.

**Content mapping (source data is already in the current file — reshape, do not rewrite copy):**

| Current export | Becomes |
|---|---|
| `ptTechniqueSections[0].cards` (5) | `ptRolls` — 1 roll, 5 frames. `image`→`image`; card `title`→frame `title`; `desc`→`desc`; `details[0].value` ("Focus")→ part of `edgecode`; `details[1].value` ("Formula")→`formula`; `details[2].value` ("Note")→`note`. `caption` = `"<scene> · 512 spp"`; `edgecode` = `` `PT-512 ▸ FRAME 0${i+1} ▸ ${focus}` `` |
| `baseRtStepDefs` / `reflectionRtStepDefs` + `toRtSteps` | `rtRolls` — 3 rolls (Snow 5, Spheres 5, Test2 5+3). Keep a `toRtFrames(scene, defs)` builder: `label`→`title`, `sub`→ focus in `edgecode` (`` `RT ▸ STAGE 0${i+1} ▸ ${sub}` ``), `detail`→`desc`, `details[0].value`→`formula`, `details[1].value`→`note`, `caption` = `` `${scene} · stage ${i+1}` `` |
| `sppCompareScenes` | unchanged, passed to `<Compare variant="film">` |
| `ptFeatureSections[0].cards` (5) | `ptFeatureCells` — `{ title, desc }` (drop `icon`) |
| `rtFeatureSections[0].cards` (5) | `rtFeatureCells` — `{ title, desc }` (drop `icon`) |
| `repoSections[0].cards` (4) | `repoCells` — `{ title, desc, href: actions[0].href, details }` (drop `icon`/`actions`) |

- [ ] **Step 1: Rewrite the data exports**

Replace `ptTechniqueSections` with:

```js
export const ptRolls = [
  {
    id: "pt",
    label: "Path Tracer",
    frames: [
      {
        image: { src: "/CS420/rayTracing/PathTracing/512/SIGGRAPH.jpg", alt: "SIGGRAPH path trace" },
        caption: "SIGGRAPH · 512 spp",
        edgecode: "PT-512 ▸ FRAME 01 ▸ global illumination",
        title: "Monte Carlo Path Tracing",
        desc: "The rendering equation describes how light accumulates at a point by integrating incoming radiance over the hemisphere. Monte Carlo integration approximates this integral by averaging many random ray samples, each sample traces a full light path through the scene, bouncing off surfaces and accumulating color.",
        formula: "L_o = L_e + ∫ f_r · L_i · cosθ dω",
        note: "f_r is the BRDF, L_i is incoming radiance, cosθ is the angle to the surface normal."
      },
      {
        image: { src: "/CS420/rayTracing/PathTracing/512/snow.jpg", alt: "Snow path trace" },
        caption: "Snow · 512 spp",
        edgecode: "PT-512 ▸ FRAME 02 ▸ importance sampling",
        title: "Cosine-Weighted Hemisphere Sampling",
        desc: "Uniform hemisphere sampling wastes samples on directions that contribute little energy. Cosine-weighted sampling concentrates samples near the surface normal where the cosine term is largest, reducing variance without bias. The PDF cancels cleanly against the cosine term in the rendering equation.",
        formula: "pdf(ω) = cosθ / π",
        note: "Sampling proportional to cosθ means the pdf cancels the cosine term, leaving just the BRDF contribution."
      },
      {
        image: { src: "/CS420/rayTracing/PathTracing/512/spheres.jpg", alt: "Spheres path trace" },
        caption: "Spheres · 512 spp",
        edgecode: "PT-512 ▸ FRAME 03 ▸ russian roulette",
        title: "Russian Roulette Termination",
        desc: "Truncating paths at a fixed depth introduces bias. Russian Roulette instead terminates paths probabilistically based on albedo brightness, high-albedo surfaces survive more often, low-albedo paths terminate early. Surviving paths are divided by their survival probability to keep the estimator unbiased.",
        formula: "L = L_direct + (albedo · L_indirect) / p_survive",
        note: "p_survive is clamped between 0.1 and 0.95 based on the max albedo channel."
      },
      {
        image: { src: "/CS420/rayTracing/PathTracing/512/table.jpg", alt: "Table path trace" },
        caption: "Table · 512 spp",
        edgecode: "PT-512 ▸ FRAME 04 ▸ next event estimation",
        title: "Next Event Estimation",
        desc: "Pure path tracing rarely hits light sources by random sampling, causing high variance. Next Event Estimation (NEE) explicitly samples each light at every bounce, combining direct lighting with the indirect bounce. This dramatically reduces noise, especially in scenes with small or distant lights.",
        formula: "L = L_direct(NEE) + albedo · L_indirect",
        note: "Direct light is computed by shadow ray to each point light. Indirect comes from the random bounce."
      },
      {
        image: { src: "/CS420/rayTracing/PathTracing/512/test2.jpg", alt: "Test2 path trace" },
        caption: "Test2 · 512 spp",
        edgecode: "PT-512 ▸ FRAME 05 ▸ anti-aliasing",
        title: "Jittered Per-Pixel Sampling",
        desc: "Rather than firing one ray through the exact pixel center, jittered sampling adds a random sub-pixel offset to each of the 64 or 512 samples. This distributes samples across the pixel area, simultaneously anti-aliasing edges and reducing noise compared to uniform sampling.",
        formula: "color = (1/N) · Σ traceRay(x + ξx, y + ξy)",
        note: "ξx and ξy are uniform random offsets in [0,1) per sample. N = 64 or 512."
      }
    ]
  }
];
```

Keep `baseRtStepDefs` and `reflectionRtStepDefs` exactly as they are (content unchanged). Replace `toRtSteps` and `rtProgressionSections` with:

```js
export function toRtFrames(scene, defs, startIndex = 0) {
  return defs.map((d, i) => ({
    image: { src: `/CS420/rayTracing/${scene}/${d.file}`, alt: `${scene} - ${d.label}` },
    caption: `${scene} · stage ${startIndex + i + 1}`,
    edgecode: `RT ▸ STAGE ${String(startIndex + i + 1).padStart(2, '0')} ▸ ${d.sub}`,
    title: d.label,
    desc: d.detail,
    formula: d.details[0].value,
    note: d.details[1].value
  }));
}

export const rtRolls = [
  { id: "snow", label: "Snow", frames: toRtFrames("Snow", baseRtStepDefs) },
  { id: "spheres", label: "Spheres", frames: toRtFrames("Spheres", baseRtStepDefs) },
  { id: "test2", label: "Test2", frames: [...toRtFrames("Test2", baseRtStepDefs), ...toRtFrames("Test2", reflectionRtStepDefs, 5)] }
];
```

Keep `sppCompareScenes` unchanged. Replace `ptFeatureSections`, `rtFeatureSections`, `repoSections` with:

```js
export const ptFeatureCells = [
  { title: "Monte Carlo Global Illumination", desc: "Each pixel samples 64 or 512 random light paths. Every path bounces up to 5 times, accumulating color from each surface it hits. The average of all samples approximates the rendering equation integral, producing physically accurate indirect lighting without precomputed light maps." },
  { title: "Cosine-Weighted Hemisphere Sampling", desc: "Bounce directions are sampled proportionally to the cosine of the angle from the surface normal. This concentrates samples where they contribute most energy, reducing variance compared to uniform hemisphere sampling. The cosine term in the rendering equation cancels against the PDF, simplifying the estimator." },
  { title: "Russian Roulette Termination", desc: "Paths are terminated probabilistically based on surface albedo rather than a fixed depth limit. High-albedo surfaces have a higher survival probability; low-albedo paths terminate early. Surviving paths divide their contribution by the survival probability to maintain an unbiased estimate." },
  { title: "Next Event Estimation", desc: "At every bounce, a shadow ray is fired directly to each point light and its contribution is added to the path. This explicit direct lighting sampling dramatically reduces variance in the indirect lighting estimate, especially in scenes where random rays rarely hit light sources." },
  { title: "Ray Tracer Foundation", desc: "The path tracer extends a from-scratch ray tracer implementing sphere and triangle intersection, Phong shading with barycentric normal interpolation, shadow rays, 2×2 supersampling anti-aliasing, and configurable-depth recursive reflections - all built without reliance on existing rendering engines." }
];

export const rtFeatureCells = [
  { title: "Ray Generation", desc: "For every pixel in a 640x480 image, a ray is fired from the camera into the scene. The direction of each ray is computed from the field of view and aspect ratio, mapping screen coordinates into 3D camera space." },
  { title: "Geometry Intersection", desc: "Two primitive types are supported. Spheres use a quadratic intersection formula, solving for where the ray meets the sphere surface. Triangles use a plane intersection followed by a barycentric coordinate test to confirm the hit lands inside the triangle boundary. The same barycentric weights are reused later for smooth shading." },
  { title: "Phong Illumination", desc: "Lighting is computed per hit point using the Phong model, combining an ambient base, a diffuse term that responds to the angle between the surface and light, and a specular highlight that sharpens on glossy materials. Triangle surfaces interpolate normals and material properties across the surface using barycentric coordinates, giving smooth gradients instead of flat facets." },
  { title: "Shadow Rays", desc: "After every surface hit, a secondary ray is fired toward each light source. If any geometry blocks the path, that light is excluded from the final color. Scenes with multiple lights produce partial shadows correctly." },
  { title: "Extensions", desc: "Two extra features were implemented in separate branches. Antialiasing fires a 2x2 grid of rays per pixel and averages the result, smoothing jagged silhouette edges. Recursive reflections bounce rays off surfaces up to a configurable depth, blending reflected scene color with local Phong shading weighted by the surface's specular value." }
];

export const repoCells = [
  {
    title: "Path-Tracing",
    desc: "Full Monte Carlo path tracer with cosine-weighted sampling, Russian Roulette termination, Next Event Estimation, and 64/512 spp jittered sampling.",
    href: "https://github.com/pranavsrathod/Ray-Tracing/tree/path-tracer",
    details: [
      { label: "Branch", value: "path-tracer" },
      { label: "Tags", value: "C++, Global Illumination, Monte Carlo" }
    ]
  },
  {
    title: "Ray-Tracing (main)",
    desc: "Core ray tracer - ray generation, sphere and triangle intersection, Phong shading, and shadow rays. Built in C++ from scratch.",
    href: "https://github.com/pranavsrathod/Ray-Tracing",
    details: [
      { label: "Branch", value: "main" },
      { label: "Tags", value: "C++, OpenGL, GLUT" }
    ]
  },
  {
    title: "Ray-Tracing (antialiasing)",
    desc: "2×2 grid supersampling - fires four rays per pixel and averages the result, smoothing jagged edges on curved surfaces.",
    href: "https://github.com/pranavsrathod/Ray-Tracing/tree/antialiasing",
    details: [
      { label: "Branch", value: "antialiasing" },
      { label: "Tags", value: "Supersampling" }
    ]
  },
  {
    title: "Ray-Tracing (reflections)",
    desc: "Recursive reflection rays with configurable bounce depth. Final color blends local Phong shading with reflected scene color weighted by the surface's specular value.",
    href: "https://github.com/pranavsrathod/Ray-Tracing/tree/reflections",
    details: [
      { label: "Branch", value: "reflections" },
      { label: "Tags", value: "Recursion" }
    ]
  }
];
```

- [ ] **Step 2: Rewrite the component usage sections**

Replace the section from `## Path Tracer` through the `<InteractiveDashboard id="rt-progression" ... />` line with:

```mdx
## Renderer Viewer

<TogglePanels id="renderer" labels={["Path Tracer", "Ray Tracer"]}>
  <div slot="a">
    <FilmstripViewer id="pt" eyebrow="REEL A ▸ PATH TRACER" rolls={ptRolls} />
    <Compare
      id="spp"
      variant="film"
      eyebrow="REEL A ▸ SAMPLE COUNT"
      title="64 spp vs 512 spp"
      beforeLabel="64 spp"
      afterLabel="512 spp"
      scenes={sppCompareScenes}
    />
  </div>
  <div slot="b">
    <FilmstripViewer id="rt" eyebrow="REEL B ▸ RAY TRACER" rolls={rtRolls} />
  </div>
</TogglePanels>
```

Replace `<InteractiveDashboard id="pt-core-features" sections={ptFeatureSections} />` with:

```mdx
<ContactSheet id="pt-features" eyebrow="CONTACT SHEET ▸ PATH TRACER" cells={ptFeatureCells} />
```

Replace `<InteractiveDashboard id="rt-core-features" sections={rtFeatureSections} />` with:

```mdx
<ContactSheet id="rt-features" eyebrow="CONTACT SHEET ▸ RAY TRACER" cells={rtFeatureCells} />
```

Replace the `repoSections` export usage `<InteractiveDashboard id="source-repos" sections={repoSections} />` with:

```mdx
<ContactSheet id="repos" eyebrow="CONTACT SHEET ▸ REPOSITORIES" cells={repoCells} />
```

All prose sections (`## Overview`, `## What Is a Path Tracer?`, `## Core Features` headings, `## What Is a Ray Tracer?`, `## Applications and Tradeoffs`, `## Source Code`, the figure, the table, the sources line) remain byte-for-byte unchanged, EXCEPT: add an amber eyebrow line directly above each of these prose headings (spec: "section eyebrows tie prose sections in"). The line goes immediately before the `##` heading with a blank line between:

```mdx
<div class="film-edgecode not-prose">REEL A ▸ WHAT IS A PATH TRACER?</div>

## What Is a Path Tracer?
```

Eyebrow text per heading: `REEL A ▸ WHAT IS A PATH TRACER?`, `REEL A ▸ CORE FEATURES` (PT), `REEL B ▸ WHAT IS A RAY TRACER?`, `REEL B ▸ CORE FEATURES` (RT), `INDEX ▸ APPLICATIONS AND TRADEOFFS`, `INDEX ▸ SOURCE CODE`. The heading text itself is unchanged.

- [ ] **Step 3: Verify build, greps, and content counts**

```bash
npm run build
grep -c "InteractiveDashboard" src/content/projects/rayTracer.mdx   # expect 0
grep -rn "backface-visibility\|rotateY\|preserve-3d" src/components/FilmstripViewer.astro src/components/TogglePanels.astro src/content/projects/rayTracer.mdx || echo CLEAN
```

Expected: build exit 0; `0` dashboard references; `CLEAN`. Then verify frame counts in the built page data: PT roll has 5 frames, rtRolls has 3 rolls with 5/5/8 frames, sppCompareScenes has 5 scenes.

- [ ] **Step 4: Commit**

```bash
git add src/content/projects/rayTracer.mdx
git commit -m "feat: rebuild rayTracer page on filmstrip viewer system"
```

---

### Task 8: Full verification pass

**Files:** none (verification only)

- [ ] **Step 1: Build and preview**

```bash
npm run build && npm run preview
```

- [ ] **Step 2: Browser checks on /projects/ray-tracer (or actual slug)**

Confirm the slug first: `ls dist/projects/`. Then at desktop width, light and dark themes:
- Toggle switches PT and RT panels; PT shows viewer + spp compare, RT shows viewer with 3 roll chips.
- Tapping main frame crossfades to inverted render with amber edge-code text; tapping again restores. `aria-pressed` flips (inspect element).
- Thumbnail strip: active frame full color + amber border, inactive frames inverted; clicking switches the main frame and resets to positive.
- Roll chips (RT): switching Snow→Test2 rebuilds strip to 8 frames; frame index preserved/clamped.
- Compare: drag handle works; scene thumbnails switch images.
- Contact sheets render as static grids; repo cells link out.

- [ ] **Step 3: Mobile viewports**

At 375px and 390px widths, both themes:
- No page-level horizontal scrollbar (`document.documentElement.scrollWidth <= innerWidth` in console).
- Filmstrip and Compare thumbnail strips scroll horizontally within their own containers.
- Negative-side text is readable on the smallest render (if text overflows the image on 375px, reduce `.fsv-desc` clamp: add `line-clamp` utility classes or shrink font, and re-verify).

- [ ] **Step 4: View Transitions re-init**

From the ray tracer page, client-side navigate to another project and back (use the View Next links). Viewer, toggle, and compare must still respond (the `astro:page-load` listeners re-run; `dataset.initialized` guards prevent double-binding on the new DOM since it is fresh).

- [ ] **Step 5: Regression check on other pages**

Spot-check `mobileGames`, `robotics`, `ourHouseInVR` render unchanged (they still use `InteractiveDashboard` and default `Compare`).

- [ ] **Step 6: Final grep + commit any fixes**

```bash
grep -rn "backface-visibility\|rotateY\|preserve-3d" src/components/ src/content/projects/rayTracer.mdx || echo CLEAN
```

Expected: `CLEAN`. Commit any small fixes made during verification:

```bash
git add -u && git commit -m "fix: polish filmstrip viewer verification issues"
```
