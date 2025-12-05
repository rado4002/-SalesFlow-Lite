// src/layouts/Layout.jsx

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex">

      {/* LEFT SIDEBAR */}
      <Sidebar />

      {/* MAIN AREA */}
      <div className="flex-1 ml-72 bg-neutral-50 min-h-screen">

        {/* TOPBAR */}
        <Topbar />

        {/* PAGE CONTENT */}
        <div className="pt-24 px-10 pb-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
