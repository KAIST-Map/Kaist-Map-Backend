import { Injectable } from "@nestjs/common";
import { NodeDto } from "./dto/node.dto";
import { NodeRepository } from "./node.repository";
import { NodeListDto } from "./dto/node.dto";
import { RouteDto } from "./dto/route.dto";
import { RouteBetweenPointsPayload } from "./payload/route.payload";
import { RouteBetweenBuildingsPayload } from "./payload/route.payload";
import { RoutePointToBuildingPayload } from "./payload/route.payload";
import { RouteBuildingToPointPayload } from "./payload/route.payload";

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
    routePayload: RouteBetweenPointsPayload
  ): Promise<RouteDto> {
    return this.nodeRepository.getRoutesBetweenPoints(routePayload);
  }

  async getRoutesBetweenBuildings(
    routePayload: RouteBetweenBuildingsPayload
  ): Promise<RouteDto> {
    return this.nodeRepository.getRoutesBetweenBuildings(routePayload);
  }

  async getRoutesPointToBuilding(
    routePayload: RoutePointToBuildingPayload
  ): Promise<RouteDto> {
    return this.nodeRepository.getRoutesPointToBuilding(routePayload);
  }

  async getRoutesBuildingToPoint(
    routePayload: RouteBuildingToPointPayload
  ): Promise<RouteDto> {
    return this.nodeRepository.getRoutesBuildingToPoint(routePayload);
  }
}
