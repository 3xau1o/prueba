# 🎨 p5.js 1.x sketch

A classic **p5.js 1.x** sketch running in global mode: `setup()` and `draw()`
are plain top-level functions, and every p5 call (`createCanvas`, `background`,
`ellipse`, …) is a global — no imports to write. The `ml5` machine-learning
add-on ships alongside p5, ready to `import` if you want it.

## 🚀 Getting started

- ✏️ Edit `index.ts` — `draw()` runs every frame, so that's where motion lives
- ▶️ Hit **Run** to see it live
- 🎨 Style the page in `index.css`
- 📖 Document your sketch right here in this file

## 📁 Files

- `index.ts` — the sketch: `setup()` once, `draw()` every frame
- `index.css` — page styling for the canvas
- `index.html` — the document that loads p5 and runs the sketch

## 🎛️ Try this

Change the `background(...)` colour, then draw something that follows
`mouseX` / `mouseY` inside `draw()`.

Happy coding! 💜
