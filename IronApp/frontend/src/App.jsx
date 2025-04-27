import { StrictMode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfileEdit from "./features/profile/pages/ProfileEdit";
import Profile from "./features/profile/pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile-edit" element={<ProtectedRoute><ProfileEdit /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
