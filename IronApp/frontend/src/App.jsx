import { StrictMode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfileEdit from "./features/profile/pages/ProfileEdit";
import Profile from "./features/profile/pages/Profile";
import FoodLogPage from "./features/foodlog/pages/FoodLogPage";
import DashboardPage from "./features/dashboard/Dashboardpage";
import WeightTracker from "./features/weight/pages/WeightTracker";
import FoodTrackerPage from "./features/foodTracker/pages/FoodTrackerPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
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
        <Route path="/food-log" element={<ProtectedRoute><FoodLogPage /></ProtectedRoute>} />
        <Route path="/weight-tracker" element={<ProtectedRoute><WeightTracker /></ProtectedRoute>} />
        <Route path="/future-tracking" element={<ProtectedRoute><FoodTrackerPage /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
