import { ApiProperty } from "@nestjs/swagger";
import { NodeDto } from "./node.dto";
import { RouteData } from "../type/route-data-type";

export class RouteDto {
  @ApiProperty({
    description: "경로상의 노드들",
    type: [NodeDto],
  })
  path!: NodeDto[];

  @ApiProperty({
    description: "총 이동 거리",
    type: Number,
  })
  totalDistance!: number;

  static from(RouteData: RouteData): RouteDto {
    return {
      path: NodeDto.fromArray(RouteData.path),
      totalDistance: RouteData.totalDistance,
    };
  }
}
