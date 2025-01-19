import { ReportStatus } from "@prisma/client";

export type ReportedRoadData = {
  id: number;
  latitude1: number;
  longitude1: number;
  latitude2: number;
  longitude2: number;
  imageUrls: string[];
  description?: string | null;
  reportStatus: ReportStatus;
};
