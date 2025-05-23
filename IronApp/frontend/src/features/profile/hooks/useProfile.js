// useProfile: Centralized logic for fetching and updating user profile data
import { useState, useEffect, useCallback } from "react";
import api from "../../auth/api";

/**
 * Custom hook for profile management.
 * Fetches and updates user profile data, handles account deletion, and exposes loading/error states.
 * Usage: const { profile, loading, error, refreshProfile, updateProfile, deleteAccount, deleteState } = useProfile();
 */
export default function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Delete account states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Fetch profile on mount
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/api/user/profile/");
      setProfile(data);
    } catch (err) {
      setError("Could not load profile info.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Update profile and refresh
  const updateProfile = useCallback(async (newProfile) => {
    setLoading(true);
    setError(null);
    try {
      await api.put("/api/user/profile/", newProfile);
      await fetchProfile(); // Refresh after update
    } catch (err) {
      setError("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  }, [fetchProfile]);

  // Handle account deletion
  const handleDeleteAccount = useCallback(async (onSuccess) => {
    setIsDeleting(true);
    setDeleteError("");
    
    try {
      const response = await api.delete('/api/user/delete/');
      
      if (response.status === 200) {
        // Account deleted successfully
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error('Delete account error:', error);
      setDeleteError(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to delete account. Please try again.'
      );
    } finally {
      setIsDeleting(false);
    }
  }, []);

  // Delete modal controls
  const openDeleteModal = useCallback(() => {
    setShowDeleteModal(true);
    setDeleteError("");
  }, []);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setDeleteError("");
  }, []);

  // Grouped delete state for easy consumption
  const deleteState = {
    showDeleteModal,
    isDeleting,
    deleteError,
    openDeleteModal,
    closeDeleteModal,
    handleDeleteAccount
  };

  return { 
    profile, 
    loading, 
    error, 
    refreshProfile: fetchProfile, 
    updateProfile,
    deleteState
  };
}
