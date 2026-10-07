import * as THREE from "three";
import { IMAGE_FILES } from "./projects";

// Cell aspect matches the plane's 1.5 : 1 so nothing is distorted.
//
// THE CELL IS SIZED TO THE CARD'S REAL ON-SCREEN FOOTPRINT, passed in by the
// caller, rather than being a fixed number. 512 was that number, and it was
// the wrong shape of answer: the figure that matters is not "enough texels",
// it is "how far is this from 1:1 with the screen".
//
// THE SIZE THAT MATTERS IS THE FOCUSED CARD, which is far bigger than the
// ring's resting cards and is what the page actually sits on. The six small
// cards are the entry animation; once it settles, one card is centred at
// planeSize x endScale x fit — 1194 device px at a 1440 viewport on a retina
// screen, against a 512 cell. That is a 2.3x magnification of the texture,
// and no amount of filtering recovers detail that was never in the atlas.
//
// Cover fit means the art is cut to the cell before the GPU ever sees it, so
// the cell is the ceiling on how much of the source survives. 512 threw away
// three quarters of a 1536px source and then stretched what was left over
// 1194px of screen.
const DEFAULT_CELL_W = 512;

const load = (src, priority) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    // Must be set before src or the request is already away.
    if (priority) img.fetchPriority = priority;
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`failed to load ${src}`));
    img.src = src;
  });

/**
 * Packs every image into one texture. A single atlas rather than one texture
 * per plane because ESSL 1.00 cannot index an array of samplers with a
 * non-constant index.
 *
 * Returns synchronously with the sheet blank and filling in as images arrive:
 * the caller needs something to bind on frame one, and the entry shows cell 0
 * while the rest are still coming.
 *
 * `first` settles once cell 0 is on the texture, `ready` once all of them are.
 * Neither rejects — a missing file leaves its cell blank and still counts as
 * settled, so one bad path cannot strand the entry.
 */
export function buildAtlas(files = IMAGE_FILES, onProgress, cellWidth) {
  const CELL_W = Math.round(cellWidth > 0 ? cellWidth : DEFAULT_CELL_W);
  const CELL_H = Math.round(CELL_W / 1.5);

  const cols = Math.ceil(Math.sqrt(files.length));
  const rows = Math.ceil(files.length / cols);

  const canvas = document.createElement("canvas");
  canvas.width = cols * CELL_W;
  canvas.height = rows * CELL_H;
  const ctx = canvas.getContext("2d");
  // The source art is several times the cell, so every paint below is a
  // downscale and the filter it uses is the one that decides how the ring
  // looks. The default is a cheap bilinear that leaves exactly the softness
  // this change is here to remove.
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const texture = new THREE.CanvasTexture(canvas);
  // The shader flips each cell itself, so leave the sheet as drawn.
  texture.flipY = false;
  // NoColorSpace deliberately: this shader writes straight to the framebuffer
  // with no encoding step, and decoding on read without encoding on write is
  // what washes everything out.
  texture.colorSpace = THREE.NoColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  // MIPMAPS STAY ON, now that the cell is big enough to be worth minifying.
  // They are what keeps the entry animation clean: the ring opens with six
  // cards at roughly a fifth of the focused size, and sampling a 1280px cell
  // down to 266px without a mip chain is a shimmering mess. Trilinear picks
  // the level per fragment, so the focused card reads level 0 at ~1:1 and the
  // small ones read a properly filtered level — each gets what it needs.
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;

  const paint = (img, i) => {
    const x = (i % cols) * CELL_W;
    const y = Math.floor(i / cols) * CELL_H;

    // Cover fit: fill the cell, crop the overflow, never squash.
    const scale = Math.max(CELL_W / img.width, CELL_H / img.height);
    const dw = img.width * scale;
    const dh = img.height * scale;

    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, CELL_W, CELL_H); // clip, or an oversized image bleeds
    ctx.clip();
    ctx.drawImage(img, x + (CELL_W - dw) / 2, y + (CELL_H - dh) / 2, dw, dh);
    ctx.restore();
  };

  let settled = 0;
  const tick = () => onProgress?.(settled / files.length);

  const fetchInto = (i, priority) =>
    load(`/${files[i]}`, priority)
      .then((img) => paint(img, i))
      .catch((err) => console.warn("[atlas]", err.message))
      .finally(() => {
        settled++;
        tick();
      });

  // Cell 0 is the seed's art, the only thing on screen during the hold, so it
  // is asked for ahead of the rest and uploaded the moment it lands.
  const first = fetchInto(0, "high").then(() => {
    texture.needsUpdate = true;
  });

  // One upload at the end for everything else. Marking dirty per image would
  // re-send the whole sheet eighteen times for cells nobody is looking at yet.
  const ready = Promise.all([
    first,
    ...files.slice(1).map((_, k) => fetchInto(k + 1, "low")),
  ]).then(() => {
    texture.needsUpdate = true;
  });

  tick();
  return { texture, grid: [cols, rows], count: files.length, first, ready };
}
