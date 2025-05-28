---
title: "Image Compression: DCT vs DWT"
description: "Explored and compared the Discrete Cosine Transform and Discrete Wavelet Transform for progressive image compression. Developed custom encoding and decoding techniques, and created animations demonstrating compression at various coefficient levels."
publishDate: "November 11, 2024"
poster: "/CS576/A3/A3.png"
isFeatured: false
seo:
  image:
    src: "/CS576/A3/A3.png"
    alt: "DWT POSTER"
---

In this project, I explored two foundational methods of image compression: the **Discrete Cosine Transform (DCT)** and the **Discrete Wavelet Transform (DWT)**. These transforms are at the core of popular compression standards like JPEG and JPEG2000, and each brings unique strengths and trade-offs.

## Understanding DCT and DWT

- **DCT (Discrete Cosine Transform):**  
  DCT works by breaking the image into small fixed-size blocks (usually 8x8) and transforming the pixel data within each block into frequency space. Low-frequency components, which represent gradual changes, are prioritized, while high-frequency components (sharp details and noise) can be discarded or compressed heavily. This makes DCT particularly effective for images with smooth gradients and consistent textures. However, the block-based approach can lead to visual artifacts, like blocking effects, when compression is aggressive.

- **DWT (Discrete Wavelet Transform):**  
  Unlike DCT, DWT processes the image as a whole, breaking it down into hierarchical levels of frequency components through wavelet decomposition. Each level captures progressively finer details, from large-scale smooth variations to small-scale edges and textures. DWT excels at preserving structural and edge information and tends to produce fewer artifacts at higher compression rates. Its scalability and progressive refinement capabilities make it well-suited for applications requiring variable-quality decoding.

## Comparative Analysis

| Aspect | DCT | DWT |
|--------|-----|-----|
| **Basis** | Cosine functions | Wavelet basis functions |
| **Block Processing** | Processes blocks (e.g., 8x8) | Processes the entire image |
| **Compression Artifacts** | Can cause blocking artifacts | Preserves edges and reduces artifacts |
| **Progressive Decoding** | Less natural, works block by block | Natural, hierarchical refinement |
| **Used In** | JPEG | JPEG2000 |
| **Strengths** | Efficient and widely supported, simple computation | Better visual quality at high compression, scalable |
| **Limitations** | Blocking artifacts, less effective at high compression | More complex to implement, slower processing |

## Key Highlights

- Implemented DCT and DWT encoders and decoders for RGB images.
- Enabled selective coefficient-based decoding to visualize quality trade-offs.
- Generated side-by-side outputs at different compression levels.
- Created a progressive animation showcasing compression effects for DCT and DWT.

## Demo Animation

Here’s a visualization of the progressive decoding comparison:

![DCT vs DWT Animation](/CS576/A3/DCTvDWT.gif)

## Source Code

Explore the full source code and details here: [GitHub Repository](https://github.com/pranavsrathod/ImageCompression)

## Reflections

This project enhanced my understanding of the trade-offs between block-based and hierarchical compression methods. While DCT is simpler and efficient, DWT provides superior quality at high compression rates, especially for images with complex structures. Future work could explore hybrid methods or optimizations for real-time encoding.
---