import { Controller, Post, Body } from "@nestjs/common";
import { ReportService } from "./report.service";
import { CreateReportPayload } from "./payload/report.payload";

@Controller("report")
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  async createReport(@Body() createReportPayload: CreateReportPayload) {
    return this.reportService.createReport(createReportPayload);
  }
}
