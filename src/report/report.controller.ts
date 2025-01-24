import { Controller, Post, Body } from "@nestjs/common";
import { ReportService } from "./report.service";
import { CreateReportPayload } from "./payload/report.payload";
import { ApiTags } from "@nestjs/swagger";

@Controller("report")
@ApiTags("Report")
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  async createReport(@Body() createReportPayload: CreateReportPayload) {
    return this.reportService.createReport(createReportPayload);
  }
}
