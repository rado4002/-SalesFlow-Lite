export type ReportFormat = "pdf" | "excel";
export type ReportType = "sales" | "stock" | "combined";
export type ReportPeriod = "daily" | "weekly" | "monthly";

// -------------------------------------------------
// GENERATE (manuel)
// -------------------------------------------------
export interface ReportRequestPayload {
  report_type: ReportType;
  format: ReportFormat;
  period?: ReportPeriod;
}

// -------------------------------------------------
// SCHEDULE (cron)
// -------------------------------------------------
export interface CreateScheduledReportPayload {
  report_type: ReportType;
  format: ReportFormat;
  hour: number;   // 0–23
  minute: number; // 0–59
}
