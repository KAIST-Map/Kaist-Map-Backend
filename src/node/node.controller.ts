import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Body,
  Query,
} from "@nestjs/common";
import { NodeService } from "./node.service";
import { NodeDto } from "./dto/node.dto";
import { ApiOperation, ApiOkResponse } from "@nestjs/swagger";
import { NodeListDto } from "./dto/node.dto";
import { RouteDto } from "./dto/route.dto";
import { RouteBetweenPointsQuery } from "./payload/route.payload";
import { RouteBetweenBuildingsQuery } from "./payload/route.payload";
import { RoutePointToBuildingQuery } from "./payload/route.payload";
import { RouteBuildingToPointQuery } from "./payload/route.payload";
@Controller("node")
export class NodeController {
  constructor(private readonly nodeService: NodeService) {}

  @Get(":nodeId")
  @ApiOperation({ summary: "노드 정보 조회" })
  @ApiOkResponse({ type: NodeDto })
  async getNode(
    @Param("nodeId", ParseIntPipe) nodeId: number
  ): Promise<NodeDto> {
    return this.nodeService.getNode(nodeId);
  }
  @Get("nodes")
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
}
