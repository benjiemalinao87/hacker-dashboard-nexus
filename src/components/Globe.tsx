import React, { useEffect, useRef } from 'react';

const Globe = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Globe parameters
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.25;

    // World map as a grid of points
    const worldMapPoints: [number, number][] = [];
    for (let lat = -60; lat <= 60; lat += 5) {
      for (let lng = -180; lng <= 180; lng += 5) {
        worldMapPoints.push([lng, lat]);
      }
    }

    // Convert lat/lng to screen coordinates
    const projectPoint = (lng: number, lat: number) => {
      const x = centerX + (radius * Math.cos(lat * Math.PI / 180) * Math.sin(lng * Math.PI / 180));
      const y = centerY + (radius * Math.sin(lat * Math.PI / 180) * 0.5);
      return [x, y];
    };

    // Spike system
    type Spike = {
      x: number;
      y: number;
      length: number;
      angle: number;
      color: string;
      speed: number;
      growth: number;
    };

    const spikes: Spike[] = [];

    const createSpike = () => {
      const point = worldMapPoints[Math.floor(Math.random() * worldMapPoints.length)];
      const [x, y] = projectPoint(point[0], point[1]);
      
      const colors = ['rgba(0, 255, 255, ', 'rgba(0, 255, 0, ', 'rgba(0, 150, 255, '];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      spikes.push({
        x,
        y,
        length: 0,
        angle: Math.random() * Math.PI * 2,
        color,
        speed: 0.5 + Math.random() * 2,
        growth: 20 + Math.random() * 80
      });
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw globe outline with glow effect
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw glowing effect
      const gradient = ctx.createRadialGradient(centerX, centerY, radius - 5, centerX, centerY, radius + 5);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw world map points
      worldMapPoints.forEach(([lng, lat]) => {
        const [x, y] = projectPoint(lng, lat);
        ctx.beginPath();
        ctx.arc(x, y, 0.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 150, 255, 0.3)';
        ctx.fill();
      });

      // Update and draw spikes
      spikes.forEach((spike, index) => {
        spike.length += spike.speed;
        
        if (spike.length >= spike.growth) {
          spikes.splice(index, 1);
          return;
        }

        const endX = spike.x + Math.cos(spike.angle) * spike.length;
        const endY = spike.y + Math.sin(spike.angle) * spike.length;

        ctx.beginPath();
        ctx.moveTo(spike.x, spike.y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = `${spike.color}${1 - spike.length / spike.growth})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Create new spikes randomly
      if (Math.random() < 0.1 && spikes.length < 50) {
        createSpike();
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'rgb(0, 0, 0)' }}
    />
  );
};

export default Globe;