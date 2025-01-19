import { Injectable } from "@nestjs/common";
import { BuildingData } from "./type/building-data.type";
import { PrismaService } from "../common/services/prisma.service";
import { CategoryData } from "src/category/type/category-data.type";
@Injectable()
export class BuildingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getBuildings(): Promise<BuildingData[]> {
    const buildings = await this.prisma.building.findMany({
      select: {
        id: true,
        name: true,
        latitude: true,
        longitude: true,
        imageUrl: true,
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
        imageUrl: true,
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
        imageUrl: true,
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
    return await this.prisma.building.findMany({
      where: {
        OR: [
          { name: { contains: name, mode: "insensitive" } },
          { alias: { hasSome: [`%${name}%`] } },
        ],
      },
      select: {
        id: true,
        name: true,
        latitude: true,
        longitude: true,
        imageUrl: true,
        importance: true,
        buildingCategories: {
          select: { buildingId: true, categoryId: true },
        },
        alias: true,
      },
      orderBy: [{ importance: "desc" }],
    });
  }
}
