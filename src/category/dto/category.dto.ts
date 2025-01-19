import { ApiProperty } from "@nestjs/swagger";
import { CategoryData } from "../type/category-data.type";
export class CategoryDto {
  @ApiProperty({
    description: "Category ID",
    example: 1,
  })
  id!: number;

  @ApiProperty({
    description: "Category Name",
    example: "도서관",
  })
  name!: string;

  static from(category: CategoryData): CategoryDto {
    return {
      id: category.id,
      name: category.name,
    };
  }

  static fromArray(categories: CategoryData[]): CategoryDto[] {
    return categories.map((category) => CategoryDto.from(category));
  }
}

export class CategoryListDto {
  @ApiProperty({
    description: "Category List",
    type: [CategoryDto],
  })
  categories!: CategoryDto[];

  static from(categories: CategoryData[]): CategoryListDto {
    return {
      categories: CategoryDto.fromArray(categories),
    };
  }
}
