import { Injectable } from "@nestjs/common";
import { NodeDto } from "./dto/node.dto";
import { NodeRepository } from "./node.repository";
import { NodeListDto } from "./dto/node.dto";
import { RouteDto } from "./dto/route.dto";
import { RouteBetweenPointsQuery } from "./query/route.query";
import { RouteBetweenBuildingsQuery } from "./query/route.query";
import { RoutePointToBuildingQuery } from "./query/route.query";
import { RouteBuildingToPointQuery } from "./query/route.query";
import { CreateNodePayload } from "./payload/create-node.payload";

@Injectable()
export class NodeService {
  constructor(private readonly nodeRepository: NodeRepository) {}

  async createNode(nodePayload: CreateNodePayload): Promise<NodeDto> {
    if (nodePayload.buildingId) {
      const building = await this.nodeRepository.getBuilding(
        nodePayload.buildingId
      );
      if (!building) {
        throw new Error("Building not found");
      }
    }

    const data = {
      name: nodePayload.name,
      latitude: nodePayload.latitude,
      longitude: nodePayload.longitude,
      buildingId: nodePayload.buildingId,
    };

    const node = await this.nodeRepository.createNode(data);
    return NodeDto.from(node);
  }

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
