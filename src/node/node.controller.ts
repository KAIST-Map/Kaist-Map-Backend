import { Controller, Get, Param, ParseIntPipe, Body } from "@nestjs/common";
import { NodeService } from "./node.service";
import { NodeDto } from "./dto/node.dto";
import { ApiOperation, ApiOkResponse } from "@nestjs/swagger";
import { NodeListDto } from "./dto/node.dto";
import { RouteDto } from "./dto/route.dto";
import { RouteBetweenPointsPayload } from "./payload/route.payload";
import { RouteBetweenBuildingsPayload } from "./payload/route.payload";
import { RoutePointToBuildingPayload } from "./payload/route.payload";
import { RouteBuildingToPointPayload } from "./payload/route.payload";
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

  @Get("routes/point to point")
  @ApiOperation({ summary: "두 포인트 사이의 경로 조회" })
  @ApiOkResponse({
    status: 200,
    description: "경로 조회 성공",
    type: RouteDto,
  })
  async getRoutesBetweenPoints(
    @Body() routePayload: RouteBetweenPointsPayload
  ): Promise<RouteDto> {
    return this.nodeService.getRoutesBetweenPoints(routePayload);
  }

  @Get("routes/building to building")
  @ApiOperation({ summary: "두 건물 사이의 경로 조회" })
  @ApiOkResponse({
    status: 200,
    description: "경로 조회 성공",
    type: RouteDto,
  })
  async getRoutesBetweenBuildings(
    @Body() routePayload: RouteBetweenBuildingsPayload
  ): Promise<RouteDto> {
    return this.nodeService.getRoutesBetweenBuildings(routePayload);
  }

  @Get("routes/point to building")
  @ApiOperation({ summary: "포인트와 건물 사이의 경로 조회" })
  @ApiOkResponse({
    status: 200,
    description: "경로 조회 성공",
    type: RouteDto,
  })
  async getRoutesPointToBuilding(
    @Body() routePayload: RoutePointToBuildingPayload
  ): Promise<RouteDto> {
    return this.nodeService.getRoutesPointToBuilding(routePayload);
  }

  @Get("routes/building to point")
  @ApiOperation({ summary: "건물과 포인트 사이의 경로 조회" })
  @ApiOkResponse({
    status: 200,
    description: "경로 조회 성공",
    type: RouteDto,
  })
  async getRoutesBuildingToPoint(
    @Body() routePayload: RouteBuildingToPointPayload
  ): Promise<RouteDto> {
    return this.nodeService.getRoutesBuildingToPoint(routePayload);
  }
}
