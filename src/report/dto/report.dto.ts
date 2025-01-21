import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ReportStatus } from "@prisma/client";
import { ReportData } from "../type/report-data.type";

export class ReportDto {
  @ApiProperty({
    description: "신고 ID",
    example: 1,
    type: Number,
  })
  id!: number;

  @ApiProperty({
    description: "신고 제목",
    example: "신고 제목",
    type: String,
  })
  title!: string;

  @ApiProperty({
    description: "신고 내용",
    example: "신고 내용",
    type: String,
  })
  description!: string;

  @ApiPropertyOptional({
    description: "신고 전화번호",
    example: "010-1234-5678",
    type: String,
    nullable: true,
  })
  phoneNumber?: string | null;

  @ApiPropertyOptional({
    description: "신고 이메일",
    example: "test@test.com",
    type: String,
    nullable: true,
  })
  email?: string | null;

  @ApiProperty({
    description: "신고 이미지 URL",
    example: ["image1.jpg", "image2.jpg"],
    type: [String],
  })
  imageUrls!: string[];

  @ApiProperty({
    description: "신고 상태",
    example: "PENDING",
    enum: ReportStatus,
  })
  reportStatus!: ReportStatus;

  static from(reportData: ReportData): ReportDto {
    return {
      id: reportData.id,
      title: reportData.title,
      description: reportData.description,
      phoneNumber: reportData.phoneNumber,
      email: reportData.email,
      imageUrls: reportData.imageUrls,
      reportStatus: reportData.reportStatus,
    };
  }
}
