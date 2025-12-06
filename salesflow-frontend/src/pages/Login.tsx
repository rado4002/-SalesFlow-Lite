import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // ----------------------------------------------------------
      // 🔵 DEV MODE → Bypass total, pas d’appel backend Java
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
      // 🔴 PROD MODE → Vrai login backend Java
      // ----------------------------------------------------------
      const data = await authAPI.login(form);

      // save token
      localStorage.setItem("token", data.token);
      setToken(data.token);

      // save user
      setUser(data.user);

      // redirect
      navigate("/dashboard");

    } catch (error) {
      console.error("Login error:", error);
      setErrorMsg("Invalid phone number or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          SalesFlow Lite
        </h1>

        {errorMsg && (
          <div className="text-red-500 text-center mb-4">
            {errorMsg}
          </div>
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

        {/* OPTIONAL : Indicate dev mode */}
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
