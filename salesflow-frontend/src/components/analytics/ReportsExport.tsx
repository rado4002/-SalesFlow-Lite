import { useState } from "react";
import { reportsAPI } from "../../services/reportsAPI";
import type { ReportFormat, ReportType, ReportPeriod } from "../../types/reports";

export default function ReportsExport() {
  const [format, setFormat] = useState<ReportFormat>("pdf");
  const [reportType, setReportType] = useState<ReportType>("combined");
  const [period, setPeriod] = useState<ReportPeriod>("daily");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);

    try {
      const res = await reportsAPI.generate({
        format,
        report_type: reportType,
        period,
      });

      const blob = new Blob([res.file], { type: res.media_type });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = res.filename;
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("❌ Report generation failed", err);
      alert("Error generating report. Check console.");
    }

    setLoading(false);
  };

  return (
    <div className="bg-white shadow p-4 rounded mt-8">
      <h3 className="text-xl font-bold mb-3">📄 Export Reports</h3>

      <div className="grid grid-cols-3 gap-4">
        
        {/* FORMAT */}
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value as ReportFormat)}
        >
          <option value="pdf">PDF</option>
          <option value="excel">Excel</option>
        </select>

        {/* TYPE */}
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value as ReportType)}
        >
          <option value="sales">Sales only</option>
          <option value="stock">Stock only</option>
          <option value="combined">Sales + Stock</option>
        </select>

        {/* PERIOD */}
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as ReportPeriod)}
        >
          <option value="daily">Today</option>
          <option value="weekly">Last 7 days</option>
          <option value="monthly">This month</option>
        </select>
      </div>

      <button
        onClick={generate}
        className="btn-primary mt-4"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Report"}
      </button>
    </div>
  );
}
