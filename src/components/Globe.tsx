import React, { useEffect, useRef, useCallback } from 'react';
import { GlobeRenderer } from './globe/GlobeRenderer';
import { generateWorldMapPoints } from './globe/globeUtils';
import type { Spike } from './globe/types';

const Globe = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const worldMapPoints = useRef(generateWorldMapPoints());
  const spikesRef = useRef<Spike[]>([]);
  const rotationRef = useRef(0);

  const createSpike = useCallback(() => {
    const startPoint = worldMapPoints.current[Math.floor(Math.random() * worldMapPoints.current.length)];
    const endPoint = worldMapPoints.current[Math.floor(Math.random() * worldMapPoints.current.length)];
    
    const colors = [
      'rgba(0, 237, 255, ',
      'rgba(180, 230, 255, ',
      'rgba(255, 255, 255, '
    ];
    
    spikesRef.current.push({
      startLng: startPoint[0],
      startLat: startPoint[1],
      endLng: endPoint[0],
      endLat: endPoint[1],
      progress: 0,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: 0.003 + Math.random() * 0.005,
      maxHeight: 0
    });
  }, []);

  const updateDimensions = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get the viewport dimensions
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Set canvas dimensions to match viewport
    canvas.width = vw;
    canvas.height = vh;

    // Calculate new radius based on viewport size
    const radius = Math.min(vw, vh) * 0.4;

    // Update maxHeight for all spikes
    spikesRef.current.forEach(spike => {
      spike.maxHeight = radius * (0.3 + Math.random() * 0.4);
    });
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.4;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    rotationRef.current += 0.05;

    // Render background and globe base
    GlobeRenderer.renderBackground(ctx, centerX, centerY, radius);
    GlobeRenderer.renderGlobeBase(ctx, centerX, centerY, radius);

    // Render world map points
    GlobeRenderer.renderWorldMapPoints({
      ctx,
      centerX,
      centerY,
      radius,
      rotation: rotationRef.current,
      worldMapPoints: worldMapPoints.current,
      spikes: spikesRef.current
    });

    // Update and render spikes
    spikesRef.current = spikesRef.current.filter(spike => {
      spike.progress += spike.speed;
      return spike.progress < 1;
    });

    GlobeRenderer.renderSpikes({
      ctx,
      centerX,
      centerY,
      radius,
      rotation: rotationRef.current,
      worldMapPoints: worldMapPoints.current,
      spikes: spikesRef.current
    });

    // Create new spikes
    if (Math.random() < 0.03 && spikesRef.current.length < 25) {
      createSpike();
    }

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [createSpike]);

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animate, updateDimensions]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-screen h-screen"
      style={{ background: 'rgb(0, 5, 15)' }}
    />
  );
};

export default Globe;