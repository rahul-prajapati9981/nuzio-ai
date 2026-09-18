import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
import InterestsPage from "./pages/InterestsPage";
import NewsPage from "./pages/NewsPage";

function HomeRedirect() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && user.interests.length > 0) {
    return <Navigate to="/news" replace />;
  }

  return <Navigate to="/interests" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />

      <Route path="/login" element={<AuthPage mode="login" />} />

      <Route path="/register" element={<AuthPage mode="register" />} />

      <Route
        path="/interests"
        element={
          <ProtectedRoute>
            <InterestsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/news"
        element={
          <ProtectedRoute>
            <NewsPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
