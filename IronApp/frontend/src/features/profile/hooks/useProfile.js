// useProfile: Centralized logic for fetching and updating user profile data
import { useState, useEffect, useCallback } from "react";
import api from "../../auth/api";

/**
 * Custom hook for profile management.
 * Fetches and updates user profile data, and exposes loading/error states.
 * Usage: const { profile, loading, error, refreshProfile, updateProfile } = useProfile();
 */
export default function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return { profile, loading, error, refreshProfile: fetchProfile, updateProfile };
}
