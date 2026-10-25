# Mumbai Street — project page draft

This is a separate technical case study for the portfolio's Projects collection. It complements the personal blog story in `blog-draft/mumbai-story`; both drafts now include the wrapper’s evolution.

- **Edit:** `mumbai-street.mdx`, the main source.
- **Review:** `preview.html`, built from that actual MDX with Astro.
- **Portable export:** `mumbai-street.md`, with widgets expanded into static images, explanations and technical notes.
- **Evidence:** `evidence-map.md`, including the distinction between historical records and current implementation.

Revised October 25 to lead with a concise visual case study and preserve interview depth through progressive disclosure. It still uses the actual Astro project pages and native layout from `/Users/pranavrathod/Desktop/Website` as its format reference.

The public case leads with product, contribution, and three decisions: camera ownership, the geometry/HTML contract, and depth-aware rendering. A request-token model, a source-backed wrapper timeline, a rendering comparison, a pipeline schematic, and a saved bounded handoff make the decisions inspectable. Equations, pseudocode, loading/lifetime explanations, an interruption timeline, checkpoints, and revision cards remain inside the expandable interview notebook. Substantial AI implementation is explicit.

`linkedin-post.md` contains the revised social post, with the creative-process URL left as a placeholder. `positioning-notes.md` records the editorial rationale, dated primary employer references and claim boundaries. Neither file publishes or sends anything.

## Preview and rebuild

Serve this folder to review the native Astro components and client-side interactions:

```sh
python3 -m http.server 5195 --bind 127.0.0.1
```

Then open `http://127.0.0.1:5195/preview.html`.

From the Blender workspace, rebuild using the existing installed dependencies:

```sh
node project-draft/mumbai-street/scripts/prepare-assets.mjs
node project-draft/mumbai-street/scripts/draw-architecture.mjs
node project-draft/mumbai-street/scripts/build-preview.mjs
```

Media preparation uses Sharp. The preview build reads the actual Website checkout's `ProjectLayout`, components, theme, collection schema, and Astro/MDX/math configuration into an isolated temporary fixture. It uses that checkout's installed dependencies, exports the rendered article as Markdown, and writes `preview.html` plus `preview-assets/`. The Website checkout and live application remain unchanged. Set `MUMBAI_PREVIEW_WEBSITE` to another absolute checkout path if needed.

Preview-only changes disable analytics, add a private/noindex banner, localize KaTeX CSS/fonts, and send links to other portfolio pages to the real website. Use `node project-draft/mumbai-street/scripts/build-preview.mjs --check` for a temporary build without replacing deliverables.

The architecture has dedicated desktop and phone artwork. The page reuses native `Compare`, `ContactSheet`, and `Callout` components. `WrapperEvolution.astro` compares five recovered geometry versions, with explicit playback and a camera-cue timing schematic. The October 19 single-version pose filmstrip remains in the archive. The small `components/project-study.css` override establishes the editorial hierarchy and makes filmstrip notes readable on phones. `CameraOwnership.astro` is an explanatory model of the route-token check, explicitly distinct from live telemetry. `RenderPipeline.astro` is a schematic, not a render-target capture. `HandoffEvidence.astro` pairs a condensed saved brief with the existing reimported-GLB image. `AgentWorkflow.astro` records the configured review protocol.

## Publish later

This folder is outside the existing website collections. The page remains an unpublished draft. The existing project schema does not have a draft filter: `isFeatured: false` controls featuring, not publication.

For the richer version, copy `mumbai-street.mdx` into the website's `src/content/projects/`, copy this folder's `components/` files into the site's components directory, and update all component and CSS import paths to that location. Copy `public/ProjectPhotos/mumbai-street/` into the site's `public/ProjectPhotos/`. The frontmatter is validated against the existing Projects schema. Native components are already supplied by the site's `ProjectLayout`, and its Markdown math configuration renders the equations. The layout supplies the hero; the body deliberately avoids repeating it.

For a component-free version, copy the generated `mumbai-street.md` and the same media directory. Its widgets become static images and readable notes; equations remain Markdown math. Publish only one source version to avoid duplicate entries. Keep `preview-assets/` and the local preview HTML out of the website's content collection.

Review the draft date, final creative-process URL, latest release status and remaining acceptance notes before publishing. The October 24 browser visit verified the displayed live street and supplied the hero image; it did not audit every deployed feature. October 17 rendering comparisons remain archive views. The October 25 wrapper is a frozen local export; earlier wrapper clips are re-rendered from dated source with common current food, artwork, camera and normalized progress. They are not period recordings. No whole-application release certification follows from this writing task.

Keep `evidence-map.md`, source reports, and this README as working material rather than placing internal notes into the public collection.

## Evidence and provenance

`sources/media-manifest.json` identifies every visual and its transformation. The saved biscuit brief and its reports are copied into `sources/evidence/` for convenient review. They are actual saved artifacts; the study guide's suggested garage brief is not presented as a historical transcript.

The article uses no historical timing or asset-budget figure as a current benchmark. Some later source changes have pending browser acceptance; the page describes targeted recorded checks and identifies the remaining device/performance work. Archive captures retain their original pixels and predate the later newspaper masthead correction.

Previous versions are preserved in `sources/drafts/project-summary-2026-10-20.mdx` and `sources/drafts/project-notebook-2026-10-21.mdx`. The separate personal story retains its original three-act scope and voice.

Preview checks and screenshots are in `review/`. These validate this draft artifact, not a new production release of the street.

## Wrapper history, October 25

The timeline uses saved September 19, September 30, October 11 and October 15 Git geometry, plus the latest October 25 working-copy GLB. Read `sources/wrapper-history/history.md` and `provenance.json` for exact commits, author/committer dates, hashes and omissions. The documented diagonal-curl boat has no distinct recovered snapshot; the first image is the literal raised-margin prototype, not an invented picture of that failure.

`public/ProjectPhotos/mumbai-street/wrapper-history/` contains five web MP4s/posters and a labeled combined MP4/GIF. All use a common comparison setup, not the actual Contact camera journey. Current camera timing is shown separately as a schematic. Edit source snapshots only to reproduce a comparison; do not replace application or Blender delivery with them. The saved original newspaper experiment remains separately labeled in the personal story.

The expanded interview notebook now explains morph targets, STEP playback, the camera cue, persistent reveal state, current validation, and the historical procedural approach. `CONTACT_EXPERIENCE.md` was corrected to match the new worklog rather than its superseded 1.45-second reveal. No runtime or Blender delivery changes were made in this editorial pass.

Rebuild the comparison media from its saved captures with `node project-draft/mumbai-street/scripts/prepare-wrapper-history.mjs`; this also mirrors it into the blog draft. The latest scoped review is `review/wrapper-validation-2026-10-25.json`.
