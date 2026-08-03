import React, { useEffect, useRef } from 'react';
import { SimplexNoise } from '../lib/simplex';
import { sampleTopoField } from '../lib/topoField';
import { TopographicBackground, TopoLayerHandle } from './TopographicBackground';

/**
 * Site-wide topographic contours — rendered ONCE as a static backdrop.
 * The noise field is sampled a single time and both color layers draw it.
 * No animation loop, no per-frame cost.
 */

export const TopoBackdrop: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const layerA = useRef<TopoLayerHandle>(null);
  const layerB = useRef<TopoLayerHandle>(null);
  const noiseRef = useRef(new SimplexNoise(0x6b11));

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const noise = noiseRef.current;

    const sampleAndDraw = () => {
      const width = wrapper.clientWidth || window.innerWidth;
      const height = wrapper.clientHeight || window.innerHeight;
      if (width < 2 || height < 2) return;
      const field = sampleTopoField(noise, width, height, 0);
      layerA.current?.draw(field);
      layerB.current?.draw(field);
    };

    sampleAndDraw();
    window.addEventListener('resize', sampleAndDraw);
    return () => window.removeEventListener('resize', sampleAndDraw);
  }, []);

  return (
    <div
      ref={wrapperRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[5] select-none overflow-hidden"
    >
      {/* Burgundy contours — visible on light sections (beige/white) */}
      <TopographicBackground ref={layerA} color="#6B1126" intensity={0.9} />
      {/* Gold contours — visible on dark sections (charcoal) */}
      <TopographicBackground ref={layerB} color="#C8A96A" intensity={1.35} />
    </div>
  );
};
