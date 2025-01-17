import { Controller, Get, Param } from "@nestjs/common";
import { EdgeRepository } from "./edge.repository";
import { EdgeDto } from "./dto/edge.dto";
import { EdgeService } from "./edge.service";
import { RouteDto } from "./dto/route.dto";
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiOkResponse,
} from "@nestjs/swagger";

@Controller("edge")
@ApiTags("Edge")
export class EdgeController {
  constructor(private readonly edgeService: EdgeService) {}

  @Get(":edgeId")
  @ApiOperation({ summary: "엣지 조회" })
  @ApiOkResponse({
    status: 200,
    description: "엣지 조회 성공",
    type: EdgeDto,
  })
  async getEdge(@Param("edgeId") id: number): Promise<EdgeDto> {
    return this.edgeService.getEdge(id);
  }

  @Get("routes/:startNodeId/:endNodeId")
  @ApiOperation({ summary: "두 노드 사이의 경로 조회" })
  @ApiOkResponse({
    status: 200,
    description: "경로 조회 성공",
    type: RouteDto,
  })
  async getRoutes(
    @Param("startNodeId") startNodeId: number,
    @Param("endNodeId") endNodeId: number
  ): Promise<RouteDto> {
    return this.edgeService.getRoutes(startNodeId, endNodeId);
  }
}
