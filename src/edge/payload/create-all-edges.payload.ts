import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsBoolean, ValidateNested, IsArray } from "class-validator";
import { Type } from "class-transformer";

class AllEdgePayload {
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    description: "엣지 아이디",
    example: 1,
    type: Number,
  })
  id!: number;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    description: "노드 아이디 1",
    example: 1,
    type: Number,
  })
  nodeId1!: number;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    description: "노드 아이디 2",
    example: 2,
    type: Number,
  })
  nodeId2!: number;

  @IsBoolean()
  @Type(() => Boolean)
  @ApiProperty({
    description: "비가 오지 않는 엣지인지",
    example: true,
    type: Boolean,
  })
  isFreeOfRain!: boolean;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    description: "거리",
    example: 100,
    type: Number,
  })
  distance!: number;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    description: "빔 가중치",
    example: 100,
    type: Number,
  })
  beamWeight!: number;
}

export class CreateAllEdgesPayload {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AllEdgePayload)
  @ApiProperty({
    description: "엣지 배열",
    type: [AllEdgePayload],
  })
  edges!: AllEdgePayload[];
}
