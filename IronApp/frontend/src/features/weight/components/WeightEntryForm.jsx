import React, { useState } from 'react';
import WeightInput from '../../../components/WeightInput';

/**
 * Weight Entry Form component
 * Allows the user to add a new weight entry
 * Calls the onSubmit function to add the new weight entry
 * Displays the form with a date input, weight input, note input and submit button to save the new weight entry
 */
const WeightEntryForm = ({ onSubmit, isSubmitting, error }) => {
  const [weight, setWeight] = useState('');
  const [localError, setLocalError] = useState('');
  
  // Get today's date in the right format to match current timezone
  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const [date, setDate] = useState(getTodayDateString());
  const [note, setNote] = useState('');

  const handleWeightChange = (e) => {
    setWeight(e.target.value);
    setLocalError('');
  };

  const validateWeight = (value) => {
    const stringValue = String(value || ''); // Convert value to string
    
    // Basic validation
    if (!stringValue.trim()) {
      setLocalError('Please enter a weight value');
      return false;
    }
    
    const weightValue = Number(value);
    // Make sure it's an actual number and not zero or negative
    if (isNaN(weightValue) || weightValue <= 0) {
      setLocalError('Please enter a valid weight value');
      return false;
    }
    
    // Check if weight exceeds maximum
    const MAX_WEIGHT = 1102;
    if (weightValue > MAX_WEIGHT) {
      setLocalError(`Weight cannot exceed ${MAX_WEIGHT} lbs`);
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if weight is valid before we try to submit
    if (!validateWeight(weight)) {
      return;
    }
    
    // Submit the form if validation passes
    const success = onSubmit({
      weight,
      date,
      note
    });
    
    // Only reset form on success
    if (success) {
      setWeight('');
      setNote('');
    }
  };

  const displayError = localError || error;

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold text-[var(--primary-color-blue)] mb-4">Track Your Weight</h2>
      
      {/* Show error message */}
      {displayError && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md">
          {displayError}
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
        <WeightInput 
          value={weight}
          onChange={handleWeightChange}
          name="weight"
          aria-invalid={!!localError}
          className={localError ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}
        />
        <p className="text-xs text-gray-500 mt-1">Maximum weight: 1,102 lbs</p>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Note (Optional)</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm h-20 "
          placeholder="How are you feeling today?"
        />
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[var(--primary-color-teal)] text-white py-2 px-4 rounded-md hover:bg-[var(--primary-color-blue)] transition-colors duration-200 disabled:opacity-50"
      >
        {isSubmitting ? 'Saving...' : 'Save Weight Entry'}
      </button>
    </form>
  );
};

export default WeightEntryForm;
