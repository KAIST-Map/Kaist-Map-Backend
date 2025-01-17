import { Injectable } from "@nestjs/common";
import { EdgeRepository } from "./edge.repository";
import { EdgeDto } from "./dto/edge.dto";
import { EdgeListDto } from "./dto/edge.dto";
import { RouteData } from "./type/edge-data.type";
import { RouteDto } from "./dto/route.dto";
@Injectable()
export class EdgeService {
  constructor(private readonly edgeRepository: EdgeRepository) {}

  async getEdge(edgeId: number): Promise<EdgeDto> {
    const edge = await this.edgeRepository.getEdge(edgeId);
    if (!edge) {
      throw new Error("Edge not found");
    }
    return EdgeDto.from(edge);
  }

  async getRoutes(startNodeId: number, endNodeId: number): Promise<RouteData> {
    const edges = await this.edgeRepository.getRoutesWithDistance(
      startNodeId,
      endNodeId
    );
    return RouteDto.from(edges.path, edges.totalDistance);
  }
}
