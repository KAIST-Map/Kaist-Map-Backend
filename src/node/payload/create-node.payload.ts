import { IsNotEmpty, IsString, IsNumber, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class CreateNodePayload {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: "노드 이름",
    type: String,
  })
  name!: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    description: "노드 위도",
    type: Number,
  })
  latitude!: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    description: "노드 경도",
    type: Number,
  })
  longitude!: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({
    description: "노드 건물 ID",
    type: Number,
    nullable: true,
  })
  buildingId?: number | null;
}
