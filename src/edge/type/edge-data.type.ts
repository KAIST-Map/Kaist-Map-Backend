import { Dormitory } from "@prisma/client";

export type EdgeData = {
  id: number;
  nodeId1: number;
  nodeId2: number;
  distance: number;
  isFreeOfRain: boolean;
  beamWeight: number;
  inDormitory: Dormitory;
};
