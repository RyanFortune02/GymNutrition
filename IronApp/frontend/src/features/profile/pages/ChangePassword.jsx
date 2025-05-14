import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../auth/api";
import NavBar from "../../../components/NavBar";
import { Eye, EyeOff } from "lucide-react";

/*
 ChangePassword page allows logged in users to change their password.
 It uses the change-password endpoint to change the password.
*/
function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  
  // State for password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordRequirements = [
    "At least 8 characters long",
    "Contains at least one uppercase letter",
    "Contains at least one lowercase letter",
    "Contains at least one number",
    "Contains at least one special character (!@#$%^&*)"
  ];

  const validatePassword = (password) => {
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);
    
    return hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecial;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset any previous messages
    setMessage(null);
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
      setMessage({
        type: "error",
        text: "New passwords do not match."
      });
      return;
    }
    
    if (!validatePassword(newPassword)) {
      setMessage({
        type: "error",
        text: "New password doesn't meet the requirements."
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Call API to change password 
      await api.post("/api/user/change-password/", {
        current_password: currentPassword,
        new_password: newPassword
      });
      
      setMessage({
        type: "success",
        text: "Password successfully changed!"
      });
      
      // Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      // Navigate back to profile after a delay
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
      
    } catch (error) {
      if (error.response?.status === 401) {
        setMessage({
          type: "error",
          text: "Current password is incorrect."
        });
      } else {
        setMessage({
          type: "error",
          text: error.response?.data?.detail || "Failed to change password."
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto my-12 p-8 rounded-lg shadow-md bg-white border border-gray-200">
          <h1 className="text-2xl font-bold mb-6 text-[color:var(--primary-color-teal)]">Change Password</h1>
          
          {/* Form for changing password */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block mb-1 font-medium">Current Password</label>
              <div className="relative">
                <input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff size={20} className="text-gray-500" />
                  ) : (
                    <Eye size={20} className="text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            
            <div>
              <label htmlFor="newPassword" className="block mb-1 font-medium">New Password</label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff size={20} className="text-gray-500" />
                  ) : (
                    <Eye size={20} className="text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block mb-1 font-medium">Confirm New Password</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} className="text-gray-500" />
                  ) : (
                    <Eye size={20} className="text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-md mt-4">
              <h3 className="font-medium text-blue-800 mb-2">Password Requirements:</h3>
              <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
                {passwordRequirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
            
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="flex-1 p-3 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 p-3 bg-[var(--primary-color-blue)] text-white rounded hover:opacity-90 transition-opacity duration-200"
              >
                {loading ? "Changing..." : "Change Password"}
              </button>
            </div>
          </form>
          
          {/* Message to show if password is changed successfully or not */}
          {message && (
            <div className={`mt-4 p-3 rounded text-center ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
              {message.text}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ChangePassword; 