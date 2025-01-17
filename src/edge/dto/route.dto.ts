import { ApiProperty } from "@nestjs/swagger";
import { EdgeDto } from "./edge.dto";
import { RouteData } from "../type/route-data-type";

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

  static from(RouteData: RouteData): RouteDto {
    return {
      path: EdgeDto.fromArray(RouteData.path),
      totalDistance: RouteData.totalDistance,
    };
  }
}
