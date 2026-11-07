# Portfolio interaction reference notes

## Applied design

- Preserve the existing hero, portrait, typography and background. Shorten the introduction to “I build systems that make data useful.”
- Replace FIG. 01 with a one-pass sequence: fragmented records → organized rows → exception review → usable output. Replay and pause controls remain available.
- Present selected work as compact visual cards; preserve detailed contributions and interactive walkthroughs on the full case-study routes.
- Add original particle geometry to three expertise links: code braces, a database, and a neural network. Shapes respond to hover and keyboard focus; touch and reduced-motion users receive static shapes.

## Reference evidence and boundaries

### Google Antigravity — particle morphing

The inspected `morph.js` module samples target images into point data, finds nearest target points using a worker, supplies hover progress and pointer positions to GPU shaders, and alternates render targets for particle simulation. `createPointsFromImage`, `setPointsTextureFromIndex`, `uIsHovering`, and `postRender` establish those mechanisms in the inspected source. This is static source evidence, not a measured runtime recreation of the exact screenshot.

REA parent evidence: `ev_1853296c4226aa9daeee9c89626f0626b2f8e56b3ba28d8326f4be56e9dceeca`. Only the selected local module was analyzed; imported dependencies and dynamic relationships are not fully recovered.

Applied here: the visual idea of loose points forming recognizable symbols, implemented independently with a small 2D canvas and original geometry. No Google assets, shaders, or bundled code are copied.

Source: https://antigravity.google/

### Aelradi — project-first hierarchy

The captured page exposes compact project previews, numbered categories, and project/system collections. The useful design lesson is progressive disclosure: a visual entry point first, detailed engineering information after navigation. A full-screen intro or GPU background would conflict with the retained hero.

REA controlled-capture evidence: `ev_036142e6b144e3b5285de1d3130db3a8642c168212ae52f3edc495660f96db1c`. Capture establishes rendered structure in a bounded visit, not all interactive behavior.

Source: https://aelradi.engineer/

### Karan Chhunchha — local pointer response

Captured chunks `241yfvywzurdt.js` and `2dblieg5zfn07.js` contain pointer-relative card interaction using `getBoundingClientRect`, motion values and spring smoothing, plus fine-pointer checks. In-view and hover transforms also appear in the inspected code. These are source observations; library presence alone does not establish that every effect was exercised in the capture.

REA controlled-capture evidence: `ev_74b145f3b13bef426be08569dbbca6c85bed886ce9fecba831556c3d6a30972b`.

Applied here: effects stay within a card and support precise pointer input without obstructing content. The new implementation uses native canvas and CSS instead of adding an animation dependency.

Source: https://www.karanchhunchha.in/

### Aaabadcode / Toukoum — guided exploration

The captured landing page presents a compact introduction and topic shortcuts: Me, Projects, Skills, Fun and Contact. Its metadata describes an AI-assisted portfolio. The capture did not send chat messages or establish the backend model, answer quality, or chat implementation.

REA controlled-capture evidence: `ev_5420345d7bbdf84268df581ad2a4806c73dbe4bf8d1312ff0a4aef52ab7fbad8`.

Applied here: direct, clearly named exploration paths in the expertise cards. A chatbot was not added because the requested portfolio prioritizes readable work and research evidence.

Source: https://www.aaabadcode.com/
