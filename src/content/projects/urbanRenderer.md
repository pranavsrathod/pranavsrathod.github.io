---
title: "Urban Renderer"
description: "I developed an interactive WebGL application to render a dynamic 3D urban environment from JSON data. The project features two interactive demos: one for standard urban rendering and another with advanced shadow mapping for realistic lighting."
publishDate: "March 4, 2022"
isFeatured: false
poster: "/UICProjects/Graphics1/UR.png"
seo:
  image:
    src: "/UICProjects/Graphics1/UR.png"
    alt: "Urban Renderer - A WebGL Project"
---

**Fall 2022**  
**Pranav Rathod**

I developed **Urban Renderer**, an interactive WebGL application that brings a 3D urban environment to life using data loaded from external JSON files and a custom configuration panel. The project is split into two main parts: the core urban rendering demo and an enhanced shadow mapping demo that delivers realistic lighting and shadows.

<div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-bottom: 1rem;">
  <img src="/UICProjects/Graphics1/assignment-1.gif" alt="Urban Renderer Demo" />
</div>

<div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-bottom: 1rem;">
  <img src="/UICProjects/Graphics2/manhattan.gif" alt="Shadow Maps Demo" />
</div>

## Overview

The application reads JSON files that describe four distinct layers representing an urban setting:
- **Buildings**
- **Water**
- **Parks**
- **Surface**

Each layer includes its own set of coordinates, indices, and (for buildings) normals along with a designated color. I designed the system to use a unique buffer and VAO for each layer, ensuring optimal performance and ease of management. Interactive controls let users dynamically alter the view through rotation, zoom, and pan, as well as switch between perspective and orthographic projections.

## Implementation

### Interactive Configuration and Basic Rendering

I built a configuration panel with:
- A **dropdown menu** to toggle between perspective and orthographic projections.
- A **file input element** for loading a JSON file that defines the urban environment.
  
User interactions are handled via mouse events that update a view transformation matrix, allowing the camera to rotate around the scene’s center, and enable zoom functionality to adjust the view seamlessly.

For rendering:
- The **Building Layer** is shaded using normals and a constant color. This gives the buildings a responsive appearance without needing a full illumination model.
- The **Flat Layers** (water, parks, and surface) are rendered with a uniform color, as they lack normals.

I leveraged WebGL utilities for creating shaders, programs, buffers, VAOs, and performing matrix operations. These tools allowed me to structure a robust and responsive rendering pipeline.

### Advanced Shadow Mapping

Building upon the basic urban rendering, I enhanced the project with an advanced shadow mapping technique to simulate realistic directional lighting and dynamic shadows. Key features include:

- **Extended Configuration:**  
  In addition to the basic controls, the panel now includes:
  - A **slider** (with values between 0 and 360) to control the rotation of the light around the scene.
  - A **checkbox input** to toggle the display of the shadow map texture.
  - A separate file input to load an appropriate JSON file for the shadow mapping demo.

- **Shadow Mapping Pipeline:**  
  The shadow mapping technique is implemented with a two-pass rendering approach:
  1. **First Pass:** Render the scene from the light's perspective to generate a depth texture (shadow map) using framebuffer objects (FBO) and a dedicated ShadowMapProgram.
  2. **Second Pass:** Use the generated depth texture in the fragment shader to determine shadowed areas while rendering the scene from the camera’s perspective.
  
  This approach guarantees that the same light transformation matrices are used for both shadow computation and surface shading, ensuring consistency in lighting.

- **Dynamic Light Control:**  
  The light direction is dynamically updated based on the slider value, and users can immediately see how changes in light orientation affect the shadows throughout the scene.

## Practical Demonstrations

The project includes two separate interactive demos:

### 1. Urban Rendering Demo
To experience the core urban rendering:
- **Download Sample File:** <a href="/UICProjects/Graphics1/city.json" download="city.json"> city.json</a>.
- **View Demo:** Click the button to launch the demo.

<div style="text-align: center; margin-top: 20px;">
  <a href="/UICProjects/Graphics1/index.html" class="btn btn-lg btn-primary" style="font-size: 1.5em; padding: 10px 20px;">View Urban Rendering Demo</a>
</div>

In this demo, you can:
- **Rotate:** Click and drag to rotate the view.
- **Zoom:** Use the mouse wheel to zoom in and out.
- **Pan:** Hold the right mouse button and drag to pan the scene.

### 2. Shadow Mapping Demo
To see the advanced shadow mapping in action:
- **Download Sample File:** <a href="/UICProjects/Graphics2/manhattan.json" download="city.json"> manhattan.json</a>..
- **View Demo:** Click the button to launch the shadow mapping demo.

<div style="text-align: center; margin-top: 20px;">
  <a href="/UICProjects/Graphics2/index.html" class="btn btn-lg btn-primary" style="font-size: 1.5em; padding: 10px 20px;">View Shadow Mapping Demo</a>
</div>

In this demo, besides the usual interactive controls (rotate, zoom, pan), you can:
- **Adjust Light Direction:** Use the slider in the control panel to rotate the light around the scene.
- **Toggle Shadow Map Display:** Use the checkbox to view the depth texture generated by the first pass.

## Reflections

Working on Urban Renderer and extending it with shadow mapping allowed me to dive deep into WebGL, shader programming, and interactive graphics. I learned how to manage complex rendering pipelines with multiple layers and how to implement advanced techniques like shadow mapping to achieve realistic lighting effects. The addition of interactive controls makes the application engaging, and the dual demo setup showcases both the core rendering and the added depth provided by dynamic shadows.

For more technical details and to view the source code, please visit my [GitHub repository](https://github.com/uic-cs425/spring-2022-assignment-2-pranavsrathod).

---