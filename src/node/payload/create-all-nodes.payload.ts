import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsNumber,
  IsString,
  ValidateNested,
  IsArray,
  IsOptional,
} from "class-validator";
import { Type } from "class-transformer";

class AllNodePayload {
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    description: "노드 아이디",
    example: 1,
    type: Number,
  })
  id!: number;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    description: "노드 위도",
    example: 37.4,
    type: Number,
  })
  latitude!: number;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    description: "노드 경도",
    example: 127.1,
    type: Number,
  })
  longitude!: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({
    description: "건물 아이디",
    example: 1,
    type: Number,
    nullable: true,
  })
  buildingId?: number | null;

  @IsString()
  @ApiProperty({
    description: "노드 이름",
    example: "노드 이름",
    type: String,
  })
  name!: string;
}

export class CreateAllNodesPayload {
  @ApiProperty({
    description: "노드 배열",
    type: [AllNodePayload],
  })
  @Type(() => AllNodePayload)
  @ValidateNested({ each: true }) // 이 데코레이터 추가
  @IsArray()
  nodes!: AllNodePayload[];
}
