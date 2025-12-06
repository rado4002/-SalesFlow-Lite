import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { pythonApi } from "../services/api";

interface UploadResponse {
  filename: string;
  preview: any[];
  column_types: Record<string, string>;
  validation: {
    status: string;
    errors: string[];
  };
}

export default function ExcelUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<UploadResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [commitLoading, setCommitLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // -----------------------------------------------------
  // HANDLE DROPZONE
  // -----------------------------------------------------
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selected = acceptedFiles[0];
    setFile(selected);
    uploadFile(selected);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
  });

  // -----------------------------------------------------
  // UPLOAD FILE TO FASTAPI
  // -----------------------------------------------------
  const uploadFile = async (file: File) => {
    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("upload_file", file);

      // FIX: destructuring → no unused variable
      const { data } = await pythonApi.post("/excel/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setData(data);
    } catch (err: any) {
      console.error(err);
      setMessage(err?.response?.data?.detail || "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------
  // COMMIT DATA TO JAVA (via FastAPI)
  // -----------------------------------------------------
  const commitToSalesFlow = async () => {
    if (!data) return;

    setCommitLoading(true);
    setMessage(null);

    try {
      const payload = { rows: data.preview };

      // FIX same: destructuring unnecessary → still clean
      await pythonApi.post("/excel/commit", payload);

      setMessage("✔ Data successfully imported into SalesFlow!");
    } catch (err: any) {
      console.error(err);
      setMessage("❌ Error: " + (err.response?.data?.detail || "Commit failed."));
    } finally {
      setCommitLoading(false);
    }
  };

  // -----------------------------------------------------
  // RENDER COMPONENT
  // -----------------------------------------------------
  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-gray-900">Import Excel</h1>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:bg-gray-50 transition"
      >
        <input {...getInputProps()} />
        <p className="text-gray-600">
          Drag & drop a file here, or click to select (.csv / .xlsx)
        </p>

        {file && (
          <p className="text-gray-500 text-sm mt-3">
            Selected file: <strong>{file.name}</strong>
          </p>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-blue-600 animate-pulse text-lg">Processing file… ⏳</div>
      )}

      {/* Global messages */}
      {message && (
        <div
          className={`p-4 rounded-xl text-white ${
            message.startsWith("✔") ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {message}
        </div>
      )}

      {/* Preview Result */}
      {data && (
        <div className="bg-white shadow rounded-xl p-6 border space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Preview</h2>

          <p className="font-medium text-gray-700">
            📄 <strong>File:</strong> {data.filename}
          </p>

          {/* Validation status */}
          {data.validation.status === "failed" ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-xl">
              <strong>Validation failed:</strong>
              <ul className="list-disc ml-6 mt-2 text-sm">
                {data.validation.errors.map((e, idx) => (
                  <li key={idx}>{String(e)}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="bg-green-100 text-green-700 p-4 rounded-xl">
              ✔ File validated successfully
            </div>
          )}

          {/* Preview Table */}
          <div className="overflow-auto border rounded-lg">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  {Object.keys(data.preview[0]).map((col) => (
                    <th
                      key={col}
                      className="border p-3 text-left text-sm font-semibold"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {data.preview.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    {Object.values(row).map((cell, i) => (
                      <td key={i} className="border p-2 text-sm">
                        {String(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Column Types */}
          <div>
            <h3 className="font-semibold mb-2">Column Types:</h3>
            <ul className="list-disc ml-6 text-sm">
              {Object.entries(data.column_types).map(([col, type]) => (
                <li key={col}>
                  <strong>{col}</strong>: {type}
                </li>
              ))}
            </ul>
          </div>

          {/* Commit Button */}
          {data.validation.status === "ok" && (
            <button
              onClick={commitToSalesFlow}
              className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition shadow"
              disabled={commitLoading}
            >
              {commitLoading ? "Importing…" : "Commit to SalesFlow"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
