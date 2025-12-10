// src/types/reports.ts

export type ReportFormat = "pdf" | "excel";
export type ReportType = "sales" | "stock" | "combined";
export type ReportPeriod = "daily" | "weekly" | "monthly";

export interface ReportRequestPayload {
  format: ReportFormat;
  report_type: ReportType;
  period: ReportPeriod;
}

export interface ReportResponse {
  job_id?: string; // selon ton implémentation Python
  file?: BlobPart;
  filename: string;
  media_type: string;
}
