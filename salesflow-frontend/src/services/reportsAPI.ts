// src/services/reportsAPI.ts

import { pythonApi } from "./api/pythonApi";
import type { ReportRequestPayload } from "../types/reports";

export const reportsAPI = {
  // -------------------------------------------------------------
  // GENERATE REPORT → retourne Blob PDF/Excel + filename
  // -------------------------------------------------------------
  generate: async (payload: ReportRequestPayload) => {
    console.log("📤 Sending REPORT payload =", payload);

    // ⭐⭐ WRAPPER OBLIGATOIRE ⭐⭐
    const wrapped = {
      payload,
      required_roles: [],
    };

    const res = await pythonApi.post(
      "/reports/generate",
      wrapped,
      {
        responseType: "arraybuffer", // <-- OBLIGATOIRE pour PDF/Excel
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // -----------------------------------------------------
    // Extract filename from Content-Disposition
    // -----------------------------------------------------
    const disposition = res.headers["content-disposition"];
    const filename =
      disposition?.split("filename=")[1]?.replace(/"/g, "") ??
      `report.${payload.format}`;

    return {
      file: res.data,
      filename,
      media_type: res.headers["content-type"],
    };
  },

  // -------------------------------------------------------------
  // STATUS JOB ASYNC (optionnel)
  // -------------------------------------------------------------
  getStatus: async (jobId: string) => {
    const res = await pythonApi.get(`/reports/status/${jobId}`);
    return res.data;
  },
};
