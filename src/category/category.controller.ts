import { Controller, Get, Param } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CategoryListDto } from "./dto/category.dto";
import { ApiTags } from "@nestjs/swagger";
import { CategoryDto } from "./dto/category.dto";
import { CreateCategoryPayload } from "./payload/create-category-payload";
import { Body, Post } from "@nestjs/common";

@Controller("category")
@ApiTags("Category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post("category/:password")
  async createCategory(
    @Body() createCategoryPayload: CreateCategoryPayload,
    @Param("password") password: string
  ): Promise<CategoryDto> {
    return this.categoryService.createCategory(createCategoryPayload, password);
  }

  @Get()
  async getCategories(): Promise<CategoryListDto> {
    return this.categoryService.getCategories();
  }

  @Get(":id")
  async getCategory(@Param("id") id: number): Promise<CategoryDto> {
    return this.categoryService.getCategory(id);
  }
}
