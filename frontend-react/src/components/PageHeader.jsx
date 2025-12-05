import React from "react";
import { RefreshCw, Download } from "lucide-react";
import PropTypes from "prop-types";

/**
 * Premium Page Header
 * - Title + Subtitle block
 * - Flexible action area (`actions` prop)
 * - Animated subtle entrance
 */

export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div
      className="
        flex flex-wrap items-center justify-between gap-6 
        animate-[fadeIn_.45s_ease-out]
      "
    >
      {/* LEFT — TITLE BLOCK */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        )}
      </div>

      {/* RIGHT — ACTION BUTTONS */}
      <div className="flex items-center gap-3">
        {actions}

        {/* REFRESH BUTTON */}
        <button
          type="button"
          className="
            flex items-center gap-2 px-3 py-2 rounded-xl
            bg-white dark:bg-neutral-800
            border border-neutral-200 dark:border-neutral-700
            shadow-sm hover:bg-neutral-100 dark:hover:bg-neutral-700
            transition
          "
        >
          <RefreshCw size={16} />
          <span className="hidden sm:inline text-sm">Refresh</span>
        </button>

        {/* EXPORT BUTTON */}
        <button
          type="button"
          className="
            flex items-center gap-2 px-3 py-2 rounded-xl
            bg-indigo-600 text-white shadow 
            hover:brightness-105 transition
          "
        >
          <Download size={16} />
          <span className="hidden sm:inline text-sm">Export</span>
        </button>
      </div>
    </div>
  );
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  actions: PropTypes.node,
};
