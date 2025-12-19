import { pythonApi } from "./api/pythonApi";
import type {
  ReportRequestPayload,
  CreateScheduledReportPayload,
  ReportType,
  ReportFormat,
} from "../types/reports";

export const reportsAPI = {
  // -------------------------------------------------------------
  // GENERATE REPORT (MANUAL) → Blob + filename
  // -------------------------------------------------------------
  generate: async (payload: ReportRequestPayload) => {
    const res = await pythonApi.post(
      "/reports/generate",
      {
        payload,
        required_roles: [],
      },
      {
        responseType: "arraybuffer",
        headers: { "Content-Type": "application/json" },
      }
    );

    const disposition = res.headers["content-disposition"];
    if (!disposition) {
      throw new Error("Missing Content-Disposition header");
    }

    const filename =
      disposition
        .split("filename=")[1]
        ?.replace(/"/g, "")
        ?.trim();

    if (!filename) {
      throw new Error("Unable to extract filename");
    }

    return {
      file: res.data,
      filename,
      media_type: res.headers["content-type"],
    };
  },

  // -------------------------------------------------------------
  // SCHEDULE REPORT (CRON + SAVE TO DISK)
  // -------------------------------------------------------------
  schedule: async (payload: CreateScheduledReportPayload) => {
    const res = await pythonApi.post("/reports/schedule", {
      payload: {
        report_type: payload.report_type,
        format: payload.format,
        hour: payload.hour,
        minute: payload.minute,
      },
      required_roles: [],
    });

    return res.data;
  },

  // -------------------------------------------------------------
  // DOWNLOAD LAST SCHEDULED REPORT (FROM DISK)
  // -------------------------------------------------------------
  downloadLastScheduled: async (
  report_type: ReportType,
  format: ReportFormat
) => {
  const res = await pythonApi.get(
    "/reports/scheduled/latest",
    {
      params: { report_type, format },
      responseType: "arraybuffer",
    }
  );

  const disposition = res.headers["content-disposition"];
  if (!disposition) {
    throw new Error("Missing Content-Disposition header");
  }

  // 🔐 Parsing robuste (RFC 5987 + fallback)
  let filename: string | undefined;

  const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match) {
    filename = decodeURIComponent(utf8Match[1]);
  } else {
    const asciiMatch = disposition.match(/filename="?([^"]+)"?/i);
    if (asciiMatch) {
      filename = asciiMatch[1];
    }
  }

  if (!filename) {
    throw new Error("Unable to extract filename from Content-Disposition");
  }

  return {
    file: res.data,
    filename,
    media_type: res.headers["content-type"],
  };
},
}