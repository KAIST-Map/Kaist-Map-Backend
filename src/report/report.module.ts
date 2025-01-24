import { Module } from "@nestjs/common";
import { ReportService } from "./report.service";
import { ReportRepository } from "./report.repository";
import { ReportController } from "./report.controller";
import { NotificationModule } from "../notification/notification.module";
@Module({
  imports: [NotificationModule],
  providers: [ReportService, ReportRepository],
  controllers: [ReportController],
})
export class ReportModule {}
