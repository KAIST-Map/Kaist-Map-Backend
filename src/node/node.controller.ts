import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Body,
  Query,
  Post,
} from "@nestjs/common";
import { NodeService } from "./node.service";
import { NodeDto } from "./dto/node.dto";
import { ApiOperation, ApiOkResponse } from "@nestjs/swagger";
import { NodeListDto } from "./dto/node.dto";
import { RouteDto } from "./dto/route.dto";
import { RouteBetweenPointsQuery } from "./query/route.query";
import { RouteBetweenBuildingsQuery } from "./query/route.query";
import { RoutePointToBuildingQuery } from "./query/route.query";
import { RouteBuildingToPointQuery } from "./query/route.query";
import { CreateNodePayload } from "./payload/create-node.payload";
import { CreateAllNodesPayload } from "./payload/create-all-nodes.payload";
import { ApiTags } from "@nestjs/swagger";
import { GraphService } from "../common/services/graph.service";

@Controller("node")
@ApiTags("Node")
export class NodeController {
  constructor(
    private readonly nodeService: NodeService,
    private readonly graphService: GraphService
  ) {}

  @Post("/:password")
  @ApiOperation({ summary: "노드 생성" })
  @ApiOkResponse({ type: NodeDto })
  async createNode(
    @Body() nodePayload: CreateNodePayload,
    @Param("password") password: string
  ): Promise<NodeDto> {
    return this.nodeService.createNode(nodePayload, password);
  }

  @Get("nodes/all")
  @ApiOperation({ summary: "노드 정보 조회" })
  @ApiOkResponse({ type: NodeListDto })
  async getNodes(): Promise<NodeListDto> {
    return this.nodeService.getNodes();
  }

  @Get("routes/point-to-point")
  @ApiOperation({ summary: "두 포인트 사이의 경로 조회" })
  @ApiOkResponse({
    status: 200,
    description: "경로 조회 성공",
    type: RouteDto,
  })
  async getRoutesBetweenPoints(
    @Query() routeQuery: RouteBetweenPointsQuery
  ): Promise<RouteDto> {
    return this.nodeService.getRoutesBetweenPoints(routeQuery);
  }

  @Get("routes/building-to-building")
  @ApiOperation({ summary: "두 건물 사이의 경로 조회" })
  @ApiOkResponse({
    status: 200,
    description: "경로 조회 성공",
    type: RouteDto,
  })
  async getRoutesBetweenBuildings(
    @Query() routeQuery: RouteBetweenBuildingsQuery
  ): Promise<RouteDto> {
    return this.nodeService.getRoutesBetweenBuildings(routeQuery);
  }

  @Get("routes/point-to-building")
  @ApiOperation({ summary: "포인트와 건물 사이의 경로 조회" })
  @ApiOkResponse({
    status: 200,
    description: "경로 조회 성공",
    type: RouteDto,
  })
  async getRoutesPointToBuilding(
    @Query() routeQuery: RoutePointToBuildingQuery
  ): Promise<RouteDto> {
    return this.nodeService.getRoutesPointToBuilding(routeQuery);
  }

  @Get("routes/building-to-point")
  @ApiOperation({ summary: "건물과 포인트 사이의 경로 조회" })
  @ApiOkResponse({
    status: 200,
    description: "경로 조회 성공",
    type: RouteDto,
  })
  async getRoutesBuildingToPoint(
    @Query() routeQuery: RouteBuildingToPointQuery
  ): Promise<RouteDto> {
    return this.nodeService.getRoutesBuildingToPoint(routeQuery);
  }

  @Get(":nodeId")
  @ApiOperation({ summary: "노드 정보 조회" })
  @ApiOkResponse({ type: NodeDto })
  async getNode(
    @Param("nodeId", ParseIntPipe) nodeId: number
  ): Promise<NodeDto> {
    return this.nodeService.getNode(nodeId);
  }

  @Post("nodes/all/:password")
  @ApiOperation({ summary: "노드들 수정 및 새로 생긴 노드 생성" })
  @ApiOkResponse({ type: NodeListDto })
  async createAllNodes(
    @Body() nodePayload: CreateAllNodesPayload,
    @Param("password") password: string
  ): Promise<NodeListDto> {
    return this.nodeService.createAllNodes(nodePayload, password);
  }

  @Post("graph/:password")
  @ApiOperation({ summary: "그래프 업데이트" })
  @ApiOkResponse()
  async updateGraph(@Param("password") password: string): Promise<void> {
    return this.nodeService.updateGraph(password);
  }
}
