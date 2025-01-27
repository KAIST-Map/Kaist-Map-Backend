import { NodeData } from "./node-data.type";
export type RouteData = {
  path: NodeData[];
  totalDistance: number;
  weightedTotalDistance: number;
};
