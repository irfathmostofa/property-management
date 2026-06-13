import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext"; // Fixed import path
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider
import { Layout } from "./components/layout/Layout";

import { Dashboard } from "./pages/dashboard/Dashboard";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";

// Lazy load pages for better performance
import { lazy, Suspense } from "react";
import { Login } from "./pages/auth/LoginPage";
import { SignupPage } from "./pages/auth/SignupPage";

const Buildings = lazy(() => import("./pages/buildings/Buildings"));
// const Apartments = lazy(() => import("./pages/apartments/Apartments"));
// const Cottages = lazy(() => import("./pages/cottages/Cottages"));
// const Renters = lazy(() => import("./pages/renters/Renters"));
// const Payments = lazy(() => import("./pages/payments/Payments"));
// const Notifications = lazy(() => import("./pages/notifications/Notifications"));
// const Reports = lazy(() => import("./pages/reports/Reports"));
// const AdminPanel = lazy(() => import("./pages/admin/AdminPanel"));

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner size="lg" className="h-screen" />;
  }

  return user ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner size="lg" className="h-screen" />;
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route
        path="/signup"
        element={!user ? <SignupPage /> : <Navigate to="/" />}
      />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route
          path="buildings"
          element={
            <Suspense fallback={<LoadingSpinner className="h-96" />}>
              <Buildings />
            </Suspense>
          }
        />
        {/* Other routes remain commented */}
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {" "}
        {/* Wrap everything with AuthProvider */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: "#10b981",
                secondary: "#fff",
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
