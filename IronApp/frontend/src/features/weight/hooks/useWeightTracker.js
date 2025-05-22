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
  const [isInitialLoading, setIsInitialLoading] = useState(true); // Track initial loading state

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
      setIsInitialLoading(false); // show loading indicator when first loading
    }
  }, [profile, processWeightHistory]);

  // Get weight history, already sorted and converted
  const getWeightHistory = useCallback(() => {
    return localWeightHistory;
  }, [localWeightHistory]);

  // Get the user's initial weight
  const getInitialWeight = useCallback(() => {
    // Use the profile weight as the initial weight
    if (initialWeight) {
      return initialWeight;
    }
    
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
    return 0;
  }, [localWeightHistory, initialWeight]);

  // Check if user is trying to enter a invalid weight value
  const validateWeight = (weightValue) => {
    // Basic checks - no negative or zero weights
    if (isNaN(weightValue) || weightValue <= 0) {
      throw new Error('Please enter a valid weight value');
    }
    
    // Check if weight exceeds maximum
    const MAX_WEIGHT = 1102;
    if (weightValue > MAX_WEIGHT) {
      throw new Error(`Weight cannot exceed ${MAX_WEIGHT} lbs`);
    }
    
    return true;
  };

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
      validateWeight(weightValue);

      // Convert weight from pounds to kg for backend storage
      const weightInKg = lbsToKg(weightValue);

      // Check if this is the first entry and mark as initial if needed
      const isFirstEntry = (!Array.isArray(profile.weight_history) || profile.weight_history.length === 0) 
                           && !profile.weight;
      
      // Ensure date handling is consistent by creating a Date object and formatting it
      const dateObj = new Date(entryData.date + 'T12:00:00');
      const formattedDate = dateObj.toISOString().split('T')[0];

      const newEntry = {
        date: formattedDate,
        weight_in_kg: weightInKg, // Store in kg for backend
        note: entryData.note || '',
        is_initial: isFirstEntry // Mark as initial if it's the first entry
      };

      const localUpdatedHistory = [...localWeightHistory]; 
      
      localUpdatedHistory.unshift({
        date: formattedDate,
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

      // Create a new array with the new entry
      const currentHistory = Array.isArray(profile.weight_history) ? profile.weight_history : [];
      const updatedHistory = [...currentHistory, newEntry];
      
      try {
        await updateProfile({
          ...profile,
          weight_history: updatedHistory
        });
      } catch (error) {
        console.error('Error saving weight entry to backend:', error);
        setWeightError('Failed to save to server. Please try again.');
        
        // Restore previous state
        const originalHistory = processWeightHistory(profile.weight_history || []);
        setLocalWeightHistory(originalHistory);
        return false;
      }

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

      // Remove from Local State first
      const originalHistory = [...localWeightHistory];
      const filteredLocalHistory = localWeightHistory.filter(entry => entry.date !== dateToDelete);
      setLocalWeightHistory(filteredLocalHistory);

      // Now update the backend
      try {
        // Filter out the entry with the matching date to delete
        const currentHistory = Array.isArray(profile.weight_history) ? profile.weight_history : [];
        const updatedHistory = currentHistory.filter(entry => entry.date !== dateToDelete);
        
        // Update the profile to delete the entry
        await updateProfile({
          ...profile,
          weight_history: updatedHistory
        });
      } catch (error) {
        console.error('Error deleting weight entry from backend:', error);
        setWeightError('Failed to delete weight entry. Please try again.');
        
        // Restore previous state
        setLocalWeightHistory(originalHistory);
        return false;
      }

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
    profileLoading: loading && isInitialLoading, // Only show loading on first load, not every time
    profileError: error
  };
};

export default useWeightTracker;
