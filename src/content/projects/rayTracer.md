---
title: "Ray Tracer"
description: "A CPU-based C++ ray tracer that renders spheres and triangles with Phong shading, shadows, anti-aliasing, and recursive reflection extensions."
publishDate: "2024-04-17"
poster: "/CS420/rayTracing/rayTracer.png"
isFeatured: true
seo:
  title: "Ray Tracer | C++ Rendering Fundamentals"
  description: "Built a CPU ray tracer from scratch with ray-object intersection, Phong shading, shadows, and extension branches."
  image:
    src: "/CS420/rayTracing/Snow/snow.jpg"
    alt: "Ray tracer snow scene render"
---

## Overview

This project explores how a renderer actually works under the hood. Instead of relying on an existing graphics engine, I built a ray tracer from scratch in C++ that progressively adds features such as shading, shadows, anti‑aliasing, and recursive reflections.

Each stage of the renderer was implemented incrementally so the visual impact of every feature could be observed directly.

---

## What Is a Ray Tracer?

Think about how we see the world. Light leaves a source, bounces off objects, and eventually reaches your eye. A ray tracer reverses that process: it starts at the camera, sends one ray per pixel into a 3D scene, and asks, "What does this pixel see, and how should it be lit?"

That simple idea turns every pixel into a visibility and lighting problem.

## Core Features

**Geometry**
- Ray–sphere intersection
- Ray–triangle intersection

**Lighting**
- Phong illumination (ambient, diffuse, specular)
- Per‑light shadow rays

**Rendering**
- Primary ray generation for every pixel
- Progressive rendering pipeline for debugging
- JPEG image export

**Extensions**
- Anti‑aliasing branch
- Recursive reflections branch

---

## Renderer Viewer

Use the dropdown to switch scenes and scroll through the rendering stages.

<style>
  .raytracer-viewer-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    margin: 2rem 0;
    font-family: 'DM Mono', monospace;
  }

  .viewer-header {
    text-align: center;
  }
  .viewer-header p {
    font-size: 0.7rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: #7b6cff;
    font-family: 'DM Mono', monospace;
    margin-bottom: 0.4rem;
  }
  .viewer-header h3 {
    font-size: 1.6rem;
    font-weight: 800;
    background: linear-gradient(135deg, #fff 30%, #7b6cff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0;
  }

  .rt-scene-tabs {
    display: flex;
    gap: 0.5rem;
    background: #111118;
    padding: 0.4rem;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.07);
  }
  .rt-scene-tab {
    font-family: 'DM Mono', monospace;
    font-size: 0.8rem;
    padding: 0.45rem 1.1rem;
    border-radius: 8px;
    border: none;
    background: transparent;
    color: #6b6b80;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.05em;
  }
  .rt-scene-tab.active {
    background: #7b6cff;
    color: #fff;
  }
  .rt-scene-tab:hover:not(.active) {
    color: #e8e8f0;
    background: #16161f;
  }

  .rt-carousel-row {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .rt-nav-btn {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.07);
    background: #111118;
    color: #e8e8f0;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .rt-nav-btn:hover {
    border-color: #7b6cff;
    color: #7b6cff;
    transform: scale(1.08);
  }

  .rt-flashcard-wrap {
    width: 600px;
    height: 460px;
    perspective: 1400px;
    cursor: pointer;
  }

  .rt-flashcard-inner {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.65s cubic-bezier(0.4, 0.2, 0.2, 1);
  }

  .rt-flashcard-wrap.flipped .rt-flashcard-inner {
    transform: rotateY(180deg);
  }

  .rt-card-face {
    position: absolute;
    inset: 0;
    backface-visibility: hidden;
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.07);
  }

  .rt-card-front {
    background: #111118;
  }
  .rt-card-front img {
    width: 100%;
    height: 380px;
    object-fit: cover;
    display: block;
  }
  .rt-card-front-footer {
    padding: 0.9rem 1.2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid rgba(255,255,255,0.07);
  }
  .rt-stage-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.78rem;
    color: #e8e8f0;
    letter-spacing: 0.04em;
  }
  .rt-flip-hint-front {
    font-family: 'DM Mono', monospace;
    font-size: 0.68rem;
    color: #6b6b80;
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }
  .rt-flip-hint-front::before {
    content: '↩';
    color: #7b6cff;
  }

  .rt-card-back {
    transform: rotateY(180deg);
    background: #16161f;
    display: flex;
    flex-direction: column;
    padding: 2rem 2.2rem;
    gap: 1.1rem;
    justify-content: center;
  }
  .rt-back-tag {
    font-family: 'DM Mono', monospace;
    font-size: 0.68rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #7b6cff;
  }
  .rt-back-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #fff;
    line-height: 1.2;
    font-family: 'Syne', sans-serif;
  }
  .rt-back-divider {
    width: 40px;
    height: 2px;
    background: linear-gradient(90deg, #7b6cff, #ff6c9d);
    border-radius: 2px;
  }
  .rt-back-desc {
    font-family: 'DM Mono', monospace;
    font-size: 0.8rem;
    line-height: 1.75;
    color: #b0b0c8;
  }
  .rt-back-eq {
    background: rgba(123, 108, 255, 0.08);
    border: 1px solid rgba(123, 108, 255, 0.2);
    border-radius: 10px;
    padding: 0.7rem 1rem;
    font-family: 'DM Mono', monospace;
    font-size: 0.76rem;
    color: #7b6cff;
    letter-spacing: 0.03em;
    line-height: 1.7;
    white-space: pre;
  }
  .rt-flip-hint-back {
    font-family: 'DM Mono', monospace;
    font-size: 0.68rem;
    color: #6b6b80;
    margin-top: auto;
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }
  .rt-flip-hint-back::before {
    content: '↩';
    color: #ff6c9d;
  }

  .rt-stage-dots {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
  }
  .rt-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #16161f;
    border: 1px solid rgba(255,255,255,0.07);
    transition: all 0.2s;
    cursor: pointer;
  }
  .rt-dot.active {
    background: #7b6cff;
    border-color: #7b6cff;
    width: 20px;
    border-radius: 3px;
  }

  @media (max-width: 680px) {
    .rt-flashcard-wrap { width: 90vw; height: 360px; }
    .rt-card-front img { height: 290px; }
  }
</style>

<div class="raytracer-viewer-wrap">
  <div class="viewer-header">
    <p>renderer progression</p>
    <h3>Ray Tracer Viewer</h3>
  </div>
  <div class="rt-scene-tabs" id="rtSceneTabs">
    <button class="rt-scene-tab active" data-scene="Snow">Snow</button>
    <button class="rt-scene-tab" data-scene="Spheres">Spheres</button>
    <button class="rt-scene-tab" data-scene="Test2">Test2</button>
  </div>
  <div class="rt-carousel-row">
    <button class="rt-nav-btn" id="rtPrevBtn">&#8592;</button>
    <div class="rt-flashcard-wrap" id="rtFlashcard">
      <div class="rt-flashcard-inner">
        <div class="rt-card-face rt-card-front">
          <img id="rtStageImage" src="" alt="render stage"/>
          <div class="rt-card-front-footer">
            <span class="rt-stage-label" id="rtStageLabel">—</span>
            <span class="rt-flip-hint-front">flip for details</span>
          </div>
        </div>
        <div class="rt-card-face rt-card-back">
          <span class="rt-back-tag" id="rtBackTag">—</span>
          <div class="rt-back-title" id="rtBackTitle">—</div>
          <div class="rt-back-divider"></div>
          <div class="rt-back-desc" id="rtBackDesc">—</div>
          <div class="rt-back-eq" id="rtBackEq" style="display:none"></div>
          <span class="rt-flip-hint-back">flip back</span>
        </div>
      </div>
    </div>
    <button class="rt-nav-btn" id="rtNextBtn">&#8594;</button>
  </div>
  <div class="rt-stage-dots" id="rtStageDots"></div>
</div>

<script>
(function() {
  const stages = {
    Snow: [
      { file: "01-flat.jpg", label: "Stage 01 — Flat Baseline", tag: "intersection", title: "Raw Geometry, No Lighting", desc: "Each pixel fires a ray into the scene. The closest surface hit determines the color — just the object's raw diffuse value. No lighting calculation happens here at all.", eq: "color = kd  (diffuse color only)" },
      { file: "02-sphere.jpg", label: "Stage 02 — Sphere Shading", tag: "phong · spheres", title: "Phong Illumination on Spheres", desc: "The sphere's outward normal is computed at the hit point. This normal drives the Phong equation — combining ambient, diffuse, and specular terms across all lights.", eq: "I = kd·(L·N) + ks·(R·V)^sh\nN = (P − C) / radius" },
      { file: "03-triangle.jpg", label: "Stage 03 — Triangle Shading", tag: "phong · triangles", title: "Smooth Shading via Interpolation", desc: "Triangles store a normal at each vertex. Rather than using a flat face normal, the per-vertex normals are blended across the surface using barycentric coordinates — giving smooth highlights instead of a faceted look.", eq: "N = α·N₀ + β·N₁ + γ·N₂\nα + β + γ = 1" },
      { file: "04-shadows.jpg", label: "Stage 04 — Shadows", tag: "shadow rays", title: "Visibility per Light Source", desc: "After finding a hit, a shadow ray is fired from that point toward each light. If any geometry blocks the path before reaching the light, that light's contribution is skipped entirely.", eq: "if intersect(P → light) → color += 0" },
      { file: "05-aa.jpg", label: "Stage 05 — Anti-Aliasing", tag: "supersampling", title: "2×2 Grid Supersampling", desc: "Instead of one ray per pixel, four rays are distributed in a 2×2 grid across the pixel area. Their colors are averaged, smoothing out jagged staircase edges on silhouettes and curved surfaces.", eq: "color = (1/N) · Σ traceRay(x + δᵢ, y + δⱼ)" }
    ],
    Spheres: [
      { file: "01-flat.jpg", label: "Stage 01 — Flat Baseline", tag: "intersection", title: "Raw Geometry, No Lighting", desc: "Each pixel fires a ray into the scene. The closest surface hit determines the color — just the object's raw diffuse value. No lighting calculation happens here at all.", eq: "color = kd  (diffuse color only)" },
      { file: "02-sphere.jpg", label: "Stage 02 — Sphere Shading", tag: "phong · spheres", title: "Phong Illumination on Spheres", desc: "The sphere's outward normal is computed at the hit point. This normal drives the Phong equation — combining ambient, diffuse, and specular terms across all lights.", eq: "I = kd·(L·N) + ks·(R·V)^sh\nN = (P − C) / radius" },
      { file: "03-triangle.jpg", label: "Stage 03 — Triangle Shading", tag: "phong · triangles", title: "Smooth Shading via Interpolation", desc: "Triangles store a normal at each vertex. Rather than using a flat face normal, the per-vertex normals are blended across the surface using barycentric coordinates — giving smooth highlights instead of a faceted look.", eq: "N = α·N₀ + β·N₁ + γ·N₂\nα + β + γ = 1" },
      { file: "04-shadows.jpg", label: "Stage 04 — Shadows", tag: "shadow rays", title: "Visibility per Light Source", desc: "After finding a hit, a shadow ray is fired from that point toward each light. If any geometry blocks the path before reaching the light, that light's contribution is skipped entirely.", eq: "if intersect(P → light) → color += 0" },
      { file: "05-aa.jpg", label: "Stage 05 — Anti-Aliasing", tag: "supersampling", title: "2×2 Grid Supersampling", desc: "Instead of one ray per pixel, four rays are distributed in a 2×2 grid across the pixel area. Their colors are averaged, smoothing out jagged staircase edges on silhouettes and curved surfaces.", eq: "color = (1/N) · Σ traceRay(x + δᵢ, y + δⱼ)" }
    ],
    Test2: [
      { file: "01-flat.jpg", label: "Stage 01 — Flat Baseline", tag: "intersection", title: "Raw Geometry, No Lighting", desc: "Each pixel fires a ray into the scene. The closest surface hit determines the color — just the object's raw diffuse value. No lighting calculation happens here at all.", eq: "color = kd  (diffuse color only)" },
      { file: "02-sphere.jpg", label: "Stage 02 — Sphere Shading", tag: "phong · spheres", title: "Phong Illumination on Spheres", desc: "The sphere's outward normal is computed at the hit point. This normal drives the Phong equation — combining ambient, diffuse, and specular terms across all lights.", eq: "I = kd·(L·N) + ks·(R·V)^sh\nN = (P − C) / radius" },
      { file: "03-triangle.jpg", label: "Stage 03 — Triangle Shading", tag: "phong · triangles", title: "Smooth Shading via Interpolation", desc: "Triangles store a normal at each vertex. Rather than using a flat face normal, the per-vertex normals are blended across the surface using barycentric coordinates — giving smooth highlights instead of a faceted look.", eq: "N = α·N₀ + β·N₁ + γ·N₂\nα + β + γ = 1" },
      { file: "04-shadows.jpg", label: "Stage 04 — Shadows", tag: "shadow rays", title: "Visibility per Light Source", desc: "After finding a hit, a shadow ray is fired from that point toward each light. If any geometry blocks the path before reaching the light, that light's contribution is skipped entirely.", eq: "if intersect(P → light) → color += 0" },
      { file: "05-aa.jpg", label: "Stage 05 — Anti-Aliasing", tag: "supersampling", title: "2×2 Grid Supersampling", desc: "Instead of one ray per pixel, four rays are distributed in a 2×2 grid across the pixel area. Their colors are averaged, smoothing out jagged staircase edges on silhouettes and curved surfaces.", eq: "color = (1/N) · Σ traceRay(x + δᵢ, y + δⱼ)" },
      { file: "06-reflection-1.jpg", label: "Reflection — Depth 1", tag: "recursive reflections", title: "One Bounce Reflection", desc: "A reflected ray is fired from each hit point. The final color blends local Phong shading with whatever the reflected ray sees, weighted by the surface's specular value.", eq: "color = (1−ks)·localPhong + ks·traceRay(R)" },
      { file: "07-reflection-2.jpg", label: "Reflection — Depth 2", tag: "recursive reflections", title: "Two Bounce Reflection", desc: "The reflected ray itself can now reflect again. Surfaces begin picking up color from nearby objects, increasing physical accuracy at the cost of doubled render time.", eq: "depth = 2  →  R₂ = reflect(R₁)" },
      { file: "08-reflection-3.jpg", label: "Reflection — Depth 3", tag: "recursive reflections", title: "Three Bounce Reflection", desc: "Three recursive bounces. Visually the difference from depth 2 is subtle but the scene picks up more inter-object color bleeding. Diminishing returns — each bounce doubles compute cost.", eq: "depth = 3  →  R₃ = reflect(R₂)" }
    ]
  }

  let currentScene = "Snow"
  let currentStage = 0

  const flashcard  = document.getElementById("rtFlashcard")
  const img        = document.getElementById("rtStageImage")
  const labelEl    = document.getElementById("rtStageLabel")
  const tagEl      = document.getElementById("rtBackTag")
  const titleEl    = document.getElementById("rtBackTitle")
  const descEl     = document.getElementById("rtBackDesc")
  const eqEl       = document.getElementById("rtBackEq")
  const dotsEl     = document.getElementById("rtStageDots")

  function buildDots() {
    dotsEl.innerHTML = ""
    stages[currentScene].forEach((_, i) => {
      const d = document.createElement("div")
      d.className = "rt-dot" + (i === currentStage ? " active" : "")
      d.onclick = () => { currentStage = i; update() }
      dotsEl.appendChild(d)
    })
  }

  function update() {
    flashcard.classList.remove("flipped")
    const s = stages[currentScene][currentStage]
    img.src          = `/CS420/rayTracing/${currentScene}/${s.file}`
    labelEl.textContent = s.label
    tagEl.textContent   = s.tag
    titleEl.textContent = s.title
    descEl.textContent  = s.desc
    if (s.eq) { eqEl.style.display = "block"; eqEl.textContent = s.eq }
    else       { eqEl.style.display = "none" }
    buildDots()
  }

  flashcard.onclick = () => flashcard.classList.toggle("flipped")

  document.getElementById("rtPrevBtn").onclick = () => {
    const len = stages[currentScene].length
    currentStage = (currentStage - 1 + len) % len
    update()
  }
  document.getElementById("rtNextBtn").onclick = () => {
    currentStage = (currentStage + 1) % stages[currentScene].length
    update()
  }

  document.querySelectorAll(".rt-scene-tab").forEach(tab => {
    tab.onclick = () => {
      document.querySelectorAll(".rt-scene-tab").forEach(t => t.classList.remove("active"))
      tab.classList.add("active")
      currentScene = tab.dataset.scene
      currentStage = 0
      update()
    }
  })

  update()
})()
</script>

---

## What I Learned

Building a renderer from scratch gives a much deeper understanding of how modern graphics pipelines work. Every pixel becomes a geometric and numerical problem that must be solved reliably.

This project strengthened my understanding of:

- vector math and geometric reasoning  
- floating‑point precision issues in graphics  
- structuring rendering pipelines so each stage can be validated independently  
- debugging visual artifacts through incremental rendering  

---

## Source Code

- Main repository: https://github.com/pranavsrathod/Ray-Tracing  
- Anti-aliasing branch: https://github.com/pranavsrathod/Ray-Tracing/tree/antialiasing  
- Reflections branch: https://github.com/pranavsrathod/Ray-Tracing/tree/reflections
