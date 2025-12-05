// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../api/http";

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    if (
      !form.username ||
      !form.email ||
      !form.phoneNumber ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError(t("register.errors.required"));
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setError(t("register.errors.password_mismatch"));
      return false;
    }
    if (form.password.length < 8) {
      setError(t("register.errors.password_length"));
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const payload = {
        username: form.username,
        email: form.email,
        phoneNumber: form.phoneNumber,
        password: form.password,
        role: "USER",
      };

      // FIXED — Use correct endpoint
      const res = await api.post("/api/v1/auth/register", payload);

      alert(t("register.success"));
      navigate("/login", { state: { registered: true } });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err.message ||
        t("register.errors.generic");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          {t("register.title")}
        </h2>
        <p className="text-sm text-gray-500 mb-6">{t("register.subtitle")}</p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 border border-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="font-semibold text-sm text-gray-700 block mb-1">
              {t("register.name")}
            </label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-indigo-600"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-sm text-gray-700 block mb-1">
                {t("register.email")}
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-indigo-600"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-sm text-gray-700 block mb-1">
                {t("register.phone")}
              </label>
              <input
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-indigo-600"
                placeholder="e.g. 0812345678"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-sm text-gray-700 block mb-1">
                {t("register.password")}
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-indigo-600"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-sm text-gray-700 block mb-1">
                {t("register.confirm_password")}
              </label>
              <input
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-indigo-600"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? t("register.loading") : t("register.action")}
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              {t("register.back_to_login")}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          {t("register.have_account")}{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-indigo-600 font-semibold hover:text-indigo-800"
          >
            {t("register.login_link")}
          </button>
        </div>
      </div>
    </div>
  );
}
