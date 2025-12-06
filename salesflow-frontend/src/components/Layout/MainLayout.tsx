import { Outlet } from "react-router-dom";
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar />

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />  {/* 🔥 C’est ici que les pages s’affichent */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
