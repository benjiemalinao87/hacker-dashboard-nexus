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
    const radius = Math.min(canvas.width, canvas.height) * 0.2;
    
    // Map coordinates (simplified world map points)
    const mapPoints = [
      // North America
      [[0.2, 0.2], [0.4, 0.2], [0.4, 0.4], [0.2, 0.4]],
      // South America
      [[0.3, 0.5], [0.4, 0.5], [0.4, 0.7], [0.3, 0.7]],
      // Europe
      [[0.5, 0.2], [0.6, 0.2], [0.6, 0.3], [0.5, 0.3]],
      // Africa
      [[0.5, 0.4], [0.6, 0.4], [0.6, 0.6], [0.5, 0.6]],
      // Asia
      [[0.7, 0.2], [0.9, 0.2], [0.9, 0.5], [0.7, 0.5]],
      // Australia
      [[0.8, 0.6], [0.9, 0.6], [0.9, 0.7], [0.8, 0.7]],
    ];

    // Packet system
    type Packet = {
      startX: number;
      startY: number;
      endX: number;
      endY: number;
      progress: number;
      speed: number;
    };

    const packets: Packet[] = [];
    
    const createPacket = () => {
      // Select random continents for start and end points
      const continent1 = mapPoints[Math.floor(Math.random() * mapPoints.length)];
      const continent2 = mapPoints[Math.floor(Math.random() * mapPoints.length)];
      
      // Get random points within the continents
      const point1 = continent1[Math.floor(Math.random() * continent1.length)];
      const point2 = continent2[Math.floor(Math.random() * continent2.length)];
      
      const angle1 = point1[0] * Math.PI * 2;
      const angle2 = point2[0] * Math.PI * 2;
      
      packets.push({
        startX: centerX + Math.cos(angle1) * radius,
        startY: centerY + Math.sin(angle1) * radius * 0.5,
        endX: centerX + Math.cos(angle2) * radius,
        endY: centerY + Math.sin(angle2) * radius * 0.5,
        progress: 0,
        speed: 0.005 + Math.random() * 0.01
      });
    };

    const drawContinents = () => {
      mapPoints.forEach(continent => {
        ctx.beginPath();
        continent.forEach((point, index) => {
          const x = centerX + (point[0] - 0.5) * radius * 2;
          const y = centerY + (point[1] - 0.5) * radius;
          if (index === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });
        ctx.closePath();
        ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
        ctx.stroke();
      });
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw base globe
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radius, radius * 0.5, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 255, 0, 0.2)';
      ctx.stroke();

      // Draw continents
      drawContinents();

      // Draw latitude lines
      for (let i = 1; i < 5; i++) {
        ctx.beginPath();
        ctx.ellipse(
          centerX,
          centerY,
          radius * (i / 5),
          (radius * (i / 5)) * 0.5,
          0,
          0,
          Math.PI * 2
        );
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.1)';
        ctx.stroke();
      }

      // Draw longitude lines
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(
          centerX + Math.cos(angle) * radius,
          centerY + Math.sin(angle) * radius * 0.5
        );
        ctx.lineTo(
          centerX + Math.cos(angle + Math.PI) * radius,
          centerY + Math.sin(angle + Math.PI) * radius * 0.5
        );
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.1)';
        ctx.stroke();
      }

      // Update and draw packets
      packets.forEach((packet, index) => {
        packet.progress += packet.speed;
        
        if (packet.progress >= 1) {
          packets.splice(index, 1);
          return;
        }

        const currentX = packet.startX + (packet.endX - packet.startX) * packet.progress;
        const currentY = packet.startY + (packet.endY - packet.startY) * packet.progress;

        ctx.beginPath();
        ctx.arc(currentX, currentY, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 0, ${1 - Math.abs(packet.progress - 0.5) * 2})`;
        ctx.fill();

        // Draw trail
        ctx.beginPath();
        ctx.moveTo(packet.startX, packet.startY);
        ctx.lineTo(currentX, currentY);
        ctx.strokeStyle = `rgba(0, 255, 0, ${0.2 * (1 - packet.progress)})`;
        ctx.stroke();
      });

      // Create new packets randomly
      if (Math.random() < 0.1 && packets.length < 20) {
        createPacket();
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
    />
  );
};

export default Globe;