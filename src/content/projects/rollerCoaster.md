---
title: "Simulating a Roller Coaster via Splines"
description: "A 3D roller coaster simulation using OpenGL and Catmull-Rom splines, offering a first-person perspective with smooth curves, realistic lighting, and texturing."
publishDate: "March 27, 2024"
isFeatured: false
poster: "/CS420/rollerCoasterPoster.png"
seo:
  image:
    src: "/CS420/rollerCoasterPoster.png"
    alt: "Roller Coaster Simulation Poster"
---

**Simulating a Roller Coaster via Splines**  
_Pranav Rathod_

**Date:** March 27, 2024

In this project, I developed a 3D roller coaster simulation using OpenGL and Catmull-Rom splines. The simulation provides a first-person perspective of the ride while showcasing smooth curves, realistic lighting, and texturing.

## Video Demonstration

<video controls style="max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 8px;">
  <source src="/CS420/rollerCoaster.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>


**Note:** If the video does not play directly, please download the file and view it locally.


## Source Code

You can explore the source code for this project on my GitHub repository: [https://github.com/pranavsrathod/roller-coaster-splines](https://github.com/pranavsrathod/roller-coaster-splines).

## Project Overview

This project was a significant step in understanding and implementing Catmull-Rom splines along with OpenGL core profile techniques. Key aspects of the project include:

- **Spline-Based Track Generation:**  
  Catmull-Rom splines were used to design a realistic and smooth roller coaster track. The spline interpolation ensures the coaster follows a natural, visually appealing curve using defined control points.
  
- **Shader Programming:**  
  - **Texture Mapping:** A custom texture shader was applied to the ground to enhance realism, simulating terrain textures effectively.  
  - **Phong Shading:** The roller coaster rails were rendered using a Phong shading shader to provide per-pixel lighting for added depth and realism.
  
- **First-Person Perspective:**  
  The simulation uses a first-person camera implemented via the Frenet Frame approach, dynamically adjusting the camera’s tangent, normal, and binormal vectors to ensure smooth and accurate orientation along the track.
  
- **Customizable Track Files:**  
  Users can load different spline files (e.g., `goodRide.sp`, `rollerCoaster.sp`) to experience various track designs. Each file modifies the control points, resulting in unique roller coaster experiences.
  
- **Animation Features:**  
  The project includes a pre-rendered animation of the roller coaster to showcase its functionality and aesthetics. Screenshots from the animation are available in the `AnimationFrames` folder.

**Note:** Due to specific tangent calculations (Sloan method), certain spline files like `circle.sp` and `lefturn.sp` may require manual adjustments in the `computeUpVector()` function for correct camera movement and orientation.

## Citations

Special thanks to the following resources for their insights:

- OpenGL Programming Guide for foundational rendering concepts.
- WebGL documentation for shader programming insights.
- *Mathematics for 3D Game Programming and Computer Graphics* for guidance on spline implementations.