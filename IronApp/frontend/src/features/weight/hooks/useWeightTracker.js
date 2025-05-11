import { useState, useEffect, useCallback } from 'react';
import useProfile from '../../profile/hooks/useProfile';
import { lbsToKg, kgToLbs } from '../../../utils/unitConversion';

/**
 * Hook for managing weight tracking
 * Uses the UserProfile weight_history field for storage
 * Stores weights in kg for the backend, and displays in pounds in the frontend
 */
const useWeightTracker = () => {
  const { profile, loading, error, updateProfile } = useProfile(); // Get the user's profile data
  const [isSubmitting, setIsSubmitting] = useState(false); // State for the submission status
  const [weightError, setWeightError] = useState(null); // State for the weight error
  const [localWeightHistory, setLocalWeightHistory] = useState([]); // State for the local weight history
  const [initialWeight, setInitialWeight] = useState(null); // State for the initial weight

  // Process weight history from backend data
  const processWeightHistory = useCallback((weightHistory) => {
    if (!Array.isArray(weightHistory)) {
      console.warn('Weight history is not an array in profile response');
      return [];
    }

    // Process the weight history from the backend data
    const processedHistory = weightHistory.map(entry => {
      let weightInPounds;
      
      // Check if the weight is stored in kg
      if (entry.weight_in_kg !== undefined) {
        weightInPounds = kgToLbs(entry.weight_in_kg); // Convert the weight from kg to lbs
      } else if (entry.weight_in_lbs !== undefined) {
        weightInPounds = entry.weight_in_lbs; // Use the weight in lbs if it exists
      } else if (entry.weight !== undefined) {
        weightInPounds = kgToLbs(entry.weight); // Convert the weight from kg to lbs
      } else {
        weightInPounds = 0; // Default to 0 if no weight is found
      }
      
      return {
        date: entry.date,
        weight: weightInPounds, // Store as pounds for display
        note: entry.note || '',
        isInitial: entry.is_initial || false
      };
    });

    // Sort the weight history by date, newest first
    return processedHistory.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA;
    });
  }, []);

  // Effect to sync with profile data when it changes
  useEffect(() => {
    if (profile) {
      const weightHistory = profile.weight_history || [];

      // Get the user's initial weight from profile
      const profileWeightInLbs = profile.weight ? kgToLbs(profile.weight) : null;
      
      // Set the initial weight
      if (profileWeightInLbs) {
        setInitialWeight(profileWeightInLbs);
      }

      const sortedHistory = processWeightHistory(weightHistory); // Process the weight history
      
      // If the user has a profile weight but no weight history, add the profile weight as initial weight
      if (profileWeightInLbs && sortedHistory.length === 0) {
        const initialEntry = {
          date: new Date().toISOString().split('T')[0],
          weight: profileWeightInLbs,
          note: 'Initial weight from profile',
          isInitial: true
        };
        sortedHistory.push(initialEntry);
      }

      setLocalWeightHistory(sortedHistory);
    }
  }, [profile, processWeightHistory]);

  // Get weight history, already sorted and converted
  const getWeightHistory = useCallback(() => {
    return localWeightHistory;
  }, [localWeightHistory]);

  // Get the user's initial weight
  const getInitialWeight = useCallback(() => {
    // Check if we have an entry marked as initial in weight history
    const initialEntry = localWeightHistory.find(entry => entry.isInitial);
    if (initialEntry) {
      return initialEntry.weight;
    }
    
    // If no initial entry in history, use the oldest entry as starting point
    if (localWeightHistory.length > 0) {
      // Get the oldest entry (last in the array after sorting)
      return localWeightHistory[localWeightHistory.length - 1].weight;
    }
    
    // If no history, fallback to profile weight or default to 0
    return initialWeight || 0;
  }, [localWeightHistory, initialWeight]);

  // Add a new weight entry
  const addWeightEntry = async (entryData) => {
    try {
      setIsSubmitting(true);
      setWeightError(null);

      if (!profile) {
        throw new Error('Profile not loaded');
      }

      // Validate the weight input
      const weightValue = Number(entryData.weight);
      if (isNaN(weightValue) || weightValue <= 0) {
        throw new Error('Please enter a valid weight value');
      }

      // Convert weight from pounds to kg for backend storage
      const weightInKg = lbsToKg(weightValue);

      // Check if this is the first entry and mark as initial if needed
      const isFirstEntry = !Array.isArray(profile.weight_history) || profile.weight_history.length === 0;
      
      const newEntry = {
        date: entryData.date,
        weight_in_kg: weightInKg, // Store in kg for backend
        note: entryData.note || '',
        is_initial: isFirstEntry // Mark as initial if it's the first entry
      };

      // Create a new array with the new entry
      const currentHistory = Array.isArray(profile.weight_history) ? profile.weight_history : [];
      const updatedHistory = [...currentHistory, newEntry];
      
      // Update the profile
      await updateProfile({
        ...profile,
        weight_history: updatedHistory
      });

      const localUpdatedHistory = [...localWeightHistory]; // Create a new array with the new entry and the existing history
      
      // Add the new entry to local state to avoid waiting for the next profile update
      localUpdatedHistory.unshift({
        date: entryData.date,
        weight: weightValue,
        note: entryData.note || '',
        isInitial: isFirstEntry
      });
      
      // Re-sort the history to ensure the new entry is at the top
      const sortedUpdatedHistory = localUpdatedHistory.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
      });
      
      setLocalWeightHistory(sortedUpdatedHistory);

      return true;
    } catch (err) {
      console.error('Error adding weight entry:', err);
      setWeightError(err.message || 'Failed to add weight entry');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete a weight entry by date
  const deleteWeightEntry = async (dateToDelete) => {
    try {
      setIsSubmitting(true);
      setWeightError(null);

      if (!profile) {
        throw new Error('Profile not loaded');
      }

      // Filter out the entry with the matching date to delete
      const currentHistory = Array.isArray(profile.weight_history) ? profile.weight_history : [];
      const updatedHistory = currentHistory.filter(entry => entry.date !== dateToDelete);
      
      // Update the profile to delete the entry
      await updateProfile({
        ...profile,
        weight_history: updatedHistory
      });

      // Filter out the entry with the matching date from local state 
      const filteredLocalHistory = localWeightHistory.filter(entry => entry.date !== dateToDelete);
      setLocalWeightHistory(filteredLocalHistory);

      return true;
    } catch (err) {
      setWeightError(err.message || 'Failed to delete weight entry');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Return the weight history, initial weight, and functions to add and delete weight entries
  return {
    weightHistory: getWeightHistory(),
    initialWeight: getInitialWeight(),
    addWeightEntry,
    deleteWeightEntry,
    isSubmitting,
    weightError,
    profileLoading: loading,
    profileError: error
  };
};

export default useWeightTracker;
