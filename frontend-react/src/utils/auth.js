// src/utils/auth.js
export function logoutLocalAndRedirect() {
  try {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("outbox_queue_v1");
  } catch (e) {}
  window.location.href = "/login";
}
