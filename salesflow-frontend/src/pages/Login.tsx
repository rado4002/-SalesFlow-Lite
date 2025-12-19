// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { authAPI } from "../services/api/javaApi";
import { useAuth } from "../contexts/AuthContext";
import type { LoginCredentials } from "../types/auth";

const Login = () => {
  const navigate = useNavigate();
  const { setUser, setToken } = useAuth();
  const { t } = useTranslation();

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
      // --------------------------------------------
      // REAL BACKEND LOGIN (UNIFIED LOGIC)
      // --------------------------------------------
      const data = await authAPI.login(form);

      localStorage.setItem("token", data.accessToken);
      setToken(data.accessToken);

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

      localStorage.removeItem("token");
      setUser(null);
      setToken(null);

      const msg =
        error?.response?.data?.message ||
        t("auth.errors.invalidCredentials");

      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-md">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 px-10 pt-16 pb-24 rounded-t-3xl text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-500 rounded-full shadow-2xl mb-8">
            <span className="text-6xl font-bold text-white">S</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            {t("auth.login.title")}
          </h1>
          <p className="text-blue-100 text-lg">
            {t("auth.login.subtitle")}
          </p>
        </div>

        {/* Form */}
        <div className="px-10 -mt-12 pb-12">
          {errorMsg && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-center font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <input
              name="phoneNumber"
              type="text"
              value={form.phoneNumber}
              onChange={handleChange}
              placeholder={t("auth.login.username")}
              required
              className="w-full px-6 py-5 bg-gray-50 border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition"
            />

            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder={t("auth.login.password")}
              required
              className="w-full px-6 py-5 bg-gray-50 border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition"
            />

            <div className="text-right">
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                {t("auth.login.forgot")}
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl rounded-full shadow-xl transition disabled:opacity-70"
            >
              {loading ? t("auth.login.signingIn") : t("auth.login.submit")}
            </button>

            <div className="text-center mt-8">
              <p className="text-gray-600 text-base">
                {t("auth.login.noAccount")}{" "}
                <Link
                  to="/register"
                  className="text-blue-600 font-bold hover:text-blue-700"
                >
                  {t("auth.login.register")}
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
