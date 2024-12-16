export type Spike = {
  startLng: number;
  startLat: number;
  endLng: number;
  endLat: number;
  progress: number;
  color: string;
  speed: number;
  maxHeight: number;
};

export type GlobeRenderProps = {
  ctx: CanvasRenderingContext2D;
  centerX: number;
  centerY: number;
  radius: number;
  rotation: number;
  worldMapPoints: [number, number][];
  spikes: Spike[];
};