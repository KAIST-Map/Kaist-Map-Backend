import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  IsEmail,
} from "class-validator";

export class CreateReportPayload {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: "신고 제목", example: "신고 제목", type: String })
  title!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: "신고 내용",
    example: "신고 내용",
    type: String,
  })
  description!: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: "신고 전화번호",
    example: "010-1234-5678",
    type: String,
  })
  phoneNumber?: string | null;

  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional({
    description: "신고 이메일",
    example: "test@test.com",
    type: String,
  })
  email?: string | null;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    description: "신고 이미지 URL",
    example: ["image1.jpg", "image2.jpg"],
    type: [String],
  })
  imageUrls!: string[];
}
