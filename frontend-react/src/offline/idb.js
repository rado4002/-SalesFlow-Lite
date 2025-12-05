// src/offline/idb.js
let db = null;

const DB_NAME = "SalesFlowLite";
const DB_VERSION = 1;
const QUEUE_STORE = "sync_queue";

/* ------------------------------------------------------------------ */
/* Open / create the DB (once)                                        */
/* ------------------------------------------------------------------ */
export function openDB() {
  return new Promise((resolve, reject) => {
    if (db) return resolve(db);

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const upgradeDb = e.target.result;
      if (!upgradeDb.objectStoreNames.contains(QUEUE_STORE)) {
        upgradeDb.createObjectStore(QUEUE_STORE, { keyPath: "qid" });
      }
    };

    request.onsuccess = (e) => {
      db = e.target.result;
      resolve(db);
    };

    request.onerror = (e) => reject(e.target.error);
  });
}

/* ------------------------------------------------------------------ */
/* Generic transaction runner                                          */
/* ------------------------------------------------------------------ */
async function runTransaction(mode, callback) {
  await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(QUEUE_STORE, mode);
    const store = tx.objectStore(QUEUE_STORE);
    const result = callback(store);
    tx.oncomplete = () => resolve(result);
    tx.onerror = () => reject(tx.error);
  });
}

/* ------------------------------------------------------------------ */
/* Exported CRUD functions (including idbAdd)                         */
/* ------------------------------------------------------------------ */
export const idbAdd = (store, item) =>
  runTransaction("readwrite", (s) => s.add(item));

export const idbPut = (store, item) =>
  runTransaction("readwrite", (s) => s.put(item));

export const idbGet = (store, key) =>
  runTransaction("readonly", (s) => s.get(key));

export const idbGetAll = (store) =>
  runTransaction("readonly", (s) => s.getAll());

export const idbGetAllKeys = (store) =>
  runTransaction("readonly", (s) => s.getAllKeys());

export const idbDelete = (store, key) =>
  runTransaction("readwrite", (s) => s.delete(key));

export const idbClear = (store) =>
  runTransaction("readwrite", (s) => s.clear());