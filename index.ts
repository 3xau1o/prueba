// ============================================================
//  CAMPO DE FLUJO
//  Un enjambre de partículas que se deja llevar por un campo
//  de ruido Perlin. Cada partícula tiene su profundidad, así que
//  hay paralaje: las cercanas son más grandes, rápidas y cálidas.
//
//  · Mueve el ratón para curvar la corriente (remolino)
//  · Mantén pulsado para empujar con más fuerza
//  · Clic para lanzar una onda expansiva
// ============================================================

const CUANTAS = 800; // número de partículas
const ESCALA_RUIDO = 0.0016; // tamaño de las corrientes
const RADIO_RATON = 240; // alcance del ratón en píxeles
const FONDO = [6, 7, 18]; // color de fondo (también el de la estela)

let particulas = [];
let ondas = [];
let t = 0; // tiempo del ruido: hace que el campo respire
let miFuente = null;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(min(2, displayDensity()));
  background(FONDO[0], FONDO[1], FONDO[2]);

  // fuente opcional: mientras no llega (o si falla) se usa una del sistema
  loadFont(
    'CascadiaMono-Regular.otf',
    (f) => (miFuente = f),
    () => (miFuente = null)
  );

  textSize(12);
  textAlign(LEFT, CENTER);

  for (let i = 0; i < CUANTAS; i++) particulas.push(nuevaParticula());
}

// ------------------------------------------------------------
//  PARTÍCULAS
// ------------------------------------------------------------

function nuevaParticula() {
  const z = random(0.25, 1.25); // profundidad: tamaño, velocidad y color
  const x = random(width);
  const y = random(height);
  return {
    x,
    y,
    px: x,
    py: y,
    z,
    col: colorPorProfundidad(z),
    vida: random(90, 600), // frames antes de renacer
  };
}

// Del cian (lejos) al violeta y al magenta (cerca).
function colorPorProfundidad(z) {
  const cian = color(80, 220, 255);
  const violeta = color(160, 120, 255);
  const magenta = color(255, 95, 170);
  const k = constrain((z - 0.25) / 1.0, 0, 1);
  return k < 0.5
    ? lerpColor(cian, violeta, k * 2)
    : lerpColor(violeta, magenta, (k - 0.5) * 2);
}

function renacer(p) {
  const nueva = nuevaParticula();
  p.x = p.px = nueva.x;
  p.y = p.py = nueva.y;
  p.z = nueva.z;
  p.col = nueva.col;
  p.vida = nueva.vida;
}

function draw() {
  // --- estela: el fondo no se borra del todo, se apaga ---
  blendMode(BLEND);
  noStroke();
  fill(FONDO[0], FONDO[1], FONDO[2], 16);
  rect(0, 0, width, height);

  t += 0.0028;

  // --- partículas ---
  blendMode(ADD);

  for (const p of particulas) {
    // dirección del viento según el ruido en ese punto
    const ang = noise(p.x * ESCALA_RUIDO, p.y * ESCALA_RUIDO, t) * TWO_PI * 2.4;
    let vx = cos(ang) * p.z * 1.9;
    let vy = sin(ang) * p.z * 1.9;

    // el ratón remolina el flujo a su alrededor
    const dx = p.x - mouseX;
    const dy = p.y - mouseY;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d < RADIO_RATON && d > 0.001) {
      const fuerza = (1 - d / RADIO_RATON) * (mouseIsPressed ? 4.2 : 1.6);
      vx += (-dy / d) * fuerza + (dx / d) * fuerza * 0.6; // tangencial + empuje
      vy += (dx / d) * fuerza + (dy / d) * fuerza * 0.6;
    }

    // las ondas empujan a su paso
    for (const o of ondas) {
      const ox = p.x - o.x;
      const oy = p.y - o.y;
      const od = Math.sqrt(ox * ox + oy * oy);
      const anillo = Math.abs(od - o.r);
      if (anillo < 70 && od > 0.001) {
        const empuje = (1 - anillo / 70) * 5.5;
        vx += (ox / od) * empuje;
        vy += (oy / od) * empuje;
      }
    }

    p.px = p.x;
    p.py = p.y;
    p.x += vx;
    p.y += vy;

    // trazo
    stroke(red(p.col), green(p.col), blue(p.col), map(p.z, 0.25, 1.25, 30, 190));
    strokeWeight(p.z * 1.7);
    line(p.px, p.py, p.x, p.y);

    // renace si se sale o se agota
    p.vida--;
    if (p.vida <= 0 || p.x < -40 || p.x > width + 40 || p.y < -40 || p.y > height + 40) {
      renacer(p);
    }
  }

  // --- ondas expansivas ---
  for (let i = ondas.length - 1; i >= 0; i--) {
    const o = ondas[i];
    o.r += 11;
    noFill();
    stroke(185, 220, 255, map(o.r, 0, 900, 150, 0));
    strokeWeight(1.4);
    circle(o.x, o.y, o.r * 2);
    if (o.r > 900) ondas.splice(i, 1);
  }

  // --- interfaz ---
  blendMode(BLEND);
  dibujarHUD();
}

function dibujarHUD() {
  if (miFuente) textFont(miFuente); // en cuanto llega la fuente, se usa

  const linea = 'MUEVE EL RATÓN · CLIC PARA UNA ONDA';
  noStroke();
  fill(3, 4, 10, 170);
  text(linea, 23, 27); // sombra: se lee aunque pase el enjambre por encima
  fill(185, 215, 255, 215);
  text(linea, 22, 26);
}

// ------------------------------------------------------------
//  INTERACCIÓN
// ------------------------------------------------------------

function mousePressed() {
  ondas.push({ x: mouseX, y: mouseY, r: 0 });
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(FONDO[0], FONDO[1], FONDO[2]);
}
