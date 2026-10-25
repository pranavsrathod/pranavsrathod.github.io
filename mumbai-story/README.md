# Two Wada Pavs — illustrated story draft

The main article is now **`two-wada-pavs.mdx`**, revised October 19 to restore the author's playful asides and show the creative process through documented revisions. `preview.html` compiles that actual MDX with Astro. `two-wada-pavs.md` is a generated, plain Markdown export with the same prose and a script-free workflow fallback; edit the MDX, then rebuild to update both.

The story keeps three acts. The original October 17 draft is preserved in `sources/drafts/draft-2026-10-17.md`.

This folder is outside both websites' content collections. No live post, newspaper selection, route, or deployment has been changed. `isFeatured: false` controls featuring, **not draft visibility**: adding the file to the existing collection will make it eligible for publication. Keep it here until ready.

## Review

Open `preview.html` in a browser, or serve this folder:

```sh
python3 -m http.server 5196 --bind 127.0.0.1
```

Then open `http://127.0.0.1:5196/preview.html`. Preview media uses relative paths so the file also opens directly. The article itself uses the public `/BlogPhotos/mumbai-story/` paths expected by the website.

The preview typography is optional. All media is local. On a phone, the association map uses a portrait layout and the friend card switches to a close crop. Videos have static posters, controls, no autoplay, and `preload="none"`. The GIF remains a separate link.

## The new workflow visuals

- **One snack. Several side quests.** A railway-style association map connects the actual memories behind Contact, the Chronicle, the street, projects, and collectible friends. It is explicitly a map of associations, not a dated build schedule. Editable desktop/mobile SVGs are in `sources/generated/`.
- **The loop behind the little world.** `components/WorkflowNotebook.astro` lets readers select the newspaper, garage, or biscuit revision. Each connects the intended feeling, the surprising failure, the smaller brief, and the inspection. The wrapper has a keyboard-accessible slider through five real production-geometry captures. These are discrete inspection poses, not a live cloth simulation.

The component uses native buttons, range input, and details. Without JavaScript, the case notes remain readable as native disclosures. It has no external runtime dependency or automatic motion. Its cases and distinctions between configured process and recorded execution are mapped to worklog/docs evidence in `sources/workflow-evidence.json`. The garage and biscuit pictures are saved refined model renders, not fabricated before/after images.

## What the evolution animation shows

`public/BlogPhotos/mumbai-story/street-evolution.gif` is a 14-second, five-checkpoint loop. `street-evolution.mp4` shows the same sequence and is the default article embed.

1. **September 11 source:** reconstructed from the earliest available street commit, `831726c`, rendered locally on October 17. This preserves the original camera, layout, and models. It is not a screenshot captured in September.
2. **V2 backdrop:** genuine saved browser review capture of the prior state, recorded with the October 13 review.
3. **V3 backdrop:** genuine saved October 13 review capture.
4. **V3.1 backdrop:** genuine saved October 15 review capture.
5. **October 17 local build:** newly captured pixel view with walking characters. The working copy includes existing uncommitted character-card changes; this is a local state, not a claim about the deployed version.

No complete early screenshot archive was found. The animation uses held frames with labeled cuts; it does not invent intermediate states. Framing and render modes vary across checkpoints, so it is an edited progression, not a fixed-camera timelapse. The two matched V3 review captures and the V3.1 capture all originate at 1440 × 900.

The short newspaper clip is the existing `Newspaper/NewspaperCrumpling-10001-0050.mp4`, converted for the web. It is shown as a saved Blender experiment, not as a recording of the finished Contact interaction.

## Move into Astro later

For the interactive version, copy `two-wada-pavs.mdx` into the Astro site's `src/content/blog/`, place `WorkflowNotebook.astro` in its components directory, and update the relative import in the MDX to that location. The existing website already uses the MDX integration. Copy the complete `public/BlogPhotos/mumbai-story/` folder into the site's `public/BlogPhotos/`. The target site currently lives at `/Users/pranavrathod/Desktop/Website`.

For a simpler version, publish the generated `two-wada-pavs.md` with that same media folder. Publish only one version so the collection does not create duplicate posts.

Review the title, excerpt, and `publishDate` first. The preparation date remains October 17, with `updatedDate` October 19. Check relative wording such as “last year” if publishing later. Set `isFeatured` according to placement. The current schema has no draft filter, so frontmatter alone does not hide a copied article.

For the future newspaper stand, use the plain Markdown export initially. The current mirror does not copy imported Astro components or all the media dependencies (MP4, posters, `srcset`, GIF links). Its image downscaling can also change animated GIFs. Copy the complete media folder when integrating. The reader strips inline styles and needs responsive `video` rules. Supporting the interactive notebook in that reader is a separate later integration; no stand content has changed here.

## Provenance and rebuilding

`sources/media-manifest.json` maps every asset back to its source, including the historical commits. `sources/captures/` holds the unedited new browser screenshots. `sources/drafts/` preserves the three pasted text files. The revised waiting-room passage pasted directly into the conversation informed the condensed Act II.

`sources/generated/` contains editable SVGs and labeled animation frames. `sources/captures/workflow-paper-*.jpg` are the new inspection captures, taken October 19 through the stage buttons in the existing production geometry preview. They are consistently cropped views, not full-sheet validation evidence. Model layouts and the friend layout use saved project artwork. Imported prop attribution is preserved in Visual credits and `sources/garage-prop-credits.md`.

Rebuild from the Blender workspace with its existing installed dependencies:

```sh
node blog-draft/mumbai-story/scripts/prepare-assets.mjs
node blog-draft/mumbai-story/scripts/draw-origin-map.mjs
node blog-draft/mumbai-story/scripts/build-preview.mjs
```

The media scripts use the installed Sharp and FFmpeg. The preview build uses the existing Astro/MDX installation in `threejs-portfolio/project-display`, creates an isolated temporary build, exports the Markdown fallback, and writes `preview.html`. These commands do not edit website or Blender source assets. Captures remain saved inputs; rebuilding does not re-capture changing scenes.

Desktop and 390 px phone previews are in `review/`. Validation details are in `review/validation.json`.
