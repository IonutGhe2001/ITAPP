import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-100">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-60">
        <Header />
        <main className="flex-1 overflow-y-auto px-6 py-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
