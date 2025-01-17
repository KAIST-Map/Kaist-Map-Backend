import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber } from "class-validator";
import { EdgeData } from "../type/node-data.type";

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

  static from(node: NodeData): NodeDto {
    return {
      id: node.id,
      name: node.name,
      latitude: node.latitude,
      longitude: node.longitude,
      imageUrl: node.imageUrl,
    };
  }
}
