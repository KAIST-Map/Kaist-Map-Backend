import { IsNotEmpty, IsNumber, IsBoolean } from "class-validator";
import { Type, Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
export class CreateEdgePayload {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    description: "노드1 아이디",
    example: 1,
    type: Number,
  })
  nodeId1!: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    description: "노드2 아이디",
    example: 2,
    type: Number,
  })
  nodeId2!: number;

  @IsBoolean()
  @Transform(({ value }) => value === "true")
  @ApiProperty({
    description: "비가 오지 않는 도로인지",
    example: true,
    type: Boolean,
  })
  isFreeOfRain!: boolean;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    description: "빔 가중치",
    example: 100,
    type: Number,
  })
  beamWeight!: number;
}
