// notification.service.ts
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { ReportData } from "src/report/type/report-data.type";

@Injectable()
export class NotificationService {
  private readonly webhookUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.webhookUrl = this.configService.get<string>("DISCORD_WEBHOOK_URL")!;
  }

  async sendNewReportNotification(report: ReportData) {
    try {
      const embeds =
        report.imageUrls?.map((url) => ({
          image: { url },
        })) || [];

      await axios.post(this.webhookUrl, {
        content: `🔔 새로운 Report가 등록되었습니다!\n\n제목: ${report.title}\n설명: ${report.description}${report.phoneNumber ? `\n연락처: ${report.phoneNumber}` : ""}${report.email ? `\n이메일: ${report.email}` : ""}`,
        embeds: embeds,
      });
      console.log("디스코드 알림 전송 성공");
    } catch (error) {
      console.error("디스코드 알림 전송 실패:", error);
    }
  }
}
