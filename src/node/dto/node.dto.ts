import { ApiProperty } from "@nestjs/swagger";
import { NodeData } from "../type/node-data.type";

export class NodeDto {
  @ApiProperty({
    description: "노드 ID",
    example: 1,
  })
  id!: number;

  @ApiProperty({
    description: "노드 이름",
    example: "Node 1",
  })
  name!: string;

  @ApiProperty({
    description: "노드 위도",
    example: 37.4123,
  })
  latitude!: number;

  @ApiProperty({
    description: "노드 경도",
    example: 127.1234,
  })
  longitude!: number;

  @ApiProperty({
    description: "노드 이미지 URL",
    nullable: true,
    example: "https://example.com/image.jpg",
  })
  imageUrl?: string | null;

  @ApiProperty({
    description: "노드 건물 ID",
    nullable: true,
    example: 1,
  })
  buildingId?: number | null;

  static from(node: NodeData): NodeDto {
    return {
      id: node.id,
      name: node.name,
      latitude: node.latitude,
      longitude: node.longitude,
      buildingId: node.buildingId,
    };
  }

  static fromArray(nodes: NodeData[]): NodeDto[] {
    return nodes.map((node) => NodeDto.from(node));
  }
}

export class NodeListDto {
  @ApiProperty({
    description: "노드 목록",
    type: [NodeDto],
  })
  nodes!: NodeDto[];

  static from(nodes: NodeData[]): NodeListDto {
    return {
      nodes: NodeDto.fromArray(nodes),
    };
  }
}
