import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { NodeService } from "./node.service";
import { NodeDto } from "./dto/node.dto";
import { ApiOperation, ApiOkResponse } from "@nestjs/swagger";
import { NodeListDto } from "./dto/node.dto";
import { RouteDto } from "./dto/route.dto";
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

  @Get("routes/:startNodeId/:endNodeId")
  @ApiOperation({ summary: "두 노드 사이의 경로 조회" })
  @ApiOkResponse({
    status: 200,
    description: "경로 조회 성공",
    type: RouteDto,
  })
  async getRoutesWithDistance(
    @Param("startNodeId") startNodeId: number,
    @Param("endNodeId") endNodeId: number
  ): Promise<RouteDto> {
    return this.nodeService.getRoutesWithDistance(startNodeId, endNodeId);
  }

  @Get("routes/rain/:startNodeId/:endNodeId")
  @ApiOperation({ summary: "두 노드 사이의 비맞지 않는 경로 조회" })
  @ApiOkResponse({
    status: 200,
    description: "경로 조회 성공",
    type: RouteDto,
  })
  async getRoutesWithoutRain(
    @Param("startNodeId") startNodeId: number,
    @Param("endNodeId") endNodeId: number
  ): Promise<RouteDto> {
    return this.nodeService.getRoutesWithoutRain(startNodeId, endNodeId);
  }
}
