import { Controller, Get, Param } from "@nestjs/common";
import { EdgeRepository } from "./edge.repository";
import { EdgeDto } from "./dto/edge.dto";
import { EdgeService } from "./edge.service";
import { RouteDto } from "./dto/route.dto";
@Controller("edge")
export class EdgeController {
  constructor(private readonly edgeService: EdgeService) {}

  @Get(":edgeId")
  async getEdge(@Param("edgeId") id: number): Promise<EdgeDto> {
    return this.edgeService.getEdge(id);
  }

  @Get("routes/:startNodeId/:endNodeId")
  async getRoutes(
    @Param("startNodeId") startNodeId: number,
    @Param("endNodeId") endNodeId: number
  ): Promise<RouteDto> {
    return this.edgeService.getRoutes(startNodeId, endNodeId);
  }
}
