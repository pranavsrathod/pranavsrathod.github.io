---
title: "Prime Engine: Building a Game Engine from the Inside Out"
description: "Six systems built inside a custom C++ game engine: frustum culling, physics, animation blending, a full UI overhaul, a CPU-simulated particle system, and 3D spatial audio."
publishDate: "2025-09-25"
isFeatured: true
poster: "/CS522/GameEngineDev.png"
seo:
  image:
    src: "/CS522/GameEngineDev.png"
    alt: "Prime Engine custom C++ game engine systems demo"
---

## Inside a Custom C++ Game Engine

Prime Engine is a custom C++ game engine I worked on extensively, building six interconnected systems from scratch: rendering optimization, physics, animation blending, a complete UI overhaul, a particle engine, and 3D spatial audio.

The engine uses a component/event/scene-graph architecture, and every system had to slot cleanly into that structure without breaking what was already there. Understanding how things connected before writing a single line was half the work.

---

## Full Demo

<!-- Replace VIDEO_ID below with your YouTube video ID once uploaded -->
<!-- <iframe width="100%" height="500" src="https://www.youtube.com/embed/VIDEO_ID" title="Prime Engine Full Demo" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe> -->

*Full demo video coming soon.*

---

## Smarter Rendering: Frustum Culling

The engine was drawing every object in the scene every frame, whether it was on screen or not. I fixed that.

- Built Axis-Aligned Bounding Boxes (AABBs) for all static meshes at load time
- Implemented a frustum culling pass that skips anything outside the camera's view volume
- Added a real-time debug overlay to visualize bounding boxes, essential for catching edge cases
- Stress-tested with hundreds of mesh instances to validate the frame budget improvement

<iframe width="100%" height="500" src="https://www.youtube.com/embed/aKiIaWN1qeo?si=6RosVNVQRVySwhR-" title="Frustum Culling Demo" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

---

## Physics: Collision Detection & Gravity

A lightweight physics system built from scratch: a PhysicsComponent that attaches to any game object, managed by a PhysicsManager that steps the simulation every frame.

- AABB collision volumes for static geometry, sphere volumes for characters
- Gravity simulation with surface response, so objects slide off inclines, stack, and fall correctly
- Validated with a character navigation demo: soldiers moving through obstacle courses, reacting to the world around them

The system is modular by design. New collision shapes and response behaviors slot in without touching the core simulation loop.

<iframe width="100%" height="500" src="https://www.youtube.com/embed/6KNxViLwbCU?si=7CZiLoUjCWTbfILO" title="Physics System Demo" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

---

## Animation: Layered Blending

Full-body animation overrides are limiting. A character can't walk and shoot at the same time if one animation cancels the other. I extended the engine's state machine to support **partial-body animations** and **additive blending**.

- Each animation layer generates its own joint palette, blended at runtime into the final skinning transform
- Partial-body layers operate independently from the full-body state; the upper body can shoot while legs keep walking
- Additive animations stack on top for fine motion adjustments
- Debug overlays display active animations, blend weights, and frame indices above characters in real time

<iframe width="100%" height="500" src="https://www.youtube.com/embed/89YAsVK2NlQ?si=BWGrgKMsdCo8HnSY" title="Animation Blending Demo" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

---

## UI: Diagnosing and Replacing a Broken System

The engine shipped with a UI system. I looked at the code and found it fundamentally didn't work. Six separate root-cause defects:

- Buttons were being constructed and added to the scene graph **every frame**, not once, creating an unbounded memory leak
- Hit-testing used a hardcoded screen Y-threshold shared across all buttons, and no element had its own bounds
- Two conflicting construction paths set up state differently, and neither was fully connected end-to-end
- Visual elements were built on the debug renderer, which uses time-to-live semantics, meaning they'd disappear mid-interaction
- All pause, resume, and exit logic was commented out across multiple files
- Event_RESUME_GAME was misspelled consistently across three files

Rather than patching defects one at a time, I replaced the entire system with **Dear ImGui**, an immediate-mode GUI library used across the games industry. Integration required four hook points: device initialization, Win32 message forwarding, per-frame UI declaration, and render submission between the 3D scene and the frame swap.

With the foundation working, I built out two live control panels on top of it:

**Particle Controls:** sliders for speed, rate, size, duration, and emitter type. Changes take effect on newly spawned particles immediately, no restart needed.

**Audio Controls:** volume, mute with saved-gain restore on unmute, and spatial attenuation parameters: reference distance, max distance, and rolloff factor.

I also traced and fixed the pause logic itself. Setting m_frameTime to 0 had no effect because update events were already enqueued at the start of each frame using the previous frame's value. The actual fix: conditionally suppress Event_UPDATE, Event_PHYSICS_START, and Event_SCENE_GRAPH_UPDATE when paused. The scene graph freezes. Unpause, and everything resumes from where it stopped.

---

## Particle System: CPU Simulation, GPU Rendering

A flexible particle system where simulation runs on the CPU and the results get uploaded to the GPU as a dynamic mesh every frame; no static geometry, just a vertex and index buffer that rebuilds from live particle state.

Five emitter types, each with distinct physics behavior:

| Type | Behavior |
|---|---|
| **Sphere** | Uniform explosion in all directions |
| **Fountain** | Upward burst with lateral drift; gravity pulls particles back down |
| **Spiral** | Radial outward motion with velocity rotated around Y each frame |
| **Fire** | Narrow upward spread with light downward pull and natural flicker |
| **Burst** | Instantaneous one-shot explosion |

Each particle renders as a billboard quad: four vertices built from the particle's world position and size, re-oriented every frame to face the camera. Spawn rate, lifetime, respawn, and velocity generation all run through a single updateParticleBuffer() call per frame.

The ImGui panel lets you switch emitter types, dial in parameters, and watch the system respond live without touching code.

---

## 3D Spatial Audio: OpenAL Integration

Sound sources that exist in 3D space and respond to where the camera is. I integrated **OpenAL Soft** for distance-based positional audio, built around two components:

**SoundManager** handles OpenAL initialization (device, context, and distance attenuation model) early in the engine's startup sequence. It exposes an updateListenerFromCamera() method that syncs the OpenAL listener's position and orientation with the active camera every frame.

**SoundComponent** is a scene-attachable component that loads .wav files via libsndfile, creates OpenAL buffers and sources, and registers for Event_UPDATE to check camera distance every frame. Move beyond the cutoff radius and the source stops. Come back in range and it resumes. All attenuation parameters are tunable at runtime through the ImGui audio panel.

One bug worth noting: the original distance-based stop logic would restart sound any time it wasn't playing and the camera was nearby, including after the sound had naturally ended or been manually muted. The fix was a m_stoppedByDistance flag that distinguishes a distance-triggered stop from any other kind, so the resume logic only fires when it should.

I also added a toggleable debug overlay (press T) that displays the current camera-to-source distance and simulated volume percentage in real time, making the spatial behavior easy to confirm visually.

---

## Reflections

The thing this project drove home: **everything in a game engine is connected**. The pause system was broken because of how the event queue ordered operations across frame boundaries. The UI system leaked memory because scene graph objects have different lifetime semantics than debug overlays. The audio system needed correct camera transforms before distance attenuation could work.

Getting any one system right required understanding several others. That's what made this worth building.
