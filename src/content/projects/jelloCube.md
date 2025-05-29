---
title: "Jello Cube Simulation"
description: "A physically based simulation of a Jello Cube using a mass-spring system. The cube deforms, oscillates, and reacts realistically to forces based on Newton's laws, Hooke's law, and damping forces."
publishDate: "February 19, 2025"
isFeatured: true
poster: "/CS520/1/jelloCube.png"
seo:
  image:
    src: "/CS520/1/jelloCube.png"
    alt: "Jello Cube - A Physics Simulation"
---

**Simulating a Mass-Spring System**  
_Pranav Rathod_

**Date:** February 19, 2025

For this assignment, I successfully implemented a physically based simulation of a Jello Cube using a mass-spring system. The cube deforms, oscillates, and reacts realistically to forces based on Newton's laws of motion, Hooke's law, and damping forces.

## Video Demonstration

<iframe width=100% height="500" src="https://www.youtube.com/embed/vRUP-VQ6AoE?si=YIpI7DMxvZcHq29A" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

### Core Features Implemented:

- **Acceleration Computation (`computeAcceleration()` in `physics.cpp`)**:
  - Structural, shear, and bend spring forces
  - External force field (if present)
  - Collision response with the bounding box

  The elasticity of the Jello Cube is modeled using a mass-spring system, where forces follow **Hooke's Law**:

  $$
  F = -k \cdot (x - x_0)
  $$

  - **F**: restoring force
  - **k**: spring constant
  - **x**: current length
  - **x0**: rest length

  Each mass point connects to others via structural, shear, and bend springs, allowing the cube to deform and recover naturally.

  - **Damping Forces**:
    To stabilize the system and reduce oscillations, damping forces are computed as:

    $$
    F_d = -k_d \cdot \frac{(v_A - v_B) \cdot L}{|L|}
    $$

    - **k_d**: damping coefficient
    - **(v_A - v_B)**: velocity difference
    - **L**: displacement vector between connected points

- **Euler and RK4 Integration**:
  Both integration methods were implemented to advance the simulation over time with tunable timestep values.

  - **Collision Detection & Penalty Response (Bounding Box)**:
    Ensures all control points stay within `[-2, 2]` by applying a spring force when out of bounds.

    $$
    F_c = k_c \cdot (p_{boundary} - p)
    $$

- **External Force Field**:
  Trilinear interpolation was used to calculate external force values from a 3D grid defined in the `.w` file.

  1. **Grid Indexing** – mapping position to force grid
  2. **Interpolation** – blending 8 surrounding vectors

- **OpenGL Visualization**:
  - Wireframe and shaded surface rendering modes
  - Real-time camera controls
  - Toggle visibility for structural, shear, and bend springs

---

## Extra Credit Implemented

### Inclined Plane Collision

- Supported via user-defined coefficients in the world file:
  $$
  a \cdot x + b \cdot y + c \cdot z + d = 0
  $$

- **Rendering**:
  Drawn dynamically in `showInclinedPlane()` using 4 corners based on the plane equation.

- **Collision Detection & Response**:
  - Each control point is checked against the plane.
  - If below, a penalty force pushes it above the surface.
  - Includes damping opposite to velocity to absorb energy.

- Implemented in `applyCollisionForces()` inside `physics.cpp`.

The inclined plane adds more complexity and realism to the cube's motion and response.

---

## Development Environment

- **OS**: MacOS
- **Editor**: Visual Studio Code
- **Compiler**: Clang++ (C++17)
- **Build System**: Makefile
- **Libraries**: OpenGL, GLUT (Mac Frameworks)

---

## Compilation Instructions

1. **Build the project**
   ```bash
   make
   ```

2. **Run the simulation with a world file**
   ```bash
   ./jello world/jello.w
   ```

3. **Create a world file**
   ```bash
   ./createWorld
   ```

4. **Clean build artifacts**
   ```bash
   make clean
   ```

 Note: The Makefile auto-detects MacOS and links the correct OpenGL/GLUT frameworks.

---

## Notes

- The simulation was tested using multiple world files including custom-generated ones.
- Performance is interactive with frame rates > 15fps at 640x480.
- A Mac executable is included, but the grader may recompile on Windows as needed.
