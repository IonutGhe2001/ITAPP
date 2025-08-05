import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import type { JSX } from 'react';
import { useAuth } from '@/context/useAuth';
import { ROUTES } from '@/constants/routes';

const LoginPage = lazy(() => import('./pages/Login/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const Echipamente = lazy(() => import('./features/equipment/pages/Echipamente/Echipamente'));
const EquipmentDetail = lazy(() => import('./features/equipment/pages/EquipmentDetail/EquipmentDetail'));
const Colegi = lazy(() => import('./features/employees/pages/Colegi/Colegi'));
const EmployeeForm = lazy(() => import('./features/employees/pages/EmployeeForm/EmployeeForm'));
const AppLayout = lazy(() => import('./layouts/AppLayout'));
const ProfilePage = lazy(() => import('./pages/Profile/ProfilePage'));
const SearchPage = lazy(() => import('./pages/Search/Search'));
const OnboardingPage = lazy(() => import('./pages/Onboarding/OnboardingPage'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound'));

// Componentă pentru rute protejate
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="border-primary h-10 w-10 animate-spin rounded-full border-4 border-t-transparent"></div>
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to={ROUTES.LOGIN} />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <div className="border-primary h-10 w-10 animate-spin rounded-full border-4 border-t-transparent"></div>
          </div>
        }
      >
        <Routes>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path={ROUTES.EQUIPMENT.slice(1)} element={<Echipamente />} />
            <Route path={ROUTES.EQUIPMENT_DETAIL.slice(1)} element={<EquipmentDetail />} />
            <Route path={ROUTES.COLEGI.slice(1)} element={<Colegi />} />
            <Route path={ROUTES.EMPLOYEE_FORM.slice(1)} element={<EmployeeForm />} />
            <Route path={ROUTES.PROFILE.slice(1)} element={<ProfilePage />} />
            <Route path={ROUTES.SEARCH.slice(1)} element={<SearchPage />} />
            <Route path={ROUTES.ONBOARDING.slice(1)} element={<OnboardingPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
