import { BuildingDto, BuildingListDto } from "./dto/building.dto";
import { Injectable } from "@nestjs/common";
import { BuildingRepository } from "./building.repository";
import { NotFoundException } from "@nestjs/common";
@Injectable()
export class BuildingService {
  constructor(private readonly buildingRepository: BuildingRepository) {}

  async getBuildings(): Promise<BuildingListDto> {
    const buildings = await this.buildingRepository.getBuildings();
    return BuildingListDto.from(buildings);
  }

  async getBuilding(id: number): Promise<BuildingDto> {
    const building = await this.buildingRepository.getBuilding(id);
    if (!building) {
      throw new NotFoundException("Building not found");
    }
    return BuildingDto.from(building);
  }

  async getBuildingsByCategory(categoryId: number): Promise<BuildingListDto> {
    const category = await this.buildingRepository.getCategory(categoryId);

    if (!category) {
      throw new NotFoundException("Category not found");
    }

    const buildings =
      await this.buildingRepository.getBuildingsByCategory(categoryId);

    return BuildingListDto.from(buildings);
  }

  async getBuildingsByName(name: string): Promise<BuildingListDto> {
    const buildings = await this.buildingRepository.getBuildingsByName(name);
    return BuildingListDto.from(buildings);
  }
}
