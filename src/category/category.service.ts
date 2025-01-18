import { Injectable } from "@nestjs/common";
import { CategoryRepository } from "./category.repository";
import { CategoryListDto, CategoryDto } from "./dto/category.dto";
import { NotFoundException } from "@nestjs/common";
@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

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
}
