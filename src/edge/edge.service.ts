import { Injectable } from "@nestjs/common";
import { EdgeRepository } from "./edge.repository";
import { EdgeDto } from "./dto/edge.dto";
import { EdgeListDto } from "./dto/edge.dto";
import { CreateEdgePayload } from "./payload/create-edge.payload";
import { CreateEdgeData } from "./type/create-edge-data.type";
import { ConfigService } from "@nestjs/config";
import { UnauthorizedException } from "@nestjs/common";
import { CreateReportedRoadData } from "./type/create-reportedRoad-data.type";
import { ReportedRoadDto } from "./dto/reportedRoad.dto";
import { CreateReportedRoadPayload } from "./payload/create-reportedRoad.payload";
import { ReportStatus } from "@prisma/client";
@Injectable()
export class EdgeService {
  constructor(
    private readonly edgeRepository: EdgeRepository,
    private readonly configService: ConfigService
  ) {}

  async createReportedRoad(
    reportedRoadPayload: CreateReportedRoadPayload
  ): Promise<ReportedRoadDto> {
    const reportedRoadData: CreateReportedRoadData = {
      latitude1: reportedRoadPayload.latitude1,
      longitude1: reportedRoadPayload.longitude1,
      latitude2: reportedRoadPayload.latitude2,
      longitude2: reportedRoadPayload.longitude2,
      imageUrls: reportedRoadPayload.imageUrls,
      description: reportedRoadPayload.description,
      reportStatus: ReportStatus.PENDING,
    };
    const reportedRoad =
      await this.edgeRepository.createReportedRoad(reportedRoadData);
    return ReportedRoadDto.from(reportedRoad);
  }

  async getEdge(edgeId: number): Promise<EdgeDto> {
    const edge = await this.edgeRepository.getEdge(edgeId);
    if (!edge) {
      throw new Error("Edge not found");
    }
    return EdgeDto.from(edge);
  }

  async createEdge(
    edgePayload: CreateEdgePayload,
    password: string
  ): Promise<EdgeDto> {
    if (password !== this.configService.get<string>("PASSWORD")) {
      throw new UnauthorizedException("Invalid password");
    }

    const node1 = await this.edgeRepository.getNode(edgePayload.nodeId1);
    const node2 = await this.edgeRepository.getNode(edgePayload.nodeId2);
    if (!node1 || !node2) {
      throw new Error("Node not found");
    }

    const edgeData: CreateEdgeData = {
      nodeId1: edgePayload.nodeId1,
      nodeId2: edgePayload.nodeId2,
      isFreeOfRain: edgePayload.isFreeOfRain,
      distance: edgePayload.distance,
      beamWeight: edgePayload.beamWeight,
    };

    const edge = await this.edgeRepository.createEdge(edgeData);
    return EdgeDto.from(edge);
  }
}
