import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api/javaApi";
import { useAuth } from "../contexts/AuthContext";
import type { LoginCredentials } from "../types/auth";

const Login = () => {
  const navigate = useNavigate();
  const { setUser, setToken, devMode } = useAuth();

  const [form, setForm] = useState<LoginCredentials>({
    phoneNumber: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ----------------------------------------------------------
  // FORM CHANGE HANDLER
  // ----------------------------------------------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ----------------------------------------------------------
  // SUBMIT HANDLER
  // ----------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // ----------------------------------------------------------
      // DEV MODE — Instant login without backend
      // ----------------------------------------------------------
      if (devMode) {
        const fakeUser = {
          username: "developer",
          role: "admin",
          phoneNumber: form.phoneNumber || "0771000001",
        };

        const fakeToken = "dev-token-123456";

        setUser(fakeUser);
        setToken(fakeToken);
        localStorage.setItem("token", fakeToken);

        navigate("/dashboard");
        return;
      }

      // ----------------------------------------------------------
      // PROD MODE — REAL LOGIN
      // ----------------------------------------------------------
      const data = await authAPI.login(form);

      // Save JWT token returned by backend
      localStorage.setItem("token", data.accessToken);
      setToken(data.accessToken);

      // Backend already returns user object → use it
      if (data.user) {
        setUser({
          username: data.user.username,
          role: data.user.role,
          phoneNumber: data.user.phoneNumber,
        });
      }

      navigate("/dashboard");

    } catch (error: any) {
      console.error("Login error:", error);

      // cleanup previous session
      localStorage.removeItem("token");
      setUser(null);
      setToken(null);

      const msg =
        error?.response?.data?.message ||
        "Invalid phone number or password";

      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------------
  // UI
  // ----------------------------------------------------------
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          SalesFlow Lite
        </h1>

        {errorMsg && (
          <div className="text-red-500 text-center mb-4">{errorMsg}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Phone Number
            </label>
            <input
              name="phoneNumber"
              type="text"
              value={form.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0771000001"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {devMode && (
          <p className="text-center text-sm text-green-600 mt-4 font-medium">
            DEV MODE ACTIVE — Login bypass enabled
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
