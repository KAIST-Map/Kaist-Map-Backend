import { Injectable } from "@nestjs/common";
import { NodeDto } from "./dto/node.dto";
import { NodeRepository } from "./node.repository";
import { NodeListDto } from "./dto/node.dto";
import { RouteDto } from "./dto/route.dto";
import { RouteBetweenPointsQuery } from "./payload/route.payload";
import { RouteBetweenBuildingsQuery } from "./payload/route.payload";
import { RoutePointToBuildingQuery } from "./payload/route.payload";
import { RouteBuildingToPointQuery } from "./payload/route.payload";

@Injectable()
export class NodeService {
  constructor(private readonly nodeRepository: NodeRepository) {}

  async getNode(nodeId: number): Promise<NodeDto> {
    const node = await this.nodeRepository.getNode(nodeId);
    if (!node) {
      throw new Error("Node not found");
    }
    return NodeDto.from(node);
  }

  async getNodes(): Promise<NodeListDto> {
    const nodes = await this.nodeRepository.getNodes();
    return NodeListDto.from(nodes);
  }

  async getRoutesBetweenPoints(
    routeQuery: RouteBetweenPointsQuery
  ): Promise<RouteDto> {
    return this.nodeRepository.getRoutesBetweenPoints(routeQuery);
  }

  async getRoutesBetweenBuildings(
    routeQuery: RouteBetweenBuildingsQuery
  ): Promise<RouteDto> {
    return this.nodeRepository.getRoutesBetweenBuildings(routeQuery);
  }

  async getRoutesPointToBuilding(
    routeQuery: RoutePointToBuildingQuery
  ): Promise<RouteDto> {
    return this.nodeRepository.getRoutesPointToBuilding(routeQuery);
  }

  async getRoutesBuildingToPoint(
    routeQuery: RouteBuildingToPointQuery
  ): Promise<RouteDto> {
    return this.nodeRepository.getRoutesBuildingToPoint(routeQuery);
  }
}
