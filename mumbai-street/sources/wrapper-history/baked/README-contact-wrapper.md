# Editable Contact wrapper

`ContactWrapper.blend` is the editable source for the website's two-second, stepped newspaper unwrap. It preserves the 4,225-vertex / 4,096-quad grid and UV layout from `Paper.blend`; the original `Paper.blend` and `Newspaper.blend` are unchanged. The website loads `../threejs-portfolio/public/contact/wrapper-unwrap.glb`. No Blender simulation runs in the browser.

## Replace only the newspaper artwork

Replace `../threejs-portfolio/public/contact/newspaper.png` with an upright **3:4** image, keeping the current resolution and printed layout when possible. Reload the page. No animation rebake or GLB export is needed. Blender references that same external image through `//../threejs-portfolio/public/contact/newspaper.png`; use Image → Reload in Blender's Image Editor to refresh its preview.

The exporter converts Blender UVs to the glTF image convention. The website loads the image with `flipY=false` and sRGB color space, and applies the matching UV convention to the supply stack. Only the wrapper's front and the stack's upward faces receive the image. The wrapper reverse uses a separate opaque warm-paper material with the same geometry and morph weights. Do not mirror the image or add printing to its reverse to compensate for orientation.

If a replacement design moves the printed links, update `contactRows[].rect` in `../threejs-portfolio/src/world/contactLayout.js`. These are `[left, top, right, bottom]` UV rectangles measured from the image's top-left, normalized to 0–1. Keep the final linked area and full permitted food movement area flat; changing artwork alone does not change those surfaces.

## Edit the saved animation

Open `ContactWrapper.blend`. The visible `ContactWrapper` mesh contains the closed basis plus `Pose_01` through `Pose_24`. Frames **1–25** correspond to poses **0–24**; the exported times are `(frame - 1) / 12`, so frame 25 is exactly two seconds. Shape-key interpolation is constant. Keep this frame/key contract, the 4,225 vertices, UVs, and face connectivity.

- Scrub to the desired frame and edit its corresponding shape key to refine a fold. The basis is the closed parcel at frame 1; `Pose_24` is the open serving sheet at frame 25.
- `FoldHandle_Left`, `FoldHandle_Right`, `FoldHandle_Far`, and `FoldHandle_Near` are downstream hook controls. Moving or keying them adjusts their weighted flap regions without replacing the sculpted poses. An unkeyed offset affects every sampled pose.
- `PinnedServingArea` identifies the fixed serving region. The browser's open sheet is 0.72 × 0.96 units, with its flat surface at local Y = 0.011. Blender uses X/Y for the sheet and Z for height; export converts Blender X/Y/Z to Three.js X/Z/−Y.
- Keep the final contact and food sweep regions at that height. Only the outer edge has shallow creases; the food can move well beyond its starting footprint. Validate after any geometry edit.
- Save the `.blend` before exporting. The exporter evaluates the saved mesh, shape animation, hook transforms, and topology-preserving modifiers at every frame. It does not regenerate or save the source.

From the parent `Blender` directory, export the saved file:

```sh
/Applications/Blender.app/Contents/MacOS/Blender --background --disable-autoexec \
  Newspaper/ContactWrapper.blend --python Newspaper/export_contact_wrapper.py
```

This writes the website GLB and `Newspaper/wrapper-asset-report.json`. Add `-- --render-previews` to also render poses 0, 4, 8, 12, 16, 20, and 24 into `Newspaper/previews/`. These Blender images use simple collision-preview pavs; the website retains its existing food models.

For an isolated export, set **both** destinations explicitly:

```sh
/Applications/Blender.app/Contents/MacOS/Blender --background --disable-autoexec \
  Newspaper/ContactWrapper.blend --python Newspaper/export_contact_wrapper.py -- \
  --output /tmp/contact-wrapper-check.glb --report /tmp/contact-wrapper-check.json
```

The exporter requires the source filename `ContactWrapper.blend`, but it may be a copy in another directory. Relative image links must be relinked if that copy is moved. A source with changed vertex count, face connectivity, UV seams, or undefined normals is rejected. Subdivision and remeshing must not enter the export mesh.

## Optional cloth re-simulation

The hidden `Cloth_FoldStudy` retains animated `Close_001`–`Close_120` target shapes, the `ServingArea_and_EdgeHandles` pin weights, cloth settings, and food/counter collision proxies. It simulates the closing motion through frame 145; the bake samples that result in reverse to make the opening poses, then applies serving-area, clearance, relaxation, and corner cleanup. This is a separate authoring operation.

**Re-simulation replaces all sculpted main-mesh pose keys.** Save a backup first. Existing `FoldHandle_*` objects and hook offsets are retained. The script temporarily enables the hidden study and collision proxies for viewport simulation, restores their visibility afterward, and saves the resulting source.

```sh
/Applications/Blender.app/Contents/MacOS/Blender --background --disable-autoexec \
  Newspaper/ContactWrapper.blend --python Newspaper/bake_contact_wrapper.py -- --replace-poses
```

Then use the ordinary export command and validate again. Omitting `--replace-poses` deliberately refuses to replace sculpting. For safer experimentation, use a copied folder/source and relink the external image first.

`author_contact_wrapper.py` is the one-time initializer from the original `Paper.blend`:

```sh
/Applications/Blender.app/Contents/MacOS/Blender --background --disable-autoexec \
  --python Newspaper/author_contact_wrapper.py
```

It refuses to run when `Newspaper/ContactWrapper.blend` exists. Do not run it as an export or texture-refresh step; the saved editable source is the normal starting point.

## Preview and validate

With the website dev server running, open `/scripts/contact-paper-preview.html`. It loads the actual exported GLB and provides playback, individual-pose scrubbing, angled/top/reverse views, and a temporary image upload. The reverse view hides the board and food so the blank side can be inspected. Temporary artwork in this page does not overwrite the saved PNG or GLB.

From `../threejs-portfolio` run:

```sh
node scripts/check-contact-wrapper.mjs
node scripts/check-contact-loading.mjs
node scripts/check-object-outline.mjs
node scripts/check-contact-stall.mjs
node scripts/check-contact-newspaper-stack.mjs
npm run build
```

The wrapper check samples every exported pose, checks connected topology, finite geometry/normals, food and counter clearance, closed concealment, the planar open contact/food sweep regions, front-only printing, texture ownership, and stepped playback. The loading checks exercise missing assets, resolution order, late loading after disposal, interrupted visits, retained food positions, camera gating, and reduced motion.

The delivered GLB contains 24 position/normal morph targets, 8,192 triangles, one `Unwrap` clip with STEP interpolation, and no embedded image. It is **2,632,984 bytes**. Its largest measured edge-length ratio relative to the open sheet is **3.72×**; the cloth cleanup is an artistic approximation, not an inextensible physical paper simulation. Tight overlapping folds are intentional. The automated checks do not prove the absence of all triangle self-intersections, and manual edits still require visual inspection of all poses. CPU parse/pose timings printed by the checks exclude texture loading, GPU upload, and rendering; they do not establish a performance improvement.

The runtime waits through the camera’s 1.8-second approach, then starts unwrapping as the slow overhead push begins. Leaving before that cue keeps the parcel closed for the next visit. Once unwrapping starts, it finishes even if the route changes and retains the open sheet and moved food until page reload. Reduced motion settles immediately. Hotspots and dragging wait for both the final pose and camera readiness. Editing the artwork preserves this behavior.

## Verified source workflow — 25 October 2026

Blender 5.1.1 verification used temporary source copies and separate GLB/report destinations. The delivered `.blend`, GLB, and asset report were hash-checked before and after; all remained unchanged.

- Re-exporting the saved delivery source reproduced the shipped GLB byte-for-byte: SHA-256 `b49ce95e145162b5e6286625c1c5fc2650befeb3886af638f270894a9b9ae76d`.
- Relinking the source's newspaper preview to a temporary PNG, then replacing that PNG with different valid 3:4 artwork, produced the same GLB bytes. Each export left the saved `.blend` unchanged.
- A saved temporary edit to vertex 1,000 in `Pose_12` changed the corresponding exported position by +0.003 in Three.js Y (within floating-point tolerance), confirming that export reads saved sculpting.
- Altered main-mesh face connectivity and UV coordinates were rejected against the preserved `Cloth_FoldStudy` reference. The reference itself must remain intact; this is not a hash check against an independently archived original mesh.
- Optional `--replace-poses` re-simulation completed on a temporary copy in 178 seconds, produced 25 exportable poses, preserved all four hook transforms, and restored the study/proxy visibility. It generated a new pose set; the shipped asset was not replaced. Any newly simulated version still needs the complete website geometry checks and visual review before adoption.
