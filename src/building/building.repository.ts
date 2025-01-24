import { Injectable } from "@nestjs/common";
import { BuildingData } from "./type/building-data.type";
import { PrismaService } from "../common/services/prisma.service";
import { CategoryData } from "src/category/type/category-data.type";
import { CreateBuildingData } from "./type/create-building-data.type";
@Injectable()
export class BuildingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createBuilding(
    buildingData: CreateBuildingData
  ): Promise<BuildingData> {
    const building = await this.prisma.building.create({
      data: {
        name: buildingData.name,
        latitude: buildingData.latitude,
        longitude: buildingData.longitude,
        imageUrls: buildingData.imageUrls,
        importance: buildingData.importance,
        alias: buildingData.alias,
        buildingCategories: {
          create: buildingData.categoryIds.map((categoryId) => ({
            categoryId: categoryId,
          })),
        },
      },
      select: {
        id: true,
        name: true,
        latitude: true,
        longitude: true,
        imageUrls: true,
        importance: true,
        alias: true,
        buildingCategories: {
          select: {
            buildingId: true,
            categoryId: true,
          },
        },
      },
    });
    return building;
  }

  async getBuildings(): Promise<BuildingData[]> {
    const buildings = await this.prisma.building.findMany({
      select: {
        id: true,
        name: true,
        latitude: true,
        longitude: true,
        imageUrls: true,
        importance: true,
        alias: true,
        buildingCategories: {
          select: {
            buildingId: true,
            categoryId: true,
          },
        },
      },
    });
    return buildings;
  }

  async getBuilding(id: number): Promise<BuildingData | null> {
    const building = await this.prisma.building.findUnique({
      where: { id: id },
      select: {
        id: true,
        name: true,
        latitude: true,
        longitude: true,
        imageUrls: true,
        importance: true,
        buildingCategories: {
          select: {
            buildingId: true,
            categoryId: true,
          },
        },
        alias: true,
      },
    });
    return building;
  }

  async getBuildingsByCategory(categoryId: number): Promise<BuildingData[]> {
    const buildings = await this.prisma.building.findMany({
      where: { buildingCategories: { some: { categoryId: categoryId } } },
      select: {
        id: true,
        name: true,
        latitude: true,
        longitude: true,
        imageUrls: true,
        importance: true,
        buildingCategories: {
          select: {
            buildingId: true,
            categoryId: true,
          },
        },
        alias: true,
      },
    });
    return buildings;
  }
  async getCategory(categoryId: number): Promise<CategoryData | null> {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });
    return category;
  }

  async getBuildingsByName(inputName: string): Promise<BuildingData[]> {
    const name = inputName.toLowerCase();
    const buildings = await this.prisma.building.findMany({
      select: {
        id: true,
        name: true,
        latitude: true,
        longitude: true,
        imageUrls: true,
        importance: true,
        buildingCategories: {
          select: { buildingId: true, categoryId: true },
        },
        alias: true,
      },
      orderBy: [{ importance: "desc" }],
    });

    return buildings.filter(
      (building) =>
        building.name.toLowerCase().includes(name) ||
        building.alias.some((alias) => alias.toLowerCase().includes(name))
    );
  }
}
