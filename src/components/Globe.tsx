import React, { useEffect, useRef } from 'react';

const Globe = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to full viewport
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Globe parameters - increase size by adjusting radius
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.4; // Increased from 0.25 to 0.4

    const worldMapPoints: [number, number][] = [];
    for (let lat = -80; lat <= 80; lat += 3) {
      for (let lng = -180; lng <= 180; lng += 3) {
        // Skip points to create landmass shapes (simplified)
        if (
          // North America
          (lat > 30 && lat < 70 && lng > -140 && lng < -50) ||
          // South America
          (lat > -60 && lat < 10 && lng > -80 && lng < -35) ||
          // Europe
          (lat > 35 && lat < 70 && lng > -10 && lng < 40) ||
          // Africa
          (lat > -35 && lat < 35 && lng > -20 && lng < 50) ||
          // Asia
          (lat > 0 && lat < 70 && lng > 60 && lng < 140) ||
          // Australia
          (lat > -40 && lat < -10 && lng > 110 && lng < 155)
        ) {
          worldMapPoints.push([lng, lat]);
        }
      }
    }

    // Convert lat/lng to screen coordinates with rotation
    const projectPoint = (lng: number, lat: number, rotation: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + rotation) * (Math.PI / 180);
      
      const x = centerX + (radius * Math.sin(phi) * Math.cos(theta));
      const y = centerY + (radius * Math.cos(phi));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      
      return [x, y, z];
    };

    type Spike = {
      startLng: number;
      startLat: number;
      endLng: number;
      endLat: number;
      progress: number;
      color: string;
      speed: number;
      maxHeight: number;
    };

    const spikes: Spike[] = [];

    const createSpike = () => {
      // Select random points from landmasses
      const startPoint = worldMapPoints[Math.floor(Math.random() * worldMapPoints.length)];
      const endPoint = worldMapPoints[Math.floor(Math.random() * worldMapPoints.length)];
      
      const colors = [
        'rgba(0, 255, 255, ',
        'rgba(0, 200, 255, ',
        'rgba(0, 150, 255, '
      ];
      
      spikes.push({
        startLng: startPoint[0],
        startLat: startPoint[1],
        endLng: endPoint[0],
        endLat: endPoint[1],
        progress: 0,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: 0.005 + Math.random() * 0.01,
        maxHeight: radius * (0.2 + Math.random() * 0.3)
      });
    };

    let rotation = 0;
    const rotationSpeed = 0.1;

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Rotate globe
      rotation += rotationSpeed;

      // Draw globe base with gradient
      ctx.beginPath();
      const baseGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius
      );
      baseGradient.addColorStop(0, 'rgba(0, 30, 60, 0.2)');
      baseGradient.addColorStop(1, 'rgba(0, 0, 30, 0)');
      ctx.fillStyle = baseGradient;
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // Draw world map points with depth
      worldMapPoints.forEach(([lng, lat]) => {
        const [x, y, z] = projectPoint(lng, lat, rotation);
        
        if (z > 0) { // Only draw points on the visible side
          const intensity = (z / radius + 1) * 0.5;
          const size = intensity * 1.5;
          
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 200, 255, ${intensity * 0.5})`;
          ctx.fill();
        }
      });

      // Update and draw spikes
      spikes.forEach((spike, index) => {
        spike.progress += spike.speed;
        
        if (spike.progress >= 1) {
          spikes.splice(index, 1);
          return;
        }

        const [startX, startY, startZ] = projectPoint(spike.startLng, spike.startLat, rotation);
        const [endX, endY, endZ] = projectPoint(spike.endLng, spike.endLat, rotation);
        
        if (startZ > 0 || endZ > 0) {
          const progress = spike.progress;
          const height = Math.sin(progress * Math.PI) * spike.maxHeight;
          
          const midX = (startX + endX) / 2;
          const midY = (startY + endY) / 2 - height;
          
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.quadraticCurveTo(midX, midY, endX, endY);
          
          const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
          gradient.addColorStop(0, `${spike.color}${0.1})`);
          gradient.addColorStop(0.5, `${spike.color}${0.8})`);
          gradient.addColorStop(1, `${spike.color}${0.1})`);
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });

      // Create new spikes randomly
      if (Math.random() < 0.05 && spikes.length < 30) {
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
      className="fixed inset-0 pointer-events-none z-0 w-screen h-screen"
      style={{ background: 'rgb(0, 0, 0)' }}
    />
  );
};

export default Globe;
