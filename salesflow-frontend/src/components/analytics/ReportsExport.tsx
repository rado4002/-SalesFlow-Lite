// src/components/analytics/ReportsExport.tsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { reportsAPI } from "../../services/reportsAPI";
import type {
  ReportFormat,
  ReportType,
  ReportPeriod,
} from "../../types/reports";

export default function ReportsExport() {
  const { t } = useTranslation();

  const [format, setFormat] = useState<ReportFormat>("pdf");
  const [reportType, setReportType] = useState<ReportType>("combined");
  const [period, setPeriod] = useState<ReportPeriod>("daily");
  const [loading, setLoading] = useState(false);

  const [hour, setHour] = useState<number>(8);
  const [minute, setMinute] = useState<number>(0);
  const [scheduling, setScheduling] = useState(false);

  // -----------------------------
  // MANUAL GENERATION
  // -----------------------------
const generateNow = async () => {
  setLoading(true);

  try {
    const res = await reportsAPI.generate({
      report_type: reportType,
      format,
      period,
    });

    // 🔽 Téléchargement direct dans le navigateur
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
  }
  // -----------------------------
  // SCHEDULE REPORT
  // -----------------------------
  const scheduleReport = async () => {
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      alert(t("reports.messages.invalidTime"));
      return;
    }

    setScheduling(true);
    try {
      const res = await reportsAPI.schedule({
        report_type: reportType,
        format,
        hour,
        minute,
      });

      alert(
        t("reports.messages.scheduled", {
          time: `${hour.toString().padStart(2, "0")}:${minute
            .toString()
            .padStart(2, "0")}`,
          job: res.job_id,
        })
      );
    } catch (err) {
      alert(t("reports.messages.scheduleError"));
      console.error(err);
    } finally {
      setScheduling(false);
    }
  };

  // -----------------------------
  // DOWNLOAD LAST SCHEDULED
  // -----------------------------
  const downloadLastScheduled = async () => {
    setLoading(true);
    try {
      const res = await reportsAPI.downloadLastScheduled(reportType, format);

      // Sécurité : vérifier que la réponse contient bien un fichier binaire
      if (!res.file || !(res.file instanceof ArrayBuffer || res.file instanceof Blob)) {
        throw new Error("Invalid file data received from server");
      }

      // Utiliser le media_type renvoyé par le backend, avec fallback sécurisé
      const contentType = res.media_type || 
        (format === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

      // Créer le Blob à partir des données binaires
      const blob = new Blob([res.file], { type: contentType });

      // Créer l'URL objet
      const url = window.URL.createObjectURL(blob);

      // Créer le lien <a> invisible
      const a = document.createElement("a");
      a.href = url;
      a.download = res.filename || `scheduled_${reportType}_${new Date().toISOString().split('T')[0]}.${format}`;

      // Crucial : ajouter au DOM avant le click (nécessaire sur Firefox et certains Chrome)
      document.body.appendChild(a);
      a.click();

      // Nettoyage immédiat
      a.remove();
      window.URL.revokeObjectURL(url);

      // Feedback positif à l'utilisateur
      // alert("✅ Last scheduled report downloaded successfully!");
    } catch (err: any) {
      console.error("Download failed:", err);

      // Message plus précis selon le type d'erreur
      if (err.response?.status === 404) {
        alert(t("reports.messages.noScheduled"));
      } else {
        alert(t("reports.messages.downloadError"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow p-6 rounded mt-8 max-w-xl">
      <h3 className="text-xl font-bold mb-4">
        {t("reports.title")}
      </h3>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <select value={format} onChange={(e) => setFormat(e.target.value as ReportFormat)}>
          <option value="pdf">{t("reports.format.pdf")}</option>
          <option value="excel">{t("reports.format.excel")}</option>
        </select>

        <select value={reportType} onChange={(e) => setReportType(e.target.value as ReportType)}>
          <option value="sales">{t("reports.type.sales")}</option>
          <option value="stock">{t("reports.type.stock")}</option>
          <option value="combined">{t("reports.type.combined")}</option>
        </select>

        <select value={period} onChange={(e) => setPeriod(e.target.value as ReportPeriod)}>
          <option value="daily">{t("reports.period.daily")}</option>
          <option value="weekly">{t("reports.period.weekly")}</option>
          <option value="monthly">{t("reports.period.monthly")}</option>
        </select>
      </div>

      <button onClick={generateNow} className="btn-primary w-full mb-4" disabled={loading}>
        {loading ? t("reports.buttons.generating") : t("reports.buttons.generate")}
      </button>

      <div className="border-t pt-4">
        <h4 className="font-semibold mb-2">
          {t("reports.schedule.title")}
        </h4>

        <div className="flex gap-4 mb-4">
          <input type="number" min={0} max={23} value={hour} onChange={(e) => setHour(+e.target.value)} />
          <input type="number" min={0} max={59} value={minute} onChange={(e) => setMinute(+e.target.value)} />
        </div>

        <button onClick={scheduleReport} className="btn-secondary w-full" disabled={scheduling}>
          {scheduling ? t("reports.buttons.scheduling") : t("reports.buttons.schedule")}
        </button>
      </div>

      <div className="border-t pt-4 mt-4">
        <h4 className="font-semibold mb-2">
          {t("reports.download.title")}
        </h4>
        <button onClick={downloadLastScheduled} className="btn-outline w-full" disabled={loading}>
          {loading ? t("reports.buttons.downloading") : t("reports.buttons.download")}
        </button>
      </div>
    </div>
  );
}