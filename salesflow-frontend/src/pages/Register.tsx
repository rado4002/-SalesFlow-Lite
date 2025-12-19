// src/pages/Register.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { authAPI } from "../services/api/javaApi";

const Register = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [form, setForm] = useState({
    username: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Password validation
    if (form.password !== form.confirmPassword) {
      setErrorMsg(t("auth.register.errors.passwordMismatch"));
      return;
    }

    setLoading(true);

    try {
      // --------------------------------------------
      // REAL BACKEND REGISTRATION (UNIFIED LOGIC)
      // --------------------------------------------
      await authAPI.register({
        username: form.username,
        phoneNumber: form.phoneNumber,
        email: form.email,
        password: form.password,
        role: "USER",
      });

      navigate("/login");
    } catch (error: any) {
      console.error("Register error:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        t("auth.register.errors.failed");

      setErrorMsg(message);
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
            {t("auth.register.title")}
          </h1>
          <p className="text-blue-100 text-lg">
            {t("auth.register.subtitle")}
          </p>
        </div>

        {/* Form */}
        <div className="px-10 -mt-12 pb-12">
          {errorMsg && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-center font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              placeholder={t("auth.register.username")}
              required
              className="w-full px-6 py-5 bg-gray-50 border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-300 transition"
            />

            <input
              name="phoneNumber"
              type="text"
              value={form.phoneNumber}
              onChange={handleChange}
              placeholder={t("auth.register.phone")}
              required
              className="w-full px-6 py-5 bg-gray-50 border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-300 transition"
            />

            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder={t("auth.register.email")}
              required
              className="w-full px-6 py-5 bg-gray-50 border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-300 transition"
            />

            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder={t("auth.register.password")}
              required
              className="w-full px-6 py-5 bg-gray-50 border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-300 transition"
            />

            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder={t("auth.register.confirmPassword")}
              required
              className="w-full px-6 py-5 bg-gray-50 border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-300 transition"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl rounded-full shadow-xl transition disabled:opacity-70"
            >
              {loading ? t("auth.register.creating") : t("auth.register.submit")}
            </button>

            <div className="text-center mt-8">
              <p className="text-gray-600 text-base">
                {t("auth.register.haveAccount")}{" "}
                <Link
                  to="/login"
                  className="text-blue-600 font-bold hover:text-blue-700"
                >
                  {t("auth.register.signIn")}
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
