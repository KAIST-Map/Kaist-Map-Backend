import { Controller, Get, Param, Post, Body } from "@nestjs/common";
import { EdgeRepository } from "./edge.repository";
import { EdgeDto } from "./dto/edge.dto";
import { EdgeService } from "./edge.service";
import { EdgeListDto } from "./dto/edge.dto";
import { CreateAllEdgesPayload } from "./payload/create-all-edges.payload";
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiOkResponse,
} from "@nestjs/swagger";
import { CreateEdgePayload } from "./payload/create-edge.payload";

@Controller("edge")
@ApiTags("Edge")
export class EdgeController {
  constructor(private readonly edgeService: EdgeService) {}

  @Post(":password")
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

  @Get("edges/all")
  @ApiOperation({ summary: "모든 엣지 조회" })
  @ApiOkResponse({
    status: 200,
    description: "모든 엣지 조회 성공",
    type: EdgeListDto,
  })
  async getAllEdges(): Promise<EdgeListDto> {
    return this.edgeService.getAllEdges();
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

  @Post("edges/all/:password")
  @ApiOperation({ summary: "모든 엣지 업데이트 하거나 생성" })
  @ApiOkResponse({ type: EdgeListDto })
  async updateAllEdges(
    @Body() edgePayload: CreateAllEdgesPayload,
    @Param("password") password: string
  ): Promise<EdgeListDto> {
    return this.edgeService.createAllEdges(edgePayload, password);
  }
}
