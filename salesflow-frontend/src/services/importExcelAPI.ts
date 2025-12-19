// src/services/importExcelAPI.ts

import { pythonApi } from "./api/pythonApi";

export interface ImportExcelResponse {
  message: string;
  imported_rows?: number;
  errors?: string[];
}

export const importExcelAPI = {
  upload: async (file: File): Promise<ImportExcelResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await pythonApi.post("/excel/import-sales", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data as ImportExcelResponse;
  },
};
