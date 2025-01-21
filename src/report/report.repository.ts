import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/services/prisma.service";
import { CreateReportData } from "./type/report-data.type";
import { ReportData } from "./type/report-data.type";

@Injectable()
export class ReportRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createReport(data: CreateReportData): Promise<ReportData> {
    return this.prisma.report.create({
      data: {
        title: data.title,
        description: data.description,
        phoneNumber: data.phoneNumber,
        email: data.email,
        imageUrls: data.imageUrls,
      },
      select: {
        id: true,
        title: true,
        description: true,
        phoneNumber: true,
        email: true,
        imageUrls: true,
        reportStatus: true,
      },
    });
  }
}
