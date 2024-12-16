import React, { useEffect, useRef } from 'react';

const Globe = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.4;

    const worldMapPoints: [number, number][] = [];
    for (let lat = -80; lat <= 80; lat += 3) {
      for (let lng = -180; lng <= 180; lng += 3) {
        if (
          (lat > 30 && lat < 70 && lng > -140 && lng < -50) ||
          (lat > -60 && lat < 10 && lng > -80 && lng < -35) ||
          (lat > 35 && lat < 70 && lng > -10 && lng < 40) ||
          (lat > -35 && lat < 35 && lng > -20 && lng < 50) ||
          (lat > 0 && lat < 70 && lng > 60 && lng < 140) ||
          (lat > -40 && lat < -10 && lng > 110 && lng < 155)
        ) {
          worldMapPoints.push([lng, lat]);
        }
      }
    }

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
      const startPoint = worldMapPoints[Math.floor(Math.random() * worldMapPoints.length)];
      const endPoint = worldMapPoints[Math.floor(Math.random() * worldMapPoints.length)];
      
      // SpaceX-inspired colors - cool blues and whites
      const colors = [
        'rgba(0, 237, 255, ', // Bright cyan
        'rgba(180, 230, 255, ', // Light blue
        'rgba(255, 255, 255, ' // Pure white
      ];
      
      spikes.push({
        startLng: startPoint[0],
        startLat: startPoint[1],
        endLng: endPoint[0],
        endLat: endPoint[1],
        progress: 0,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: 0.003 + Math.random() * 0.005, // Slower, more dramatic movements
        maxHeight: radius * (0.3 + Math.random() * 0.4)
      });
    };

    let rotation = 0;
    const rotationSpeed = 0.05; // Slower rotation for more dramatic effect

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      rotation += rotationSpeed;

      // Dark space background with subtle gradient
      const bgGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius * 2
      );
      bgGradient.addColorStop(0, 'rgba(0, 10, 30, 0.4)');
      bgGradient.addColorStop(1, 'rgba(0, 0, 10, 0)');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw globe base with SpaceX-inspired gradient
      ctx.beginPath();
      const baseGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius
      );
      baseGradient.addColorStop(0, 'rgba(0, 40, 80, 0.2)');
      baseGradient.addColorStop(1, 'rgba(0, 10, 40, 0)');
      ctx.fillStyle = baseGradient;
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // Draw world map points with enhanced depth and glow
      worldMapPoints.forEach(([lng, lat]) => {
        const [x, y, z] = projectPoint(lng, lat, rotation);
        
        if (z > 0) {
          const intensity = (z / radius + 1) * 0.5;
          const size = intensity * 1.2;
          
          // Outer glow
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
          gradient.addColorStop(0, `rgba(0, 210, 255, ${intensity * 0.5})`);
          gradient.addColorStop(1, 'rgba(0, 210, 255, 0)');
          
          ctx.beginPath();
          ctx.arc(x, y, size * 2, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
          
          // Core point
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(180, 230, 255, ${intensity * 0.8})`;
          ctx.fill();
        }
      });

      // Update and draw spikes with enhanced effects
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
          
          // Draw glow effect
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.quadraticCurveTo(midX, midY, endX, endY);
          
          const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
          gradient.addColorStop(0, `${spike.color}${0.05})`);
          gradient.addColorStop(0.5, `${spike.color}${0.4})`);
          gradient.addColorStop(1, `${spike.color}${0.05})`);
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 3;
          ctx.stroke();
          
          // Add additional glow layer
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.quadraticCurveTo(midX, midY, endX, endY);
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * Math.sin(progress * Math.PI)})`;
          ctx.lineWidth = 6;
          ctx.stroke();
        }
      });

      // Create new spikes less frequently for more dramatic effect
      if (Math.random() < 0.03 && spikes.length < 25) {
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
      style={{ background: 'rgb(0, 5, 15)' }} // Darker space background
    />
  );
};

export default Globe;