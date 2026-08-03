import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import { CELL_SIZE, EDGE_TABLE, edgePoint, LEVELS, TopoField } from '../lib/topoField';

/**
 * Animated topographic contour layer.
 * Rasterizes contour strokes from a shared TopoField (sampled once per frame by
 * the orchestrator). Blend mode + color are chosen per section background:
 * multiply/burgundy on light sections, screen/gold on dark sections.
 */

export interface TopoLayerHandle {
  draw: (field: TopoField) => void;
}

// Draw at half backing resolution and upscale via CSS — contour strokes are
// soft by nature, so this cuts raster/composite cost ~4x with negligible
// visual difference.
const RASTER_SCALE = 0.5;

interface Props {
  className?: string;
  color?: string;
  intensity?: number;
}

export const TopographicBackground = forwardRef<TopoLayerHandle, Props>(
  function TopographicBackground({ className = '', color = '#6B1126', intensity = 1 }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const resRef = useRef<{ rasterDpr: number }>({ rasterDpr: 1 });
    const lastFieldRef = useRef<TopoField | null>(null);

    const draw = useCallback(
      (field: TopoField) => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!canvas || !ctx) return;
        lastFieldRef.current = field;

        const { data, cols, rows, width, height } = field;
        ctx.clearRect(0, 0, width, height);

        const cx = width * 0.5;
        const cy = height * 0.48;
        const maxR = Math.hypot(cx, Math.max(cy, height - cy));

        const minL = -0.9;
        const maxL = 1.0;
        const step = (maxL - minL) / LEVELS;

        const hex = /^#?([0-9a-f]{6})$/i.exec(color);
        const line = hex
          ? [
              parseInt(hex[1].slice(0, 2), 16),
              parseInt(hex[1].slice(2, 4), 16),
              parseInt(hex[1].slice(4, 6), 16),
            ]
          : [107, 17, 38];

        ctx.lineWidth = resRef.current.rasterDpr;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        for (let li = 0; li < LEVELS; li++) {
          const level = minL + step * (li + 0.5);
          // Opacity band ~8–15% with gentle variation by elevation
          const t = li / (LEVELS - 1);
          const levelAlpha = 0.115 * (0.72 + 0.5 * Math.sin(t * Math.PI + 0.3)) * intensity;

          ctx.beginPath();

          for (let j = 0; j < rows - 1; j++) {
            const y = j * CELL_SIZE;
            const row = j * cols;
            const rowN = row + cols;
            for (let i = 0; i < cols - 1; i++) {
              const x = i * CELL_SIZE;
              const tl = data[row + i];
              const tr = data[row + i + 1];
              const bl = data[rowN + i];
              const br = data[rowN + i + 1];

              let config = 0;
              if (tl >= level) config |= 8;
              if (tr >= level) config |= 4;
              if (br >= level) config |= 2;
              if (bl >= level) config |= 1;

              const edges = EDGE_TABLE[config];
              if (!edges.length) continue;

              for (let e = 0; e < edges.length; e += 2) {
                const p1 = edgePoint(edges[e], x, y, CELL_SIZE, tl, tr, br, bl, level);
                const p2 = edgePoint(edges[e + 1], x, y, CELL_SIZE, tl, tr, br, bl, level);
                ctx.moveTo(p1[0], p1[1]);
                ctx.lineTo(p2[0], p2[1]);
              }
            }
          }

          ctx.strokeStyle = `rgba(${line[0]},${line[1]},${line[2]},${levelAlpha})`;
          ctx.stroke();
        }

        // Radial mask: softer center, full mid-field, fade to edges
        ctx.save();
        ctx.globalCompositeOperation = 'destination-in';
        const grd = ctx.createRadialGradient(cx, cy, maxR * 0.08, cx, cy, maxR * 1.02);
        grd.addColorStop(0, 'rgba(0,0,0,0.28)');
        grd.addColorStop(0.22, 'rgba(0,0,0,0.62)');
        grd.addColorStop(0.48, 'rgba(0,0,0,1)');
        grd.addColorStop(0.72, 'rgba(0,0,0,0.85)');
        grd.addColorStop(0.88, 'rgba(0,0,0,0.4)');
        grd.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      },
      [color, intensity],
    );

    useImperativeHandle(ref, () => ({ draw }), [draw]);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
      if (!ctx) return;
      ctxRef.current = ctx;

      const resize = () => {
        const parent = canvas.parentElement ?? document.documentElement;
        const width = parent.clientWidth || window.innerWidth;
        const height = parent.clientHeight || window.innerHeight;
        const rasterDpr = Math.min(window.devicePixelRatio || 1, 2) * RASTER_SCALE;
        canvas.width = Math.max(1, Math.floor(width * rasterDpr));
        canvas.height = Math.max(1, Math.floor(height * rasterDpr));
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.setTransform(rasterDpr, 0, 0, rasterDpr, 0, 0);
        resRef.current.rasterDpr = rasterDpr;
        if (lastFieldRef.current) draw(lastFieldRef.current);
      };

      resize();
      window.addEventListener('resize', resize);
      return () => window.removeEventListener('resize', resize);
    }, [draw]);

    return (
      <div
        className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
        aria-hidden="true"
      >
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      </div>
    );
  },
);

export default TopographicBackground;