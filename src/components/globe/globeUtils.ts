export const projectPoint = (
  lng: number,
  lat: number,
  rotation: number,
  centerX: number,
  centerY: number,
  radius: number
) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + rotation) * (Math.PI / 180);
  
  const x = centerX + (radius * Math.sin(phi) * Math.cos(theta));
  const y = centerY + (radius * Math.cos(phi));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  
  return [x, y, z] as const;
};

export const generateWorldMapPoints = (): [number, number][] => {
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
  return worldMapPoints;
};