import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import type { JSX } from "react";
import { useAuth } from "@/context/AuthContext";

const LoginPage = lazy(() => import("./pages/Login/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const Echipamente = lazy(() => import("./pages/Echipamente/Echipamente"));
const Colegi = lazy(() => import("./pages/Colegi/Colegi"));
const AppLayout = lazy(() => import("./layouts/AppLayout"));
const ProfilePage = lazy(() => import("./pages/Profile/ProfilePage"));

// Componentă pentru rute protejate
function ProtectedRoute({ children }: { children: JSX.Element }) {
 const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
          </div>
        }
      >
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
            <Route path="profil" element={<ProfilePage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
