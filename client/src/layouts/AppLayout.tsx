import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto px-6 py-6 max-w-screen-2xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
