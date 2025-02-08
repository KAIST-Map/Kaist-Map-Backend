import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber } from "class-validator";
import { EdgeData } from "../type/edge-data.type";
import { Dormitory } from "@prisma/client";
export class EdgeDto {
  @ApiProperty({
    description: "엣지 아이디",
    type: Number,
  })
  id!: number;

  @ApiProperty({
    description: "노드 1의 ID",
    type: Number,
  })
  nodeId1!: number;

  @ApiProperty({
    description: "노드 2의 ID",
    type: Number,
  })
  nodeId2!: number;

  @ApiProperty({
    description: "두 노드 사이의 거리",
    type: Number,
  })
  distance!: number;

  @ApiProperty({
    description: "비가 오지 않는 경우",
    type: Boolean,
  })
  isFreeOfRain!: boolean;

  @ApiProperty({
    description: "빔 가중치",
    type: Number,
  })
  beamWeight!: number;

  @ApiProperty({
    description: "노드 1의 기숙사 여부",
    example: "MALE",
  })
  inDormitory!: Dormitory;

  static from(edge: EdgeData): EdgeDto {
    return {
      id: edge.id,
      nodeId1: edge.nodeId1,
      nodeId2: edge.nodeId2,
      distance: edge.distance,
      isFreeOfRain: edge.isFreeOfRain,
      beamWeight: edge.beamWeight,
      inDormitory: edge.inDormitory,
    };
  }

  static fromArray(edges: EdgeData[]): EdgeDto[] {
    return edges.map((edge) => EdgeDto.from(edge));
  }
}

export class EdgeListDto {
  @ApiProperty({
    description: "엣지 목록",
    type: [EdgeDto],
  })
  edges!: EdgeDto[];

  static from(edges: EdgeData[]): EdgeListDto {
    return {
      edges: EdgeDto.fromArray(edges),
    };
  }
}
