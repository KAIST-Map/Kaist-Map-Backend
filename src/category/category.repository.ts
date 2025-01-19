import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/services/prisma.service";
import { CategoryData } from "./type/category-data.type";
import { CreateCategoryData } from "./type/create-category-data.type";
@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createCategory(
    categoryData: CreateCategoryData
  ): Promise<CategoryData> {
    const category = await this.prisma.category.create({
      data: categoryData,
    });
    return category;
  }

  async getCategories(): Promise<CategoryData[]> {
    const categories = await this.prisma.category.findMany();
    return categories;
  }

  async getCategory(id: number): Promise<CategoryData | null> {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    return category;
  }
}
