import * as THREE from "three";
import { textVertexShader, textFragmentShader } from "../shaders/textShaders";

/**
 * The intro heading, one glyph per quad. In the scene rather than the DOM so
 * the planes sweep over it as the ring spins — text draws first, planes draw
 * on top. Each quad is a mask its glyph wipes up through.
 *
 * `chars` are the reveal uniforms and `fades` the opacity ones; the entry
 * timeline tweens both as arrays.
 */
/* ── chalk, for a bitmap ────────────────────────────────────────────────
   The rest of the site gets its chalky edge from an SVG filter
   (feTurbulence -> feDisplacementMap, see components/ChalkTexture.jsx). A
   filter cannot reach a heading drawn inside a WebGL shader, so the same idea
   is applied to the glyph bitmaps here: fractal value noise standing in for
   feTurbulence, and a per-pixel resample standing in for the displacement.

   Deterministic on purpose — a fixed hash rather than Math.random, so a glyph
   rebuilt on a resize or a font swap comes back identical instead of
   shimmering into a different texture. */
const hash2 = (x, y, seed) => {
  let n = (x | 0) * 374761393 + (y | 0) * 668265263 + seed * 1274126177;
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
};

const smootherstep = (t) => t * t * (3 - 2 * t);

const valueNoise = (x, y, seed) => {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const u = smootherstep(x - xi);
  const v = smootherstep(y - yi);
  const a = hash2(xi, yi, seed);
  const b = hash2(xi + 1, yi, seed);
  const c = hash2(xi, yi + 1, seed);
  const d = hash2(xi + 1, yi + 1, seed);
  return a * (1 - u) * (1 - v) + b * u * (1 - v) + c * (1 - u) * v + d * u * v;
};

/* Three octaves, matching the filter's numOctaves. */
const fbm = (x, y, seed) => {
  let sum = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < 3; i++) {
    sum += amp * valueNoise(x * freq, y * freq, seed + i * 101);
    amp *= 0.5;
    freq *= 2;
  }
  return sum / 0.875; // 0.5 + 0.25 + 0.125, normalised back to 0..1
};

/**
 * Displace a glyph bitmap in place. `scalePx` is in canvas pixels and `dpr`
 * converts the noise frequencies back into CSS pixels, so the grain is the
 * same size on a retina screen as anywhere else rather than twice as fine.
 */
function chalk(ctx, w, h, scalePx, dpr) {
  if (scalePx < 0.2) return;
  const img = ctx.getImageData(0, 0, w, h);
  const src = img.data;
  const out = new Uint8ClampedArray(src.length);
  // the SVG filter's baseFrequency, per CSS pixel
  const fx = 0.06 / dpr;
  const fy = 0.19 / dpr;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const nx = fbm(x * fx, y * fy, 7);
      const ny = fbm(x * fx, y * fy, 907);
      const sx = Math.round(x + scalePx * (nx - 0.5));
      const sy = Math.round(y + scalePx * (ny - 0.5));
      const di = (y * w + x) * 4;
      if (sx < 0 || sy < 0 || sx >= w || sy >= h) continue; // leave transparent
      const si = (sy * w + sx) * 4;
      out[di] = src[si];
      out[di + 1] = src[si + 1];
      out[di + 2] = src[si + 2];
      out[di + 3] = src[si + 3];
    }
  }
  img.data.set(out);
  ctx.putImageData(img, 0, 0);
}

export function createSplitText(group, params) {
  let chars = [];
  let fades = [];

  const dispose = () => {
    for (const child of [...group.children]) {
      group.remove(child);
      child.geometry.dispose();
      child.material.uniforms.uTex.value?.dispose();
      child.material.dispose();
    }
    chars = [];
    fades = [];
  };

  const build = () => {
    dispose();

    const size = params.textSize;
    // Above display resolution — type is the first thing to show softness and
    // these canvases are tiny.
    const dpr = Math.min(window.devicePixelRatio, 2) * 2;
    const font = `${params.textWeight} ${size}px "${params.textFont}", ui-sans-serif, system-ui, sans-serif`;

    const measure = document.createElement("canvas").getContext("2d");
    measure.font = font;

    const glyphs = [...params.text];
    const advances = glyphs.map((ch) => measure.measureText(ch).width);
    const tracking = params.textTracking * size;
    const totalW =
      advances.reduce((a, b) => a + b, 0) + tracking * (glyphs.length - 1);

    // Padding gives overhanging glyphs room and lengthens the wipe a little.
    // Sized by params.textPad, because how far a face paints outside its
    // advance box is a property of the face — a script needs several times
    // what a grotesque does, and anything beyond the cell is cropped.
    const pad = size * (params.textPad ?? 0.25);
    const cellH = size * 1.3 + pad * 2;

    let x = -totalW / 2;

    glyphs.forEach((ch, i) => {
      const adv = advances[i];
      if (ch.trim()) {
        const cellW = adv + pad * 2;

        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.ceil(cellW * dpr));
        canvas.height = Math.max(1, Math.ceil(cellH * dpr));
        const ctx = canvas.getContext("2d");
        ctx.scale(dpr, dpr);
        ctx.font = font;
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = "#000";
        ctx.fillText(ch, pad, pad + size); // puts cap-height centre on y = 0

        /* Ratio, not a fixed px value: the filter's 10px is quoted against
           ~198px type, and the same absolute displacement at this size would
           destroy the letterform rather than texture it. */
        chalk(
          ctx,
          canvas.width,
          canvas.height,
          (params.textTexture || 0) * size * dpr,
          dpr,
        );

        const tex = new THREE.CanvasTexture(canvas);
        tex.colorSpace = THREE.NoColorSpace;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.generateMipmaps = false;

        const mat = new THREE.ShaderMaterial({
          vertexShader: textVertexShader,
          fragmentShader: textFragmentShader,
          uniforms: {
            uTex: { value: tex },
            uReveal: { value: 0 },
            uColor: { value: new THREE.Color(params.textColor) },
            uOpacity: { value: 1 },
          },
          transparent: true,
          depthTest: false,
          depthWrite: false,
        });

        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
        mesh.scale.set(cellW, cellH, 1);
        // Cell is the advance box plus symmetric padding, so centring on the
        // advance keeps the run correctly spaced.
        mesh.position.set(x + adv / 2, 0, 0);
        mesh.renderOrder = 0;
        group.add(mesh);
        chars.push(mat.uniforms.uReveal);
        fades.push(mat.uniforms.uOpacity);
      }
      x += adv + tracking;
    });
  };

  return {
    build,
    dispose,
    get chars() {
      return chars;
    },
    get fades() {
      return fades;
    },
  };
}
