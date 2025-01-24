import { Injectable } from "@nestjs/common";
import { ReportDto } from "./dto/report.dto";
import { ReportRepository } from "./report.repository";
import { ReportData } from "./type/report-data.type";
import { CreateReportPayload } from "./payload/report.payload";
import { NotificationService } from "../notification/notification.service";
@Injectable()
export class ReportService {
  constructor(
    private readonly reportRepository: ReportRepository,
    private readonly notificationService: NotificationService
  ) {}

  async createReport(payload: CreateReportPayload): Promise<ReportDto> {
    const data = {
      title: payload.title,
      description: payload.description,
      phoneNumber: payload.phoneNumber ?? null,
      email: payload.email ?? null,
      imageUrls: payload.imageUrls,
    };

    const report = await this.reportRepository.createReport(data);

    await this.notificationService.sendNewReportNotification(report);

    return ReportDto.from(report);
  }
}
