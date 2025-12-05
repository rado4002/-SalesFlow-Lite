// src/hooks/useSyncStatus.ts
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getQueueLength, getIsSyncing } from "../offline/syncQueue";

export type SyncState = "online" | "syncing" | "offline";

export function useSyncStatus(): { state: SyncState; queueCount: number } {
  const { isOnline } = useAuth();
  const [queueCount, setQueueCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const update = async () => {
      setQueueCount(await getQueueLength());
      setIsSyncing(getIsSyncing());
    };

    update();
    const handler = () => update();
    window.addEventListener("online", handler);
    window.addEventListener("offline", handler);
    window.addEventListener("syncQueueChange", handler);

    return () => {
      window.removeEventListener("online", handler);
      window.removeEventListener("offline", handler);
      window.removeEventListener("syncQueueChange", handler);
    };
  }, [isOnline]);

  if (!isOnline) return { state: "offline", queueCount };
  if (isSyncing) return { state: "syncing", queueCount };
  return { state: "online", queueCount };
}