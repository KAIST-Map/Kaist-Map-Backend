import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsBoolean } from "class-validator";

export class RoutePayload {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: "시작 노드 위도",
    type: Number,
  })
  startLatitude!: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: "시작 노드 경도",
    type: Number,
  })
  startLongitude!: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: "도착 노드 위도",
    type: Number,
  })
  endLatitude!: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: "도착 노드 경도",
    type: Number,
  })
  endLongitude!: number;

  @IsBoolean()
  @ApiProperty({
    description: "비맞지 않는 경로 여부",
    type: Boolean,
  })
  wantFreeOfRain!: boolean;

  @IsBoolean()
  @ApiProperty({
    description: "빔 타는지 여부",
    type: Boolean,
  })
  wantBeam!: boolean;
}
