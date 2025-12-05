// src/components/MobileSidebarButton.jsx
import { Menu } from "lucide-react";

export default function MobileSidebarButton({ onOpen }) {
  return (
    <button
      onClick={onOpen}
      className="
        md:hidden p-2 rounded-xl 
        bg-neutral-100 dark:bg-neutral-800 
        border border-neutral-200 dark:border-neutral-700
        hover:bg-neutral-200 dark:hover:bg-neutral-700
        transition
      "
    >
      <Menu size={22} className="text-slate-800 dark:text-white" />
    </button>
  );
}
