// src/pages/ImportExcel.tsx
import { useState } from "react";
import { importExcelAPI } from "../services/importExcelAPI";

export default function ImportExcelPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await importExcelAPI.upload(file);
      setMessage(`Success: ${res.message}`);
    } catch (err: any) {
      console.error(err);
      setMessage("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-white rounded shadow max-w-2xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-4">📥 Import Excel File</h1>

      <div className="border-2 border-dashed p-6 rounded-lg text-center">
        <input
          type="file"
          accept=".xlsx,.csv"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </div>

      <button
        onClick={handleUpload}
        disabled={loading}
        className="mt-4 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Uploading…" : "Upload File"}
      </button>

      {message && (
        <p className="mt-4 text-center font-medium text-gray-700">{message}</p>
      )}
    </div>
  );
}
