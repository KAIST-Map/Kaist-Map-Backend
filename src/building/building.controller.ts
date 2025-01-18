import { Controller, Get, Param } from "@nestjs/common";
import { BuildingService } from "./building.service";
import { BuildingDto } from "./dto/building.dto";
import { ApiTags, ApiResponse } from "@nestjs/swagger";
import { BuildingListDto } from "./dto/building.dto";
@Controller("building")
@ApiTags("Building")
export class BuildingController {
  constructor(private readonly buildingService: BuildingService) {}

  @Get()
  @ApiResponse({
    type: BuildingListDto,
  })
  async getBuildings(): Promise<BuildingListDto> {
    return this.buildingService.getBuildings();
  }

  @Get(":id")
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
}
