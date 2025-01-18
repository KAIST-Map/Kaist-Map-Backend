import { Controller, Get, Param } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CategoryListDto } from "./dto/category.dto";
import { ApiTags } from "@nestjs/swagger";
import { CategoryDto } from "./dto/category.dto";

@Controller("category")
@ApiTags("Category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getCategories(): Promise<CategoryListDto> {
    return this.categoryService.getCategories();
  }

  @Get(":id")
  async getCategory(@Param("id") id: number): Promise<CategoryDto> {
    return this.categoryService.getCategory(id);
  }
}
