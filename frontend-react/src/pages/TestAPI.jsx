import { useState } from "react";
import api from "../api/http";
import LogoutButton from "../components/LogoutButton";

export default function TestAPI() {
  const [message, setMessage] = useState("");

  const pingBackend = async () => {
    try {
      const response = await api.get("/auth/test"); // FIXED
      setMessage("SUCCESS! " + response.data);
    } catch (error) {
      const status = error.response?.status || "???";
      const msg = error.response?.data?.message || error.message || "Network error";
      setMessage(`ERROR ${status}: ${msg}`);
    }
  };

  return (
    <div className="pt-24 px-8 min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-6xl font-black text-indigo-800 mb-12">
          Test API Connection
        </h1>

        <button
          onClick={pingBackend}
          className="px-16 py-8 text-3xl font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-2xl shadow-2xl transform hover:scale-110 transition"
        >
          PING BACKEND
        </button>

        {message && (
          <div className="mt-16 p-12 bg-white rounded-3xl shadow-2xl border-8 border-green-500">
            <p className="text-5xl font-black text-green-700 animate-pulse">
              {message}
            </p>
          </div>
        )}

        <div className="mt-20 text-6xl font-black text-purple-700">
          YOU ARE NOW A FULL-STACK GOD
        </div>
      </div>
    </div>
  );
}
