import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, IsArray, IsUrl, IsEnum } from "class-validator";

export enum ReportStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export class CreateReportedRoadPayload {
  @IsNumber()
  @ApiProperty({
    description: "위도1",
    example: 37.5656,
    type: Number,
  })
  latitude1!: number;

  @IsNumber()
  @ApiProperty({
    description: "경도1",
    example: 126.9724,
    type: Number,
  })
  longitude1!: number;

  @IsNumber()
  @ApiProperty({
    description: "위도2",
    example: 37.5656,
    type: Number,
  })
  latitude2!: number;

  @IsNumber()
  @ApiProperty({
    description: "경도2",
    example: 126.9724,
    type: Number,
  })
  longitude2!: number;

  @IsArray()
  @IsUrl(undefined, { each: true })
  @ApiProperty({
    description: "이미지 주소",
    example: ["이미지 주소"],
    type: [String],
  })
  imageUrls!: string[];

  @IsString()
  @ApiProperty({
    description: "설명",
    example: "설명",
    type: String,
    nullable: true,
  })
  description?: string | null;

  @IsEnum(ReportStatus)
  @ApiProperty({
    description: "신고 상태",
    example: ReportStatus.PENDING,
    enum: ReportStatus,
  })
  reportStatus!: ReportStatus;
}
