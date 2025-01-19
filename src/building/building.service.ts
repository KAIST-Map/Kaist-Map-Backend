import { BuildingDto, BuildingListDto } from "./dto/building.dto";
import { Injectable } from "@nestjs/common";
import { BuildingRepository } from "./building.repository";
import { NotFoundException } from "@nestjs/common";
import { CreateBuildingPayload } from "./payload/create-building.payload";
import { ConfigService } from "@nestjs/config";
import { UnauthorizedException } from "@nestjs/common";
import { CreateBuildingData } from "./type/create-building-data.type";
@Injectable()
export class BuildingService {
  constructor(
    private readonly buildingRepository: BuildingRepository,
    private readonly configService: ConfigService
  ) {}

  async createBuilding(
    buildingPayload: CreateBuildingPayload,
    password: string
  ): Promise<BuildingDto> {
    if (password !== this.configService.get<string>("PASSWORD")) {
      throw new UnauthorizedException("Invalid password");
    }

    const buildingData: CreateBuildingData = {
      name: buildingPayload.name,
      latitude: buildingPayload.latitude,
      longitude: buildingPayload.longitude,
      imageUrls: buildingPayload.imageUrls,
      importance: buildingPayload.importance,
      alias: buildingPayload.alias,
      categoryIds: buildingPayload.categoryIds,
    };

    const building = await this.buildingRepository.createBuilding(buildingData);
    return BuildingDto.from(building);
  }

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
