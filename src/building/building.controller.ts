import { Controller, Get, Param, Post, Body } from "@nestjs/common";
import { BuildingService } from "./building.service";
import { BuildingDto } from "./dto/building.dto";
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiOkResponse,
} from "@nestjs/swagger";
import { BuildingListDto } from "./dto/building.dto";
import { CreateBuildingPayload } from "./payload/create-building.payload";
import { CreateBuildingData } from "./type/create-building-data.type";
@Controller("building")
@ApiTags("Building")
export class BuildingController {
  constructor(private readonly buildingService: BuildingService) {}

  @Post("building/:password")
  @ApiOperation({ summary: "건물 생성" })
  @ApiOkResponse({
    status: 200,
    description: "건물 생성 성공",
    type: BuildingDto,
  })
  async createBuilding(
    @Body() buildingPayload: CreateBuildingPayload,
    @Param("password") password: string
  ): Promise<BuildingDto> {
    return this.buildingService.createBuilding(buildingPayload, password);
  }

  @Get()
  @ApiResponse({
    type: BuildingListDto,
  })
  async getBuildings(): Promise<BuildingListDto> {
    return this.buildingService.getBuildings();
  }

  @Get("id/:id")
  @ApiResponse({
    type: BuildingDto,
  })
  async getBuilding(@Param("id") id: number): Promise<BuildingDto> {
    return this.buildingService.getBuilding(id);
  }

  @Get("category/:categoryId")
  @ApiResponse({
    type: BuildingListDto,
  })
  async getBuildingsByCategory(
    @Param("categoryId") categoryId: number
  ): Promise<BuildingListDto> {
    return this.buildingService.getBuildingsByCategory(categoryId);
  }

  @Get("name/:name")
  @ApiResponse({
    type: BuildingListDto,
  })
  async getBuildingsByName(
    @Param("name") name: string
  ): Promise<BuildingListDto> {
    return this.buildingService.getBuildingsByName(name);
  }
}
