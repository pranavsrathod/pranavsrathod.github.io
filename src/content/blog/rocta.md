---
title: Designing a Room Occupancy & Safety System During COVID
excerpt: A retrospective on an award-winning embedded systems project built under real-world constraints during the COVID-19 pandemic.
publishDate: 'April 18, 2021'
tags:
  - embedded-systems
  - hardware
  - arduino
  - uic
  - covid-19
  - retrospective

seo:
  image:
    src: '/Blog/ROCTA/rocta-cover.jpg'
    alt: Room Occupancy Counter and Temperature Alarm project overview
---

In 2021, during my undergraduate studies at UIC, I worked on a hardware systems project shaped heavily by the realities of the COVID-19 pandemic. Public indoor spaces were operating under strict occupancy and safety constraints, raising an important question: how can we reliably monitor room capacity and environmental conditions in real time?

This question led to **ROCTA — the Room Occupancy Counter and Temperature Alarm**, an embedded system designed to track the number of people in a room, monitor ambient temperature, and trigger alerts when safety thresholds were exceeded. The project went on to win the **UIC Engineering Expo 2021**, but more importantly, it taught me early lessons about systems thinking, adaptability, and designing under real-world constraints.

<!--
<iframe src="https://docs.google.com/presentation/d/e/2PACX-1vTiMmg_ucYt4irZ9XC94stsjtGRCbFhdZhkcwga-AAofva0cpJtMwN5fbcuxY2-5qYEMpq1FpUBN8t1/pubembed?start=false&loop=false&delayms=30000" frameborder="0" width="1440" height="839" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
-->
<div class="not-prose my-6 w-full overflow-hidden rounded-xl border border-slate-200 dark:border-zinc-700 bg-black aspect-video">
  <iframe
    class="w-full h-full"
    src="https://www.youtube.com/embed/w8BM8sJXokk?si=UNv4LNz09NM-Y2aP"
    title="ROCTA Design Presentation Video"
    loading="lazy"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen
  ></iframe>
</div>

## Why this project felt important at the time

In early 2021, the context around this project mattered just as much as the technical implementation. Indoor spaces around the world were navigating capacity limits, safety guidelines, and a general lack of reliable, real-time feedback. Most enforcement relied on manual counting, signage, or trust, all of which broke down easily in practice.

At the time, we felt that even a small, low-cost system could meaningfully improve how shared spaces responded to these constraints. The goal was not to build an enterprise-scale solution, but to demonstrate that embedded systems could be used to enforce safety guidelines in a way that was automated, visible, and immediate. Occupancy limits and temperature thresholds were no longer abstract rules; they became measurable system constraints.

Looking back, what made this project compelling was that it sat at the intersection of hardware, policy, and human behavior. It forced us to think beyond correctness and into usability: how quickly should an alert trigger, what information should be visible to occupants, and how should the system recover once conditions return to normal?

## Challenges of building during lockdown

The circumstances under which this project was built introduced challenges that were largely outside our control, but deeply shaped the final system.

During this period, I was attending online classes in Chicago while physically located in Mumbai. The time difference made coordination non-trivial, often requiring late-night or early-morning work sessions to stay aligned with deadlines and team communication.

Hardware access was an even larger constraint. Due to strict lockdown restrictions, sourcing electronic components was extremely difficult. Local electronics stores were closed, and even Amazon was unable to reliably deliver parts. This forced us to design around availability rather than ideal components.

In my case, this meant abandoning the originally planned PIR sensor and switching to IR-based sensing when the former could not be procured. While this introduced differences in signal behavior and data interpretation, the core system logic remained unchanged. This experience reinforced an important lesson early on: robust systems are defined by their interfaces and behavior, not by any single component.

These constraints slowed development, but they also pushed us toward clearer abstractions, better documentation, and more deliberate design decisions. In hindsight, the limitations imposed by lockdown ended up being one of the most valuable parts of the learning experience.

## How we made it work — and why it succeeded

Despite the circumstances, this project came together because of clear communication, trust, and a deliberate division of responsibilities. My teammate, **Manasvi Narayanan**, was instrumental throughout the process. While she was based in Chicago and I was working remotely from Mumbai, we treated the time difference not as a blocker, but as a constraint to design around.

We split the system into well-defined components early on. This allowed us to work asynchronously, make progress independently, and minimize the overhead of constant coordination. Regular check-ins helped us stay aligned on system behavior and integration, even when our working hours barely overlapped.

More importantly, we shared a common understanding of what “success” looked like. Given the uncertainty around hardware access, shipping delays, and shifting personal schedules, our goal was to build something that worked reliably under imperfect conditions. We prioritized robustness, clarity, and demonstrability over complexity.

The fact that ROCTA went on to win the **UIC Engineering Expo 2021** felt especially meaningful in this context. The recognition was not just for the final system, but for the process behind it — adapting to severe constraints, making pragmatic design decisions, and still delivering a cohesive, functional solution.

Looking back, this experience reinforced a lesson that has stayed with me since: strong collaboration and clear system boundaries matter even more when circumstances are far from ideal. Winning under these conditions was less about any single technical choice, and more about how we worked together when everything around us was uncertain.
