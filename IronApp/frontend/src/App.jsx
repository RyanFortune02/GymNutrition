import { StrictMode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfileEdit from "./features/profile/pages/ProfileEdit";
import Profile from "./features/profile/pages/Profile";
import ChangePassword from "./features/profile/pages/ChangePassword";
import FoodLogPage from "./features/foodlog/pages/FoodLogPage";
import DashboardPage from "./features/dashboard/Dashboardpage";
import WeightTracker from "./features/weight/pages/WeightTracker";
import FoodTrackerPage from "./features/foodTracker/pages/FoodTrackerPage";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/welcome" element={<LandingPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile-edit" element={<ProtectedRoute><ProfileEdit /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
          <Route path="/food-log" element={<ProtectedRoute><FoodLogPage /></ProtectedRoute>} />
          <Route path="/weight-tracker" element={<ProtectedRoute><WeightTracker /></ProtectedRoute>} />
          <Route path="/future-tracking" element={<ProtectedRoute><FoodTrackerPage /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
