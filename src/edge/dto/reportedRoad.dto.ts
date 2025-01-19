import { ApiProperty } from "@nestjs/swagger";
import { ReportStatus } from "@prisma/client";
import { ReportedRoadData } from "../type/reportedRoadData.type";
export class ReportedRoadDto {
  @ApiProperty({
    description: "신고 아이디",
    type: Number,
  })
  id!: number;

  @ApiProperty({
    description: "위도1",
    type: Number,
  })
  latitude1!: number;

  @ApiProperty({
    description: "경도1",
    type: Number,
  })
  longitude1!: number;

  @ApiProperty({
    description: "위도2",
    type: Number,
  })
  latitude2!: number;

  @ApiProperty({
    description: "경도2",
    type: Number,
  })
  longitude2!: number;

  @ApiProperty({
    description: "이미지 주소",
    type: [String],
  })
  imageUrls!: string[];

  @ApiProperty({
    description: "신고 상태",
    enum: ReportStatus,
  })
  reportStatus!: ReportStatus;

  @ApiProperty({
    description: "설명",
    type: String,
    nullable: true,
  })
  description?: string | null;

  static from(reportedRoad: ReportedRoadData): ReportedRoadDto {
    return {
      id: reportedRoad.id,
      latitude1: reportedRoad.latitude1,
      longitude1: reportedRoad.longitude1,
      latitude2: reportedRoad.latitude2,
      longitude2: reportedRoad.longitude2,
      imageUrls: reportedRoad.imageUrls,
      reportStatus: reportedRoad.reportStatus,
      description: reportedRoad.description,
    };
  }

  static fromArray(reportedRoads: ReportedRoadData[]): ReportedRoadDto[] {
    return reportedRoads.map((reportedRoad) =>
      ReportedRoadDto.from(reportedRoad)
    );
  }
}

export class ReportedRoadListDto {
  @ApiProperty({
    description: "신고 목록",
    type: [ReportedRoadDto],
  })
  reportedRoads!: ReportedRoadDto[];
}
