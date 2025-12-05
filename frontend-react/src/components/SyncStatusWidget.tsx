// src/components/SyncStatusWidget.jsx
import { RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { useSyncStatus } from "../hooks/useSyncStatus";

export default function SyncStatusWidget() {
  const { state, queueCount } = useSyncStatus();

  const states = {
    online: {
      label: "Online",
      icon: <CheckCircle2 size={18} className="text-green-500" />,
      dot: "bg-green-500",
    },
    syncing: {
      label: `Syncing (${queueCount})`,
      icon: <RefreshCw size={18} className="animate-spin text-yellow-500" />,
      dot: "bg-yellow-500",
    },
    offline: {
      label: "Offline",
      icon: <AlertCircle size={18} className="text-red-500" />,
      dot: "bg-red-500",
    },
  };

  const s = states[state];

  return (
    <div
      className="
        fixed bottom-5 right-5 flex items-center gap-2
        px-4 py-2 rounded-xl bg-white/80 dark:bg-neutral-900/80 
        backdrop-blur-lg shadow-lg 
        border border-neutral-200 dark:border-neutral-700
        z-50
      "
    >
      <div className={`h-3 w-3 rounded-full ${s.dot}`} />
      {s.icon}
      <span className="text-sm font-medium text-slate-700 dark:text-gray-200">
        {s.label}
      </span>
    </div>
  );
}
