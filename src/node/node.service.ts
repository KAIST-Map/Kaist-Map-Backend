// node.service.ts
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NodeRepository } from "./node.repository";
import { RoutingService } from "./routind.service";
import { NodeDto, NodeListDto } from "./dto/node.dto";
import { RouteDto } from "./dto/route.dto";
import { CreateNodePayload } from "./payload/create-node.payload";
import { CreateAllNodesPayload } from "./payload/create-all-nodes.payload";
import {
  RouteBetweenPointsQuery,
  RouteBetweenBuildingsQuery,
  RoutePointToBuildingQuery,
  RouteBuildingToPointQuery,
} from "./query/route.query";

@Injectable()
export class NodeService {
  constructor(
    private readonly nodeRepository: NodeRepository,
    private readonly routingService: RoutingService,
    private readonly configService: ConfigService
  ) {}

  private validatePassword(password: string) {
    const envPassword = this.configService.get<string>("PASSWORD");
    if (password !== envPassword) {
      throw new UnauthorizedException("Invalid password");
    }
  }

  async createNode(
    nodePayload: CreateNodePayload,
    password: string
  ): Promise<NodeDto> {
    this.validatePassword(password);

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

  // 라우팅 관련 메서드들을 RoutingService로 위임
  async getRoutesBetweenPoints(
    routeQuery: RouteBetweenPointsQuery
  ): Promise<RouteDto> {
    return this.routingService.getRoutesBetweenPoints(routeQuery);
  }

  async getRoutesBetweenBuildings(
    routeQuery: RouteBetweenBuildingsQuery
  ): Promise<RouteDto> {
    return this.routingService.getRoutesBetweenBuildings(routeQuery);
  }

  async getRoutesPointToBuilding(
    routeQuery: RoutePointToBuildingQuery
  ): Promise<RouteDto> {
    return this.routingService.getRoutesPointToBuilding(routeQuery);
  }

  async getRoutesBuildingToPoint(
    routeQuery: RouteBuildingToPointQuery
  ): Promise<RouteDto> {
    return this.routingService.getRoutesBuildingToPoint(routeQuery);
  }

  async createAllNodes(
    nodesPayload: CreateAllNodesPayload,
    password: string
  ): Promise<NodeListDto> {
    this.validatePassword(password);

    if (nodesPayload.nodes.length === 0) {
      throw new BadRequestException("Nodes array is empty");
    }

    const lastNodeId = await this.nodeRepository.getLastNode();

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
