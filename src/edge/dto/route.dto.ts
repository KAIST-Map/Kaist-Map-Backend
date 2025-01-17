import { ApiProperty } from "@nestjs/swagger";
import { EdgeDto } from "./edge.dto";

export class RouteDto {
  @ApiProperty({
    description: "경로상의 엣지들",
    type: [EdgeDto],
  })
  path!: EdgeDto[];

  @ApiProperty({
    description: "총 이동 거리",
    type: Number,
  })
  totalDistance!: number;

  static from(path: EdgeDto[], totalDistance: number): RouteDto {
    return {
      path,
      totalDistance,
    };
  }
}
