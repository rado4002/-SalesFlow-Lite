// MainLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";


export default function MainLayout() {
return (
<div className="flex h-screen w-full bg-slate-50 dark:bg-neutral-900 overflow-hidden">
{/* Sidebar */}
<Sidebar />


{/* Main content area */}
<div className="flex flex-col flex-1 ml-0 md:ml-72 transition-all duration-300">
{/* Topbar */}
<div className="h-20 w-full fixed top-0 left-0 md:left-72 z-30 transition-all duration-300">
<Topbar />
</div>


{/* Page Content */}
<main className="mt-20 p-6 overflow-y-auto h-[calc(100vh-80px)]">
<Outlet />
</main>
</div>
</div>
);
}