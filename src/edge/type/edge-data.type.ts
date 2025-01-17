export type EdgeData = {
  nodeId1: number;
  nodeId2: number;
  distance: number;
  isFreeOfRain: boolean;
  beamWeight: number;
};

export type RouteData = {
  path: EdgeData[];
  totalDistance: number;
};
