import React, { useEffect, useRef } from 'react';

export const FilmGrain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = 128);
    let height = (canvas.height = 128);

    const noiseData = ctx.createImageData(width, height);
    const buffer = new Uint32Array(noiseData.data.buffer);

    // Film grain doesn't need to run at screen refresh rate. Capping at ~24fps
    // cuts canvas redraws massively on high-refresh displays (e.g. 120Hz iPads).
    const FRAME_MS = 1000 / 24;
    let last = 0;

    const fillFrame = () => {
      for (let i = 0; i < buffer.length; i++) {
        // Generate random greyscale noise with low opacity
        const val = Math.floor(Math.random() * 255);
        // Alpha determines the grain intensity (keep it very subtle, e.g., 12 out of 255)
        buffer[i] = (15 << 24) | (val << 16) | (val << 8) | val;
      }
      ctx.putImageData(noiseData, 0, 0);
    };

    const render = (time: number) => {
      if (time - last >= FRAME_MS) {
        last = time;
        fillFrame();
      }
      animationFrameId = requestAnimationFrame(render);
    };

    const stop = () => cancelAnimationFrame(animationFrameId);
    const start = () => {
      stop();
      animationFrameId = requestAnimationFrame(render);
    };

    // Respect users who prefer reduced motion: render a single static frame.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      fillFrame();
      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    }

    // Pause the loop while the tab is hidden to avoid wasted compositing work.
    const handleVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    };

    render(0);
    document.addEventListener('visibilitychange', handleVisibility);

    const handleResize = () => {
      // Keep canvas small and scale with CSS for performance
      width = canvas.width = 128;
      height = canvas.height = 128;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-50 opacity-[0.25] mix-blend-overlay"
      style={{ imageRendering: 'pixelated' }}
    />
  );
};
