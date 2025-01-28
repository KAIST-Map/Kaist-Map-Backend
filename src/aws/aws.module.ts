import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AwsService } from "./aws.service";
import { AwsController } from "./aws.controller";

@Module({
  imports: [ConfigModule],
  providers: [AwsService],
  exports: [AwsService],
  controllers: [AwsController],
})
export class AwsS3Module {}
