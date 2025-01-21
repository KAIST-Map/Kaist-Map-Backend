import { Injectable } from "@nestjs/common";
import { EdgeRepository } from "./edge.repository";
import { EdgeDto } from "./dto/edge.dto";
import { EdgeListDto } from "./dto/edge.dto";
import { CreateEdgePayload } from "./payload/create-edge.payload";
import { CreateEdgeData } from "./type/create-edge-data.type";
import { ConfigService } from "@nestjs/config";
import { UnauthorizedException } from "@nestjs/common";
import { ReportStatus } from "@prisma/client";
import { NodeData } from "../node/type/node-data.type";
import { CreateAllEdgesPayload } from "./payload/create-all-edges.payload";
@Injectable()
export class EdgeService {
  constructor(
    private readonly edgeRepository: EdgeRepository,
    private readonly configService: ConfigService
  ) {}

  async getEdge(edgeId: number): Promise<EdgeDto> {
    const edge = await this.edgeRepository.getEdge(edgeId);
    if (!edge) {
      throw new Error("Edge not found");
    }
    return EdgeDto.from(edge);
  }

  async getAllEdges(): Promise<EdgeListDto> {
    const edges = await this.edgeRepository.getAllEdges();
    return EdgeListDto.from(edges);
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

    const distance = await this.calculateDistance(node1, node2);
    const edgeData: CreateEdgeData = {
      nodeId1: edgePayload.nodeId1,
      nodeId2: edgePayload.nodeId2,
      isFreeOfRain: edgePayload.isFreeOfRain,
      distance: distance,
      beamWeight: edgePayload.beamWeight,
    };

    const edge = await this.edgeRepository.createEdge(edgeData);
    return EdgeDto.from(edge);
  }

  async createAllEdges(
    edgePayload: CreateAllEdgesPayload,
    password: string
  ): Promise<EdgeListDto> {
    this.validatePassword(password);

    const lastEdgeId = await this.edgeRepository.getLastEdgeId();

    for (const edge of edgePayload.edges) {
      const edgeData = {
        id: edge.id,
        nodeId1: edge.nodeId1,
        nodeId2: edge.nodeId2,
        isFreeOfRain: edge.isFreeOfRain,
        distance: edge.distance,
        beamWeight: edge.beamWeight,
      };

      if (edge.id > lastEdgeId) {
        await this.edgeRepository.createEdge(edgeData);
      } else {
        await this.edgeRepository.updateEdge(edgeData);
      }
    }

    const updatedEdges = await this.edgeRepository.getAllEdges();
    return EdgeListDto.from(updatedEdges);
  }

  private async calculateDistance(
    node1: NodeData,
    node2: NodeData
  ): Promise<number> {
    const R = 6371;

    const lat1 = this.toRadian(node1.latitude);
    const lon1 = this.toRadian(node1.longitude);
    const lat2 = this.toRadian(node2.latitude);
    const lon2 = this.toRadian(node2.longitude);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  }

  private toRadian(degree: number): number {
    return ((degree * Math.PI) / 180) * 1000;
  }

  private validatePassword(password: string) {
    const envPassword = this.configService.get<string>("PASSWORD");
    if (password !== envPassword) {
      throw new UnauthorizedException("Invalid password");
    }
  }
}
