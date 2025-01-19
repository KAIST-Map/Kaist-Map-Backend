import { Injectable } from "@nestjs/common";
import { CategoryRepository } from "./category.repository";
import { CategoryListDto, CategoryDto } from "./dto/category.dto";
import { NotFoundException } from "@nestjs/common";
import { CreateCategoryPayload } from "./payload/create-category-payload";
import { CreateCategoryData } from "./type/create-category-data.type";
import { ConfigService } from "@nestjs/config";
import { UnauthorizedException } from "@nestjs/common";

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly configService: ConfigService
  ) {}

  async getCategories(): Promise<CategoryListDto> {
    const categories = await this.categoryRepository.getCategories();
    return CategoryListDto.from(categories);
  }

  async getCategory(id: number): Promise<CategoryDto> {
    const category = await this.categoryRepository.getCategory(id);
    if (!category) {
      throw new NotFoundException("Category not found");
    }
    return CategoryDto.from(category);
  }

  async createCategory(
    createCategoryPayload: CreateCategoryPayload,
    password: string
  ): Promise<CategoryDto> {
    if (password !== this.configService.get<string>("PASSWORD")) {
      throw new UnauthorizedException("Invalid password");
    }

    const categoryData: CreateCategoryData = {
      name: createCategoryPayload.name,
    };

    const category = await this.categoryRepository.createCategory(categoryData);
    return CategoryDto.from(category);
  }
}
