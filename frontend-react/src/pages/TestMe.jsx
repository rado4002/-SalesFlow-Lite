import { useState } from "react";
import api from "../api/http";

export default function TestMe() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const runTest = async () => {
    setError("");
    setData(null);

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("No Access Token found — please login first.");
      return;
    }

    try {
      const response = await api.get("/auth/me", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      setData(response.data); // { username, role, phoneNumber }
    } catch (err) {
      const status = err.response?.status || "???";
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        err.message;

      setError(`ERROR ${status}: ${msg}`);
    }
  };

  return (
    <div className="pt-24 px-8 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-5xl font-black text-indigo-800 mb-12">
          Test Authenticated User (<code>/auth/me</code>)
        </h1>

        <button
          onClick={runTest}
          className="px-16 py-8 text-3xl font-bold text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 rounded-2xl shadow-2xl transform hover:scale-110 transition"
        >
          CHECK WHO I AM
        </button>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mt-16 p-10 bg-red-100 text-red-700 rounded-3xl shadow-2xl border-8 border-red-400">
            <p className="text-4xl font-black">{error}</p>
          </div>
        )}

        {/* SUCCESS RESULT */}
        {data && (
          <div className="mt-16 p-10 bg-white rounded-3xl shadow-2xl border-8 border-green-500">
            <h2 className="text-5xl font-black text-green-700 mb-6">
              AUTHENTICATED USER
            </h2>

            <div className="text-3xl space-y-4 text-gray-800">
              <p>
                <strong>Username:</strong> {data.username}
              </p>
              <p>
                <strong>Role:</strong> {data.role}
              </p>
              <p>
                <strong>Phone:</strong> {data.phoneNumber}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
