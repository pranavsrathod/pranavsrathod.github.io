# Downloaded garage collectibles

User-supplied originals are preserved unchanged here. Each GLB carries the following author, source and **Creative Commons Attribution 4.0** metadata. License: https://creativecommons.org/licenses/by/4.0/

- **LEGO Scarlet Witch** — Ramón Ruiz. https://sketchfab.com/ramon.ruiz — https://sketchfab.com/3d-models/lego-scarlet-witch-65fd0da1a5f04b4289db423cd00c9383
- **Art Reference: Utah Teapot** — Smallpoly. https://sketchfab.com/smallpoly — https://sketchfab.com/3d-models/art-reference-utah-teapot-4c02605ea63541b6aa053df167befe36
- **Chicago Cubs** — Laurance Animations. https://sketchfab.com/LauranceAnimations — https://sketchfab.com/3d-models/chicago-cubs-8d592b64547a46e4b730b8620f389296

Modifications for this portfolio: resized, reoriented, simplified meshes, removed the teapot's unrelated backdrop, consolidated texture/material data into one 2048-pixel atlas, and placed the derivatives in the garage. Original character/team intellectual property is not claimed by this project. The Cubs sign and Scarlet Witch are personal decorative references; no endorsement is implied.

`prepare_downloaded_props.py` reproduces `downloaded-props.blend` and its atlas from these originals. `integrate_downloaded_props.py` appends that derivative into the current garage, or is called by the complete `build_garage.py` generator. Original files are never overwritten by either script.
