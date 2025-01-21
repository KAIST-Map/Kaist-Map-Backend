import { Injectable, UnauthorizedException } from "@nestjs/common";
import { NodeDto } from "./dto/node.dto";
import { NodeRepository } from "./node.repository";
import { NodeListDto } from "./dto/node.dto";
import { RouteDto } from "./dto/route.dto";
import { RouteBetweenPointsQuery } from "./query/route.query";
import { RouteBetweenBuildingsQuery } from "./query/route.query";
import { RoutePointToBuildingQuery } from "./query/route.query";
import { RouteBuildingToPointQuery } from "./query/route.query";
import { CreateNodePayload } from "./payload/create-node.payload";
import { ConfigService } from "@nestjs/config";
import { CreateAllNodesPayload } from "./payload/create-all-nodes.payload";
import { BadRequestException } from "@nestjs/common";
@Injectable()
export class NodeService {
  constructor(
    private readonly nodeRepository: NodeRepository,
    private readonly configService: ConfigService
  ) {}

  async createNode(
    nodePayload: CreateNodePayload,
    password: string
  ): Promise<NodeDto> {
    const envPassword = this.configService.get<string>("PASSWORD");
    if (password !== envPassword) {
      throw new UnauthorizedException("Invalid password");
    }
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

  async createAllNodes(
    nodesPayload: CreateAllNodesPayload,
    password: string
  ): Promise<NodeListDto> {
    if (password !== this.configService.get<string>("PASSWORD")) {
      throw new UnauthorizedException("Invalid password");
    }

    const lastNodeId = await this.nodeRepository.getLastNode();

    if (nodesPayload.nodes.length === 0) {
      throw new BadRequestException("Nodes array is empty");
    }

    for (const node of nodesPayload.nodes) {
      const data = {
        id: node.id,
        name: node.name,
        latitude: node.latitude,
        longitude: node.longitude,
        buildingId: node.buildingId,
      };
      if (node.id > lastNodeId) {
        await this.nodeRepository.createNode(data);
      } else {
        await this.nodeRepository.updateNode(data);
      }
    }

    const updatedNodes = await this.nodeRepository.getNodes();
    return NodeListDto.from(updatedNodes);
  }
}
