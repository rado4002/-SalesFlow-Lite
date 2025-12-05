// src/pages/Login.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await login({ phoneNumber, password });

    setLoading(false);

    if (!res.ok) {
      setError(res.message || t("login.error"));
      return;
    }

    navigate("/dashboard");
  }

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-800 via-purple-800 to-slate-900 p-6">
      <div className="absolute top-4 right-4">
        <select
          onChange={(e) => changeLanguage(e.target.value)}
          value={i18n.language}
          className="bg-white/20 text-white backdrop-blur-md p-2 rounded-lg focus:outline-none"
        >
          <option value="en">EN</option>
          <option value="fr">FR</option>
          <option value="zh">中文</option>
          <option value="sw">Swahili</option>
          <option value="ln">Lingala</option>
        </select>
      </div>

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-white tracking-wide drop-shadow-lg">
          SalesFlow Lite
        </h1>

        <p className="text-center text-gray-200 mb-8">
          {t("login.subtitle")}
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-gray-200">{t("login.phone")}</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full mt-2 p-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none backdrop-blur-sm"
              placeholder={t("login.phone_placeholder")}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-gray-200">{t("login.password")}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 p-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none backdrop-blur-sm"
              placeholder={t("login.password_placeholder")}
              required
              disabled={loading}
            />
          </div>

          {error && <p className="text-red-300 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-white text-blue-900 font-bold shadow-lg hover:bg-gray-200 transition disabled:opacity-50"
          >
            {loading ? t("login.loading") : t("login.sign_in")}
          </button>
        </form>

        <p className="text-center text-gray-200 mt-6">
          {t("login.no_account")}{" "}
          <span
            className="underline cursor-pointer hover:text-white font-semibold"
            onClick={() => navigate("/register")}
          >
            {t("login.register")}
          </span>
        </p>
      </div>
    </div>
  );
}
