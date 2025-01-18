import { Controller, Get, Param } from "@nestjs/common";
import { EdgeRepository } from "./edge.repository";
import { EdgeDto } from "./dto/edge.dto";
import { EdgeService } from "./edge.service";
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
}
