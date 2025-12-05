// src/utils/offlineQueue.js

const QUEUE_KEY = "offline_request_queue";

/**
 * Load queue from localStorage
 */
export function loadQueue() {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY)) || [];
  } catch {
    return [];
  }
}

/**
 * Save queue to localStorage
 */
export function saveQueue(queue) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

/**
 * Add a request to the queue
 */
export function enqueueRequest(req) {
  const queue = loadQueue();
  queue.push(req);
  saveQueue(queue);
  console.log("📌 Request queued (offline):", req);
}

/**
 * Clear queue
 */
export function clearQueue() {
  localStorage.removeItem(QUEUE_KEY);
}

/**
 * Remove first request after successful send
 */
export function dequeueRequest() {
  const queue = loadQueue();
  queue.shift();
  saveQueue(queue);
}
