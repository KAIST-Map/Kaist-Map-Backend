import { ApiProperty } from "@nestjs/swagger";
import { BuildingData } from "../type/building-data.type";
import { CategoryDto } from "src/category/dto/category.dto";
export class BuildingDto {
  @ApiProperty({
    description: "건물 ID",
    example: 1,
    type: Number,
  })
  id!: number;

  @ApiProperty({
    description: "건물 이름",
    example: "Building 1",
    type: String,
  })
  name!: string;

  @ApiProperty({
    description: "건물 이미지 URL들",
    example: [
      "https://example.com/image.jpg",
      "https://example.com/image2.jpg",
    ],
    type: [String],
  })
  imageUrl!: string[];

  @ApiProperty({
    description: "건물 중요도",
    example: 1,
    type: Number,
  })
  importance!: number;

  @ApiProperty({
    description: "건물 위도",
    example: 37.123456,
    type: Number,
  })
  latitude!: number;

  @ApiProperty({
    description: "건물 경도",
    example: 127.123456,
    type: Number,
  })
  longitude!: number;

  @ApiProperty({
    description: "건물 카테고리id들",
    example: [1, 2, 3],
    type: [Number],
  })
  categoryIds!: number[];

  @ApiProperty({
    description: "건물 별칭",
    example: ["Building 1", "Building 2"],
    type: [String],
  })
  alias!: string[];

  static from(building: BuildingData): BuildingDto {
    return {
      id: building.id,
      name: building.name,
      imageUrl: building.imageUrl,
      importance: building.importance,
      latitude: building.latitude,
      longitude: building.longitude,
      categoryIds: building.buildingCategories.map(
        (category) => category.categoryId
      ),
      alias: building.alias,
    };
  }

  static fromArray(buildings: BuildingData[]): BuildingDto[] {
    return buildings.map((building) => BuildingDto.from(building));
  }
}
export class BuildingListDto {
  @ApiProperty({
    description: "건물 목록",
    type: [BuildingDto],
  })
  buildings!: BuildingDto[];

  static from(buildings: BuildingData[]): BuildingListDto {
    return {
      buildings: BuildingDto.fromArray(buildings),
    };
  }
}
