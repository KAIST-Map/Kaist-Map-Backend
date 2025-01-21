import { Module } from "@nestjs/common";
import { ReportService } from "./report.service";
import { ReportRepository } from "./report.repository";
import { ReportController } from "./report.controller";

@Module({
  providers: [ReportService, ReportRepository],
  controllers: [ReportController],
})
export class ReportModule {}
