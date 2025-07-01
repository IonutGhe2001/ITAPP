import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import AppLayout from "./layouts/AppLayout";
import type { JSX } from "react";
import Echipamente from "./pages/Echipamente/Echipamente";
import Colegi from "./pages/Colegi/Colegi";

// Componentă pentru rute protejate
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

export default function AppRouter() {
  return (
<BrowserRouter>
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Dashboard />} />
      <Route path="echipamente" element={<Echipamente />} />
      <Route path="colegi" element={<Colegi />} />
    </Route>
  </Routes>
</BrowserRouter>
  );
}
