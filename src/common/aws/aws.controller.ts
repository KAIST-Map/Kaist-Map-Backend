import { Controller, Get, Query } from "@nestjs/common";
import { AwsService } from "./aws.service";

@Controller("aws")
export class AwsController {
  constructor(private readonly awsService: AwsService) {}

  @Get("s3")
  getPresignedUrl(@Query("fileName") fileName: string) {
    // fileName을 Query로 전달받았다고 가정
    return this.awsService.getPresignedUrl(fileName);
  }
}
