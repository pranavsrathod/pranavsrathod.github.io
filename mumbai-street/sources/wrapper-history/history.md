# Recoverable wrapper geometry

This isolated fixture reconstructs **geometry**, not whole historical websites. It never checks out Git, edits the application, saves Blender files, or rebakes the current wrapper. `provenance.json` identifies every frozen source/asset and its SHA-256.

Serve `/Users/pranavrathod/Desktop/Projects/Blender` as an HTTP root, then open:

`/project-draft/mumbai-street/sources/wrapper-history/viewer.html?stage=corners&pose=0`

Three.js0.180.0 and its addons resolve through an import map to `/threejs-portfolio/node_modules/three/`; there are no CDN requests. At a viewport at least960px wide, crop the clean canvas at **x0,y0,width960,height600**. Labels and controls live below the canvas. Stages and the `Comparison pose`0–24 slider can be operated with native controls. `window.wrapperHistory.ready` indicates completion; `setStage(id)`, `setPose(0..24)` and `setProgress(0..1)` support deterministic capture. Read `window.wrapperHistory.state` to confirm the selected pose.

## Five displayed milestones

| ID | Source | Representation and evidence |
| --- | --- | --- |
| `corners` | `707010f`, source date September19,2026 | The literal earliest24×32 plane with raised left/right margins. Original inline vertex formula is transplanted without a new shape model. Food/ad were deliberately exposed. **Do not label this the documented boat.** |
| `panels` | `467087a`, September30 | Base plus four independently tessellated fold panels; their `paperPanel` attribute is passed to the historical surface function. September29 notes record this change after diagonal curls produced a boat and intersections. |
| `bloom` | `8022f78`, October11 | Connected72×96 grid with a low radial crumple and staggered bloom. Historical guide records the prior panel version looking like a box with cut corners. |
| `parcel` | `420e1a6`, October15 | Continuous rectangular perimeter gathers overhead to conceal the food, then spreads before lowering. Worklog records local work October11; first committed snapshot is October15. |
| `baked` | Frozen October25 working copy; **uncommitted** | Actual `wrapper-unwrap.glb`, frozen adapter and external artwork. Closed basis plus24 morph targets gives25 STEP poses over two seconds at12 pose intervals/second. Cloth-assisted and artistically cleaned/sculpted; no browser cloth solver. |

The API returns `{root, mesh, setProgress, progress, dispose}`. Historical procedural stages retain their saved geometry and deformation functions. The earliest original `contact.js` is archived for evidence but is not imported, since its old full-application dependencies are intentionally not reconstructed. Current food and corrected artwork are shared across all stages so the comparison isolates wrapper geometry. This means these are **re-renders from saved source**, not archived period captures. Legacy and glTF texture conventions use separate texture instances sharing the same image.

The common2-second playback is an **inspection clock**, not a claim about historical pacing. Original margins used damping; panel and bloom revisions waited then opened over3.1seconds; the covered parcel opened over1.45seconds. The baked asset is natively2seconds. Every procedural stage supports continuous normalized progress, while the baked stage selects its actual held pose. The slider's25 samples are not25 different revisions.

Current application timing is separately recorded: the parcel waits through the1.8-second approach, then unwraps during the4.2-second overhead push. Once opening begins it finishes away from Contact and remains open; leaving before that cue keeps it closed. The isolated inspection fixture deliberately does not recreate route/camera choreography.

## Recorded failures and missing states

- September29 `CONTACT_EXPERIENCE.md` notes describe intersecting diagonal curls and a boat silhouette. No distinct committed intermediate geometry was recovered; do not manufacture its image or call the earliest margins the boat.
- `8022f78:docs/INTERVIEW_STUDY_GUIDE.md:302–310` records the panel box/cut-corner appearance and the move to one sheet.
- Current worklog documents the low surround failing to conceal the food, followed by the covered parcel. It also documents four pin-corner needles repaired in the October25 authored sequence; the frozen GLB is the repaired delivery, not its earlier failed state.
- The additional September19 rolled-front implementation in `829cb1d` is recoverable but omitted from these five displayed stages.

Existing saved browser captures include `threejs-portfolio/docs/previews/contact/paper-bloom.jpg`, `covered-parcel.jpg`, and the current `docs/previews/contact-wrapper/` folder. October19 `workflow-paper-00.jpg` through`04.jpg` show five poses of the covered-parcel implementation. `Newspaper/NewspaperCrumpling-10001-0050.mp4` is a separate Blender experiment; no runtime-commit identity has been established for it.

User recollection identifies collaboration with Codex Astra. These Git/source records establish implementation snapshots, not the model used in each individual session. The editorial pass corrected `CONTACT_EXPERIENCE.md`'s stale current-state paragraph to match `HANDOFF.md:704–726`, current source and the saved Blender workflow.

## Published-draft media

`captures/` preserves 125 original browser JPEG crops: 25 normalized inspection poses for each version. `capture-manifest.json` records hashes and capture method. The media preparation script at `../../scripts/prepare-wrapper-history.mjs` encodes each sequence with one-second endpoint holds into a four-second MP4, plus a poster. Only the current baked sequence uses its original exported pose schedule; earlier sequences compare normalized shape progress. A labeled 20-second MP4/GIF cycles the five versions. The GIF is a reduced-size, 8 fps derivative, not a full-rate motion reference.

The same media is mirrored into the personal-story draft. The interactive timeline starts on the selected October 25 version; Cycle versions starts the chronological sequence. The camera cue is explained in a separate schematic because these comparison clips keep the camera fixed.
