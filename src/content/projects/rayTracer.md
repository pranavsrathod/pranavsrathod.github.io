---
title: "Path Tracer & Ray Tracer"
description: "A CPU-based C++ path tracer and ray tracer implementing Monte Carlo global illumination, cosine-weighted sampling, Russian Roulette, and Next Event Estimation."
publishDate: "2026-03-16"
poster: "/CS420/rayTracing/PathTracing/512/spheres.jpg"
isFeatured: true
seo:
  title: "Path Tracer & Ray Tracer | C++ Global Illumination"
  description: "C++ Monte Carlo path tracer with global illumination, cosine-weighted sampling, and Russian Roulette. Extended from a from-scratch ray tracer."
  image:
    src: "/CS420/rayTracing/PathTracing/512/spheres.jpg"
    alt: "Path tracer spheres render with global illumination"
---

## Overview

A CPU-based renderer built from scratch in C++, extended from a ray tracer into a full Monte Carlo path tracer. The path tracer simulates global illumination by tracing light paths recursively through a scene, using cosine-weighted hemisphere sampling, Russian Roulette termination, and Next Event Estimation to produce physically accurate renders.

The ray tracer foundation implements Phong shading, shadow rays, and sphere/triangle intersections - extended with antialiasing and recursive reflections on separate branches.

Full source code on [GitHub](https://github.com/pranavsrathod/Ray-Tracing), with branches for [antialiasing](https://github.com/pranavsrathod/Ray-Tracing/tree/antialiasing), [recursive reflections](https://github.com/pranavsrathod/Ray-Tracing/tree/reflections), and [path tracing](https://github.com/pranavsrathod/Ray-Tracing/tree/path-tracer).

<style>
  /* ── SHARED TOKENS ─────────────────────────────────────────────────── */
  .rt-wrap {
    --rt-accent: #4d5fd4;
    --rt-accent-strong: #3b4fc8;
    --rt-equation-color: #b13a2e;
    --rt-surface: #fbfaf6;
    --rt-surface-raised: #f3f1e8;
    --rt-surface-soft: #efede4;
    --rt-text-subtle: rgba(23, 23, 23, 0.72);
  }
  html.dark .rt-wrap {
    --rt-accent: #9bb0ff;
    --rt-accent-strong: #b8c7ff;
    --rt-equation-color: #e8c168;
    --rt-surface: #111f3c;
    --rt-surface-raised: #0f1b34;
    --rt-surface-soft: #1a2a4b;
    --rt-text-subtle: rgba(242, 241, 236, 0.78);
  }

  /* ── PARENT TABS ────────────────────────────────────────────────────── */
  .renderer-parent-tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    border-bottom: 2px solid rgba(23,23,23,0.12);
    padding-bottom: 0;
  }
  html.dark .renderer-parent-tabs {
    border-color: rgba(186,206,255,0.18);
  }
  .renderer-parent-tab {
    font-family: 'Inter Variable', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    padding: 0.6rem 1.4rem;
    border: none;
    background: transparent;
    color: var(--text-main);
    opacity: 0.5;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -2px;
    transition: all 0.2s ease;
    border-radius: 6px 6px 0 0;
  }
  .renderer-parent-tab.active {
    opacity: 1;
    border-bottom-color: var(--rt-accent);
    color: var(--rt-accent);
  }
  .renderer-parent-tab:hover:not(.active) {
    opacity: 0.8;
  }
  .renderer-panel {
    display: none;
  }
  .renderer-panel.active {
    display: block;
  }

  /* ── SHARED VIEWER SHELL ────────────────────────────────────────────── */
  .raytracer-viewer-wrap {
    width: 100%;
    margin: 0 0 2.5rem;
    padding: 1.35rem;
    border: 1px solid rgba(23, 23, 23, 0.24);
    border-radius: 22px;
    background: linear-gradient(150deg, #f9f7f0 0%, #f0eee4 55%, #ece9df 100%);
    box-shadow: 0 14px 28px rgba(17, 24, 39, 0.07);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.1rem;
  }
  html.dark .raytracer-viewer-wrap {
    border-color: rgba(182, 203, 255, 0.4);
    background:
      radial-gradient(120% 130% at 0% 0%, rgba(112, 145, 255, 0.26) 0%, rgba(10, 18, 34, 0) 50%),
      linear-gradient(160deg, #0f1b34 0%, #0c162d 52%, #091327 100%);
    box-shadow: 0 26px 52px rgba(4, 8, 20, 0.5);
  }
  .viewer-header { text-align: center; }
  .viewer-header p {
    margin: 0 0 0.3rem;
    font-size: 0.66rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--rt-accent);
    font-family: 'Inter Variable', sans-serif;
    font-weight: 650;
  }
  .viewer-header h3 {
    margin: 0;
    font-size: 2rem;
    line-height: 1.1;
    font-family: 'Newsreader Variable', serif;
    font-weight: 500;
    color: var(--text-main);
  }
  .rt-controls-row {
    width: min(100%, 620px);
    display: flex;
    justify-content: center;
  }
  .rt-scene-tabs {
    display: flex;
    gap: 0.35rem;
    background: var(--rt-surface-raised);
    padding: 0.35rem;
    width: fit-content;
    border-radius: 12px;
    border: 1px solid rgba(23, 23, 23, 0.16);
  }
  html.dark .rt-scene-tabs { border-color: rgba(186, 206, 255, 0.28); }
  .rt-scene-tab {
    font-family: 'Inter Variable', sans-serif;
    font-size: 0.74rem;
    font-weight: 500;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    padding: 0.45rem 1rem;
    border-radius: 8px;
    border: 1px solid transparent;
    background: transparent;
    color: var(--text-main);
    opacity: 0.72;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .rt-scene-tab.active {
    background: var(--rt-accent-strong);
    border-color: var(--rt-accent-strong);
    color: #f7f7ff;
    opacity: 1;
    box-shadow: 0 8px 16px rgba(59, 79, 200, 0.25);
  }
  .rt-scene-tab:hover:not(.active) { background: var(--rt-surface-soft); opacity: 1; }
  .rt-progress-wrap {
    width: min(100%, 620px);
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
  }
  .rt-progress-label {
    margin: 0;
    font-family: 'Inter Variable', sans-serif;
    font-size: 0.71rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--rt-text-subtle);
  }
  .rt-progress-rail {
    height: 8px;
    border-radius: 999px;
    overflow: hidden;
    border: 1px solid rgba(23, 23, 23, 0.16);
    background: var(--rt-surface-raised);
  }
  .rt-progress-fill {
    height: 100%;
    width: 0;
    border-radius: inherit;
    background: linear-gradient(90deg, var(--rt-accent) 0%, var(--rt-accent-strong) 100%);
    transition: width 0.25s ease;
  }
  html.dark .rt-progress-rail { border-color: rgba(186, 206, 255, 0.3); background: #0d182f; }
  .rt-carousel-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.95rem;
    width: 100%;
  }
  .rt-nav-btn {
    width: 42px; height: 42px;
    border-radius: 50%;
    border: 1px solid rgba(23, 23, 23, 0.2);
    background: var(--rt-surface-raised);
    color: var(--text-main);
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .rt-nav-btn:hover { border-color: var(--rt-accent-strong); color: var(--rt-accent-strong); transform: translateY(-1px); }
  html.dark .rt-nav-btn { border-color: rgba(186, 206, 255, 0.26); }
  .rt-flashcard-wrap {
    width: min(100%, 620px);
    height: 500px;
    perspective: 1400px;
    cursor: pointer;
  }
  .rt-flashcard-inner {
    width: 100%; height: 100%;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.65s cubic-bezier(0.4, 0.2, 0.2, 1);
  }
  .rt-flashcard-wrap.flipped .rt-flashcard-inner { transform: rotateY(180deg); }
  .rt-card-face {
    position: absolute; inset: 0;
    backface-visibility: hidden;
    border-radius: 16px; overflow: hidden;
    border: 1px solid rgba(23, 23, 23, 0.2);
    background: var(--rt-surface);
    box-shadow: 0 12px 24px rgba(17, 24, 39, 0.14);
  }
  html.dark .rt-card-face { border-color: rgba(186, 206, 255, 0.3); box-shadow: 0 12px 24px rgba(5, 11, 27, 0.42); }
  .rt-card-front { display: flex; flex-direction: column; }
  .rt-stage-figure { margin: 0; display: flex; flex-direction: column; flex: 1; }
  .rt-stage-figure img { width: 100%; height: 390px; object-fit: cover; display: block; }
  .rt-stage-caption {
    margin: 0; padding: 0.75rem 1rem;
    border-top: 1px solid rgba(23, 23, 23, 0.2);
    font-family: 'Inter Variable', sans-serif;
    font-size: 0.79rem; line-height: 1.4;
    letter-spacing: 0.06em; text-transform: uppercase;
    color: var(--text-main);
  }
  .rt-card-front-footer {
    padding: 0.75rem 1rem 0.95rem;
    display: flex; justify-content: flex-end;
    border-top: 1px dashed rgba(23, 23, 23, 0.28);
  }
  .rt-flip-hint-front {
    font-family: 'Inter Variable', sans-serif;
    font-size: 0.7rem; letter-spacing: 0.05em; text-transform: uppercase;
    color: var(--text-main); opacity: 0.74;
    display: flex; align-items: center; gap: 0.35rem;
  }
  .rt-flip-hint-front::before { content: '↩'; color: var(--rt-accent); }
  .rt-card-back {
    transform: rotateY(180deg);
    display: flex; flex-direction: column;
    padding: 1.45rem 1.5rem; gap: 0.9rem;
  }
  .rt-back-tag { font-family: 'Inter Variable', sans-serif; font-size: 0.66rem; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: var(--rt-accent); }
  .rt-back-title { font-size: 1.26rem; line-height: 1.2; font-family: 'Newsreader Variable', serif; font-weight: 500; color: var(--text-main); }
  .rt-back-divider { width: 48px; height: 2px; background: var(--rt-accent); border-radius: 2px; }
  .rt-back-desc { font-family: 'Inter Variable', sans-serif; font-size: 0.84rem; line-height: 1.62; color: var(--text-main); opacity: 0.86; }
  .rt-back-eq {
    margin-top: auto;
    background: linear-gradient(160deg, rgba(77, 95, 212, 0.1) 0%, var(--rt-surface-soft) 62%);
    border: 1px solid rgba(23, 23, 23, 0.2);
    border-radius: 12px; padding: 0.85rem 0.9rem;
    display: grid; gap: 0.62rem;
  }
  .rt-eq-row { margin: 0; display: grid; grid-template-columns: 1fr; gap: 0.34rem; text-align: center; align-items: start; }
  .rt-eq-row:first-child { padding: 0.2rem 0.2rem 0.52rem; border-bottom: 1px solid rgba(23, 23, 23, 0.15); }
  .rt-eq-row:last-child { padding-top: 0.1rem; }
  .rt-eq-label { font-family: 'Inter Variable', sans-serif; font-size: 0.65rem; font-weight: 650; letter-spacing: 0.1em; text-transform: uppercase; color: var(--rt-accent-strong); white-space: nowrap; line-height: 1.4; justify-self: center; }
  .rt-eq-formula, .rt-eq-note { color: var(--text-main); overflow-wrap: anywhere; }
  .rt-eq-formula { font-family: "Cambria Math", "STIX Two Math", "Times New Roman", Georgia, serif; font-size: 1.06rem; font-weight: 500; letter-spacing: 0.01em; line-height: 1.3; font-variant-numeric: lining-nums; }
  .rt-eq-row:first-child .rt-eq-formula { text-align: center; font-size: 1.34rem; font-weight: 600; line-height: 1.16; color: var(--rt-equation-color); text-shadow: 0 1px 0 rgba(255,255,255,0.32); }
  .rt-eq-formula sub { font-size: 0.72em; line-height: 0; vertical-align: -0.25em; }
  .rt-eq-formula sup { font-size: 0.68em; line-height: 0; vertical-align: 0.45em; }
  .rt-eq-note { font-family: 'Inter Variable', sans-serif; font-size: 0.75rem; line-height: 1.5; text-align: center; max-width: 33ch; margin: 0 auto; opacity: 0.86; }
  html.dark .rt-back-eq, html.dark .rt-stage-caption, html.dark .rt-card-front-footer { border-color: rgba(186, 206, 255, 0.24); }
  html.dark .rt-back-eq { background: linear-gradient(155deg, rgba(155, 176, 255, 0.22) 0%, rgba(18, 34, 66, 0.86) 58%, rgba(11, 24, 48, 0.96) 100%); border-color: rgba(186, 206, 255, 0.28); }
  html.dark .rt-eq-row:first-child { border-color: rgba(186, 206, 255, 0.26); }
  html.dark .rt-eq-row:first-child .rt-eq-formula { color: var(--rt-equation-color); text-shadow: 0 0 12px rgba(232, 193, 104, 0.28); }
  .rt-flip-hint-back { font-family: 'Inter Variable', sans-serif; font-size: 0.7rem; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-main); opacity: 0.7; margin-top: auto; display: flex; align-items: center; gap: 0.35rem; }
  .rt-flip-hint-back::before { content: '↩'; color: var(--rt-accent); }
  .rt-stage-dots { display: flex; gap: 0.45rem; justify-content: center; opacity: 0.58; }
  .rt-dot { width: 6px; height: 6px; border-radius: 999px; background: var(--rt-surface-raised); border: 1px solid rgba(23, 23, 23, 0.2); opacity: 0.45; transition: all 0.2s; cursor: pointer; }
  .rt-dot.active { background: var(--rt-accent-strong); border-color: var(--rt-accent-strong); opacity: 1; width: 18px; border-radius: 6px; }
  html.dark .rt-dot { border-color: rgba(186, 206, 255, 0.26); }

  /* ── SPP COMPARISON SLIDER ──────────────────────────────────────────── */
  .spp-compare-wrap {
    width: 100%;
    margin: 0 0 2.5rem;
    padding: 1.35rem;
    border: 1px solid rgba(23,23,23,0.24);
    border-radius: 22px;
    background: linear-gradient(150deg, #f9f7f0 0%, #f0eee4 55%, #ece9df 100%);
    box-shadow: 0 14px 28px rgba(17,24,39,0.07);
    display: flex; flex-direction: column; align-items: center; gap: 1.1rem;
  }
  html.dark .spp-compare-wrap {
    border-color: rgba(182,203,255,0.4);
    background: radial-gradient(120% 130% at 0% 0%, rgba(112,145,255,0.26) 0%, rgba(10,18,34,0) 50%), linear-gradient(160deg, #0f1b34 0%, #0c162d 52%, #091327 100%);
    box-shadow: 0 26px 52px rgba(4,8,20,0.5);
  }
  .spp-header { text-align: center; }
  .spp-header p { margin: 0 0 0.3rem; font-size: 0.66rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--rt-accent); font-family: 'Inter Variable', sans-serif; font-weight: 650; }
  .spp-header h3 { margin: 0; font-size: 1.8rem; line-height: 1.1; font-family: 'Newsreader Variable', serif; font-weight: 500; color: var(--text-main); }
  .spp-scene-tabs {
    display: flex; gap: 0.35rem;
    background: var(--rt-surface-raised);
    padding: 0.35rem; width: fit-content;
    border-radius: 12px; border: 1px solid rgba(23,23,23,0.16);
  }
  html.dark .spp-scene-tabs { border-color: rgba(186,206,255,0.28); }
  .spp-scene-tab {
    font-family: 'Inter Variable', sans-serif; font-size: 0.74rem; font-weight: 500;
    letter-spacing: 0.07em; text-transform: uppercase;
    padding: 0.45rem 1rem; border-radius: 8px; border: 1px solid transparent;
    background: transparent; color: var(--text-main); opacity: 0.72; cursor: pointer; transition: all 0.2s ease;
  }
  .spp-scene-tab.active { background: var(--rt-accent-strong); border-color: var(--rt-accent-strong); color: #f7f7ff; opacity: 1; box-shadow: 0 8px 16px rgba(59,79,200,0.25); }
  .spp-scene-tab:hover:not(.active) { background: var(--rt-surface-soft); opacity: 1; }
  .spp-slider-container {
    width: min(100%, 620px);
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid rgba(23,23,23,0.2);
    box-shadow: 0 12px 24px rgba(17,24,39,0.14);
    user-select: none;
    cursor: col-resize;
  }
  html.dark .spp-slider-container { border-color: rgba(186,206,255,0.3); }
  .spp-img-base, .spp-img-overlay {
    display: block; width: 100%; height: 400px; object-fit: cover;
  }
  .spp-img-base { position: relative; }
  .spp-img-overlay {
    position: absolute; top: 0; left: 0;
    clip-path: inset(0 50% 0 0);
    transition: clip-path 0s;
  }
  .spp-divider {
    position: absolute; top: 0; bottom: 0;
    left: 50%; width: 3px;
    background: #fff;
    box-shadow: 0 0 8px rgba(0,0,0,0.4);
    transform: translateX(-50%);
    pointer-events: none;
  }
  .spp-handle {
    position: absolute; top: 50%; left: 50%;
    width: 40px; height: 40px;
    border-radius: 50%;
    background: #fff;
    border: 3px solid var(--rt-accent-strong);
    box-shadow: 0 4px 12px rgba(0,0,0,0.25);
    transform: translate(-50%, -50%);
    display: flex; align-items: center; justify-content: center;
    pointer-events: none;
    font-size: 0.85rem; color: var(--rt-accent-strong); font-weight: 700;
  }
  .spp-label-left, .spp-label-right {
    position: absolute; bottom: 0.7rem;
    font-family: 'Inter Variable', sans-serif;
    font-size: 0.68rem; font-weight: 700;
    letter-spacing: 0.12em; text-transform: uppercase;
    padding: 0.25rem 0.6rem; border-radius: 6px;
    background: rgba(0,0,0,0.55); color: #fff;
    pointer-events: none;
  }
  .spp-label-left { left: 0.75rem; }
  .spp-label-right { right: 0.75rem; }
  .spp-hint {
    font-family: 'Inter Variable', sans-serif; font-size: 0.71rem;
    letter-spacing: 0.06em; text-transform: uppercase;
    color: var(--rt-text-subtle);
  }

  /* ── FEATURES ───────────────────────────────────────────────────────── */
  .rt-features { display: flex; flex-direction: column; gap: 0; margin: 1.5rem 0; border: 1px solid rgba(23,23,23,0.14); border-radius: 16px; overflow: hidden; }
  html.dark .rt-features { border-color: rgba(186,206,255,0.18); }
  .rt-feature { display: flex; gap: 1.1rem; padding: 1.2rem 1.3rem; border-bottom: 1px solid rgba(23,23,23,0.1); transition: background 0.2s; }
  .rt-feature:last-child { border-bottom: none; }
  .rt-feature:hover { background: rgba(77,95,212,0.04); }
  html.dark .rt-feature { border-color: rgba(186,206,255,0.1); }
  html.dark .rt-feature:hover { background: rgba(155,176,255,0.06); }
  .rt-feature-icon { flex-shrink: 0; width: 36px; height: 36px; border-radius: 10px; background: rgba(77,95,212,0.1); border: 1px solid rgba(77,95,212,0.2); display: flex; align-items: center; justify-content: center; margin-top: 0.1rem; }
  .rt-feature-icon svg { width: 18px; height: 18px; color: #4d5fd4; }
  html.dark .rt-feature-icon { background: rgba(155,176,255,0.12); border-color: rgba(155,176,255,0.25); }
  html.dark .rt-feature-icon svg { color: #9bb0ff; }
  .rt-feature-body { display: flex; flex-direction: column; gap: 0.6rem; flex: 1; }
  .rt-feature-body h4 { font-family: 'Inter Variable', sans-serif; font-size: 0.9rem; font-weight: 650; margin: 0; color: var(--text-main); }
  .rt-feature-body p { font-family: 'Inter Variable', sans-serif; font-size: 0.84rem; line-height: 1.65; color: var(--text-main); opacity: 0.82; margin: 0; }

  /* ── REPO GRID ──────────────────────────────────────────────────────── */
  .rt-repo-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; margin: 1.5rem 0; }
  .rt-repo-card { display: flex; flex-direction: column; gap: 0.65rem; padding: 1rem 1.1rem; border-radius: 12px; border: 1px solid rgba(23,23,23,0.18); background: #f9f7f0; text-decoration: none; color: inherit; transition: all 0.2s ease; }
  .rt-repo-card:hover { border-color: #4d5fd4; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(77,95,212,0.12); }
  html.dark .rt-repo-card { background: #111f3c; border-color: rgba(186,206,255,0.2); }
  html.dark .rt-repo-card:hover { border-color: #9bb0ff; box-shadow: 0 8px 20px rgba(155,176,255,0.15); }
  .rt-repo-card-header { display: flex; align-items: center; gap: 0.5rem; }
  .rt-repo-icon { width: 16px; height: 16px; color: #4d5fd4; flex-shrink: 0; }
  html.dark .rt-repo-icon { color: #9bb0ff; }
  .rt-repo-name { font-family: 'Inter Variable', sans-serif; font-size: 0.85rem; font-weight: 600; color: #4d5fd4; }
  html.dark .rt-repo-name { color: #9bb0ff; }
  .rt-repo-badge { margin-left: auto; font-family: 'Inter Variable', sans-serif; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; padding: 0.2rem 0.55rem; border-radius: 999px; background: rgba(77,95,212,0.12); color: #4d5fd4; border: 1px solid rgba(77,95,212,0.25); }
  .rt-repo-badge--branch { background: rgba(16,185,129,0.1); color: #059669; border-color: rgba(16,185,129,0.25); }
  html.dark .rt-repo-badge { background: rgba(155,176,255,0.15); color: #9bb0ff; border-color: rgba(155,176,255,0.3); }
  html.dark .rt-repo-badge--branch { background: rgba(52,211,153,0.12); color: #34d399; border-color: rgba(52,211,153,0.25); }
  .rt-repo-desc { font-family: 'Inter Variable', sans-serif; font-size: 0.8rem; line-height: 1.6; color: inherit; opacity: 0.78; margin: 0; }
  .rt-repo-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: auto; }
  .rt-repo-tags span { font-family: 'Inter Variable', sans-serif; font-size: 0.68rem; padding: 0.18rem 0.55rem; border-radius: 6px; background: rgba(23,23,23,0.07); color: inherit; opacity: 0.72; }
  html.dark .rt-repo-tags span { background: rgba(255,255,255,0.07); }

  @media (max-width: 760px) {
    .raytracer-viewer-wrap, .spp-compare-wrap { padding: 1rem; border-radius: 18px; }
    .viewer-header h3, .spp-header h3 { font-size: 1.72rem; }
    .rt-controls-row, .rt-progress-wrap { width: 100%; }
    .rt-carousel-row { flex-wrap: wrap; gap: 0.75rem; }
    .rt-flashcard-wrap { order: 1; width: 100%; height: 430px; }
    .rt-nav-btn { order: 2; }
    .rt-stage-figure img { height: 318px; }
    .rt-card-back { padding: 1.25rem 1.2rem; }
    .rt-back-desc { font-size: 0.8rem; line-height: 1.6; }
    .spp-img-base, .spp-img-overlay { height: 280px; }
    .spp-slider-container { width: 100%; }
  }
</style>

<div class="rt-wrap">

<!-- ── PARENT TABS ──────────────────────────────────────────────────── -->
<div class="renderer-parent-tabs" id="rendererParentTabs">
  <button class="renderer-parent-tab active" data-panel="pt">Path Tracer</button>
  <button class="renderer-parent-tab" data-panel="rt">Ray Tracer</button>
</div>

<!-- ══ PATH TRACER PANEL ═══════════════════════════════════════════════ -->
<div class="renderer-panel active" id="panel-pt">

<div class="raytracer-viewer-wrap">
  <div class="viewer-header">
    <p>global illumination</p>
    <h3>Path Tracer Viewer</h3>
  </div>
  <div class="rt-controls-row">
    <div class="rt-scene-tabs" id="ptSceneTabs">
      <button class="rt-scene-tab active" data-scene="SIGGRAPH">SIGGRAPH</button>
      <button class="rt-scene-tab" data-scene="Snow">Snow</button>
      <button class="rt-scene-tab" data-scene="Spheres">Spheres</button>
      <button class="rt-scene-tab" data-scene="Table">Table</button>
      <button class="rt-scene-tab" data-scene="Test2">Test2</button>
    </div>
  </div>
  <div class="rt-progress-wrap">
    <p class="rt-progress-label" id="ptProgressLabel">SIGGRAPH · 512 spp</p>
    <div class="rt-progress-rail">
      <div class="rt-progress-fill" id="ptProgressFill" style="width:100%"></div>
    </div>
  </div>
  <div class="rt-carousel-row">
    <div class="rt-flashcard-wrap" id="ptFlashcard">
      <div class="rt-flashcard-inner">
        <div class="rt-card-face rt-card-front">
          <figure class="rt-stage-figure">
            <img id="ptStageImage" src="/CS420/rayTracing/PathTracing/512/SIGGRAPH.jpg" alt="Path tracer render"/>
            <figcaption class="rt-stage-caption" id="ptStageCaption">SIGGRAPH · 512 spp</figcaption>
          </figure>
          <div class="rt-card-front-footer">
            <span class="rt-flip-hint-front">flip for technique</span>
          </div>
        </div>
        <div class="rt-card-face rt-card-back">
          <span class="rt-back-tag" id="ptBackTag">global illumination</span>
          <div class="rt-back-title" id="ptBackTitle">Monte Carlo Path Tracing</div>
          <div class="rt-back-divider"></div>
          <div class="rt-back-desc" id="ptBackDesc">The rendering equation describes how light accumulates at a point by integrating incoming radiance over the hemisphere. Monte Carlo integration approximates this integral by averaging many random ray samples - each sample traces a path through the scene, bouncing off surfaces and accumulating color.</div>
          <div class="rt-back-eq" id="ptBackEq">
            <p class="rt-eq-row">
              <span class="rt-eq-label">Rendering Equation</span>
              <span class="rt-eq-formula" id="ptBackEqFormula">L<sub>o</sub> = L<sub>e</sub> + ∫ f<sub>r</sub> · L<sub>i</sub> · cosθ dω</span>
            </p>
            <p class="rt-eq-row">
              <span class="rt-eq-label">Where</span>
              <span class="rt-eq-note" id="ptBackEqNote">f_r is the BRDF, L_i is incoming radiance, cosθ is the angle to the surface normal.</span>
            </p>
          </div>
          <span class="rt-flip-hint-back">flip back</span>
        </div>
      </div>
    </div>
  </div>
  <div class="rt-stage-dots" id="ptStageDots"></div>
</div>

<!-- SPP COMPARISON SLIDER -->
<div class="spp-compare-wrap">
  <div class="spp-header">
    <p>sample count comparison</p>
    <h3>64 spp vs 512 spp</h3>
  </div>
  <div class="rt-controls-row">
    <div class="spp-scene-tabs" id="sppSceneTabs">
      <button class="spp-scene-tab active" data-scene="spheres">Spheres</button>
      <button class="spp-scene-tab" data-scene="snow">Snow</button>
      <button class="spp-scene-tab" data-scene="table">Table</button>
      <button class="spp-scene-tab" data-scene="SIGGRAPH">SIGGRAPH</button>
      <button class="spp-scene-tab" data-scene="test2">Test2</button>
    </div>
  </div>
  <div class="spp-slider-container" id="sppSlider">
    <img class="spp-img-base" id="sppImg512" src="/CS420/rayTracing/PathTracing/512/spheres.jpg" alt="512 spp"/>
    <img class="spp-img-overlay" id="sppImg64" src="/CS420/rayTracing/PathTracing/64/spheres.jpg" alt="64 spp"/>
    <div class="spp-divider" id="sppDivider"></div>
    <div class="spp-handle" id="sppHandle">⇔</div>
    <span class="spp-label-left">64 spp</span>
    <span class="spp-label-right">512 spp</span>
  </div>
  <p class="spp-hint">Drag to compare · 64 spp left · 512 spp right</p>
</div>

</div><!-- end pt panel -->

<!-- ══ RAY TRACER PANEL ══════════════════════════════════════════════════ -->
<div class="renderer-panel" id="panel-rt">

<div class="raytracer-viewer-wrap">
  <div class="viewer-header">
    <p>renderer progression</p>
    <h3>Ray Tracer Viewer</h3>
  </div>
  <div class="rt-controls-row">
    <div class="rt-scene-tabs" id="rtSceneTabs">
      <button class="rt-scene-tab active" data-scene="Snow">Snow</button>
      <button class="rt-scene-tab" data-scene="Spheres">Spheres</button>
      <button class="rt-scene-tab" data-scene="Test2">Test2</button>
    </div>
  </div>
  <div class="rt-progress-wrap">
    <p class="rt-progress-label" id="rtProgressLabel">Snow · Stage 1 of 5</p>
    <div class="rt-progress-rail">
      <div class="rt-progress-fill" id="rtProgressFill"></div>
    </div>
  </div>
  <div class="rt-carousel-row">
    <button class="rt-nav-btn" id="rtPrevBtn">&#8592;</button>
    <div class="rt-flashcard-wrap" id="rtFlashcard">
      <div class="rt-flashcard-inner">
        <div class="rt-card-face rt-card-front">
          <figure class="rt-stage-figure">
            <img id="rtStageImage" src="" alt="render stage"/>
            <figcaption class="rt-stage-caption" id="rtStageCaption">-</figcaption>
          </figure>
          <div class="rt-card-front-footer">
            <span class="rt-flip-hint-front">flip for details</span>
          </div>
        </div>
        <div class="rt-card-face rt-card-back">
          <span class="rt-back-tag" id="rtBackTag">-</span>
          <div class="rt-back-title" id="rtBackTitle">-</div>
          <div class="rt-back-divider"></div>
          <div class="rt-back-desc" id="rtBackDesc">-</div>
          <div class="rt-back-eq" id="rtBackEq" hidden>
            <p class="rt-eq-row">
              <span class="rt-eq-label">Formula</span>
              <span class="rt-eq-formula" id="rtBackEqFormula">-</span>
            </p>
            <p class="rt-eq-row">
              <span class="rt-eq-label">Where</span>
              <span class="rt-eq-note" id="rtBackEqNote">-</span>
            </p>
          </div>
          <span class="rt-flip-hint-back">flip back</span>
        </div>
      </div>
    </div>
    <button class="rt-nav-btn" id="rtNextBtn">&#8594;</button>
  </div>
  <div class="rt-stage-dots" id="rtStageDots"></div>
</div>

</div><!-- end rt panel -->

</div><!-- end rt-wrap -->

<script>
(function() {

  // ── PARENT TAB SWITCHING ───────────────────────────────────────────
  document.querySelectorAll('.renderer-parent-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.renderer-parent-tab').forEach(t => t.classList.remove('active'))
      document.querySelectorAll('.renderer-panel').forEach(p => p.classList.remove('active'))
      tab.classList.add('active')
      document.getElementById('panel-' + tab.dataset.panel).classList.add('active')
    })
  })

  // ── PATH TRACER VIEWER ─────────────────────────────────────────────
  const ptData = {
    SIGGRAPH: {
      img: '/CS420/rayTracing/PathTracing/512/SIGGRAPH.jpg',
      caption: 'SIGGRAPH · 512 spp',
      tag: 'global illumination',
      title: 'Monte Carlo Path Tracing',
      desc: 'The rendering equation describes how light accumulates at a point by integrating incoming radiance over the hemisphere. Monte Carlo integration approximates this integral by averaging many random ray samples - each sample traces a full light path through the scene.',
      formula: 'L<sub>o</sub> = L<sub>e</sub> + ∫ f<sub>r</sub> · L<sub>i</sub> · cosθ dω',
      note: 'f_r is the BRDF, L_i is incoming radiance, cosθ is the angle to the surface normal.'
    },
    Snow: {
      img: '/CS420/rayTracing/PathTracing/512/snow.jpg',
      caption: 'Snow · 512 spp',
      tag: 'importance sampling',
      title: 'Cosine-Weighted Hemisphere Sampling',
      desc: 'Uniform hemisphere sampling wastes samples on directions that contribute little energy. Cosine-weighted sampling concentrates samples near the surface normal where the cosine term is largest, reducing variance without bias. The PDF cancels cleanly against the cosine term in the rendering equation.',
      formula: 'pdf(ω) = cosθ / π',
      note: 'Sampling proportional to cosθ means the pdf cancels the cosine term, leaving just the BRDF contribution.'
    },
    Spheres: {
      img: '/CS420/rayTracing/PathTracing/512/spheres.jpg',
      caption: 'Spheres · 512 spp',
      tag: 'russian roulette',
      title: 'Russian Roulette Termination',
      desc: 'Truncating paths at a fixed depth introduces bias. Russian Roulette instead terminates paths probabilistically based on albedo brightness - high-albedo surfaces survive more often, low-albedo paths terminate early. Surviving paths are divided by their survival probability to keep the estimator unbiased.',
      formula: 'L = L<sub>direct</sub> + (albedo · L<sub>indirect</sub>) / p<sub>survive</sub>',
      note: 'p_survive is clamped between 0.1 and 0.95 based on the max albedo channel.'
    },
    Table: {
      img: '/CS420/rayTracing/PathTracing/512/table.jpg',
      caption: 'Table · 512 spp',
      tag: 'next event estimation',
      title: 'Next Event Estimation',
      desc: 'Pure path tracing rarely hits light sources by random sampling, causing high variance. Next Event Estimation (NEE) explicitly samples each light at every bounce, combining direct lighting with the indirect bounce. This dramatically reduces noise, especially in scenes with small or distant lights.',
      formula: 'L = L<sub>direct</sub>(NEE) + albedo · L<sub>indirect</sub>',
      note: 'Direct light is computed by shadow ray to each point light. Indirect comes from the random bounce.'
    },
    Test2: {
      img: '/CS420/rayTracing/PathTracing/512/test2.jpg',
      caption: 'Test2 · 512 spp',
      tag: 'anti-aliasing',
      title: 'Jittered Per-Pixel Sampling',
      desc: 'Rather than firing one ray through the exact pixel center, jittered sampling adds a random sub-pixel offset to each of the 64 or 512 samples. This distributes samples across the pixel area, simultaneously anti-aliasing edges and reducing noise compared to uniform sampling.',
      formula: 'color = (1/N) · Σ traceRay(x + ξ<sub>x</sub>, y + ξ<sub>y</sub>)',
      note: 'ξ_x and ξ_y are uniform random offsets in [0,1) per sample. N = 64 or 512.'
    }
  }

  let ptScene = 'SIGGRAPH'
  const ptFlashcard = document.getElementById('ptFlashcard')
  const ptImg = document.getElementById('ptStageImage')
  const ptCaption = document.getElementById('ptStageCaption')
  const ptTag = document.getElementById('ptBackTag')
  const ptTitle = document.getElementById('ptBackTitle')
  const ptDesc = document.getElementById('ptBackDesc')
  const ptEq = document.getElementById('ptBackEq')
  const ptFormula = document.getElementById('ptBackEqFormula')
  const ptNote = document.getElementById('ptBackEqNote')
  const ptProgress = document.getElementById('ptProgressLabel')
  const ptFill = document.getElementById('ptProgressFill')

  function updatePT() {
    ptFlashcard.classList.remove('flipped')
    const d = ptData[ptScene]
    ptImg.src = d.img
    ptImg.alt = ptScene + ' path trace'
    ptCaption.textContent = d.caption
    ptTag.textContent = d.tag
    ptTitle.textContent = d.title
    ptDesc.textContent = d.desc
    ptFormula.innerHTML = d.formula
    ptNote.textContent = d.note
    ptProgress.textContent = d.caption
    ptFill.style.width = '100%'
  }

  ptFlashcard.addEventListener('click', () => ptFlashcard.classList.toggle('flipped'))

  document.querySelectorAll('#ptSceneTabs .rt-scene-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('#ptSceneTabs .rt-scene-tab').forEach(t => t.classList.remove('active'))
      tab.classList.add('active')
      ptScene = tab.dataset.scene
      updatePT()
    })
  })

  updatePT()

  // ── SPP COMPARISON SLIDER ──────────────────────────────────────────
  const slider = document.getElementById('sppSlider')
  const img64 = document.getElementById('sppImg64')
  const divider = document.getElementById('sppDivider')
  const handle = document.getElementById('sppHandle')
  let dragging = false
  let sppScene = 'spheres'

  function setSPPPosition(pct) {
    pct = Math.max(2, Math.min(98, pct))
    img64.style.clipPath = `inset(0 ${100 - pct}% 0 0)`
    divider.style.left = pct + '%'
    handle.style.left = pct + '%'
  }

  function getPercent(e) {
    const rect = slider.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    return ((clientX - rect.left) / rect.width) * 100
  }

  slider.addEventListener('mousedown', e => { dragging = true; setSPPPosition(getPercent(e)); e.preventDefault() })
  slider.addEventListener('touchstart', e => { dragging = true; setSPPPosition(getPercent(e)) }, { passive: true })
  window.addEventListener('mousemove', e => { if (dragging) setSPPPosition(getPercent(e)) })
  window.addEventListener('touchmove', e => { if (dragging) setSPPPosition(getPercent(e)) }, { passive: true })
  window.addEventListener('mouseup', () => { dragging = false })
  window.addEventListener('touchend', () => { dragging = false })

  setSPPPosition(50)

  document.querySelectorAll('#sppSceneTabs .spp-scene-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('#sppSceneTabs .spp-scene-tab').forEach(t => t.classList.remove('active'))
      tab.classList.add('active')
      sppScene = tab.dataset.scene
      img64.src = `/CS420/rayTracing/PathTracing/64/${sppScene}.jpg`
      document.getElementById('sppImg512').src = `/CS420/rayTracing/PathTracing/512/${sppScene}.jpg`
      setSPPPosition(50)
    })
  })

  // ── RAY TRACER VIEWER ──────────────────────────────────────────────
  const baseStages = [
    { file: '01-flat.jpg', label: 'Flat Baseline', tag: 'intersection', title: 'Raw Geometry, No Lighting', desc: 'Each pixel fires a ray into the scene. The closest surface hit determines the color - just the raw diffuse value. No lighting calculation happens here at all.', formula: 'color = k_d', formulaHtml: 'color = k<sub>d</sub>', note: 'k_d is the surface\'s base diffuse color.' },
    { file: '02-sphere.jpg', label: 'Sphere Shading', tag: 'phong · spheres', title: 'Phong Illumination on Spheres', desc: 'The sphere\'s outward normal is computed at the hit point. This normal drives the Phong equation - combining ambient, diffuse, and specular terms across all lights.', formula: 'I = k_d(L · N) + k_s(R · V)^sh', formulaHtml: 'I = k<sub>d</sub>(L · N) + k<sub>s</sub>(R · V)<sup>sh</sup>', note: 'N is the unit normal at the hit point on the sphere.' },
    { file: '03-triangle.jpg', label: 'Triangle Shading', tag: 'phong · triangles', title: 'Smooth Shading via Interpolation', desc: 'Triangles store a normal at each vertex. Rather than using a flat face normal, the per-vertex normals are blended across the surface using barycentric coordinates - giving smooth highlights instead of a faceted look.', formula: 'N = αN0 + βN1 + γN2', formulaHtml: 'N = αN<sub>0</sub> + βN<sub>1</sub> + γN<sub>2</sub>', note: 'α + β + γ = 1 are barycentric weights over the triangle.' },
    { file: '04-shadows.jpg', label: 'Shadows', tag: 'shadow rays', title: 'Visibility per Light Source', desc: 'After finding a hit, a shadow ray is fired from that point toward each light. If any geometry blocks the path before reaching the light, that light\'s contribution is skipped entirely.', formula: 'if intersect(P -> light): skip light term', formulaHtml: 'if intersect(P → L): skip light term', note: 'Any blocker between hit point P and a light casts shadow.' },
    { file: '05-aa.jpg', label: 'Anti-Aliasing', tag: 'supersampling', title: '2×2 Grid Supersampling', desc: 'Instead of one ray per pixel, four rays are distributed in a 2×2 grid across the pixel area. Their colors are averaged, smoothing out jagged staircase edges on silhouettes and curved surfaces.', formula: 'color = (1/N) * Σ traceRay(x+δi, y+δj)', formulaHtml: 'color = (1/N) · Σ traceRay(x + δ<sub>i</sub>, y + δ<sub>j</sub>)', note: 'N = 4 for a 2×2 sample pattern per pixel.' }
  ]
  const reflectionStages = [
    { file: '06-reflection-1.jpg', label: 'Reflection - Depth 1', tag: 'recursive reflections', title: 'One Bounce Reflection', desc: 'A reflected ray is fired from each hit point. The final color blends local Phong shading with whatever the reflected ray sees, weighted by the surface\'s specular value.', formula: 'color = (1-k_s)local + k_s * traceRay(R)', formulaHtml: 'color = (1 - k<sub>s</sub>)local + k<sub>s</sub> · traceRay(R)', note: 'R is the first reflected ray direction from the hit normal.' },
    { file: '07-reflection-2.jpg', label: 'Reflection - Depth 2', tag: 'recursive reflections', title: 'Two Bounce Reflection', desc: 'The reflected ray itself can now reflect again. Surfaces begin picking up color from nearby objects, increasing physical accuracy at the cost of doubled render time.', formula: 'R2 = reflect(R1), depth = 2', formulaHtml: 'R<sub>2</sub> = reflect(R<sub>1</sub>), depth = 2', note: 'A second bounce captures reflected light from nearby geometry.' },
    { file: '08-reflection-3.jpg', label: 'Reflection - Depth 3', tag: 'recursive reflections', title: 'Three Bounce Reflection', desc: 'Three recursive bounces. Visually the difference from depth 2 is subtle but the scene picks up more inter-object color bleeding. Diminishing returns - each bounce doubles compute cost.', formula: 'R3 = reflect(R2), depth = 3', formulaHtml: 'R<sub>3</sub> = reflect(R<sub>2</sub>), depth = 3', note: 'Extra bounce adds subtle energy but increases render time.' }
  ]
  const rtStages = { Snow: baseStages, Spheres: baseStages, Test2: [...baseStages, ...reflectionStages] }

  let rtScene = 'Snow'
  let rtStage = 0
  const rtFlashcard = document.getElementById('rtFlashcard')
  const rtImg = document.getElementById('rtStageImage')
  const rtCaption = document.getElementById('rtStageCaption')
  const rtTag = document.getElementById('rtBackTag')
  const rtTitle = document.getElementById('rtBackTitle')
  const rtDesc = document.getElementById('rtBackDesc')
  const rtEqPanel = document.getElementById('rtBackEq')
  const rtFormula = document.getElementById('rtBackEqFormula')
  const rtNote = document.getElementById('rtBackEqNote')
  const rtProgress = document.getElementById('rtProgressLabel')
  const rtFill = document.getElementById('rtProgressFill')
  const rtDots = document.getElementById('rtStageDots')

  function buildRTDots() {
    rtDots.innerHTML = ''
    rtStages[rtScene].forEach((_, i) => {
      const d = document.createElement('div')
      d.className = 'rt-dot' + (i === rtStage ? ' active' : '')
      d.onclick = () => { rtStage = i; updateRT() }
      rtDots.appendChild(d)
    })
  }

  function updateRT() {
    rtFlashcard.classList.remove('flipped')
    const s = rtStages[rtScene][rtStage]
    rtImg.src = `/CS420/rayTracing/${rtScene}/${s.file}`
    rtImg.alt = `${rtScene} - ${s.label}`
    rtCaption.textContent = s.label
    rtTag.textContent = s.tag
    rtTitle.textContent = s.title
    rtDesc.textContent = s.desc
    const formula = s.formula || s.eq
    const formulaHtml = s.formulaHtml || formula
    if (formula) {
      rtEqPanel.hidden = false
      rtFormula.innerHTML = formulaHtml
      rtNote.textContent = s.note || ''
    } else {
      rtEqPanel.hidden = true
    }
    const total = rtStages[rtScene].length
    rtProgress.textContent = `${rtScene} · Stage ${rtStage + 1} of ${total}`
    rtFill.style.width = `${((rtStage + 1) / total) * 100}%`
    buildRTDots()
  }

  rtFlashcard.addEventListener('click', () => rtFlashcard.classList.toggle('flipped'))
  document.getElementById('rtPrevBtn').addEventListener('click', () => { rtStage = (rtStage - 1 + rtStages[rtScene].length) % rtStages[rtScene].length; updateRT() })
  document.getElementById('rtNextBtn').addEventListener('click', () => { rtStage = (rtStage + 1) % rtStages[rtScene].length; updateRT() })

  document.querySelectorAll('#rtSceneTabs .rt-scene-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('#rtSceneTabs .rt-scene-tab').forEach(t => t.classList.remove('active'))
      tab.classList.add('active')
      rtScene = tab.dataset.scene
      rtStage = 0
      updateRT()
    })
  })

  updateRT()

})()
</script>

---

## What Is a Path Tracer?

A path tracer extends a ray tracer by simulating the full physical behavior of light. Rather than approximating indirect lighting with an ambient term, a path tracer recursively traces rays as they bounce through a scene - each bounce picking up color from whatever surface it hits next, and combining it with direct illumination from light sources.

The result is physically accurate global illumination: color bleeding between surfaces, soft shadows from area lights, and realistic inter-reflections - all emerging naturally from the simulation rather than being approximated.

The key tradeoff is noise. Each pixel is estimated by averaging many independent random paths. Fewer samples means faster renders but grainier images. The 64 vs 512 spp comparison above shows this directly.

---

## Core Features

<div class="rt-features">
  <div class="rt-feature">
    <div class="rt-feature-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>
    </div>
    <div class="rt-feature-body">
      <h4>Monte Carlo Global Illumination</h4>
      <p>Each pixel samples 64 or 512 random light paths. Every path bounces up to 5 times, accumulating color from each surface it hits. The average of all samples approximates the rendering equation integral, producing physically accurate indirect lighting without precomputed light maps.</p>
    </div>
  </div>
  <div class="rt-feature">
    <div class="rt-feature-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>
    </div>
    <div class="rt-feature-body">
      <h4>Cosine-Weighted Hemisphere Sampling</h4>
      <p>Bounce directions are sampled proportionally to the cosine of the angle from the surface normal. This concentrates samples where they contribute most energy, reducing variance compared to uniform hemisphere sampling. The cosine term in the rendering equation cancels against the PDF, simplifying the estimator.</p>
    </div>
  </div>
  <div class="rt-feature">
    <div class="rt-feature-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.35-5.45 1.012a.75.75 0 00-.49.72v.527c0 .386.152.756.423 1.028L9.75 8.25v1.5l-1.5 1.5H6.75A2.25 2.25 0 004.5 13.5v2.25a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V13.5a2.25 2.25 0 00-2.25-2.25h-1.5L14.25 9.75v-1.5l2.577-2.743A1.5 1.5 0 0017.25 4.5v-.527a.75.75 0 00-.49-.72A13.4 13.4 0 0012 2.25z"/></svg>
    </div>
    <div class="rt-feature-body">
      <h4>Russian Roulette Termination</h4>
      <p>Paths are terminated probabilistically based on surface albedo rather than a fixed depth limit. High-albedo surfaces have a higher survival probability; low-albedo paths terminate early. Surviving paths divide their contribution by the survival probability to maintain an unbiased estimate.</p>
    </div>
  </div>
  <div class="rt-feature">
    <div class="rt-feature-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"/></svg>
    </div>
    <div class="rt-feature-body">
      <h4>Next Event Estimation</h4>
      <p>At every bounce, a shadow ray is fired directly to each point light and its contribution is added to the path. This explicit direct lighting sampling dramatically reduces variance in the indirect lighting estimate, especially in scenes where random rays rarely hit light sources.</p>
    </div>
  </div>
  <div class="rt-feature">
    <div class="rt-feature-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
    </div>
    <div class="rt-feature-body">
      <h4>Ray Tracer Foundation</h4>
      <p>The path tracer extends a from-scratch ray tracer implementing sphere and triangle intersection, Phong shading with barycentric normal interpolation, shadow rays, 2×2 supersampling anti-aliasing, and configurable-depth recursive reflections - all built without reliance on existing rendering engines.</p>
    </div>
  </div>
</div>

---
## What Is a Ray Tracer?

Think about how you see the world. Light travels from a source, bounces off objects, and eventually reaches your eye. A ray tracer reverses that process. Instead of simulating light going outward from a source, it starts at the camera and works backwards, firing one ray per pixel into the scene and asking: what does this pixel see, and how is it lit?

<figure>
  <img src="https://upload.wikimedia.org/wikipedia/commons/8/83/Ray_trace_diagram.svg" alt="Backwards ray tracing diagram showing rays fired from camera through pixels into the scene" />
  <figcaption>Backwards ray tracing — rays originate at the camera and travel through each pixel into the scene. Source: Wikipedia, CC BY-SA 3.0</figcaption>
</figure>

Most real-time graphics use a faster technique called rasterization instead. While rasterization is great for speed, it struggles to simulate how light actually behaves. Shadows, reflections, and the way light bounces between surfaces all have to be faked using clever tricks. Ray tracing does not need those tricks - shadows fall naturally because a blocked ray means no light, and reflections work because a ray can bounce and pick up color from whatever it hits next.

*Sources: [NVIDIA Blog](https://blogs.nvidia.com/blog/whats-difference-between-ray-tracing-rasterization/), [Wikipedia](https://en.wikipedia.org/wiki/Ray_tracing_(graphics)), [Scratchapixel](https://www.scratchapixel.com/lessons/3d-basic-rendering/ray-tracing-generating-camera-rays/generating-camera-rays.html)*

## Core Features

<div class="rt-features">
  <div class="rt-feature">
    <div class="rt-feature-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
    </div>
    <div class="rt-feature-body">
      <h4>Ray Generation</h4>
      <p>For every pixel in a 640x480 image, a ray is fired from the camera into the scene. The direction of each ray is computed from the field of view and aspect ratio, mapping screen coordinates into 3D camera space.</p>
      <!-- <figure class="rt-feature-fig">
        <img src="https://upload.wikimedia.org/wikipedia/commons/8/83/Ray_trace_diagram.svg" alt="Ray tracing diagram showing rays from camera through image plane into scene"/>
        <figcaption>Rays originate at the camera and pass through each pixel into the scene. <a href="https://en.wikipedia.org/wiki/Ray_tracing_(graphics)" target="_blank" rel="noopener">Wikipedia</a>, CC BY-SA 3.0</figcaption>
      </figure> -->
    </div>
  </div>
  <div class="rt-feature">
    <div class="rt-feature-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>
    </div>
    <div class="rt-feature-body">
      <h4>Geometry Intersection</h4>
      <p>Two primitive types are supported. Spheres use a quadratic intersection formula, solving for where the ray meets the sphere surface. Triangles use a plane intersection followed by a barycentric coordinate test to confirm the hit lands inside the triangle boundary. The same barycentric weights are reused later for smooth shading.</p>
      <!-- <figure class="rt-feature-fig">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Line_sphere_intersection.svg/320px-Line_sphere_intersection.svg.png" alt="Diagram showing three cases of ray-sphere intersection: miss, tangent, and two intersection points"/>
        <figcaption>Three possible outcomes when a ray meets a sphere: no intersection, tangent, or two hit points. <a href="https://en.wikipedia.org/wiki/Line%E2%80%93sphere_intersection" target="_blank" rel="noopener">Wikipedia</a>, CC BY-SA 3.0</figcaption>
      </figure> -->
    </div>
  </div>
  <div class="rt-feature">
    <div class="rt-feature-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"/></svg>
    </div>
    <div class="rt-feature-body">
      <h4>Phong Illumination</h4>
      <p>Lighting is computed per hit point using the Phong model, combining an ambient base, a diffuse term that responds to the angle between the surface and light, and a specular highlight that sharpens on glossy materials. Triangle surfaces interpolate normals and material properties across the surface using barycentric coordinates, giving smooth gradients instead of flat facets.</p>
      <!-- <figure class="rt-feature-fig">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Phong_components_version_4.png/655px-Phong_components_version_4.png" alt="Diagram showing the three Phong components: ambient, diffuse, and specular, combined into a final render"/>
        <figcaption>The three Phong components — ambient, diffuse, and specular — each contribute to the final pixel color. <a href="https://en.wikipedia.org/wiki/Phong_reflection_model" target="_blank" rel="noopener">Wikipedia</a>, CC BY-SA 3.0</figcaption>
      </figure> -->
    </div>
  </div>
  <div class="rt-feature">
    <div class="rt-feature-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v18m0-18C10.343 3 9 4.343 9 6s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 18c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3-3z"/></svg>
    </div>
    <div class="rt-feature-body">
      <h4>Shadow Rays</h4>
      <p>After every surface hit, a secondary ray is fired toward each light source. If any geometry blocks the path, that light is excluded from the final color. Scenes with multiple lights produce partial shadows correctly.</p>
    </div>
  </div>
  <div class="rt-feature">
    <div class="rt-feature-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>
    </div>
    <div class="rt-feature-body">
      <h4>Extensions</h4>
      <p>Two extra features were implemented in separate branches. Antialiasing fires a 2x2 grid of rays per pixel and averages the result, smoothing jagged silhouette edges. Recursive reflections bounce rays off surfaces up to a configurable depth, blending reflected scene color with local Phong shading weighted by the surface's specular value.</p>
    </div>
  </div>
</div>
<style>
.rt-features {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin: 1.5rem 0;
  border: 1px solid rgba(23,23,23,0.14);
  border-radius: 16px;
  overflow: hidden;
}
html.dark .rt-features {
  border-color: rgba(186,206,255,0.18);
}
.rt-feature {
  display: flex;
  gap: 1.1rem;
  padding: 1.2rem 1.3rem;
  border-bottom: 1px solid rgba(23,23,23,0.1);
  transition: background 0.2s;
}
.rt-feature:last-child {
  border-bottom: none;
}
.rt-feature:hover {
  background: rgba(77,95,212,0.04);
}
html.dark .rt-feature {
  border-color: rgba(186,206,255,0.1);
}
html.dark .rt-feature:hover {
  background: rgba(155,176,255,0.06);
}
.rt-feature-icon {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(77,95,212,0.1);
  border: 1px solid rgba(77,95,212,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.1rem;
}
.rt-feature-icon svg {
  width: 18px;
  height: 18px;
  color: #4d5fd4;
}
html.dark .rt-feature-icon {
  background: rgba(155,176,255,0.12);
  border-color: rgba(155,176,255,0.25);
}
html.dark .rt-feature-icon svg {
  color: #9bb0ff;
}
.rt-feature-body {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  flex: 1;
}
.rt-feature-body h4 {
  font-family: 'Inter Variable', sans-serif;
  font-size: 0.9rem;
  font-weight: 650;
  margin: 0;
  color: var(--text-main);
}
.rt-feature-body p {
  font-family: 'Inter Variable', sans-serif;
  font-size: 0.84rem;
  line-height: 1.65;
  color: var(--text-main);
  opacity: 0.82;
  margin: 0;
}
.rt-feature-fig {
  margin: 0.4rem 0 0;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(23,23,23,0.12);
}
html.dark .rt-feature-fig {
  border-color: rgba(186,206,255,0.15);
}
.rt-feature-fig img {
  width: 100%;
  max-height: 220px;
  object-fit: contain;
  display: block;
  background: #f9f7f0;
  padding: 0.75rem;
}
html.dark .rt-feature-fig img {
  background: #0f1b34;
}
.rt-feature-fig figcaption {
  padding: 0.5rem 0.75rem;
  font-family: 'Inter Variable', sans-serif;
  font-size: 0.72rem;
  color: var(--text-main);
  opacity: 0.62;
  border-top: 1px solid rgba(23,23,23,0.1);
}
html.dark .rt-feature-fig figcaption {
  border-color: rgba(186,206,255,0.12);
}
.rt-feature-fig figcaption a {
  color: #4d5fd4;
  text-decoration: none;
}
html.dark .rt-feature-fig figcaption a {
  color: #9bb0ff;
}
</style>

---

## Applications and Tradeoffs

Ray tracing produces physically accurate images by simulating how light actually behaves. Here is how it compares to rasterization, the technique used in most real-time applications:

| | Ray Tracing | Rasterization |
|---|---|---|
| **Shadows** | Natural, no tricks needed | Approximated via shadow maps |
| **Reflections** | Accurate, recursive | Faked with cubemaps or screen-space tricks |
| **Light bouncing** | Physically correct | Not supported without extra passes |
| **Speed** | Slow, expensive per pixel | Fast, optimized for GPUs |
| **Primary use** | Film, VFX, product rendering | Games, real-time applications |

**Where it gets used today**

Ray tracing is now finding its way into real-time pipelines. Games like Cyberpunk 2077 and Alan Wake 2 use ray tracing selectively for shadows and reflections while rasterizing everything else. The tradeoff is still real - enabling full ray tracing tanks frame rates even on high-end hardware.

Building this renderer made those tradeoffs tangible. Every feature added - shadow rays, reflection recursion, antialiasing - had a direct and measurable impact on render time. That hands-on understanding of where the cost comes from is something you do not get from using an engine.

---

## Source Code

<div class="rt-repo-grid">
  <a class="rt-repo-card" href="https://github.com/pranavsrathod/Ray-Tracing/tree/path-tracer" target="_blank" rel="noopener">
    <div class="rt-repo-card-header">
      <svg class="rt-repo-icon" viewBox="0 0 16 16" fill="currentColor"><path d="M11.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122V6A2.5 2.5 0 0110 8.5H6a1 1 0 00-1 1v1.128a2.251 2.251 0 11-1.5 0V9.5A2.5 2.5 0 016 7h4a1 1 0 001-1v-.628A2.25 2.25 0 019.5 3.25zM4.25 12a.75.75 0 100 1.5.75.75 0 000-1.5z"/></svg>
      <span class="rt-repo-name">Path-Tracing</span>
      <span class="rt-repo-badge rt-repo-badge--branch">path-tracer</span>
    </div>
    <p class="rt-repo-desc">Full Monte Carlo path tracer with cosine-weighted sampling, Russian Roulette termination, Next Event Estimation, and 64/512 spp jittered sampling.</p>
    <div class="rt-repo-tags">
      <span>C++</span><span>Global Illumination</span><span>Monte Carlo</span>
    </div>
  </a>
  <a class="rt-repo-card" href="https://github.com/pranavsrathod/Ray-Tracing" target="_blank" rel="noopener">
    <div class="rt-repo-card-header">
      <svg class="rt-repo-icon" viewBox="0 0 16 16" fill="currentColor"><path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"/></svg>
      <span class="rt-repo-name">Ray-Tracing</span>
      <span class="rt-repo-badge">main</span>
    </div>
    <p class="rt-repo-desc">Core ray tracer - ray generation, sphere and triangle intersection, Phong shading, and shadow rays. Built in C++ from scratch.</p>
    <div class="rt-repo-tags">
      <span>C++</span><span>OpenGL</span><span>GLUT</span>
    </div>
  </a>
  <a class="rt-repo-card" href="https://github.com/pranavsrathod/Ray-Tracing/tree/antialiasing" target="_blank" rel="noopener">
    <div class="rt-repo-card-header">
      <svg class="rt-repo-icon" viewBox="0 0 16 16" fill="currentColor"><path d="M11.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122V6A2.5 2.5 0 0110 8.5H6a1 1 0 00-1 1v1.128a2.251 2.251 0 11-1.5 0V9.5A2.5 2.5 0 016 7h4a1 1 0 001-1v-.628A2.25 2.25 0 019.5 3.25zM4.25 12a.75.75 0 100 1.5.75.75 0 000-1.5z"/></svg>
      <span class="rt-repo-name">Ray-Tracing</span>
      <span class="rt-repo-badge rt-repo-badge--branch">antialiasing</span>
    </div>
    <p class="rt-repo-desc">2×2 grid supersampling - fires four rays per pixel and averages the result, smoothing jagged edges on curved surfaces.</p>
    <div class="rt-repo-tags">
      <span>Supersampling</span>
    </div>
  </a>
  <a class="rt-repo-card" href="https://github.com/pranavsrathod/Ray-Tracing/tree/reflections" target="_blank" rel="noopener">
    <div class="rt-repo-card-header">
      <svg class="rt-repo-icon" viewBox="0 0 16 16" fill="currentColor"><path d="M11.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122V6A2.5 2.5 0 0110 8.5H6a1 1 0 00-1 1v1.128a2.251 2.251 0 11-1.5 0V9.5A2.5 2.5 0 016 7h4a1 1 0 001-1v-.628A2.25 2.25 0 019.5 3.25zM4.25 12a.75.75 0 100 1.5.75.75 0 000-1.5z"/></svg>
      <span class="rt-repo-name">Ray-Tracing</span>
      <span class="rt-repo-badge rt-repo-badge--branch">reflections</span>
    </div>
    <p class="rt-repo-desc">Recursive reflection rays with configurable bounce depth. Final color blends local Phong shading with reflected scene color weighted by specularity.</p>
    <div class="rt-repo-tags">
      <span>Recursion</span>
    </div>
  </a>
</div>