import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  IsUrl,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateBuildingPayload {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: "건물 이름",
    example: "건물 이름",
    type: String,
  })
  name!: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: "건물 위도",
    example: 37.5656,
    type: Number,
  })
  latitude!: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: "건물 경도",
    example: 126.9724,
    type: Number,
  })
  longitude!: number;

  @IsNotEmpty()
  @IsArray()
  @IsUrl(undefined, { each: true })
  @ApiProperty({
    description: "건물 이미지 URL",
    example: ["건물 이미지 URL"],
    type: [String],
  })
  imageUrls!: string[];

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: "건물 중요도",
    example: 1,
    type: Number,
  })
  importance!: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: "건물 별칭",
    example: ["건물 별칭"],
    type: [String],
  })
  alias!: string[];

  @IsNotEmpty()
  @IsNumber({}, { each: true })
  @ApiProperty({
    description: "건물 카테고리 ID",
    example: [1, 2, 3],
    type: [Number],
  })
  categoryIds!: number[];
}
