// src/offline/syncQueue.js
import { v4 as uuidv4 } from "uuid";
import api from "../api/http";
import {
  idbAdd,
  idbGetAll,
  idbDelete,
  idbPut,
  idbGetAllKeys,
  idbGet,
} from "./idb";

const QUEUE_STORE = "sync_queue";
const MAX_RETRIES = 5;

/* ------------------------------------------------------------------ */
/* PUBLIC API ------------------------------------------------------- */
export async function enqueueSyncOp({ method, path, body = null }) {
  const item = {
    qid: uuidv4(),
    method,
    path,
    body,
    status: "pending",
    retries: 0,
    createdAt: new Date().toISOString(),
  };
  await idbPut(QUEUE_STORE, item);
  dispatchChange();
  return item;
}

/* ------------------------------------------------------------------ */
// src/offline/syncQueue.js
export async function peekQueue() {
  const all = await idbGetAll(QUEUE_STORE);
  // FIX: Ensure all is an array
  if (!Array.isArray(all)) return [];
  return all.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

/* ------------------------------------------------------------------ */
export async function retryQueueItem(qid) {
  const item = await idbGet(QUEUE_STORE, qid);
  if (!item) return false;
  await processOneQueueItem(item);
  return true;
}

/* ------------------------------------------------------------------ */
export async function clearQueue() {
  const keys = await idbGetAllKeys(QUEUE_STORE);
  await Promise.all(keys.map((k) => idbDelete(QUEUE_STORE, k)));
  dispatchChange();
}

/* ------------------------------------------------------------------ */
let _isSyncing = false;
export const getIsSyncing = () => _isSyncing;
export const setIsSyncing = (v) => {
  _isSyncing = v;
  dispatchChange();
};

export const getQueueLength = async () => {
  const keys = await idbGetAllKeys(QUEUE_STORE);
  return keys.length;
};

/* ------------------------------------------------------------------ */
/* INTERNAL HELPERS ------------------------------------------------- */
async function markItem(qid, updates) {
  const all = await idbGetAll(QUEUE_STORE);
  const item = all.find((x) => x.qid === qid);
  if (!item) return;
  Object.assign(item, updates);
  await idbPut(QUEUE_STORE, item);
  dispatchChange();
}

async function removeItem(qid) {
  await idbDelete(QUEUE_STORE, qid);
  dispatchChange();
}

function backoffDelay(retries) {
  const base = Math.min(60_000, 1000 * Math.pow(2, Math.min(retries, 6)));
  const jitter = Math.floor(Math.random() * 300);
  return base + jitter;
}

/* ------------------------------------------------------------------ */
async function processOneQueueItem(item) {
  if (item.status === "in-progress") return;

  try {
    await markItem(item.qid, { status: "in-progress" });
    setIsSyncing(true);

    let res;
    if (item.method === "DELETE") {
      res = await api.delete(item.path, { data: item.body });
    } else if (item.method === "PUT") {
      res = await api.put(item.path, item.body);
    } else {
      res = await api.post(item.path, item.body);
    }

    await removeItem(item.qid);
    return { ok: true, response: res };
  } catch (err) {
    const retries = (item.retries || 0) + 1;
    if (retries >= MAX_RETRIES) {
      await markItem(item.qid, { status: "failed", retries });
    } else {
      await markItem(item.qid, { status: "pending", retries });
      const delay = backoffDelay(retries);
      setTimeout(() => processOneQueueItem(item), delay);
    }
    return { ok: false, error: err };
  } finally {
    setIsSyncing(false);
  }
}

/* ------------------------------------------------------------------ */
/* PROCESSOR -------------------------------------------------------- */
let _processorInterval = null;

export function startQueueProcessor({ intervalMs = 5000 } = {}) {
  if (_processorInterval) return;

  async function run() {
    if (!navigator.onLine) return;
    const queue = await peekQueue();
    for (const it of queue) {
      if (getIsSyncing()) break;
      await processOneQueueItem(it);
    }
  }

  run();
  _processorInterval = setInterval(run, intervalMs);
}

export function stopQueueProcessor() {
  if (_processorInterval) clearInterval(_processorInterval);
  _processorInterval = null;
}

/* ------------------------------------------------------------------ */
/* EVENT DISPATCHER ------------------------------------------------- */
const dispatchChange = () => window.dispatchEvent(new Event("syncQueueChange"));