---
title: "Custom Game Engine Development"
description: "A modular C++ game engine built from scratch, featuring real-time rendering, spatial audio, and in-engine debug tools."
publishDate: "2025-09-25"
isFeatured: false
poster: "/CS522/GameEngineDev.png"
seo:
  image:
    src: "/CS522/GameEngineDev.png"
    alt: "Custom Game Engine Development Screenshot"
---

## Building on a Custom Engine Framework

I spent this project cycle enhancing a modular C++ game engine, layering in systems that turned it from a bare-bones framework into a more complete interactive environment. My focus was on adding functionality where it mattered — optimizing performance, adding visual debugging aids, and bringing gameplay physics to life.

---

## Making Rendering Smarter — Bounding Volumes & Culling

One of the first improvements I tackled was optimizing how objects get rendered. Initially, every object was pushed through the rendering pipeline, whether it was visible or not. To fix this, I implemented bounding volumes and frustum culling to skip objects that didn’t need to be drawn.

### How I approached it:
- Built Axis-Aligned Bounding Boxes (AABBs) for all static meshes during their load phase.
- Developed a frustum culling algorithm that efficiently checked which objects intersected the camera’s view.
- Added a debug visualization overlay to display bounding volumes in real-time for validation.
- Stress-tested performance by spawning hundreds of mesh instances and ensuring the engine gracefully handled them.

<iframe width="100%" height="500" src="https://www.youtube.com/embed/aKiIaWN1qeo?si=6RosVNVQRVySwhR-" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

---

## Bringing Physics to Life — Collisions & Gravity

The next major step was integrating a lightweight physics system. I focused on giving objects the ability to interact physically, simulating collisions and gravity without overcomplicating the architecture.

### Here’s what I built:
- Designed a **PhysicsComponent** that could be attached to game objects, handling their collision volumes and state.
- Managed these components with a **Physics Manager**, updating their states every frame.
- Implemented collision detection using simple shapes — AABBs for static meshes, spheres for characters.
- Simulated gravity and response behaviors, so objects would slide off surfaces and react to obstacles.
- Configured the CharacterControl Demo to showcase these interactions — soldiers navigating through cars, sliding off planes, and falling due to gravity.

<iframe width="100%" height="500" src="https://www.youtube.com/embed/6KNxViLwbCU?si=7CZiLoUjCWTbfILO" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

---

## Breathing Life into Characters — Animation Blending System

The next step in evolving the engine was enhancing the animation system to support **partial body animations** and **additive animation blending**. Until this point, animations were applied as full-body overrides, limiting dynamic interactions like upper-body gestures while walking.

### What I built:
- Extended the existing animation state machine to handle **layered animation blending**, enabling combinations of full-body and partial-body animations.
- Developed a system where different animation layers produced their own joint palettes, which were then blended to form the final model space palette for skinning.
- Implemented debug overlays to display real-time information — active animations, blend weights, and current frame indices floating above characters.
- Configured multiple test cases using a Vampire character asset:
  - Full-body animation blending.
  - Partial-body animations layered on top of full-body (e.g., shooting while walking).
  - Additive animations for finer motion adjustments.

The system was built to be modular, allowing new animation layers to be added without disrupting the core state machine logic. 

<iframe width="100%" height="500" src="https://www.youtube.com/embed/89YAsVK2NlQ?si=BWGrgKMsdCo8HnSY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

---

## Reflections on Engine Development

Working on this engine taught me how deliberate, small improvements can dramatically evolve a framework. Every new system—whether it was rendering optimization, physics integration, or animation blending—started with understanding existing constraints and then layering solutions on top without breaking what already worked. 

I learned how essential it is to visualize internal data through debug tools, which saved me countless hours of guesswork. More importantly, this project showed me how scalable game engines are built through modular systems that interact predictably, yet remain flexible enough to extend. The process sharpened my problem-solving mindset, focusing on building tools and pipelines that serve both the developer and the final interactive experience.
