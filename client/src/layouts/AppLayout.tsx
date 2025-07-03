
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-60 min-h-screen">
        <Header />
        <main className="flex-1 overflow-y-auto px-6 py-4 bg-[#fffafc]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
