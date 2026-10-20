# p5.js 1.x sketch

The original p5.js API, global mode: `setup()`/`draw()` are bare top-level
functions and every call (`createCanvas`, `background`, …) is an unqualified
global — no imports. `ml5` (machine-learning add-ons) is bundled as a
dependency alongside p5 itself.

Edit `index.ts` — `draw()` is the line to change first, it runs every frame.
