import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/services/prisma.service";
import { EdgeData } from "./type/edge-data.type";
import { NodeData } from "../node/type/node-data.type";
import { CreateEdgeData } from "./type/create-edge-data.type";
import { CreateReportedRoadData } from "./type/create-reportedRoad-data.type";
import { ReportedRoadData } from "./type/reportedRoadData.type";
import { ReportStatus } from "@prisma/client";
@Injectable()
export class EdgeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getEdge(edgeId: number): Promise<EdgeData | null> {
    const edge = await this.prisma.edge.findUnique({
      where: { id: edgeId },
    });
    return edge;
  }

  async getNode(nodeId: number): Promise<NodeData | null> {
    const node = await this.prisma.node.findUnique({
      where: { id: nodeId },
    });
    return node;
  }

  async createEdge(edgeData: CreateEdgeData): Promise<EdgeData> {
    const edge = await this.prisma.edge.create({
      data: {
        nodeId1: edgeData.nodeId1,
        nodeId2: edgeData.nodeId2,
        isFreeOfRain: edgeData.isFreeOfRain,
        distance: edgeData.distance,
        beamWeight: edgeData.beamWeight,
      },
      select: {
        id: true,
        nodeId1: true,
        nodeId2: true,
        isFreeOfRain: true,
        distance: true,
        beamWeight: true,
      },
    });

    return edge;
  }

  async createReportedRoad(
    reportedRoadData: CreateReportedRoadData
  ): Promise<ReportedRoadData> {
    const reportedRoad = await this.prisma.reportedRoad.create({
      data: {
        latitude1: reportedRoadData.latitude1,
        longitude1: reportedRoadData.longitude1,
        latitude2: reportedRoadData.latitude2,
        longitude2: reportedRoadData.longitude2,
        imageUrls: reportedRoadData.imageUrls,
        description: reportedRoadData.description,
        reportStatus: ReportStatus.PENDING,
      },
      select: {
        id: true,
        latitude1: true,
        longitude1: true,
        latitude2: true,
        longitude2: true,
        imageUrls: true,
        description: true,
        reportStatus: true,
      },
    });
    return reportedRoad;
  }
}
