import { Controller, Get, Param, Post, Body } from "@nestjs/common";
import { EdgeRepository } from "./edge.repository";
import { EdgeDto } from "./dto/edge.dto";
import { EdgeService } from "./edge.service";
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiOkResponse,
} from "@nestjs/swagger";
import { CreateEdgePayload } from "./payload/create-edge.payload";
import { CreateReportedRoadPayload } from "./payload/create-reportedRoad.payload";
import { ReportedRoadDto } from "./dto/reportedRoad.dto";

@Controller("edge")
@ApiTags("Edge")
export class EdgeController {
  constructor(private readonly edgeService: EdgeService) {}

  @Post("reportedRoad")
  @ApiOperation({ summary: "신고 생성" })
  @ApiOkResponse({
    status: 200,
    description: "신고 생성 성공",
    type: ReportedRoadDto,
  })
  async createReportedRoad(
    @Body() reportedRoadPayload: CreateReportedRoadPayload
  ): Promise<ReportedRoadDto> {
    return this.edgeService.createReportedRoad(reportedRoadPayload);
  }

  @Post("edge/:password")
  @ApiOperation({ summary: "엣지 생성" })
  @ApiOkResponse({
    status: 200,
    description: "엣지 생성 성공",
    type: EdgeDto,
  })
  async createEdge(
    @Param("password") password: string,
    @Body() edgePayload: CreateEdgePayload
  ): Promise<EdgeDto> {
    return this.edgeService.createEdge(edgePayload, password);
  }

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
}
