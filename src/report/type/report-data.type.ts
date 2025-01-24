import { ReportStatus } from "@prisma/client";

export type ReportData = {
  id: number;
  title: string;
  description: string;
  phoneNumber: string | null;
  email: string | null;
  imageUrls: string[];
  reportStatus: ReportStatus;
};

export type CreateReportData = {
  title: string;
  description: string;
  phoneNumber: string | null;
  email: string | null;
  imageUrls: string[];
};
