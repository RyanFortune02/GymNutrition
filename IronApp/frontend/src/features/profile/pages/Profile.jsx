import { useState, useEffect } from "react";
import useProfile from "../hooks/useProfile";
import { FOOD_PREF_OPTIONS, ALLERGY_OPTIONS, GENDER_OPTIONS, ACTIVITY_LEVEL_OPTIONS } from "../../formConfig";
import LoadingIndicator from "../../../components/LoadingIndicator";
import NavBar from "../../../components/NavBar";
import { formatHeightImperial, formatWeightImperial } from "../../../utils/unitConversion";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../../../components/ThemeToggle";
import useAuth from "../../auth/hooks/useAuth";

function Profile() {
  const { profile, loading, error, deleteState } = useProfile();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const { 
    showDeleteModal, 
    isDeleting, 
    deleteError, 
    openDeleteModal, 
    closeDeleteModal, 
    handleDeleteAccount 
  } = deleteState;

  // Handle successful account deletion
  const onDeleteSuccess = () => {
    alert('Account deleted successfully');
    logout(); // This will clear tokens and redirect to login
  };

  if (loading) return <LoadingIndicator />;
  if (error) return <div className="text-center text-red-600 mt-8">{error}</div>;
  if (!profile) return null;

  const genderLabel = GENDER_OPTIONS.find(opt => opt.value === profile.sex)?.label || profile.sex;
  const activityLabel = ACTIVITY_LEVEL_OPTIONS.find(opt => opt.value === profile.activity_level)?.label || profile.activity_level;

  // Bitwise decode food preferences and allergies 
  const getCheckedLabels = (val, options) =>
    options.filter(opt => (val & opt.value)).map(opt => opt.label).join(", ") || "None";

  return (
    <>
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto my-12 p-8 rounded-lg shadow-md bg-white border border-gray-200">
          <h1 className="text-2xl font-bold mb-6 text-[color:var(--primary-color-teal)]">My Profile</h1>
          <div className="mb-4"><span className="font-semibold text-[color:var(--primary-color-blue)]">Age:</span> {profile.age}</div>
          <div className="mb-4"><span className="font-semibold text-[color:var(--primary-color-blue)]">Sex:</span> {genderLabel}</div>
          <div className="mb-4"><span className="font-semibold text-[color:var(--primary-color-blue)]">Height:</span> {formatHeightImperial(profile.height)}</div>
          <div className="mb-4"><span className="font-semibold text-[color:var(--primary-color-blue)]">Weight:</span> {formatWeightImperial(profile.weight)}</div>
          <div className="mb-4"><span className="font-semibold text-[color:var(--primary-color-blue)]">Activity Level:</span> {activityLabel}</div>
          <div className="mb-4"><span className="font-semibold text-[color:var(--primary-color-blue)]">Food Preferences:</span> {getCheckedLabels(profile.food_preferences, FOOD_PREF_OPTIONS)}</div>
          <div className="mb-4"><span className="font-semibold text-[color:var(--primary-color-blue)]">Allergies:</span> {getCheckedLabels(profile.allergies, ALLERGY_OPTIONS)}</div>
          
          <ThemeToggle />
          
          <button
            onClick={() => navigate("/profile-edit")}
            className="w-full p-3 my-4 bg-gradient-to-r from-[var(--primary-color-teal)] to-[var(--secondary-color-green)] text-white rounded hover:opacity-90 transition-opacity duration-200 font-medium"
          >
            Edit Profile
          </button>
          <button
            onClick={() => navigate("/change-password")}
            className="w-full p-3 my-4 bg-[var(--primary-color-blue)] text-white rounded hover:opacity-90 transition-opacity duration-200 font-medium"
          >
            Change Password
          </button>
          
          {/* Delete Account Button */}
          <button
            onClick={openDeleteModal}
            className="w-full p-3 my-4 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200 font-medium"
          >
            Delete Account
          </button>
        </div>
        
        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-4">
              <h2 className="text-xl font-bold text-red-600 mb-4">Delete Account</h2>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete your account? This action cannot be undone. 
                All your data including food logs, progress, and preferences will be permanently deleted.
              </p>
              
              {deleteError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {deleteError}
                </div>
              )}
              
              <div className="flex gap-3">
                <button
                  onClick={closeDeleteModal}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteAccount(onDeleteSuccess)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Profile;
