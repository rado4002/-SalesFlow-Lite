// src/offline/useOfflineInventory.js
import { useEffect, useState } from "react";
import api from "../api/http";
import { idbGetAll, idbPut, idbDelete } from "./idb";
import { enqueueSyncOp, startQueueProcessor } from "./syncQueue";

const STORE = "inventory";

export default function useOfflineInventory() {
  const [items, setItems] = useState([]);
  const [syncing, setSyncing] = useState(false);

  // load from IDB first
  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      // start queue processing (background)
      startQueueProcessor({ intervalMs: 3000 });

      const local = await idbGetAll(STORE);
      if (!mounted) return;
      setItems(local || []);

      // if online, fetch remote and reconcile (simple strategy: prefer remote)
      if (navigator.onLine) {
        try {
          const res = await api.get("/inventory");
          const remote = res.data || [];
          // store remote snapshot locally
          for (const r of remote) {
            await idbPut(STORE, r);
          }
          const updatedLocal = await idbGetAll(STORE);
          if (mounted) setItems(updatedLocal);
        } catch (e) {
          // keep local
          console.warn("Failed to fetch remote inventory:", e);
        }
      }
    }

    bootstrap();
    return () => { mounted = false; };
  }, []);

  // Create
  async function createItem(payload) {
    // assign client id if not present (server will override id in remote)
    const toSave = { ...payload, id: payload.id || `cli-${Date.now()}` };

    // save locally
    await idbPut(STORE, toSave);
    setItems((s) => [...s.filter(i => i.id !== toSave.id), toSave]);

    // enqueue to backend
    if (navigator.onLine) {
      try {
        // attempt immediate online create
        const res = await api.post("/inventory", payload);
        const serverItem = res.data;
        // replace local entry with server-provided ID if changed
        await idbPut(STORE, serverItem);
        setItems((s) => s.map(i => (i.id === toSave.id ? serverItem : i)));
      } catch (err) {
        // fallback: enqueue for later
        await enqueueSyncOp({ method: "POST", path: "/api/v1/inventory", body: payload });
      }
    } else {
      await enqueueSyncOp({ method: "POST", path: "/api/v1/inventory", body: payload });
    }
  }

  // Update
  async function updateItem(id, patch) {
    const existing = (await idbGetAll(STORE)).find(i => i.id === id);
    const merged = { ...(existing || {}), ...patch, id };
    await idbPut(STORE, merged);
    setItems((s) => s.map(i => (i.id === id ? merged : i)));

    if (navigator.onLine) {
      try {
        await api.put(`/inventory/${id}`, merged);
      } catch (err) {
        await enqueueSyncOp({ method: "PUT", path: `/api/v1/inventory/${id}`, body: merged });
      }
    } else {
      await enqueueSyncOp({ method: "PUT", path: `/api/v1/inventory/${id}`, body: merged });
    }
  }

  // Delete
  async function deleteItem(id) {
    await idbDelete(STORE, id);
    setItems((s) => s.filter(i => i.id !== id));
    if (navigator.onLine) {
      try {
        await api.delete(`/inventory/${id}`);
      } catch (err) {
        await enqueueSyncOp({ method: "DELETE", path: `/api/v1/inventory/${id}`, body: null });
      }
    } else {
      await enqueueSyncOp({ method: "DELETE", path: `/api/v1/inventory/${id}`, body: null });
    }
  }

  return {
    items,
    syncing,
    createItem,
    updateItem,
    deleteItem,
    refresh: async () => {
      // manual refresh: fetch remote and update local
      if (!navigator.onLine) return false;
      try {
        setSyncing(true);
        const res = await api.get("/inventory");
        const remote = res.data || [];
        for (const r of remote) await idbPut(STORE, r);
        const local = await idbGetAll(STORE);
        setItems(local);
        return true;
      } catch (e) {
        console.warn("Refresh failed:", e);
        return false;
      } finally {
        setSyncing(false);
      }
    }
  };
}
