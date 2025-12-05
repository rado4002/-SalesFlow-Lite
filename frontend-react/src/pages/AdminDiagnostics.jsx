// src/pages/AdminDiagnostics.jsx
import { useEffect, useState } from "react";
import { peekQueue, retryQueueItem, clearQueue } from "../offline/syncQueue";

export default function AdminDiagnostics() {
  const [items, setItems] = useState([]);

  const load = async () => {
    const queue = await peekQueue();
    setItems(queue);
  };

  useEffect(() => {
    load();
    const onChange = () => load();
    window.addEventListener("syncQueueChange", onChange);
    return () => window.removeEventListener("syncQueueChange", onChange);
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Queue Diagnostics</h1>

      {items.length === 0 ? (
        <p className="text-gray-600">Queue is empty</p>
      ) : (
        <ul className="space-y-2">
          {items.map((it) => (
            <li
              key={it.qid}
              className="flex items-center justify-between rounded border p-3"
            >
              <div>
                <code className="font-mono text-sm">
                  {it.method} {it.path}
                </code>
                <p className="text-xs text-gray-500">
                  Attempts: {it.retries || 0}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => retryQueueItem(it.qid).then(load)}
                  className="rounded bg-blue-600 px-3 py-1 text-xs text-white"
                >
                  Retry
                </button>
                <button
                  onClick={() => {
                    if (window.confirm("Delete this item?")) {
                      // simple delete
                      indexedDB
                        .delete("sync_queue", it.qid)
                        .then(load);
                    }
                  }}
                  className="rounded bg-red-600 px-3 py-1 text-xs text-white"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={() => clearQueue().then(load)}
        className="rounded bg-gray-700 px-4 py-2 text-white"
      >
        Clear All
      </button>
    </div>
  );
}