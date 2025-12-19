// src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import fr from "./i18n/locales/fr.json";
import en from "./i18n/locales/en.json";
import ln from "./i18n/locales/ln.json";
import sw from "./i18n/locales/sw.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
      ln: { translation: ln },
      sw: { translation: sw },
    },
    lng: "en",          // 🔥 obligatoire
    fallbackLng: "fr",  // 🔥 sécurité
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
