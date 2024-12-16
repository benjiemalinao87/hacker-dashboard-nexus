import { GlobeRenderProps, Spike } from "./types";
import { projectPoint } from "./globeUtils";

export class GlobeRenderer {
  static renderBackground(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number) {
    const bgGradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, radius * 2
    );
    bgGradient.addColorStop(0, 'rgba(0, 10, 30, 0.4)');
    bgGradient.addColorStop(1, 'rgba(0, 0, 10, 0)');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  static renderGlobeBase(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number) {
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
  }

  static renderWorldMapPoints({ ctx, centerX, centerY, radius, rotation, worldMapPoints }: GlobeRenderProps) {
    worldMapPoints.forEach(([lng, lat]) => {
      const [x, y, z] = projectPoint(lng, lat, rotation, centerX, centerY, radius);
      
      if (z > 0) {
        const intensity = (z / radius + 1) * 0.5;
        const size = intensity * 1.2;
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
        gradient.addColorStop(0, `rgba(0, 210, 255, ${intensity * 0.5})`);
        gradient.addColorStop(1, 'rgba(0, 210, 255, 0)');
        
        ctx.beginPath();
        ctx.arc(x, y, size * 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 230, 255, ${intensity * 0.8})`;
        ctx.fill();
      }
    });
  }

  static renderSpikes({ ctx, centerX, centerY, radius, rotation, spikes }: GlobeRenderProps) {
    spikes.forEach((spike) => {
      const [startX, startY, startZ] = projectPoint(
        spike.startLng,
        spike.startLat,
        rotation,
        centerX,
        centerY,
        radius
      );
      const [endX, endY, endZ] = projectPoint(
        spike.endLng,
        spike.endLat,
        rotation,
        centerX,
        centerY,
        radius
      );
      
      if (startZ > 0 || endZ > 0) {
        const progress = spike.progress;
        const height = Math.sin(progress * Math.PI) * spike.maxHeight;
        
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2 - height;
        
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
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(midX, midY, endX, endY);
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * Math.sin(progress * Math.PI)})`;
        ctx.lineWidth = 6;
        ctx.stroke();
      }
    });
  }
}