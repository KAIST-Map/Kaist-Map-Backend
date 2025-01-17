import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class RoutePayload {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: "시작 노드 ID",
    type: Number,
  })
  startNodeId!: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: "도착 노드 ID",
    type: Number,
  })
  endNodeId!: number;
}
