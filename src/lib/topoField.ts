import { SimplexNoise } from './simplex';

/**
 * Shared topographic noise-field sampler.
 * Computed once per frame and shared between color layers (see TopoBackdrop).
 */

export const CELL_SIZE = 16;
export const LEVELS = 10;
const NOISE_SCALE = 0.00215;

// Marching squares: edge pairs for each 4-bit case
// Edges: 0=top, 1=right, 2=bottom, 3=left
export const EDGE_TABLE: number[][] = [
  [],
  [3, 2],
  [2, 1],
  [3, 1],
  [0, 1],
  [0, 1, 3, 2],
  [0, 2],
  [3, 0],
  [0, 3],
  [0, 2],
  [0, 3, 2, 1],
  [0, 1],
  [1, 3],
  [1, 2],
  [2, 3],
  [],
];

export function edgePoint(
  edge: number,
  x: number,
  y: number,
  cs: number,
  tl: number,
  tr: number,
  br: number,
  bl: number,
  level: number,
): [number, number] {
  switch (edge) {
    case 0: {
      const t = (level - tl) / (tr - tl + 1e-9);
      return [x + cs * t, y];
    }
    case 1: {
      const t = (level - tr) / (br - tr + 1e-9);
      return [x + cs, y + cs * t];
    }
    case 2: {
      const t = (level - bl) / (br - bl + 1e-9);
      return [x + cs * t, y + cs];
    }
    case 3: {
      const t = (level - tl) / (bl - tl + 1e-9);
      return [x, y + cs * t];
    }
    default:
      return [x, y];
  }
}

export interface TopoField {
  data: Float32Array;
  cols: number;
  rows: number;
  width: number;
  height: number;
}

export function sampleTopoField(
  noise: SimplexNoise,
  width: number,
  height: number,
  phase: number,
): TopoField {
  const cols = Math.ceil(width / CELL_SIZE) + 1;
  const rows = Math.ceil(height / CELL_SIZE) + 1;
  const data = new Float32Array(cols * rows);

  // Circular orbit in noise-space → seamless breathing, no directional drift
  const ang = phase * Math.PI * 2;
  const z = Math.sin(ang) * 0.32;
  const w = Math.cos(ang) * 0.32;

  const cx = width * 0.5;
  const cy = height * 0.48;
  const scale = NOISE_SCALE * (960 / Math.max(width, height, 1));

  for (let j = 0; j < rows; j++) {
    const py = j * CELL_SIZE;
    const row = j * cols;
    for (let i = 0; i < cols; i++) {
      const px = i * CELL_SIZE;
      const nx = (px - cx) * scale;
      const ny = (py - cy) * scale;

      // Domain warp for organic, non-grid contour islands
      const warpA = noise.noise3D(nx * 0.55 + 8.2, ny * 0.55 - 3.7, w * 0.45);
      const warpB = noise.noise3D(nx * 0.5 - 4.1, ny * 0.5 + 6.3, z * 0.45);
      const wx = nx + warpA * 0.52;
      const wy = ny + warpB * 0.52;

      // Primary multi-octave terrain
      let h = noise.fbm3D(wx + z * 0.12, wy + w * 0.12, 0.18 + z * 0.38, 4, 2.02, 0.5);

      // Broad secondary ridges → large contour islands
      h += 0.38 * noise.noise3D(wx * 0.38 + 18, wy * 0.38 - 11, w * 0.28);
      // Tertiary detail for nested loops
      h += 0.12 * noise.noise3D(wx * 1.4 - 5, wy * 1.4 + 9, z * 0.2);

      // Center soft-dip for content readability
      const dx = (px - cx) / (width * 0.52);
      const dy = (py - cy) / (height * 0.52);
      const dist2 = dx * dx + dy * dy;
      const centerDip = Math.max(0, 1 - dist2) * 0.62;
      h -= centerDip;

      // Slightly amplify periphery structure
      const edge = Math.min(1, Math.sqrt(dist2) * 0.9);
      h *= 0.5 + edge * 0.58;

      data[row + i] = h;
    }
  }

  return { data, cols, rows, width, height };
}
